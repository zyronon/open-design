import {Rect} from "./type";

type Store = {
  rectList: Rect[]
  images: Map<any, any>
}

export const store: Store = {
  rectList: [],
  images: new Map()
}

export function pushRect(val: Rect) {
  store.rectList.push(val)
}

export function clearRect() {
  store.rectList = []
}

export function removeRect(val: Rect) {
  let rIndex = store.rectList.findIndex(v => v.id === val.id)
  if (rIndex > -1) {
    store.rectList.splice(rIndex, 1)
  }
}

export function pushImg(id: any, val: Rect) {
  store.images.set(id, val)
}
