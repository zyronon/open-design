import {Shape} from "./type";

type Store = {
  rectList: Shape[]
  images: Map<any, any>
}

export const store: Store = {
  rectList: [],
  images: new Map()
}

export function pushRect(val: Shape) {
  store.rectList.push(val)
}

export function clearRect() {
  store.rectList = []
}

export function removeRect(val: Shape) {
  let rIndex = store.rectList.findIndex(v => v.id === val.id)
  if (rIndex > -1) {
    store.rectList.splice(rIndex, 1)
  }
}

export function pushImg(id: any, val: Shape) {
  store.images.set(id, val)
}
