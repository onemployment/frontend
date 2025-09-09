import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../config';
import { attachAuthHeader } from '../features/auth/tokenHeader';
import { clearAuth, persistAuth } from '../features/auth/utils/persistence';
import { shouldClearAuthOnUnauthorized } from '../features/auth/utils/errorHandling';
import { clearCredentials, setCredentials } from '../features/auth/authSlice';
import type { User } from '../features/auth/authSlice';
import type { RootState } from './index';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: config.apiBaseUrl,
  prepareHeaders: (headers, api) => {
    const state = api.getState?.() as unknown as RootState;
    attachAuthHeader(headers as Headers, state?.auth?.token ?? null);
    return headers;
  },
});

const baseQueryWithUnauthorized: typeof rawBaseQuery = async (
  args,
  api,
  extra
) => {
  const result = await rawBaseQuery(args, api, extra);
  if (
    (result as unknown as { error?: { status?: number; data?: unknown } })
      .error &&
    shouldClearAuthOnUnauthorized(
      (result as { error?: { status?: number; data?: unknown } }).error
    )
  ) {
    api.dispatch(clearCredentials());
    try {
      clearAuth(window.localStorage);
    } catch (_e) {
      void _e; // ignore persistence errors
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithUnauthorized,
  endpoints: (builder) => ({
    callJobApplicationService: builder.query<string, void>({
      query: () => '/',
    }),

    register: builder.mutation<
      { message: string; token: string; user: unknown },
      {
        email: string;
        password: string;
        username: string;
        firstName: string;
        lastName: string;
      }
    >({
      query: (body) => ({
        url: '/api/v1/user',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ token: data.token, user: data.user as User })
          );
          try {
            persistAuth(window.localStorage, {
              token: data.token,
              user: data.user,
            });
          } catch (_e) {
            void _e; // ignore persistence errors
          }
        } catch (_e) {
          void _e; // ignore rejection here; UI will handle
        }
      },
    }),

    login: builder.mutation<
      { message: string; token: string; user: unknown },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ token: data.token, user: data.user as User })
          );
          try {
            persistAuth(window.localStorage, {
              token: data.token,
              user: data.user,
            });
          } catch (_e) {
            void _e; // ignore persistence errors
          }
        } catch (_e) {
          void _e; // ignore rejection here; UI will handle
        }
      },
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: '/api/v1/auth/logout', method: 'POST' }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (_e) {
          void _e; // ignore api error when logging out
        }
        dispatch(clearCredentials());
        try {
          clearAuth(window.localStorage);
        } catch (_e) {
          void _e; // ignore persistence errors
        }
      },
    }),

    getCurrentUser: builder.query<{ user: unknown }, void>({
      query: () => ({ url: '/api/v1/user/me' }),
    }),

    validateEmail: builder.query<
      { available: boolean; message: string },
      { email: string }
    >({
      query: ({ email }) => ({
        url: `/api/v1/user/validate/email?email=${encodeURIComponent(email)}`,
      }),
    }),

    validateUsername: builder.query<
      { available: boolean; message: string; suggestions?: string[] },
      { username: string }
    >({
      query: ({ username }) => ({
        url: `/api/v1/user/validate/username?username=${encodeURIComponent(username)}`,
      }),
    }),

    suggestUsernames: builder.query<
      { suggestions: string[] },
      { username: string }
    >({
      query: ({ username }) => ({
        url: `/api/v1/user/suggest-usernames?username=${encodeURIComponent(username)}`,
      }),
    }),
  }),
});

export const {
  useCallJobApplicationServiceQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useValidateEmailQuery,
  useLazyValidateEmailQuery,
  useValidateUsernameQuery,
  useLazyValidateUsernameQuery,
  useSuggestUsernamesQuery,
  useLazySuggestUsernamesQuery,
} = apiSlice;
