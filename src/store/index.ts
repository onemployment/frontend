import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { authReducer, type AuthStateType } from '../features/auth/authSlice';
import { buildPreloadedAuthState } from '../features/auth/hydration';

const preloadedState =
  typeof window !== 'undefined'
    ? { auth: buildPreloadedAuthState(window.localStorage) as AuthStateType }
    : undefined;

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    auth: authReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
