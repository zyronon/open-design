import {clear, getPath, renderRoundRect} from "../utils";
import {CanvasUtil} from "./CanvasUtil";
import EventBus from "../../../utils/event-bus";
import {EventMapTypes, ShapeConfig} from "../type";

export class Shape {
  config: ShapeConfig
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
    let {e, coordinate, type} = event
    // @ts-ignore
    this[type]?.(event, p)
  }

  //获取缩放平移之后的x和y值
  getXY(coordinate: { x: number, y: number }) {
    let {x, y} = coordinate
    let cu = CanvasUtil.getInstance();
    const {x: handX, y: handY} = cu.handMove
    x = (x - handX) / cu.handScale//上面的简写
    y = (y - handY) / cu.handScale
    return {x, y, cu}
  }

  mouseDown(cu?: any) {
    // console.log('mousedown')
    EventBus.emit(EventMapTypes.onMouseMove, cu.selectedShape)
  }

  mouseMove(cu?: any) {
    // console.log('mousemove')
    EventBus.emit(EventMapTypes.onMouseDown, cu.selectedShape)
  }

  flip(type: number) {
    const conf = this.config
    let centerX = conf.x + conf.w / 2
    if (type === 0) {
      if (this.children.length) {
        this.children.map((item: Shape) => {
          if (this.config.flipHorizontal) {
            // let shapeLeftDistance = centerX - item.config.x
            // let shapeRightDistance = centerX - (item.config.x + item.config.w)
            // item.config.x = item.config.x + shapeLeftDistance + shapeRightDistance
            item.config.x = centerX * 2 - (item.config.leftX!)
            item.config.flipHorizontal = true
          } else {
            item.config.x = centerX * 2 - (item.config.leftX!)
            // item.config.x = centerX - (item.config.leftX! - centerX)
            item.config.flipHorizontal = false
          }
        })
      }
      this.config.flipHorizontal = !this.config.flipHorizontal
    } else {
      this.config.flipVertical = !this.config.flipVertical
    }
  }
}