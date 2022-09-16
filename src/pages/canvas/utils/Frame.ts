import { Shape } from "./Shape";
import { draw, getPath } from "../utils";
import { CanvasUtil } from "./CanvasUtil";
import { clone, cloneDeep } from "lodash";
import getCenterPoint, { getAngle, getRotatedPoint } from "../../../utils";

class Frame extends Shape {
  hoverL: boolean = false
  enterL: boolean = false
  hoverLT: boolean = false
  enterLT: boolean = false
  hoverLTR: boolean = false
  enterLTR: boolean = false
  startX: number = -1
  startY: number = -1
  sPoint: { x: number, y: number } = { x: 0, y: 0 }

  constructor(props: any) {
    super(props);
    this.children = this.config.children.map((child: any) => {
      return new Frame(child)
    })
  }

  render(ctx: CanvasRenderingContext2D, parent?: any): void {
    draw(ctx, this.config, {
      isHover: this.isHover,
      isSelect: this.isSelect
    }, parent)
    if (this.children) {
      this.children.map((item: any) => item.render(ctx, this.config))
    }
  }

  isInName(x: number, y: number,): boolean {
    return false
    let rect = this.config
    if (rect.leftX < x && x < (rect.leftX + 30)
      && (rect.topY - 20) < y && y < rect.topY
    ) {
      return true
    }
    return false
  }

  isIn(x: number, y: number, cu: CanvasUtil): boolean {
    if (this.enterL || this.enterLT || this.enterLTR) return true

    const { x: handX, y: handY } = cu.handMove
    x = (x - handX) / cu.handScale//上面的简写
    y = (y - handY) / cu.handScale

    let rect = this.config
    if (rect.rotate !== 0 || rect.flipHorizontal) {
      let { w, h, rotate, flipHorizontal, flipVertical } = rect
      const center = {
        x: rect.x + (rect.w / 2),
        y: rect.y + (rect.h / 2)
      }
      if (flipHorizontal) {
        x = center.x + Math.abs(x - center.x) * (x < center.x ? 1 : -1)
      }
      if (flipVertical) {
        y = center.y + Math.abs(y - center.y) * (y < center.y ? 1 : -1)
      }
      let p1 = { x, y }
      let c2 = { x: rect.x + w / 2, y: rect.y + h / 2 }
      let s2 = getRotatedPoint(p1, c2, -rotate)
      x = s2.x
      y = s2.y
    }

    // console.log('isIn-rect.leftX', rect.leftX)

    if (this.isSelect) {
      let edge = 10
      let angle = 7
      let rotate = 27
      if ((rect.leftX! - edge < x && x < rect.leftX! + edge) &&
        (rect.topY! + edge < y && y < rect.bottomY! - edge)
      ) {
        // console.log('hoverLeft')
        document.body.style.cursor = "col-resize"
        this.hoverL = true

        this.hoverLT = false
        return true
      } else if ((rect.leftX! - angle < x && x < rect.leftX! + angle) &&
        (rect.topY! - angle < y && y < rect.topY! + angle)
      ) {
        // console.log('1', rect.flipHorizontal)
        this.hoverLT = true

        this.hoverL = false
        document.body.style.cursor = "nwse-resize"
        return true
      } else if ((rect.leftX! - rotate < x && x < rect.leftX! - angle) &&
        (rect.topY! - rotate < y && y < rect.topY! - angle)
      ) {
        this.hoverLTR = true

        this.hoverLT = false
        this.hoverL = false
        document.body.style.cursor = "pointer"
        return true
      }
    }
    if (rect.leftX < x && x < rect.rightX
      && rect.topY < y && y < rect.bottomY
    ) {
      document.body.style.cursor = "default"
      this.hoverL = false
      this.hoverLT = false
      this.hoverLTR = false
      return true
    }
    return this.isInName(x, y)
  }

  event(event: any, parent?: Shape[], cb?: Function) {
    let { e, coordinate, type } = event
    // console.log('event', this.config.name, `type：${type}`,)
    if (e.capture) return

    //mouseup事件，会直接走到这里
    //这里需要禁止传播，不然canvas的onMouseUp会触发
    if (this.enter) {
      event.e.stopPropagation()
      return this.emit(event, parent)
    }

    let cu = CanvasUtil.getInstance()
    if (this.isIn(coordinate.x, coordinate.y, cu)) {
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

  mousedown(event: any, p: Shape[] = []) {
    // console.log('mousedown', p)
    let { e, coordinate, type } = event
    let { x, y } = coordinate

    let cu = CanvasUtil.getInstance()
    if (!cu.isDesign()) {
      cu.startX = coordinate.x
      cu.startY = coordinate.y
      return;
    }

    if (Date.now() - this.lastClickTime < 300) {
      console.log('dblclick')
      // cu.selectedShape = null
      // this.config.selected = false
      // cu.draw()
      // this.isSelect = false
      this.isCapture = false
      this.children.map((child: any) => child.event(event, p?.concat([this]), () => {
        cu.childIsIn = true
      }))
      if (!cu.childIsIn) {
        cu.childIsIn = false
        this.isCapture = true
      } else {
        // console.log('选中了')
      }
      return;
    }

    this.original = cloneDeep(this.config)
    let rect = this.config

    if (this.hoverLT) {
      console.log('config', cloneDeep(this.config))
      const center = {
        x: rect.x + (rect.w / 2),
        y: rect.y + (rect.h / 2)
      }
      //不是当前点击位置，当前点击位置算对角会有偏差
      let rectLT = getRotatedPoint({ x: rect.x, y: rect.y }, center, rect.rotate)
      console.log('rect', clone(rect))
      console.log('rectLT', clone(rectLT))
      if (rect.flipHorizontal) {
        // rectLT.x = center.x + Math.abs(rectLT.x - center.x) * (rectLT.x < center.x ? 1 : -1)
      }
      if (rect.flipVertical) {
        rectLT.y = center.y + Math.abs(rectLT.y - center.y) * (rectLT.y < center.y ? 1 : -1)
      }
      console.log('rectLT', rectLT)

      const sPoint = {
        x: center.x + Math.abs(rectLT.x - center.x) * (rectLT.x < center.x ? 1 : -1),
        y: center.y + Math.abs(rectLT.y - center.y) * (rectLT.y < center.y ? 1 : -1)
      }
      console.log('sPoint', sPoint)
      this.sPoint = sPoint
    }

    if (this.hoverL || this.hoverLT || this.hoverLTR) {
      cu.startX = x
      cu.startY = y
      cu.offsetX = x - this.config.x
      cu.offsetY = y - this.config.y
      this.enterL = this.hoverL
      this.enterLT = this.hoverLT
      this.enterLTR = this.hoverLTR
      return;
    }

    this.lastClickTime = Date.now()
    // console.log('mousedown', this.config.name, this.isMouseDown, this.isSelect)

    this.enter = true
    this.startX = x
    this.startY = y
    if (this.isSelect) return

    this.isSelect = true
    this.isCapture = true
    this.isHover = false
    if (cu.selectedShape && cu.selectedShape !== this) {
      cu.selectedShape.isSelect = false
    }
    cu.selectedShapeParent.map((shape: Shape) => shape.isCapture = true)
    cu.selectedShapeParent = p
    cu.selectedShapeParent.map((shape: Shape) => shape.isCapture = false)
    cu.selectedShape = this
    cu.render()
  }

  mouseup(event: any, p: any) {
    // console.log('mouseup', this.config.name,)
    this.enter = false
    this.enterL = false
    this.enterLT = false
    this.enterLTR = false
    // this.isCapture = true
  }

  mousemove(event: any, p: any) {
    let { e, coordinate, type } = event
    // console.log('mousemove', this.config.name, `isHover：${this.isHover}`)
    let { x, y } = coordinate

    let cu = CanvasUtil.getInstance();
    if (!cu.isDesign()) {
      return;
    }

    if (this.enter) {
      // console.log('enter')
      let { x, y } = coordinate
      let dx = (x - this.startX) / cu.handScale
      let dy = (y - this.startY) / cu.handScale
      this.config.x = this.original.x + dx
      this.config.y = this.original.y + dy
      this.config = getPath(this.config, this.original)
      // cu.hoverShape = this
      cu.render()
      return;
    }

    let rect = this.config
    let s = this.original

    if (this.enterLTR) {
      let selectRect = this.original
      // console.log('x-------', x, '          y--------', y)
      let a = getAngle([selectRect.x + selectRect.w / 2, selectRect.y + selectRect.h / 2],
        [this.original.x, this.original.y],
        [x, y]
      )
      // console.log('getAngle', a)
      this.config.rotate = a
      cu.render()
      return;
    }

    if (this.enterLT) {

      // let currentPosition = { x: x , y: y }
      let currentPosition = {
        x: (x - cu.handMove.x) / cu.handScale,
        y: (y - cu.handMove.y) / cu.handScale
      }
      const center = {
        x: s.x + (s.w / 2),
        y: s.y + (s.h / 2)
      }
      //水平翻转，那么要把当前的x坐标一下翻转
      //同时，draw的时候，需要把新rect的中心点和平移（选中时rect的中心点）的2倍
      if (rect.flipHorizontal) {
        // currentPosition.x = center.x + Math.abs(currentPosition.x - center.x) * (currentPosition.x < center.x ? 1 : -1)
        // console.log('currentPosition', currentPosition)
      }

      let newCenterPoint = getCenterPoint(currentPosition, this.sPoint)
      let newTopLeftPoint = getRotatedPoint(currentPosition, newCenterPoint, -s.rotate)
      let newBottomRightPoint = getRotatedPoint(this.sPoint, newCenterPoint, -s.rotate)

      let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
      let newHeight = newBottomRightPoint.y - newTopLeftPoint.y
      rect.x = newTopLeftPoint.x
      rect.y = newTopLeftPoint.y
      rect.rx = this.original.rx - (this.original.x - rect.x)
      rect.ry = this.original.ry - (this.original.y - rect.y)
      rect.w = newWidth
      rect.h = newHeight
      // console.log(rect)

      this.config = getPath(rect, this.original)
      cu.render()
      return;
    }

    // if (this.enterL) {
    //   let xx = (x - cu.offsetX) / cu.handScale
    //   // this.config.x = (x - cu.offsetX) / cu.handScale
    //   this.config.x = xx
    //   // one.y = one.y
    //   this.config.w = this.original.w - xx
    //   this.config = getPath(this.config, this.original)
    //   cu.render()
    //   return;
    // }
    if (this.enterL) {
      // this.config.x = (x - cu.offsetX) / cu.handScale
      this.config.x = (x - cu.offsetX)
      // one.y = one.y
      this.config.w = this.original.w - (x - cu.startX)
      this.config = getPath(this.config, this.original)
      cu.render()
      return;
    }
  }
}

export default Frame
