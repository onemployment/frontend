import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../config';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiBaseUrl,
  }),
  endpoints: (builder) => ({
    callJobApplicationService: builder.query<string, void>({
      query: () => '/',
    }),
    register: builder.mutation<
      { message: string; username: string },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    login: builder.mutation<
      { message: string; username: string },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  }),
});

export const {
  useCallJobApplicationServiceQuery,
  useRegisterMutation,
  useLoginMutation,
} = apiSlice;
