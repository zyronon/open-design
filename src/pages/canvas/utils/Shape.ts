import { clear, getPath, renderRoundRect } from "../utils";
import { CanvasUtil } from "./CanvasUtil";
import eventBus from "../../../utils/event-bus";
import { EventType } from "../type";

export class Shape {
  config: any
  protected children: Shape[] = []
  isHover: boolean = false
  isSelect: boolean = false
  isCapture: boolean = true
  enter: boolean = false
  startX: number = 0
  startY: number = 0
  original: any = null
  lastClickTime: number = 0

  constructor(props: any) {
    this.config = getPath(props)
  }

  emit(event: any, p: any) {
    let { e, coordinate, type } = event
    // @ts-ignore
    this[type]?.(event, p)
  }

  //获取缩放平移之后的x和y值
  getXY(coordinate: { x: number, y: number }) {
    let { x, y } = coordinate
    let cu = CanvasUtil.getInstance();
    const { x: handX, y: handY } = cu.handMove
    x = (x - handX) / cu.handScale//上面的简写
    y = (y - handY) / cu.handScale
    return { x, y, cu }
  }

  mouseDown(cu?: any) {
    // console.log('mousedown')
    eventBus.emit(EventType.onMouseMove, cu.selectedShape)
  }

  mouseMove(cu?: any) {
    // console.log('mousemove')
    eventBus.emit(EventType.onMouseDown, cu.selectedShape)
  }
}