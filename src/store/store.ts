import {configureStore} from '@reduxjs/toolkit';
import todoReducer from './todo/index';
import postSlice from "./post/index";
import canvas from "./canvas";

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    post: postSlice,
    canvas
  },
});
