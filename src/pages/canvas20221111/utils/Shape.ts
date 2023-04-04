import {clear, getPath, renderRoundRect} from "../utils";
import {CanvasUtil} from "./CanvasUtil";
import EventBus from "../../../lib/designer/event/eventBus";
import {EventMapTypes, ShapeConfig} from "../type";
import {clone, cloneDeep} from "lodash";

export class Shape {
  config: ShapeConfig
  protected children: Shape[] = []
  isHover: boolean = false
  isSelect: boolean = false
  isEdit: boolean = false
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

  changeChildrenFlip(children: Shape[], type: number, conf: ShapeConfig) {
    let centerX = conf.centerX
    let centerY = conf.centerY
    children.map((item: Shape) => {
      let old = clone(item.config)
      if (type === 0) {
        item.config.x = centerX * 2 - (item.config.rightX!)
        item.config.flipHorizontal = !item.config.flipHorizontal;
      } else {
        item.config.y = centerY * 2 - (item.config.bottomY!)
        item.config.flipVertical = !item.config.flipVertical;
      }
      if (item.children.length) this.changeChildrenFlip(item.children, type, item.config)
      item.config = getPath(item.config, old)
    })
  }

  flip(type: number) {
    const conf = this.config
    this.children.length && this.changeChildrenFlip(this.children, type, conf)
    if (type === 0) {
      conf.flipHorizontal = !conf.flipHorizontal
    } else {
      conf.flipVertical = !conf.flipVertical
    }
  }
}