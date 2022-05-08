import {configureStore} from '@reduxjs/toolkit';
import todoReducer from './todo/index';
import postSlice from "./post/index";

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    post: postSlice,
  },
});
