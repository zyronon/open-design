import {ShapeConfig} from "../type";
import {getPath} from "../utils";
import {Shape} from "../utils/Shape";
import CanvasUtil2 from "../CanvasUtil2";

export abstract class BaseShape {
  hoverRd1: boolean = false
  enterRd1: boolean = false
  hoverL: boolean = false
  enterL: boolean = false
  hoverLT: boolean = false
  enterLT: boolean = false
  hoverLTR: boolean = false
  enterLTR: boolean = false
  config: ShapeConfig
  protected children: BaseShape[] = []
  isHover: boolean = false
  isSelect: boolean = false
  isEdit: boolean = false
  isCapture: boolean = true
  enter: boolean = false
  startX: number = 0
  startY: number = 0
  original: any = null
  lastClickTime: number = 0

  constructor(props: ShapeConfig) {
    this.config = getPath(props)
  }

  abstract render(ctx: CanvasRenderingContext2D): void

  abstract isIn(x: number, y: number, cu: CanvasUtil2): boolean

  abstract mousedown(): void

  abstract mouseup(): void

  abstract mousemove(): void

  shapeIsIn(x: number, y: number, cu: CanvasUtil2): boolean {
    if (!this.isSelect && !this.isHover) {
      return this.isIn(x, y, cu)
    }
    return false
  }

  event(event: any, parent?: BaseShape[], cb?: Function) {
    console.log('eve')
    let {e, coordinate, type} = event
    // console.log('event', this.config.name, `type：${type}`,)
    if (e.capture) return

    //mouseup事件，会直接走到这里
    //这里需要禁止传播，不然canvas的onMouseUp会触发
    if (this.enter) {
      event.e.stopPropagation()
      return this.emit(event, parent)
    }

    let cu = CanvasUtil2.getInstance()
    if (this.shapeIsIn(coordinate.x, coordinate.y, cu)) {
      cb?.()
      // console.log('捕获', this.config.name)
      if (!this.isCapture || !cu.isDesign()) {
        this.children.map((child: any) => child.event(event, parent?.concat([this])))
      }

      if (e.capture) return

      //如果已经选中了，那就不要再加hover效果了
      if (!this.isSelect) {
        this.isHover = true
      }

      //设置当前的inShape为自己，这位的位置很重要，当前的inShape是唯一的
      //如果放在e.capture前面，那么会被子组件给覆盖。所以放在e.capture后面
      //子组件isSelect或者isHover之后会stopPropagation，那么父组件就不会往
      //下执行了
      cu.setInShape(this, parent)

      this.emit(event, parent)
      if (this.isSelect || this.isHover) {
        event.e.stopPropagation()
      }
      // console.log('冒泡', this.config.name)
    } else {
      document.body.style.cursor = "default"
      this.isHover = false
      cu.setInShapeNull(this)
      this.children.map((child: any) => child.event(event, parent?.concat([this]), cb))
    }
  }

  emit(event: any, p: any) {
    let {e, coordinate, type} = event
    // @ts-ignore
    this[type]?.(event, p)
  }

  //获取缩放平移之后的x和y值
  getXY(coordinate: { x: number, y: number }) {
    let {x, y} = coordinate
    let cu = CanvasUtil2.getInstance();
    const {x: handX, y: handY} = cu.handMove
    x = (x - handX) / cu.handScale//上面的简写
    y = (y - handY) / cu.handScale
    return {x, y, cu}
  }
}
