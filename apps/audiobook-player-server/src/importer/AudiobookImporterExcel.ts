import * as XLSX from "xlsx";
import {IAudiobookManager} from "../audiobooks/Types.API";
import {AudiobookManagerHelper} from "../audiobooks/AudiobookManagerHelper";
import {
    Audiobook,
    Author,
    Category,
    createMediaFileInstance,
    MediaFileOwnerType,
    MediaFileType,
    Reader,
    Tag
} from "shared";
import path from "node:path";
import fs from "node:fs/promises"
import {calculateFileHash} from "../utils/FileUtils";

function deepEqual(x: any, y: any): boolean {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
        ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    ) : (x === y);
}

interface ICellData {
    v: string
}

interface IAudiobookImportData {
    index: number,
    id: number,
    authors: string[],
    title: string,
    assetDir: string,
    readers: string[],
    description: string | null,
    shortDescription: string | null,
    isDeleted: boolean,
    categories: string[],
    tags: string[],
}

enum SheetColumns {
    Id="A",
    Author="B",
    Reader="C",
    Title="D",
    ShortDescription="E",
    Description="F",
    AssetDir="G",
    Categories="H",
    Tags="I",
    IsDeleted="J"
}

export class AudiobookImporterExcel {

    private audiobookManagerHelper: AudiobookManagerHelper;
    private tags: Tag[] = []
    private categories: Category[] = []

    constructor(private audiobookManager: IAudiobookManager, private spreadsheetPath: string, private assetDir: string) {
        this.audiobookManagerHelper = new AudiobookManagerHelper(audiobookManager);
    }

    async import(): Promise<void> {
        this.tags = await this.audiobookManager.getTags()
        this.categories = await this.audiobookManager.getCategories()

        const workBook = XLSX.readFile(this.spreadsheetPath);
        const sheet = workBook.Sheets['Audiobooks'];

        function getSheetCellIndex(column: string, row: number): string {
            return `${column}${row}`;
        }

        function getSheetCellValue(column: string, row: number): ICellData | undefined {
            return sheet[getSheetCellIndex(column, row)];
        }

        const audiobookRows: IAudiobookImportData[] = [];
        let index = 2;
        while (true) {
            const author = getSheetCellValue(SheetColumns.Author, index);
            if (!author) break;

            const row: IAudiobookImportData = {
                index: index,
                id: parseInt(getSheetCellValue(SheetColumns.Id, index)?.v!),
                authors: author.v.trim().split(","),
                title: getSheetCellValue(SheetColumns.Title, index)!.v.trim(),
                assetDir: getSheetCellValue(SheetColumns.AssetDir, index)!.v.trim(),
                readers: (getSheetCellValue(SheetColumns.Reader, index)!.v.trim() ?? "").split(","),
                description: getSheetCellValue(SheetColumns.Description, index)?.v.trim() ?? null,
                shortDescription: getSheetCellValue(SheetColumns.ShortDescription, index)?.v.trim() ?? null,
                isDeleted: (getSheetCellValue(SheetColumns.IsDeleted, index)?.v.trim() ?? "") !== "",
                categories: (getSheetCellValue(SheetColumns.Categories, index)?.v.trim() ?? "").split(","),
                tags: (getSheetCellValue(SheetColumns.Tags, index)?.v.trim() ?? "").split(","),
            };

            audiobookRows.push(row);
            index++;
        }

        for (const row of audiobookRows) {
            const audiobook = await this.audiobookManagerHelper.getAudiobookIfExists(row.id)

            console.log("- - - - - - - -  Row");
            console.log(row)

            if (audiobook === null) {
                // add new
                if (!row.isDeleted) {
                    console.log(" -> Add audiobook");
                    await this.addNewABook(row);
                }
            } else {
                // update existing one
                if (row.isDeleted) {
                    await this.audiobookManager.removeAudiobook(row.id);
                } else {
                    await this.updateAudiobook(audiobook, row);
                }

            }
        }
    }

    private now(): number {
        return Date.now();
    }

    private async gatherImportReferences(data: IAudiobookImportData, audiobook: Audiobook): Promise<Audiobook> {
        const tagIds: number[] = [];
        const categoryIds: number[] = [];
        const readerIds: number[] = [];
        const authorIds: number[] = [];

        for (const tag of data.tags) {
            const tagName = tag.trim()
            if (tagName.length > 0) {
                tagIds.push(await this.getOrCreateTagId(tagName))
            }
        }

        for (const category of data.categories) {
            const categoryName = category.trim()
            if (categoryName.length > 0) {
                categoryIds.push(await this.getOrCreateCategoryId(categoryName))
            }
        }

        for (const author of data.authors) {
            const authorName = author.trim()
            if (authorName.length > 0) {
                authorIds.push((await this.getOrCreateAuthor(authorName)).id)
            }
        }

        for (const reader of data.readers) {
            const readerName = reader.trim()
            if (readerName.length > 0) {
                readerIds.push((await this.getOrCreateReader(readerName)).id)
            }
        }

        audiobook.tagIds = tagIds;
        audiobook.categoryIds = categoryIds;
        audiobook.authorIds = authorIds;
        audiobook.readerIds = readerIds;

        return audiobook;
    }

    private async gatherImportFiles(data: IAudiobookImportData, audiobook: Audiobook): Promise<{icon: string | null, images: string[] | null, audioFiles: string[] | null}> {
        let icon: string | null = null;
        let images: string[] = []
        let audioFiles: string[] = []

        const audiobookAssetDirPath = path.join(this.assetDir, data.assetDir)
        const files = await fs.readdir(audiobookAssetDirPath)

        for (const file of files) {
            const type = this.audiobookManagerHelper.getFileMediaType(file)
            const filePath = path.join(audiobookAssetDirPath, file);
            switch (type) {
                case MediaFileType.Icon:
                    icon = filePath;
                    break
                case MediaFileType.Image:
                    images.push(filePath);
                    break
                case MediaFileType.Audio:
                    audioFiles.push(filePath);
                    break
            }
        }

        return {
            icon: icon,
            images: images,
            audioFiles: audioFiles,
        }
    }

    private async addNewABook(data: IAudiobookImportData): Promise<number> {
        let audiobook: Audiobook = {
            id: data.id,
            tagIds: [],
            tags: [],
            categoryIds: [],
            categories: [],
            description: data.description,
            totalDuration: 0,
            providerId: "",
            icon: null,
            images: null,
            audioFiles: null,
            readerIds: [],
            readers: null,
            authorIds: [],
            authors: null,
            version: 1,
            addTime: this.now(),
            totalSize: 0,
            shortDescription: data.shortDescription,
            title: data.title,
            parameters: null,
            updateTime: this.now()
        }

        audiobook = await this.gatherImportReferences(data, audiobook)

        const audiobookFiles = await this.gatherImportFiles(data, audiobook)

        return await this.audiobookManager.addAudiobook(audiobook, audiobookFiles.icon, audiobookFiles.images, audiobookFiles.audioFiles, data.id)
    }

    private jsonClone<T>(obj: T): T {
        const json = JSON.stringify(obj);
        return JSON.parse(json);
    }

    private async isFileUpdateRequired(audiobook: Audiobook, data: IAudiobookImportData): Promise<boolean> {
        const files = await this.gatherImportFiles(data, audiobook);
        const importHashes: string[] = []
        const audiobookHashes: string[] = []

        if (files.icon) {
            importHashes.push(await calculateFileHash(files.icon));
        }

        importHashes.push(",")

        if (files.images) for (const file of files.images) {
            importHashes.push(await calculateFileHash(file));
        }

        importHashes.push(",")

        if (files.audioFiles) for (const file of files.audioFiles) {
            importHashes.push(await calculateFileHash(file));
        }

        importHashes.push(",")

        if (audiobook.icon) {
            audiobookHashes.push(audiobook.icon.fileHash);
        }
        audiobookHashes.push(",")
        if (audiobook.images) {
            for (const file of audiobook.images) {
                audiobookHashes.push(file.fileHash);
            }
        }
        audiobookHashes.push(",")
        if (audiobook.audioFiles) {
            for (const file of audiobook.audioFiles) {
                audiobookHashes.push(file.fileHash);
            }
        }
        audiobookHashes.push(",")

        if (importHashes.length != audiobookHashes.length) return true;

        for (let i=0; i<importHashes.length; i++) {
            if (audiobookHashes[i] != importHashes[i]) return true;
        }

        return false;
    }

    private async updateAudiobook(audiobook: Audiobook, data: IAudiobookImportData): Promise<void> {
        let isFileUpdateRequired = await this.isFileUpdateRequired(audiobook, data)

        if (isFileUpdateRequired) {
            console.log("File update is required")

            if (audiobook.icon) await this.audiobookManager.removeMediaFile(audiobook.icon.id)
            if (audiobook.images) for (const image of audiobook.images) await this.audiobookManager.removeMediaFile(image.id)
            if (audiobook.audioFiles) for (const audioFile of audiobook.audioFiles) await this.audiobookManager.removeMediaFile(audioFile.id)

            const files = await this.gatherImportFiles(data, audiobook);

            if (files.icon) {
                await this.audiobookManager.addMediaFile(createMediaFileInstance(audiobook.id, MediaFileOwnerType.Audiobook, MediaFileType.Icon), files.icon)
            }

            if (files.images) {
                for (const file of files.images) await this.audiobookManager.addMediaFile(createMediaFileInstance(audiobook.id, MediaFileOwnerType.Audiobook, MediaFileType.Image), file)
            }

            if (files.audioFiles) {
                for (const file of files.audioFiles) await this.audiobookManager.addMediaFile(createMediaFileInstance(audiobook.id, MediaFileOwnerType.Audiobook, MediaFileType.Audio), file)
            }
        }

        let clone = this.jsonClone(audiobook)
        let clonedSource = this.jsonClone(audiobook)

        clone.title = data.title;
        clone.shortDescription = data.shortDescription;
        clone.description = data.description;

        clone = await this.gatherImportReferences(data, clone)

        if (isFileUpdateRequired || !deepEqual(clonedSource, clone)) {
            console.log("Audiobook update is required")
            clone.version += 1
            clone.updateTime = this.now()
            await this.audiobookManager.updateAudiobook(clone)
        }
    }

    async getOrCreateAuthor(authorName: string): Promise<Author> {
        authorName = authorName.trim()
        const getAuthorsResponse = await this.audiobookManager.getAuthors({nameStartWith: authorName, offset: 0, limit: 100, searchFor: null})

        // Get existing
        for (const author of getAuthorsResponse.authors) {
            if (author.name === authorName) {
                return author
            }
        }

        // Add new
        const authorId = await this.audiobookManager.addAuthor({id: 0, name: authorName, description: "", parentId: 0, parameters: null}, null, null)

        return await this.audiobookManager.getAuthor(authorId)
    }

    async getOrCreateReader(readerName: string): Promise<Reader> {
        readerName = readerName.trim()
        const getReadersResponse = await this.audiobookManager.getReaders({nameStartWith: readerName, offset: 0, limit: 100, searchFor: null})

        // Get existing
        for (const reader of getReadersResponse.readers) {
            if (reader.name === readerName) {
                return reader
            }
        }

        // Add new
        const readerId = await this.audiobookManager.addReader({id: 0, name: readerName, description: "", parentId: 0, parameters: null}, null, null)

        return await this.audiobookManager.getReader(readerId)
    }

    private async getOrCreateTagId(tagName: string) {
        tagName = tagName.trim()
        const tags = this.tags.filter(tag => tag.name === tagName)
        if (tags && tags.length > 0) return tags[0].id;

        const tagId = await this.audiobookManager.addTag({id: 0, name: tagName, description: null, parameters: null, parentId: 0})
        this.tags = await this.audiobookManager.getTags()
        return tagId;
    }

    private async getOrCreateCategoryId(categoryName: string) {
        categoryName = categoryName.trim()
        const categories = this.categories.filter(tag => tag.name === categoryName)
        if (categories && categories.length > 0) return categories[0].id;

        const categoryId = await this.audiobookManager.addCategory({id: 0, name: categoryName, description: null, parameters: null, parentId: 0})
        this.categories = await this.audiobookManager.getCategories()
        return categoryId;
    }

}

// export const Importer = new AudiobookImporterExcel();
