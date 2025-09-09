import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { authReducer } from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// no persistence at this stage
