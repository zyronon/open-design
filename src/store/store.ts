import {configureStore} from '@reduxjs/toolkit';
import todoReducer from './todo';
import postSlice from "./post";
import canvas from "./canvas";

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    post: postSlice,
    canvas
  },
});
