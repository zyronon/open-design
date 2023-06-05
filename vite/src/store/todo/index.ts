import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  list: [1],
};


export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    increment: (state, action) => {
      state.list.push(action.payload)
    },
    decrement: (state) => {
      state.list.pop()
    },
  }
});

export const {increment, decrement,} = todoSlice.actions;

export default todoSlice.reducer;
