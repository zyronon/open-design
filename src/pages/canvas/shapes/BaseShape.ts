import {BaseEvent2, P, ShapeConfig} from "../type";
import {getPath} from "../utils";
import CanvasUtil2 from "../CanvasUtil2";
import {Shape} from "../utils/Shape";

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

  abstract isIn(p: P, cu: CanvasUtil2): boolean

  isInBox(p: P): boolean {
    const {x, y} = p
    let rect = this.config
    return rect.leftX < x && x < rect.rightX
      && rect.topY < y && y < rect.bottomY;
  }

  shapeIsIn(p: P, cu: CanvasUtil2): boolean {
    if (this.isSelect) {
      const {x, y} = p
      let rect = this.config
      let edge = 10
      let angle = 7
      let rotate = 27
      //左边
      if ((rect.leftX! - edge < x && x < rect.leftX! + edge) &&
        (rect.topY! + edge < y && y < rect.bottomY! - edge)
      ) {
        // console.log('hoverLeft')
        document.body.style.cursor = "col-resize"
        this.hoverL = true

        this.hoverLT = false
        return true
      }

      //左上
      if ((rect.leftX! - angle < x && x < rect.leftX! + angle) &&
        (rect.topY! - angle < y && y < rect.topY! + angle)
      ) {
        // console.log('1', rect.flipHorizontal)
        this.hoverLT = true

        this.hoverL = false
        document.body.style.cursor = "nwse-resize"
        return true
      }

      //左上旋转
      if ((rect.leftX! - rotate < x && x < rect.leftX! - angle) &&
        (rect.topY! - rotate < y && y < rect.topY! - angle)
      ) {
        this.hoverLTR = true

        this.hoverLT = false
        this.hoverL = false
        document.body.style.cursor = "pointer"
        return true
      }

      let r = rect.radius
      let rr = 5
      //左上，拉动圆角那个点
      if ((rect.leftX! + r - rr < x && x < rect.leftX! + r + rr / 2) &&
        (rect.topY! + r - rr < y && y < rect.topY! + r + rr / 2)
      ) {
        this.hoverRd1 = true
        document.body.style.cursor = "pointer"
        return true
      }

      //未命中所有点
      document.body.style.cursor = "default"
      this.hoverL = false
      this.hoverLT = false
      this.hoverLTR = false
      this.hoverRd1 = false
    }
    return this.isIn(p, cu)
  }

  event(event: BaseEvent2, parent?: BaseShape[], cb?: Function): boolean {
    let {e, point, type} = event
    // console.log('event', this.config.name, `type：${type}`,)
    if (event.capture) return true

    //mouseup事件，会直接走到这里
    //这里需要禁止传播，不然canvas的onMouseUp会触发
    if (this.enter) {
      event.stopPropagation()
      this.emit(event, parent)
      return true
    }

    let cu = CanvasUtil2.getInstance()
    if (this.shapeIsIn(point, cu)) {
      cb?.()
      // console.log('捕获', this.config.name)
      if (!this.isCapture || !cu.isDesign()) {
        this.children.map((child: any) => child.event(event, parent?.concat([this])))
      }

      if (event.capture) return true

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
        event.stopPropagation()
      }
      // console.log('冒泡', this.config.name)
    } else {
      document.body.style.cursor = "default"
      this.isHover = false
      cu.setInShapeNull(this)
      this.children.map((child: any) => child.event(event, parent?.concat([this]), cb))
    }
    return false
  }

  emit(event: BaseEvent2, p: BaseShape[] = []) {
    let {e, point, type} = event
    // @ts-ignore
    this[type]?.(event, p)
  }

  mousedown(event: BaseEvent2, p: BaseShape[] = []) {
    console.log('mousedown', this)
    let {e, point, type} = event
    let {x, y, cu} = this.getXY(point)
    this.isSelect = true
    this.isCapture = true
    this.isHover = false
    cu.render()
    //如果当前选中的图形不是自己，那么把那个图形设为未选中
    if (cu.selectedShape && cu.selectedShape !== this) {
      cu.selectedShape.isSelect = false
    }
    cu.selectedShapeParent.map((shape: BaseShape) => shape.isCapture = true)
    cu.selectedShapeParent = p
    cu.selectedShapeParent.map((shape: BaseShape) => shape.isCapture = false)
    cu.selectedShape = this
    cu.render()
  }

  mousemove(e: BaseEvent2, p: BaseShape[] = []) {
    // console.log('mousemove', this.isSelect)
  }

  mouseup(e: BaseEvent2, p: BaseShape[] = []) {
    if (e.capture) return
    console.log('mouseup')
  }

  //获取缩放平移之后的x和y值
  getXY(point: P) {
    let {x, y} = point
    let cu = CanvasUtil2.getInstance();
    const {x: handX, y: handY} = cu.handMove
    x = (x - handX) / cu.handScale//上面的简写
    y = (y - handY) / cu.handScale
    return {x, y, cu}
  }
}
