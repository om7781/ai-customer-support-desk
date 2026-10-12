import { configureStore } from '@reduxjs/toolkit';
import { supportApi } from './api/supportApi';
import uiReducer from './slices/uiSlice';
import ticketsReducer from './slices/ticketsSlice';

export const store = configureStore({
  reducer: {
    [supportApi.reducerPath]: supportApi.reducer,
    ui: uiReducer,
    tickets: ticketsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(supportApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
