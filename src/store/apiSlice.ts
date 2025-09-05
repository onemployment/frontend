import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
  }),
  endpoints: (builder) => ({
    callJobApplicationService: builder.query<string, void>({
      query: () => '/',
    }),
  }),
});

export const { useCallJobApplicationServiceQuery } = apiSlice;
