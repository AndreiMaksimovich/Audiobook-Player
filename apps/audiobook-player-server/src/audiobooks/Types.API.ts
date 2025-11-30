import {
    Audiobook,
    Author,
    Category,
    MediaFile,
    MediaFileOwnerType,
    MediaFileType,
    Reader,
    Tag,
    GetAudiobooksRequest,
    GetAudiobooksResponse,
    GetAuthorsRequest,
    GetAuthorsResponse,
    GetReadersRequest,
    GetReadersResponse,
    GetWelcomePackageResponse
} from "shared";

export interface IAudiobookProvider {
    getAudiobook(id: number): Promise<Audiobook>
    getMediaFile: (id: number) => Promise<MediaFile>

    getAuthor(id: number): Promise<Author>
    getReader(id: number): Promise<Reader>

    getCategory(id: number): Promise<Category>
    getCategories(): Promise<Category[]>
    getTag(id: number): Promise<Tag>
    getTags(): Promise<Tag[]>

    getAudiobooks(request: GetAudiobooksRequest): Promise<GetAudiobooksResponse>
    getAuthors(request: GetAuthorsRequest): Promise<GetAuthorsResponse>
    getReaders(request: GetReadersRequest): Promise<GetReadersResponse>

    getWelcomePackage(): Promise<GetWelcomePackageResponse>
}

export interface IAudiobookManager extends IAudiobookProvider {
    getMediaFiles: (ownerId: number | null, ownerType: MediaFileOwnerType | null, type: MediaFileType | null) => Promise<MediaFile[]>

    addMediaFile: (mediaFile: MediaFile, path: string) => Promise<string[]>
    removeMediaFile: (id: number) => Promise<void>
    updateMediaFile: (mediaFile: MediaFile, path: string | null) => Promise<void>

    addAudiobook(audiobook: Audiobook, icon: string | null, images: string[] | null, audioFiles: string[] | null, audiobookId: number | null): Promise<number>

    removeAudiobook(id: number): Promise<void>
    updateAudiobook(audiobook: Audiobook): Promise<void>
    updateAudiobookMediaFileMetadata(id: number): Promise<void>

    addAuthor(author: Author, icon: string | null, images: string[] | null): Promise<number>
    removeAuthor(id: number): Promise<void>
    updateAuthor(author: Author): Promise<void>

    addReader(reader: Reader, icon: string | null, images: string[] | null): Promise<number>
    removeReader(id: number): Promise<void>
    updateReader(reader: Reader): Promise<void>

    addCategory(category: Category): Promise<number>
    removeCategory(id: number): Promise<void>
    updateCategory(category: Category): Promise<void>

    addTag(tag: Tag): Promise<number>
    removeTag(id: number): Promise<void>
    updateTag(tag: Tag): Promise<void>
}

export enum AudiobookProviderErrorCode {
    MediaFileNotFound = 1,
}

export class AudiobookProviderError extends Error {
    public errorCode: number;
    public error: any | null;

    constructor(message: string, errorCode: number, error: any | null = null) {
        super(message);
        this.errorCode = errorCode;
        this.error = error;
    }
}

export enum AudiobookManagerErrorCode {
    UnknownMediaFileFormat = 1001,
    FileStorageFileRemovalFailed = 1002,
}

export class AudiobookManagerError extends AudiobookProviderError {

}
