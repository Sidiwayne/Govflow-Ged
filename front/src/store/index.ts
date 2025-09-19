import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import entityReducer from './slices/entity';
import courrierReducer from './slices/courrier';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    entity: entityReducer,
    courrier: courrierReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
