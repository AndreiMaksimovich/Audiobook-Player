import {Audiobook, Author, Category, Reader, Tag} from "./Types.Data";

export interface GetWelcomePackageResponse {
    categories: Category[];
    tags: Tag[];
}

export enum AudiobooksOrderBy {
    Default = 0,
    AddTime = 1,
    UpdateTime = 2,
    Title
}

export interface GetAudiobooksRequest {
    tagId?: number,
    categoryId?: number,
    authorId?: number,
    readerId?: number,
    offset: number,
    limit: number,
    searchFor?: string,
    titleStartsWith?: string,
    orderBy?: AudiobooksOrderBy
}

export enum AudiobookLimit {
    _10 = 10,
    _25 = 25,
    _50 = 50
}

export interface GetAudiobooksResponse {
    totalCount: number,
    audiobooks: Audiobook[]
}

export interface GetAuthorsRequest {
    offset: number,
    limit: number,
    searchFor: string | null,
    nameStartWith: string | null
}

export interface GetAuthorsResponse {
    totalCount: number,
    authors: Author[]
}

export interface GetReadersRequest {
    offset: number,
    limit: number,
    searchFor: string | null,
    nameStartWith: string | null
}

export interface GetReadersResponse {
    totalCount: number,
    readers: Reader[]
}
