import {RowDataPacket} from "mysql2";
import {IFileStorageService} from "../file-storage/Types";
import {Audiobook, Author, Category, MediaFile, Reader, Tag} from "shared";

export enum MySqlTable {
    media_files = "media_files",
    audiobooks = "audiobooks",
    tags = "tags",
    categories = "categories",
    authors = "authors",
    readers = "readers",
    audiobooks_to_tags = "audiobooks_to_tags",
    audiobooks_to_categories = "audiobooks_to_categories",
    audiobooks_to_authors = "audiobooks_to_authors",
    audiobooks_to_readers = "audiobooks_to_readers",
}

// ----- Media file - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export interface MediaFileRow extends RowDataPacket {
    id: number,
    file_id: string,
    owner_id: number,
    owner_type: number,
    owner_index: number,
    file_size: number,
    file_name: string,
    name: string,
    description: string,
    media_type: number,
    file_hash: string,
    duration: number,
}

export type MediaFileRowInsertable = Omit<MediaFileRow, 'id'>;

export function getInsertableMediaFileRow(data: MediaFileRow): MediaFileRowInsertable {
    return removeId(data)
}

export async function rowToMediaFile(row: MediaFileRow, fileStorage: IFileStorageService): Promise<MediaFile> {
    return {
        id: row.id,
        mediaType: row.media_type,
        fileId: row.file_id,
        name: row.name,
        description: row.description,
        fileName: row.file_name,
        duration: row.duration,
        fileHash: row.file_hash,
        fileSize: row.file_size,
        ownerId: row.owner_id,
        ownerIndex: row.owner_index,
        url: await fileStorage.fileIdToUrl(row.file_id),
        ownerType: row.owner_type,
    }
}

export async function mediaFileToRow(mediaFile: MediaFile): Promise<MediaFileRowInsertable> {
    return {
        file_hash: mediaFile.fileHash,
        file_id: mediaFile.fileId,
        owner_type: mediaFile.ownerType,
        file_name: mediaFile.fileName,
        file_size: mediaFile.fileSize,
        media_type: mediaFile.mediaType,
        duration: mediaFile.duration,
        description: mediaFile.description,
        owner_id: mediaFile.ownerId,
        name: mediaFile.name,
        owner_index: mediaFile.ownerIndex,
    }
}

// ----- Audiobook - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export interface AudiobookRow extends RowDataPacket  {
    id: number,
    title: string,
    short_description: string | null,
    description: string | null,
    version: number,
    total_size: number,
    total_duration: number,
    add_time: number,
    update_time: number,
}

export type AudiobookRowInsertable = Omit<AudiobookRow, "id">

export function getInsertableAudiobookRow(audiobook: AudiobookRow): AudiobookRowInsertable {
    return removeId(audiobook)
}

export function rowToAudiobook(row: AudiobookRow): Audiobook {
    return {
        id: row.id,
        addTime: row.add_time,
        description: row.description,
        shortDescription: row.short_description,
        title: row.title,
        totalDuration: row.total_duration,
        totalSize: row.total_size,
        updateTime: row.update_time,
        version: row.version,

        authors: null,
        authorIds: null,
        categoryIds: null,
        parameters: null,
        readers: null,
        icon: null,
        images: null,
        audioFiles: null,
        providerId: null,
        readerIds: null,
        tagIds: null,
        tags: null,
        categories: null,
    }
}

export function audiobookToRow(data: Audiobook): AudiobookRowInsertable {
    return {
        update_time: data.updateTime,
        total_size: data.totalSize,
        total_duration: data.totalDuration,
        title: data.title,
        short_description: data.shortDescription,
        description: data.description,
        add_time: data.addTime,
        version: data.version,
    }
}

export function audiobookToRowMediaFilesMeta(data: Audiobook) {
    return {
        total_size: data.totalSize,
        total_duration: data.totalDuration,
    }
}

// ----- Author - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export interface AuthorRow extends RowDataPacket {
    id: number,
    name: string,
    description: string | null,
    parent_id: number,
}

export type AuthorRowInsertable = Omit<AuthorRow, "id">

export function getInsertableAuthorRow(data: AuthorRow): AuthorRowInsertable {
    return removeId(data)
}

export function rowToAuthor(row: AuthorRow): Author {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        parentId: row.parent_id,
        parameters: null
    }
}

export function authorToRow(author: Author): AuthorRowInsertable {
    return {
        name: author.name,
        description: author.description,
        parent_id: author.parentId
    }
}

// ----- Reader - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export interface ReaderRow extends RowDataPacket  {
    id: number,
    name: string,
    description: string | null,
    parent_id: number,
}

export type ReaderRowInsertable = Omit<ReaderRow, "id">

export function getInsertableReaderRow(data: ReaderRow): ReaderRowInsertable {
    return removeId(data)
}

export function rowToReader(row: AuthorRow): Reader {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        parentId: row.parent_id,
        parameters: null
    }
}

export function readerToRow(object: Author): ReaderRowInsertable {
    return {
        name: object.name,
        description: object.description,
        parent_id: object.parentId
    }
}

// ----- Category - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export interface CategoryRow extends RowDataPacket {
    id: number,
    name: string,
    description: string | null,
    parent_id: number,
}

export type CategoryRowInsertable = Omit<CategoryRow, "id">

export function getInsertableCategoryRow(data: CategoryRow): CategoryRowInsertable {
    return removeId(data)
}

export function rowToCategory(row: CategoryRow): Category {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        parentId: row.parent_id,
        parameters: null
    }
}

export function categoryToRow(object: Category): CategoryRowInsertable {
    return {
        name: object.name,
        description: object.description,
        parent_id: object.parentId
    }
}

// ----- Tag - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export interface TagRow extends RowDataPacket {
    id: number,
    name: string,
    description: string | null,
    parent_id: number,
}

export type TagRowInsertable = Omit<TagRow, "id">

export function getInsertableTagRow(data: TagRow): TagRowInsertable {
    return removeId(data)
}

export function rowToTag(row: TagRow): Tag {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        parentId: row.parent_id,
        parameters: null
    }
}

export function tagToRow(object: Tag): TagRowInsertable {
    return {
        name: object.name,
        description: object.description,
        parent_id: object.parentId
    }
}

export interface TotalCountRow extends RowDataPacket {
    total_count: number
}

export interface IdRow extends RowDataPacket {
    id: number
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

interface IdentifiableRow {
    id: number,
}

function removeId<T extends IdentifiableRow>(data: T): Omit<T, 'id'> {
    const {id, ...insertableData} = data;
    return insertableData;
}
