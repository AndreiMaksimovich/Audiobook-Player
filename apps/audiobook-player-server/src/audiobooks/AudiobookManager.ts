import {AudiobookManagerError, AudiobookManagerErrorCode, IAudiobookManager} from "./Types.API";
import {Pool, PoolConnection, ResultSetHeader} from "mysql2/promise";
import {IFileStorageManager} from "../file-storage/Types";
import {
    Audiobook,
    Author,
    Category,
    createMediaFileInstance,
    MediaFile,
    MediaFileOwnerType,
    MediaFileType,
    Reader,
    Tag
} from "shared";
import nodePath from "path";
import {AudiobookProvider} from "./AudiobookProvider";
import {
    audiobookToRow, audiobookToRowMediaFilesMeta,
    authorToRow,
    categoryToRow,
    mediaFileToRow,
    MySqlTable,
    readerToRow,
    tagToRow
} from "./Types.MySQL";
import {calculateFileHash, getAudioFileDuration, getFileSize} from "../utils/FileUtils";

export class AudiobookManager extends AudiobookProvider implements IAudiobookManager {

    constructor(connectionPool: Pool, private fileStorageManager: IFileStorageManager) {
        super(connectionPool, fileStorageManager);
    }

    // ---- Audiobooks - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    async addAudiobook(audiobook: Audiobook, icon: string | null, images: string[] | null, audioFiles: string[] | null, audiobookId: number | null = null): Promise<number> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            const id = await this._addAudiobook(audiobook, icon, images, audioFiles, audiobookId, connection);
            await connection.commit();

            return id;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _addAudiobook(audiobook: Audiobook, icon: string | null, images: string[] | null, audioFiles: string[] | null, audiobookId: number | null, connection: PoolConnection): Promise<number> {
        const rowData = audiobookToRow(audiobook)
        if (audiobookId !== null) {
            rowData.id = audiobookId;
        }
        audiobookId = await this.sqlInsert(MySqlTable.audiobooks, rowData, connection)

        const fileIds: string[] = []

        try {
            if (icon) {
                const [mediaFileId, fileId] = await this._addMediaFile(
                    createMediaFileInstance(audiobookId, MediaFileOwnerType.Audiobook, MediaFileType.Icon),
                    icon,
                    connection
                )
                fileIds.push(fileId)
            }

            if (images) {
                for (const image of images) {
                    const [mediaFileId, fileId] = await this._addMediaFile(
                        createMediaFileInstance(audiobookId, MediaFileOwnerType.Audiobook, MediaFileType.Image),
                        image,
                        connection
                    )
                    fileIds.push(fileId)
                }
            }

            if (audioFiles) {
                let index = 0
                for (const audioFile of audioFiles) {
                    const [mediaFileId, fileId] = await this._addMediaFile(
                        createMediaFileInstance(audiobookId, MediaFileOwnerType.Audiobook, MediaFileType.Audio, index),
                        audioFile,
                        connection
                    )
                    fileIds.push(fileId)
                    index++
                }
            }

            const mediaFiles = await this._getMediaFiles(null, audiobookId, MediaFileOwnerType.Audiobook, MediaFileType.Audio, connection)
            let totalSize = 0
            let totalDuration = 0

            for (const mediaFile of mediaFiles) {
                totalDuration += mediaFile.duration;
                totalSize += mediaFile.fileSize;
            }

            audiobook.addTime = Date.now();
            audiobook.updateTime = Date.now();
            audiobook.totalDuration = totalDuration;
            audiobook.totalSize = totalSize;

            await this.sqlUpdate(MySqlTable.audiobooks, audiobookId, audiobookToRow(audiobook), connection)

            await this._updateAudiobookExternalReferences(audiobook, connection);
        } catch (e) {
            for (const fileId of fileIds) {
                try {
                    await this.fileStorageManager.removeFile(fileId);
                } catch (error) {
                    console.log(new AudiobookManagerError(`Failed to remove file storage file with id=${fileId}`, AudiobookManagerErrorCode.FileStorageFileRemovalFailed, error));
                }
            }
            throw e
        }

        return audiobookId
    }

    protected async _updateAudiobookExternalReferences(audiobook: Audiobook, connection: PoolConnection): Promise<void> {
        const currentAudiobook = await this._getAudiobook(audiobook.id, connection, false)

        function getItemsToAdd(currentState: number[], targetState: number[]): number[] {
            const result = []
            for (const targetId of targetState) {
                if (currentState.indexOf(targetId) < 0) {
                    result.push(targetId)
                }
            }
            return result
        }

        function getItemsToRemove(currentState: number[], targetState: number[]): number[] {
            const result = []
            for (const currentId of currentState) {
                if (targetState.indexOf(currentId) < 0) {
                    result.push(currentId)
                }
            }
            return result
        }

        const authorsToAdd: number[] = getItemsToAdd(currentAudiobook.authorIds!, audiobook.authorIds!);
        const authorsToRemove: number[] = getItemsToRemove(currentAudiobook.authorIds!, audiobook.authorIds!);
        await this.sqlInsertAudiobookMappingIds(MySqlTable.audiobooks_to_authors, audiobook.id, authorsToAdd, 'author_id', connection)
        await this.sqlDeleteAudiobookMappingIds(MySqlTable.audiobooks_to_authors, audiobook.id, authorsToRemove, 'author_id', connection)

        const readersToAdd: number[] = getItemsToAdd(currentAudiobook.readerIds!, audiobook.readerIds!);
        const readersToRemove: number[] = getItemsToRemove(currentAudiobook.readerIds!, audiobook.readerIds!);
        await this.sqlInsertAudiobookMappingIds(MySqlTable.audiobooks_to_readers, audiobook.id, readersToAdd, 'reader_id', connection)
        await this.sqlDeleteAudiobookMappingIds(MySqlTable.audiobooks_to_readers, audiobook.id, readersToRemove, 'reader_id', connection)

        const categoriesToAdd: number[] = getItemsToAdd(currentAudiobook.categoryIds!, audiobook.categoryIds!);
        const categoriesToRemove: number[] = getItemsToRemove(currentAudiobook.categoryIds!, audiobook.categoryIds!);
        await this.sqlInsertAudiobookMappingIds(MySqlTable.audiobooks_to_categories, audiobook.id, categoriesToAdd, 'category_id', connection)
        await this.sqlDeleteAudiobookMappingIds(MySqlTable.audiobooks_to_categories, audiobook.id, categoriesToRemove, 'category_id', connection)

        const tagsToAdd: number[] = getItemsToAdd(currentAudiobook.tagIds!, audiobook.tagIds!);
        const tagsToRemove: number[] = getItemsToRemove(currentAudiobook.tagIds!, audiobook.tagIds!);
        await this.sqlInsertAudiobookMappingIds(MySqlTable.audiobooks_to_tags, audiobook.id, tagsToAdd, 'tag_id', connection)
        await this.sqlDeleteAudiobookMappingIds(MySqlTable.audiobooks_to_tags, audiobook.id, tagsToRemove, 'tag_id', connection)
    }

    async removeAudiobook(id: number): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._removeAudiobook(id, connection);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _removeAudiobook(id: number, connection: PoolConnection): Promise<void> {
        const audiobookId = id;
        const audiobookIdFieldName = "audiobook_id";

        const mediaFiles = await this._getMediaFiles(null, id, MediaFileOwnerType.Audiobook, null, connection);

        // Remove media file records
        for (const mediaFile of mediaFiles) {
            await this._removeMediaFile(mediaFile.id, connection, false)
        }

        // Remove audiobook ref record
        await this.sqlDelete(MySqlTable.audiobooks_to_tags, audiobookId, connection, audiobookIdFieldName)
        await this.sqlDelete(MySqlTable.audiobooks_to_categories, audiobookId, connection, audiobookIdFieldName)
        await this.sqlDelete(MySqlTable.audiobooks_to_authors, audiobookId, connection, audiobookIdFieldName)
        await this.sqlDelete(MySqlTable.audiobooks_to_readers, audiobookId, connection, audiobookIdFieldName)

        // Remove audiobook record
        await this.sqlDelete(MySqlTable.audiobooks, audiobookId, connection)

        // Remove media data files
        for (const mediaFile of mediaFiles) {
            try {
                await this.fileStorageManager.removeFile(mediaFile.fileId)
            } catch (error) {
                console.error(new AudiobookManagerError(`Failed to remove file storage file with id=${mediaFile.fileId}`, AudiobookManagerErrorCode.FileStorageFileRemovalFailed, error));
            }
        }
    }

    async updateAudiobook(audiobook: Audiobook): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._updateAudiobook(audiobook, connection);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _updateAudiobook(audiobook: Audiobook, connection: PoolConnection): Promise<void> {
        await this.sqlUpdate(MySqlTable.audiobooks, audiobook.id, audiobookToRow(audiobook), connection)
        await this._updateAudiobookExternalReferences(audiobook, connection)
        await this._updateAudiobookMediaFileMetadata(audiobook.id, connection)
    }

    async updateAudiobookMediaFileMetadata(id: number): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._updateAudiobookMediaFileMetadata(id, connection);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _updateAudiobookMediaFileMetadata(id: number, connection: PoolConnection) {
        const audiobook= await this._getAudiobook(id, connection, true);

        audiobook.totalSize = 0
        audiobook.totalDuration = 0

        for (const mediaFile of audiobook.audioFiles!) {
            if (mediaFile.mediaType == MediaFileType.Audio) {
                audiobook.totalSize += mediaFile.fileSize
                audiobook.totalDuration += mediaFile.duration
            }
        }

        await this.sqlUpdate(MySqlTable.audiobooks, audiobook.id, audiobookToRowMediaFilesMeta(audiobook), connection)
    }

    // ---- Authors - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    async addAuthor(author: Author, icon: string | null, images: string[] | null): Promise<number> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            const authorId = await this._addAuthor(author, icon, images, connection);
            await connection.commit();
            return authorId;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _addAuthor(author: Author, icon: string | null, images: string[] | null, connection: PoolConnection): Promise<number> {
        const rowData = authorToRow(author)
        const id = await this.sqlInsert(MySqlTable.authors, rowData, connection)
        //TODO add media support
        return id;
    }

    async removeAuthor(id: number): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._removeAuthor(id, connection);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _removeAuthor(id: number, connection: PoolConnection): Promise<void> {
        await this.sqlDelete(MySqlTable.audiobooks_to_authors, id, connection, 'author_id');
        await this.sqlDelete(MySqlTable.authors, id, connection);
        //TODO add media support
    }

    async updateAuthor(author: Author): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._updateAuthor(author, connection);
            //TODO add media support
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _updateAuthor(author: Author, connection: PoolConnection): Promise<void> {
        const rowData = authorToRow(author)
        await this.sqlUpdate(MySqlTable.authors, author.id, rowData, connection)
        //TODO add media support
    }

    // ---- Readers - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    async addReader(reader: Reader, icon: string | null, images: string[] | null): Promise<number> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            const readerId = await this._addReader(reader, icon, images, connection);
            await connection.commit();
            return readerId;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _addReader(reader: Reader, icon: string | null, images: string[] | null, connection: PoolConnection): Promise<number> {
        const id = await this.sqlInsert(MySqlTable.readers, readerToRow(reader), connection);
        //TODO add media support
        return id;
    }

    async removeReader(id: number): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._removeReader(id, connection);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _removeReader(id: number, connection: PoolConnection): Promise<void> {
        await this.sqlDelete(MySqlTable.audiobooks_to_readers, id, connection, 'reader_id');
        await this.sqlDelete(MySqlTable.readers, id, connection);
        //TODO add media support
    }

    async updateReader(reader: Reader): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._updateReader(reader, connection);
            //TODO add media support
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _updateReader(reader: Reader, connection: PoolConnection): Promise<void> {
        const rowData = readerToRow(reader)
        await this.sqlUpdate(MySqlTable.readers, reader.id, rowData, connection)
        //TODO add media support
    }

    // ---- Categories - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    async addCategory(category: Category): Promise<number> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            const readerId = await this._addCategory(category, connection);
            await connection.commit();
            return readerId;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _addCategory(category: Category, connection: PoolConnection): Promise<number> {
        return await this.sqlInsert(MySqlTable.categories, categoryToRow(category), connection);
    }

    async removeCategory(id: number): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._removeCategory(id, connection);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _removeCategory(id: number, connection: PoolConnection): Promise<void> {
        await this.sqlDelete(MySqlTable.audiobooks_to_categories, id, connection, 'category_id');
        await this.sqlDelete(MySqlTable.categories, id, connection);
    }

    async updateCategory(category: Category): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._updateCategory(category, connection);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _updateCategory(category: Category, connection: PoolConnection): Promise<void> {
        const rowData = categoryToRow(category)
        await this.sqlUpdate(MySqlTable.categories, category.id, rowData, connection)
    }

    // ---- Tags - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    async addTag(tag: Tag): Promise<number> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            const readerId = await this._addTag(tag, connection);
            await connection.commit();
            return readerId;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _addTag(tag: Tag, connection: PoolConnection): Promise<number> {
        return await this.sqlInsert(MySqlTable.tags, tagToRow(tag), connection);
    }

    async removeTag(id: number): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._removeTag(id, connection);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _removeTag(id: number, connection: PoolConnection): Promise<void> {
        await this.sqlDelete(MySqlTable.audiobooks_to_tags, id, connection, 'tag_id');
        await this.sqlDelete(MySqlTable.tags, id, connection);
    }

    async updateTag(tag: Tag): Promise<void> {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            await this._updateTag(tag, connection);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    protected async _updateTag(tag: Tag, connection: PoolConnection): Promise<void> {
        const rowData = tagToRow(tag)
        await this.sqlUpdate(MySqlTable.tags, tag.id, rowData, connection)
    }

    // ---- Media Files - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    async getMediaFiles (ownerId: number | null, ownerType: MediaFileOwnerType | null, mediaType: MediaFileType | null): Promise<MediaFile[]> {
        const connection = await this.getConnection()
        try {
            return await this._getMediaFiles(null, ownerId, ownerType, mediaType, connection)
        }
        finally {
            connection.release();
        }
    }

    async removeMediaFile(id: number): Promise<void> {
        const connection = await this.getConnection()
        try {
            await this._removeMediaFile(id, connection)
        }
        finally {
            connection.release();
        }
    }

    private async _removeMediaFile(id: number, connection: PoolConnection, removeFileStorageFile: boolean = true): Promise<void> {
        const mediaFile = await this.getMediaFile(id);
        await connection.execute(`DELETE FROM ${mediaFile.name} WHERE id=?`, [id]);
        if (removeFileStorageFile) {
            await this.fileStorageManager.removeFile(mediaFile.fileId)
        }
    }

    async updateMediaFile(mediaFile: MediaFile, path: string | null): Promise<void> {
        const connection = await this.getConnection()
        try {
            await this._updateMediaFile(mediaFile, path, connection)
        }
        finally {
            connection.release();
        }
    }

    private async _updateMediaFile(mediaFile: MediaFile, path: string | null, connection: PoolConnection): Promise<void> {
        let fileId: string | null = null;
        let oldFileId: string | null = null;
        const mediaFileId = mediaFile.id;

        try {
            if (path) {
                mediaFile.fileHash = await calculateFileHash(path)
                mediaFile.duration = mediaFile.mediaType == MediaFileType.Audio ? await getAudioFileDuration(path) : 0
                mediaFile.fileName = nodePath.basename(path)
                mediaFile.fileSize = await getFileSize(path)

                oldFileId = mediaFile.fileId
                fileId = await this.fileStorageManager.addFile(path, this.getFileIdPrefix(mediaFile))
                mediaFile.fileId = fileId
            }

            const rowData = await mediaFileToRow(mediaFile)
            await connection.query(`UPDATE ${MySqlTable.media_files} SET ? WHERE id=?`, [rowData, mediaFileId])

            if (oldFileId) {
                await this.fileStorageManager.removeFile(oldFileId)
            }
        } catch (e) {
            if (fileId) {
                await this.fileStorageManager.removeFile(fileId)
            }
            throw e;
        }
    }

    async addMediaFile(mediaFile: MediaFile, path: string): Promise<string[]> {
        const connection = await this.getConnection()
        try {
            return await this._addMediaFile(mediaFile, path, connection)
        }
        finally {
            connection.release();
        }
    }

    private getFileIdPrefix(mediaFile: MediaFile): string {
        return `${mediaFile.ownerType}_${mediaFile.ownerId}_`;
    }

    private async _addMediaFile(mediaFile: MediaFile, path: string, connection: PoolConnection): Promise<string[]> {
        let fileId: string | null = null;

        try {
            fileId = await this.fileStorageManager.addFile(path, this.getFileIdPrefix(mediaFile))

            const rowData = await mediaFileToRow(mediaFile)
            rowData.duration = mediaFile.mediaType == MediaFileType.Audio ? await getAudioFileDuration(path) : 0
            rowData.file_hash = await calculateFileHash(path)
            rowData.file_name = nodePath.basename(path)
            rowData.file_size = await getFileSize(path)
            rowData.file_id = fileId

            const [result] = await connection.query<ResultSetHeader>(`INSERT INTO ${MySqlTable.media_files} SET ?`, [rowData])
            return [`${result.insertId}`, fileId]
        }
        catch (error) {
            if (fileId !== null) {
                await this.fileStorageManager.removeFile(fileId)
            }
            throw error
        }
    }

    protected async sqlInsert(table: string, data: any, connection: PoolConnection): Promise<number> {
        const [result] = await connection.query<ResultSetHeader>(`INSERT INTO ${table} SET ?`, [data])
        return result.insertId;
    }

    protected async sqlUpdate(table: string, id: number, data: any, connection: PoolConnection): Promise<void> {
        await connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data, id])
    }

    protected async sqlDelete(table: string, id: number, connection: PoolConnection, idFieldName: string = 'id'): Promise<void> {
        await connection.query(`DELETE FROM ${table} WHERE ${idFieldName}=?`, [id]);
    }

    protected async sqlInsertAudiobookMappingIds(table: string, audiobookId: number, ids: number[], idFieldName: string, connection: PoolConnection): Promise<void> {
        for (const id of ids) {
            await connection.query(`INSERT INTO ${table}(audiobook_id, ${idFieldName}) VALUES (${audiobookId}, ${id})`);
        }
    }

    protected async sqlDeleteAudiobookMappingIds(table: string, audiobookId: number, ids: number[], idFieldName: string, connection: PoolConnection): Promise<void> {
        for (const id of ids) {
            await connection.query(`DELETE FROM ${table} WHERE audiobook_id=? AND ${idFieldName}=?`, [audiobookId, id]);
        }
    }
}



