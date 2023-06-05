import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from "lodash"

export type CanvasState = {
  rectList: any[]
  pageList: any[]
}

const initialState: CanvasState = {
  rectList: [],
  pageList: [
    {
      name: '123123'
    }
  ],
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setRectList(state: CanvasState, { payload }) {
      let old = cloneDeep(state)
      old.rectList = payload
      return old
    },
    add(state: CanvasState, { payload }) {
      let old = cloneDeep(state)
      old.rectList.push(payload)
      return old
    },
  }
});

export const { add, } = canvasSlice.actions;

export default canvasSlice.reducer;
