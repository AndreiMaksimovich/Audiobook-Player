import {Router} from "express";

import {handlerWelcome} from "./HandlerWelcome";
import {handlerAudiobook} from "./HandlerAudiobook";
import {param, query} from "express-validator";
import {handlerAuthors} from "./HandlerAuthors";
import {handlerReaders} from "./HandleReaders";
import {handlerAudiobooks} from "./HandlerAudiobooks";
import {handlerCategories} from "./HandlerCategories";
import {handlerTags} from "./HandlerTags";
import {handlerMediaFile} from "./HandlerMediaFile";
import {handlerAuthor} from "./HandleAthour";
import {handlerReader} from "./HandlerReader";
import {handlerTag} from "./HandlerTag";
import {handlerCategory} from "./HandlerCategory";

export const apiRouter = Router()

// Welcome package
apiRouter.get('/welcome', handlerWelcome);

// Audiobook
apiRouter.get(
    '/audiobook/:audiobookId',
    [param("audiobookId").isInt()],
    handlerAudiobook);

// Audiobooks
apiRouter.post('/audiobooks', handlerAudiobooks)

// Authors
apiRouter.post('/authors', handlerAuthors)

// Author
apiRouter.get(
    '/author/:authorId',
    [param("authorId").isInt()],
    handlerAuthor)

// Readers
apiRouter.post('/readers', handlerReaders)

// Reader
apiRouter.get(
    '/reader/:readerId',
    [param("readerId").isInt()],
    handlerReader)

// Category
apiRouter.get(
    '/category/:categoryId',
    [param("categoryId").isInt()],
    handlerCategory)

// Categories
apiRouter.get('/categories', handlerCategories)

// Tag
apiRouter.get(
    '/tag/:tagId',
    param("tagId").isInt(),
    handlerTag)

// Tags
apiRouter.get('/tags', handlerTags)

// Media file
apiRouter.get(
    '/media-file/:mediaFileId',
    [param("mediaFileId").isInt()],
    handlerMediaFile)
