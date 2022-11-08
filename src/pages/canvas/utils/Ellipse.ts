import {Shape} from "./Shape";
import {draw, draw2, draw3, getPath} from "../utils";
import {CanvasUtil} from "./CanvasUtil";
import {clone, cloneDeep} from "lodash";
import getCenterPoint, {getAngle, getRotatedPoint} from "../../../utils";
import {Point} from "../type";

class Ellipse extends Shape {
  hoverRd1: boolean = false
  enterRd1: boolean = false
  hoverL: boolean = false
  enterL: boolean = false
  hoverLT: boolean = false
  enterLT: boolean = false
  hoverLTR: boolean = false
  enterLTR: boolean = false
  startX: number = -1
  startY: number = -1
  diagonal: Point = {x: 0, y: 0}//对角
  handlePoint: Point = {x: 0, y: 0}//对角

  constructor(props: any) {
    super(props);
    this.children = this.config.children.map((child: any) => {
      return new Ellipse(child)
    })
  }

  render(ctx: CanvasRenderingContext2D, parent?: any): void {
    draw3(ctx, this.config, this.original, {
      isHover: this.isHover,
      isSelect: this.isSelect,
      isEdit: this.isEdit,
      enterLT: this.enterLT,
      enterL: this.enterL
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

    const {x: handX, y: handY} = cu.handMove
    x = (x - handX) / cu.handScale//上面的简写
    y = (y - handY) / cu.handScale

    let rect = this.config
    if (rect.rotate !== 0 || rect.flipHorizontal || rect.flipVertical) {
      let {w, h, rotate, flipHorizontal, flipVertical} = rect
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
      let p1 = {x, y}
      let c2 = {x: rect.x + w / 2, y: rect.y + h / 2}
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

      let r = rect.radius
      let rr = 5
      if ((rect.leftX! + r - rr < x && x < rect.leftX! + r + rr / 2) &&
        (rect.topY! + r - rr < y && y < rect.topY! + r + rr / 2)
      ) {
        this.hoverRd1 = true
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

      this.hoverRd1 = false
      return true
    }
    return this.isInName(x, y)
  }

  event(event: any, parent?: Shape[], cb?: Function) {
    let {e, coordinate, type} = event
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
    let {e, coordinate, type} = event
    let {x, y, cu} = this.getXY(coordinate)
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
      // console.log('config', cloneDeep(this.config))
      const center = {
        x: rect.x + (rect.w / 2),
        y: rect.y + (rect.h / 2)
      }
      //可以用当前位置，如果点击的不是点位上，那么会有细小的偏差
      let handlePoint = getRotatedPoint({x: rect.x, y: rect.y}, center, rect.rotate)
      if (rect.flipHorizontal) {
        // handlePoint.x = center.x + Math.abs(handlePoint.x - center.x) * (handlePoint.x < center.x ? 1 : -1)
      }
      if (rect.flipVertical) {
        // handlePoint.y = center.y + Math.abs(handlePoint.y - center.y) * (handlePoint.y < center.y ? 1 : -1)
      }
      this.diagonal = {
        x: center.x + Math.abs(handlePoint.x - center.x) * (handlePoint.x < center.x ? 1 : -1),
        y: center.y + Math.abs(handlePoint.y - center.y) * (handlePoint.y < center.y ? 1 : -1)
      }
    }
    if (this.hoverL) {
      // console.log('config', cloneDeep(this.config))
      const center = {
        x: rect.x + (rect.w / 2),
        y: rect.y + (rect.h / 2)
      }
      //不是当前点击位置，当前点击位置算对角会有偏差
      let handlePoint = getRotatedPoint(
        {x: this.config.x, y: this.config.y + this.config.h / 2},
        center, rect.rotate)
      this.handlePoint = handlePoint
      this.diagonal = {
        x: center.x + Math.abs(handlePoint.x - center.x) * (handlePoint.x < center.x ? 1 : -1),
        y: center.y + Math.abs(handlePoint.y - center.y) * (handlePoint.y < center.y ? 1 : -1)
      }
      console.log('diagonal', this.diagonal)
    }

    cu.startX = x
    cu.startY = y
    if (this.hoverRd1) {
      this.enterRd1 = true
    }
    if (this.hoverL || this.hoverLT || this.hoverLTR) {
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
    super.mouseDown(cu)
  }

  mouseup(event: any, p: any) {
    // console.log('mouseup', this.config.name,)
    let {
      flipVertical, flipHorizontal,
    }
      = this.config
    let {e, coordinate, type} = event
    let {x, y, cu} = this.getXY(coordinate)

    let current = this.config
    let center = {
      x: current.x + (current.w / 2),
      y: current.y + (current.h / 2)
    }

    if ((flipHorizontal || flipVertical) && (this.enterLT || this.enterL)) {
      let s = this.original
      let oldCenter = {
        x: s.x + (s.w / 2),
        y: s.y + (s.h / 2)
      }
      //这里把rect的x坐标，加上偏移量，因为draw的时候临时平移了中心点，不重新设定x坐标，会回弹
      //不能直接用x-startX，因为startX是鼠标点击位置，会有一丁点偏移，导致rect重绘时小抖动
      if (flipHorizontal) {
        let dx = oldCenter!.x - center!.x
        this.config.x += dx * 2
      }
      if (flipVertical) {
        let dy = oldCenter!.y - center!.y
        this.config.y += dy * 2
      }
      this.config = getPath(this.config, this.original)
    }

    this.enter = false
    this.enterL = false
    this.enterLT = false
    this.enterLTR = false
    this.enterRd1 = false

    cu.render()
  }

  moveEnterLT({x, y}: Point) {
    let rect = this.config
    let s = this.original
    let current = {x, y}
    const center = {
      x: s.x + (s.w / 2),
      y: s.y + (s.h / 2)
    }

    //水平翻转，那么要把当前的x坐标一下翻转
    //同时，draw的时候，需要把新rect的中心点和平移（选中时rect的中心点）的2倍
    if (rect.flipHorizontal) {
      current.x = center.x + Math.abs(current.x - center.x) * (current.x < center.x ? 1 : -1)
    }
    if (rect.flipVertical) {
      current.y = center.y + Math.abs(current.y - center.y) * (current.y < center.y ? 1 : -1)
    }

    let newCenter = getCenterPoint(current, this.diagonal)
    let newTopLeftPoint = getRotatedPoint(current, newCenter, -s.rotate)
    let newBottomRightPoint = getRotatedPoint(this.diagonal, newCenter, -s.rotate)

    let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
    let newHeight = newBottomRightPoint.y - newTopLeftPoint.y
    rect.x = newTopLeftPoint.x
    rect.y = newTopLeftPoint.y
    rect.w = newWidth
    rect.h = newHeight
    // console.log(rect)
    this.config = getPath(rect, this.original)
  }

  mousemove(event: any, p: any) {
    let {e, coordinate, type} = event
    // console.log('mousemove', this.config.name, `isHover：${this.isHover}`)
    let {x, y, cu} = this.getXY(coordinate)
    if (this.enter || this.enterLTR || this.enterLT || this.enterL) {
      super.mouseMove(cu)
    }
    if (!cu.isDesign()) {
      return;
    }

    if (this.enterRd1) {
      let dx = (x - cu.startX)
      this.config.radius = this.original.radius + dx
      cu.render()
      console.log('th.enterRd1')
      return;
    }

    if (this.enter) {
      // console.log('enter')
      let dx = (x - cu.startX)
      let dy = (y - cu.startY)
      this.config.x = this.original.x + dx
      this.config.y = this.original.y + dy
      this.config = getPath(this.config, this.original)
      // cu.hoverShape = this
      cu.render()
      return;
    }

    if (this.enterLTR) {
      let rect = this.original
      let old = this.original
      const center = {
        x: old.x + (old.w / 2),
        y: old.y + (old.h / 2)
      }
      let current = {x, y}
      if (rect.flipHorizontal) {
        current.x = center.x + Math.abs(current.x - center.x) * (current.x < center.x ? 1 : -1)
      }
      if (rect.flipVertical) {
        current.y = center.y + Math.abs(current.y - center.y) * (current.y < center.y ? 1 : -1)
      }
      // console.log('x-------', x, '          y--------', y)
      let a = getAngle([rect.x + rect.w / 2, rect.y + rect.h / 2],
        [this.original.x, this.original.y],
        [current.x, current.y]
      )
      // console.log('getAngle', a)
      this.config.rotate = a
      cu.render()
      return;
    }

    if (this.enterLT) {
      this.moveEnterLT({x, y})
      cu.render()
      return;
    }

    if (this.enterL) {
      if (this.config.rotate) {
        // if (false) {
        // this.moveEnterLT({ x, y })
        let rect = this.config
        let s = this.original
        const center = {
          x: s.x + (s.w / 2),
          y: s.y + (s.h / 2)
        }
        let sPoint = this.diagonal
        const current = {x, y}
        console.log('--------------------------')
        if (rect.flipHorizontal) {
          current.x = center.x + Math.abs(current.x - center.x) * (current.x < center.x ? 1 : -1)
        }
        if (rect.flipVertical) {
          current.y = center.y + Math.abs(current.y - center.y) * (current.y < center.y ? 1 : -1)
        }
        const handlePoint = this.handlePoint
        console.log('current', current)
        console.log('handlePoint', handlePoint)

        const rotatedCurrentPosition = getRotatedPoint(current, handlePoint, -rect.rotate)
        console.log('rotatedCurrentPosition', rotatedCurrentPosition)

        console.log('test', rotatedCurrentPosition.x, handlePoint.y)

        const rotatedLeftMiddlePoint = getRotatedPoint({
          x: rotatedCurrentPosition.x,
          y: handlePoint.y,
        }, handlePoint, rect.rotate)
        console.log('rotatedLeftMiddlePoint', rotatedLeftMiddlePoint)

        // const newWidth = Math.sqrt(Math.pow(rotatedLeftMiddlePoint.x - sPoint.x, 2) + Math.pow(rotatedLeftMiddlePoint.y - sPoint.y, 2))
        const newWidth = Math.hypot(rotatedLeftMiddlePoint.x - sPoint.x, rotatedLeftMiddlePoint.y - sPoint.y)
        console.log('newWidth', newWidth)
        console.log('sPoint', sPoint)
        const newCenter = {
          x: rotatedLeftMiddlePoint.x - (Math.abs(sPoint.x - rotatedLeftMiddlePoint.x) / 2) * (rotatedLeftMiddlePoint.x > sPoint.x ? 1 : -1),
          y: rotatedLeftMiddlePoint.y + (Math.abs(sPoint.y - rotatedLeftMiddlePoint.y) / 2) * (rotatedLeftMiddlePoint.y > sPoint.y ? -1 : 1),
        }
        console.log('newCenter', newCenter)


        rect.w = newWidth
        rect.y = newCenter.y - (rect.h / 2)
        rect.x = newCenter.x - (newWidth / 2)
        console.log(rect)
        this.config = getPath(rect, this.original)
      } else {
        this.config.x = (x - cu.offsetX)
        this.config.w = this.original.rightX - this.config.x
        this.config = getPath(this.config, this.original)
      }
      cu.render()
      return;
    }
  }
}

export default Ellipse
