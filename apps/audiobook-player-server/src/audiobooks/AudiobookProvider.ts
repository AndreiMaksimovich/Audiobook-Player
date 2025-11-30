import {AudiobookProviderError, AudiobookProviderErrorCode, IAudiobookProvider} from "./Types.API";
import {
    AudiobookRow,
    AuthorRow,
    CategoryRow,
    IdRow,
    MediaFileRow,
    MySqlTable,
    ReaderRow,
    rowToAudiobook,
    rowToAuthor,
    rowToCategory,
    rowToMediaFile,
    rowToReader,
    rowToTag,
    TagRow,
    TotalCountRow
} from "./Types.MySQL";
import {Pool, PoolConnection} from "mysql2/promise";
import {IFileStorageService} from "../file-storage/Types";
import {
    Audiobook,
    AudiobooksOrderBy,
    Author,
    Category,
    GetAudiobooksRequest,
    GetAudiobooksResponse,
    GetAuthorsRequest,
    GetAuthorsResponse,
    GetReadersRequest,
    GetReadersResponse,
    GetWelcomePackageResponse,
    MediaFile,
    MediaFileOwnerType,
    MediaFileType,
    Reader,
    Tag
} from "shared";
import {RowDataPacket} from "mysql2";

export class AudiobookProvider implements IAudiobookProvider {

    constructor(protected connectionPool: Pool, protected fileStorage: IFileStorageService) {}

    async getCategory(id: number): Promise<Category> {
        const connection = await this.getConnection();
        try {
            return await this._getCategory(id, connection);
        } finally {
            connection.release()
        }
    }

    protected async _getCategory(id: number, connection: PoolConnection): Promise<Category> {
        return (await this.sqlSelectData<CategoryRow, Category>(MySqlTable.categories, id, connection, rowToCategory))[0]
    }

    async getTag(id: number): Promise<Tag> {
        const connection = await this.getConnection();
        try {
            return await this._getTag(id, connection);
        } finally {
            connection.release()
        }
    }

    protected async _getTag(id: number, connection: PoolConnection): Promise<Tag> {
        return (await this.sqlSelectData<TagRow, Tag>(MySqlTable.tags, id, connection, rowToTag))[0]
    }

    async getCategories(): Promise<Category[]> {
        const connection = await this.getConnection();
        try {
            return await this._getCategories(connection);
        } finally {
          connection.release()
        }
    }

    protected async _getCategories(connection: PoolConnection): Promise<Category[]> {
        return await this.sqlSelectAll<CategoryRow, Category>(MySqlTable.categories, connection, rowToCategory)
    }

    async getTags(): Promise<Tag[]> {
        const connection = await this.getConnection();
        try {
            return await this._getTags(connection);
        } finally {
            connection.release()
        }
    }

    protected async _getTags(connection: PoolConnection): Promise<Tag[]> {
        return await this.sqlSelectAll<TagRow, Tag>(MySqlTable.tags, connection, rowToTag)
    }

    protected async _getTagsByIds(tagIds: number[], connection: PoolConnection): Promise<Tag[]> {
        const result: Tag[] = []
        for (const tagId of tagIds) {
            result.push(await this._getTag(tagId, connection));
        }
        return result;
    }

    protected async _getCategoriesByIds(categoryIds: number[], connection: PoolConnection): Promise<Category[]> {
        const result: Category[] = []
        for (const categoryId of categoryIds) {
            result.push(await this._getCategory(categoryId, connection));
        }
        return result;
    }

    async getAuthor(id: number): Promise<Author> {
        const connection = await this.getConnection()
        try {
            return (await this.sqlSelectData<AuthorRow, Author>(MySqlTable.authors, id, connection, rowToAuthor))[0]
        } finally {
            connection.release();
        }
    }

    async getReader(id: number): Promise<Reader> {
        const connection = await this.getConnection()
        try {
            return (await this.sqlSelectData<ReaderRow, Reader>(MySqlTable.readers, id, connection, rowToReader))[0]
        } finally {
            connection.release();
        }
    }

    async getAudiobook(id: number): Promise<Audiobook> {
        const connection = await this.getConnection()
        try {
            return await this._getAudiobook(id, connection, true)
        } finally {
            connection.release();
        }
    }

    protected async _getAudiobook(id: number, connection: PoolConnection, full: boolean = false): Promise<Audiobook> {
        const audiobookRow = (await this.sqlSelectRows<AudiobookRow>(MySqlTable.audiobooks, id, connection))[0];
        let audiobook = rowToAudiobook(audiobookRow);

        audiobook = await this._getAudiobookExternalReferences(audiobook, connection)
        if (full) {
            audiobook = await this._fillAudiobookMediaFiles(audiobook, connection)
            audiobook.tags = await this._getTagsByIds(audiobook.tagIds!, connection)
            audiobook.categories = await this._getCategoriesByIds(audiobook.categoryIds!, connection)
        } else {
            audiobook.icon = await this._getAudiobookIcon(audiobook.id, connection)
        }

        return audiobook;
    }

    protected async _getAudiobookIcon(id: number, connection: PoolConnection): Promise<MediaFile | null> {
        const mediaFiles = await this._getMediaFiles(null, id, MediaFileOwnerType.Audiobook, MediaFileType.Icon, connection)
        return mediaFiles.length > 0 ? mediaFiles[0] : null
    }

   protected async _fillAudiobookMediaFiles(audiobook: Audiobook, connection: PoolConnection): Promise<Audiobook> {
       const mediaFiles = await this._getMediaFiles(null, audiobook.id, MediaFileOwnerType.Audiobook, null, connection)
       audiobook.images = []
       audiobook.audioFiles = []
       for (const mediaFile of mediaFiles) {
           switch (mediaFile.mediaType) {
               case MediaFileType.Icon:
                   audiobook.icon = mediaFile
                   break
               case MediaFileType.Audio:
                   audiobook.audioFiles.push(mediaFile);
                   break
               case MediaFileType.Image:
                   audiobook.images.push(mediaFile);
                   break
           }
       }
       return audiobook
   }

    protected async _getAudiobookExternalReferenceIds(audiobook: Audiobook, connection: PoolConnection): Promise<Audiobook> {
        audiobook.authorIds = await this.sqlSelectIds(MySqlTable.audiobooks_to_authors, audiobook.id, 'author_id', connection, 'audiobook_id');
        audiobook.readerIds = await this.sqlSelectIds(MySqlTable.audiobooks_to_readers, audiobook.id, 'reader_id', connection, 'audiobook_id');
        audiobook.categoryIds = await this.sqlSelectIds(MySqlTable.audiobooks_to_categories, audiobook.id, 'category_id', connection, 'audiobook_id');
        audiobook.tagIds = await this.sqlSelectIds(MySqlTable.audiobooks_to_tags, audiobook.id, 'tag_id', connection, 'audiobook_id');

        return audiobook;
    }

    protected async _getAudiobookExternalReferences(audiobook: Audiobook, connection: PoolConnection): Promise<Audiobook> {
        audiobook = await this._getAudiobookExternalReferenceIds(audiobook, connection)

        if (audiobook.authorIds) {
            audiobook.authors = []
            for (const authorId of audiobook.authorIds) {
                audiobook.authors.push(await this.getAuthor(authorId))
            }
        }

        if (audiobook.readerIds) {
            audiobook.readers = []
            for (const readerId of audiobook.readerIds) {
                audiobook.readers.push(await this.getReader(readerId))
            }
        }

        return audiobook;
    }

    async getAudiobooks(request: GetAudiobooksRequest): Promise<GetAudiobooksResponse> {
        const connection = await this.getConnection()
        try {
            return await this._getAudiobooks(request, connection)
        } finally {
            connection.release();
        }
    }

    protected async _getAudiobooks(request: GetAudiobooksRequest, connection: PoolConnection): Promise<GetAudiobooksResponse> {
        const whereConditions: string[] = []
        const params: any[] = []

        // Author
        if (request.authorId) {
            whereConditions.push(`id IN (SELECT audiobook_id FROM ${MySqlTable.audiobooks_to_authors} WHERE author_id=?)`)
            params.push(request.authorId)
        }

        // Reader
        if (request.readerId) {
            whereConditions.push(`id IN (SELECT audiobook_id FROM ${MySqlTable.audiobooks_to_readers} WHERE reader_id=?)`)
            params.push(request.readerId)
        }

        // Category
        if (request.categoryId) {
            whereConditions.push(`id IN (SELECT audiobook_id FROM ${MySqlTable.audiobooks_to_categories} WHERE category_id=?)`)
            params.push(request.categoryId)
        }

        // Tag
        if (request.tagId) {
            whereConditions.push(`id IN (SELECT audiobook_id FROM ${MySqlTable.audiobooks_to_tags} WHERE tag_id=?)`)
            params.push(request.tagId)
        }

        // Name starts with
        if (request.titleStartsWith) {
            const titleStartsWith = request.titleStartsWith.trim()
            if (titleStartsWith.length > 0) {
                whereConditions.push('title LIKE ?')
                params.push(`${titleStartsWith}%`)
            }
        }

        // Search for
        if (request.searchFor) {
            const searchFor = request.searchFor.trim()
            if (searchFor.length > 0) {
                whereConditions.push('MATCH(title, description) AGAINST(?)')
                params.push(searchFor)
            }
        }

        let queryCount = `SELECT COUNT(*) as total_count FROM ${MySqlTable.audiobooks}`
        let queryRows = `SELECT id FROM ${MySqlTable.audiobooks}`

        if (whereConditions.length > 0) {
            queryCount += " WHERE " + whereConditions.join('AND')
            queryRows += " WHERE " + whereConditions.join('AND')
        }

        const [countRows] = await connection.query<TotalCountRow[]>(queryCount, params);
        const totalCount = countRows[0].total_count;

        queryRows += ` ORDER BY ?`
        params.push(this.getAudiobookSqlOrderByParam(request.orderBy ?? AudiobooksOrderBy.Default))

        queryRows += ` LIMIT ? OFFSET ?`
        params.push(request.limit, request.offset)

        const [rows] = await connection.query<IdRow[]>(queryRows, params);
        const audiobooks: Audiobook[] = []
        for (const row of rows) {
            audiobooks.push(await this._getAudiobook(row.id, connection, false))
        }

        return {
            audiobooks: audiobooks,
            totalCount: totalCount
        }
    }

    protected getAudiobookSqlOrderByParam(value: AudiobooksOrderBy) {
        switch (value) {
            case AudiobooksOrderBy.UpdateTime:
                return 'update_time';
            case AudiobooksOrderBy.Title:
                return 'title';
            case AudiobooksOrderBy.Default:
            case AudiobooksOrderBy.AddTime:
            default:
                return 'add_time';
        }
    }

    async getAuthors(request: GetAuthorsRequest): Promise<GetAuthorsResponse> {
        const connection = await this.getConnection()
        try {
            return await this._getAuthors(request, connection)
        } finally {
            connection.release();
        }
    }

    async _getAuthors(request: GetAuthorsRequest, connection: PoolConnection): Promise<GetAuthorsResponse> {
        const whereConditions: string[] = []
        const params: any[] = []

        // Name starts with
        if (request.nameStartWith) {
            const nameStartsWith = request.nameStartWith.trim()
            if (nameStartsWith.length > 0) {
                whereConditions.push('name LIKE ?')
                params.push(`${nameStartsWith}%`)
            }
        }

        // Search for
        if (request.searchFor) {
            const searchFor = request.searchFor.trim()
            if (searchFor.length > 0) {
                whereConditions.push('MATCH(name) AGAINST(?)')
                params.push(searchFor)
            }
        }

        let queryCount = `SELECT COUNT(*) as total_count FROM ${MySqlTable.authors}`
        let queryRows = `SELECT * FROM ${MySqlTable.authors}`

        if (whereConditions.length > 0) {
            queryCount += " WHERE " + whereConditions.join('AND')
            queryRows += " WHERE " + whereConditions.join('AND')
        }

        const [countRows] = await connection.query<TotalCountRow[]>(queryCount, params);
        const totalCount = countRows[0].total_count;

        queryRows += ' ORDER BY name'

        queryRows += ` LIMIT ? OFFSET ?`
        params.push(request.limit, request.offset)

        const [rows] = await connection.query<AuthorRow[]>(queryRows, params);
        const authors = rows.map(row => rowToAuthor(row));

        return {
            authors: authors,
            totalCount: totalCount
        }
    }

    async getReaders(request: GetReadersRequest): Promise<GetReadersResponse> {
        const connection = await this.getConnection()
        try {
            return await this._getReaders(request, connection)
        } finally {
            connection.release();
        }
    }

    protected async _getReaders(request: GetReadersRequest, connection: PoolConnection): Promise<GetReadersResponse> {
        const whereConditions: string[] = []
        const params: any[] = []

        // Name starts with
        if (request.nameStartWith) {
            const nameStartsWith = request.nameStartWith.trim()
            if (nameStartsWith.length > 0) {
                whereConditions.push('name LIKE ?')
                params.push(`${nameStartsWith}%`)
            }
        }

        // Search for
        if (request.searchFor) {
            const searchFor = request.searchFor.trim()
            if (searchFor.length > 0) {
                whereConditions.push('MATCH(name) AGAINST(?)')
                params.push(searchFor)
            }
        }

        let queryCount = `SELECT COUNT(*) as total_count FROM ${MySqlTable.readers}`
        let queryRows = `SELECT * FROM ${MySqlTable.readers}`

        if (whereConditions.length > 0) {
            queryCount += " WHERE " + whereConditions.join('AND')
            queryRows += " WHERE " + whereConditions.join('AND')
        }

        const [countRows] = await connection.query<TotalCountRow[]>(queryCount, params);
        const totalCount = countRows[0].total_count;

        queryRows += ' ORDER BY name'

        queryRows += ` LIMIT ? OFFSET ?`
        params.push(request.limit, request.offset)

        const [rows] = await connection.query<ReaderRow[]>(queryRows, params);
        const readers = rows.map(row => rowToReader(row));

        return {
            readers: readers,
            totalCount: totalCount
        }
    }

    async getWelcomePackage(): Promise<GetWelcomePackageResponse> {
        const connection = await this.getConnection()
        try {
            return await this._getWelcomePackage(connection);
        }
        finally {
            connection.release()
        }
    }

    protected async _getWelcomePackage(connection: PoolConnection): Promise<GetWelcomePackageResponse> {
        return {
            tags: await this._getTags(connection),
            categories: await this._getCategories(connection),
        }
    }

    async getMediaFile(id: number): Promise<MediaFile> {
        const connection = await this.getConnection()
        try {
            return await this._getMediaFile(id, connection);
        }
        finally {
            connection.release()
        }
    }

    protected async _getMediaFile(id: number, connection: PoolConnection): Promise<MediaFile> {
        const [rows] = await connection.query<MediaFileRow[]>(`SELECT * FROM ${MySqlTable.media_files}where id = ?`, [id]);
        if (rows.length == 0) {
            throw new AudiobookProviderError(`File with id="${id} not found"`, AudiobookProviderErrorCode.MediaFileNotFound)
        }
        return await rowToMediaFile(rows[0], this.fileStorage);
    }

    protected async _getMediaFiles(id: number | null, ownerId: number | null, ownerType: MediaFileOwnerType | null, mediaType: MediaFileType | null, connection: PoolConnection): Promise<MediaFile[]> {
        const result: MediaFile[] = [];
        const whereParams: string[] = [];
        const whereVariables: any[] = [];

        // Media file id
        if (id !== null) {
            whereParams.push("id");
            whereVariables.push(id);
        }

        // Owner id
        if (ownerId !== null) {
            whereParams.push("owner_id=?");
            whereVariables.push(ownerId)
        }

        // Owner type
        if (ownerType !== null) {
            whereParams.push("owner_type=?");
            whereVariables.push(ownerType);
        }

        // Media type
        if (mediaType !== null) {
            whereParams.push("media_type = ?");
            whereVariables.push(mediaType)
        }

        // Get all files
        if (whereParams.length == 0) {
            whereParams.push("1")
        }

        const sql = `SELECT * FROM ${MySqlTable.media_files} where ${whereParams.join(" AND ")}`

        const [rows] = await connection.query<MediaFileRow[]>(sql, whereVariables)

        for (const row of rows) {
            result.push(await rowToMediaFile(row, this.fileStorage));
        }

        return result;
    }

    protected async getConnection(): Promise<PoolConnection> {
        return await this.connectionPool.getConnection();
    }

    protected async sqlSelectRows<T extends RowDataPacket>(table: string, id: number, connection: PoolConnection, idFieldName: string = 'id'): Promise<T[]> {
        const [rows] = await connection.query<T[]>(`SELECT * FROM ${table} WHERE ${idFieldName} = ?`, [id]);
        return rows;
    }

    protected async sqlSelectData<T extends RowDataPacket, R>(table: string, id: number, connection: PoolConnection, adapter: (element: T) => R, idFieldName: string = 'id'): Promise<R[]> {
        const rows = await this.sqlSelectRows<T>(table, id, connection, idFieldName);
        const result: R[] = [];
        for (const row of rows) {
            result.push(adapter(row));
        }
        return result;
    }

    protected async sqlSelectAll<T extends RowDataPacket, R>(table: string, connection: PoolConnection, adapter: (element: T) => R): Promise<R[]> {
        const [rows] = await connection.query<T[]>(`SELECT * FROM ${table}`);
        const result: R[] = [];
        for (const row of rows) {
            result.push(adapter(row));
        }
        return result;
    }

    protected async sqlSelectIds(table: string, id: number, columnName: string, connection: PoolConnection, idFieldName: string = 'id'): Promise<number[]> {
        const [rows] = await connection.query<IdSelectionResultRow[]>(`SELECT ${columnName} as value FROM ${table} WHERE ${idFieldName}=?`, [id]);
        const result: number[] = [];
        for (const row of rows) {
            result.push(row.value);
        }
        return result
    }

    protected async sqlSelectMappedRows<T extends RowDataPacket>(table: string, mapTable: string, mapIdFieldName: string, mapIdFieldValue: number, mapTargetIdFieldName: string, connection: PoolConnection, idFieldName: string = 'id'): Promise<T[]> {
        const [rows] = await connection.query<T[]>(`SELECT * FROM ${table} where ${idFieldName} IN (SELECT ${mapTargetIdFieldName} FROM ${mapTable} WHERE ${mapIdFieldName}=?)`, [mapIdFieldValue]);
        return rows;
    }
}

interface IdSelectionResultRow extends RowDataPacket {
    value: number
}





