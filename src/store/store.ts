import {configureStore} from '@reduxjs/toolkit';
import modal from '@/store/reducers/modal';

export const store = configureStore({
  reducer: {
    modal,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      //https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
      ignoredPaths: ['modal.modals'], // Ignore state message
      ignoredActionPaths: ['payload.props', 'payload.Component'] // Ignore dispatch action message
    }
  })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred types: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
