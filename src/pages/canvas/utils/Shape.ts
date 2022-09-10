import { clear, getPath, renderRoundRect } from "../utils";

export class Shape {
  protected config: any
  protected children: Shape[] = []
  protected isHover: boolean = false
  isSelect: boolean = false
  protected isCapture: boolean = true
  handDown: boolean = false
  startX: number = 0
  startY: number = 0
  original: any = null
  lastClickTime: number = 0

  constructor(props: any) {
    this.config = getPath(props)
    this.isSelect = this.config.isSelect ?? false;
  }

  emit(event: any, p: any) {
    let { e, coordinate, type } = event
    // @ts-ignore
    this[type]?.(event, p)
  }
}