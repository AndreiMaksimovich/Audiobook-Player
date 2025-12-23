import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Audiobook,
    Author,
    Category,
    GetAudiobooksRequest,
    GetAudiobooksResponse,
    GetAuthorsRequest,
    GetAuthorsResponse,
    GetReadersResponse,
    GetReadersRequest,
    Tag
} from "shared";
import {API_URL} from "@/src/env-configuration";

export const audiobookProviderApi = createApi({
    reducerPath: 'audiobookProviderApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    endpoints: (builder) => ({

        getAudiobooks: builder.query<GetAudiobooksResponse, GetAudiobooksRequest>({
            query: (request: GetAudiobooksRequest) => ({
                url: '/audiobooks',
                method: 'POST', // Using POST for a search query with a complex body
                body: request,
            }),
        }),

        getAudiobook: builder.query<Audiobook, number>({
            query: (id: number) => ({
                url: `/audiobook/${id}`,
                method: 'GET',
            })
        }),

        getAuthor: builder.query<Author, number>({
            query: (id: number) => ({
                url: `/author/${id}`,
                method: 'GET',
            })
        }),

        getAuthors: builder.query<GetAuthorsResponse, GetAuthorsRequest>({
            query: (request) => ({
                url: `/authors`,
                method: 'POST',
                body: request
            })
        }),

        getReader: builder.query<Author, number>({
            query: (id: number) => ({
                url: `/reader/${id}`,
                method: 'GET',
            })
        }),

        getReaders: builder.query<GetReadersResponse, GetReadersRequest>({
            query: (request) => ({
                url: `/readers`,
                method: 'POST',
                body: request
            })
        }),

        getCategory: builder.query<Category, number>({
            query: (id: number) => ({
                url: `/category/${id}`,
                method: 'GET',
            })
        }),

        getTag: builder.query<Tag, number>({
            query: (id: number) => ({
                url: `/tag/${id}`,
                method: 'GET',
            })
        }),

        getCategories: builder.query<Category[], void>({
            query: () => ({
                url: `/categories`,
                method: 'GET',
            })
        }),

        getTags: builder.query<Tag[], void>({
            query: () => ({
                url: `/tags`,
                method: 'GET',
            })
        }),

    }),
});

export const {
    useGetAudiobookQuery,
    useLazyGetAudiobookQuery,
    useGetAudiobooksQuery,
    useLazyGetAudiobooksQuery,
    useGetAuthorQuery,
    useGetReaderQuery,
    useGetCategoryQuery,
    useLazyGetCategoryQuery,
    useGetTagQuery,
    useGetAuthorsQuery,
    useGetReadersQuery,
    useLazyGetAuthorsQuery,
    useLazyGetReadersQuery,
    useGetTagsQuery,
    useGetCategoriesQuery,
    useLazyGetTagsQuery,
    useLazyGetCategoriesQuery,
} = audiobookProviderApi
