export type Parameters = Map<string, string> | null

export function compareAudiobooks(a1: Audiobook, a2: Audiobook) {
    return a1.id == a2.id && a1.providerId == a2.providerId
}

export interface Audiobook {
    id: number,
    providerId: string | null,
    title: string,
    shortDescription: string | null,
    description: string | null,
    authors: Author[] | null,
    authorIds: number[] | null,
    readers: Reader[] | null,
    readerIds: number[] | null,
    tagIds: number[] | null,
    tags: Tag[] | null,
    categoryIds: Array<number> | null,
    categories: Category[] | null,
    version: number,
    icon: MediaFile | null,
    images: MediaFile[] | null,
    audioFiles: MediaFile[] | null,
    totalSize: number,
    totalDuration: number,
    addTime: number,
    updateTime: number,
    parameters: Parameters
}

export interface MediaFile {
    id: number,
    fileId: string,
    ownerType: MediaFileOwnerType,
    ownerId: number,
    url: string,
    fileSize: number,
    fileName: string,
    name: string,
    description: string,
    mediaType: MediaFileType,
    fileHash: string,
    duration: number,
    ownerIndex: number
}

export function createMediaFileInstance(ownerId: number, ownerType: MediaFileOwnerType, mediaType: MediaFileType, ownerIndex: number = 0, name: string = "", description: string = ""): MediaFile {
    return {
        id: 0,
        fileSize: 0,
        name: name,
        description: description,
        fileName: "",
        duration: 0,
        mediaType: mediaType,
        fileHash: "",
        ownerType: ownerType,
        ownerId: ownerId,
        url: "",
        fileId: "",
        ownerIndex: ownerIndex
    }
}

export enum MediaFileOwnerType {
    Audiobook = 0,
    Author = 1,
    Reader = 2,
}

export enum MediaFileType {
    Icon = 0,
    Image = 1,
    Audio = 2
}

export interface Tag {
    id: number,
    parentId: number,
    name: string,
    description: string | null,
    parameters: Parameters
}

export interface Category {
    id: number,
    parentId: number,
    name: string,
    description: string | null,
    parameters: Parameters
}

export interface Author {
    id: number,
    parentId: number,
    name: string,
    description: string | null,
    parameters: Parameters
}

export interface Reader {
    id: number,
    parentId: number,
    name: string,
    description: string | null,
    parameters: Parameters
}
