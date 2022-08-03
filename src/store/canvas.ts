import { createSlice, nanoid } from '@reduxjs/toolkit';
import { Rect } from "../pages/canvas/type"
import { cloneDeep } from "lodash"

export type CanvasState = {
  rectList: Rect[]
}

const initialState: CanvasState = {
  rectList: []
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    add(state: CanvasState, { payload }) {
      let old = cloneDeep(state)
      old.rectList.push(payload)
      return old
    },
  }
});

export const { add, } = canvasSlice.actions;

export default canvasSlice.reducer;
