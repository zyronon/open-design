import {BaseEvent2, P, ShapeConfig} from "../type"
import {getPath} from "../utils"
import CanvasUtil2 from "../CanvasUtil2"
import {cloneDeep} from "lodash"
import getCenterPoint, {getAngle, getRotatedPoint} from "../../../utils"
import {getShapeFromConfig} from "./common"

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
  isSelectHover: boolean = false //是否选中之后hover
  isEdit: boolean = false
  isCapture: boolean = true//是否捕获事件，为true不会再往下传递事件
  enter: boolean = false
  startX: number = 0
  startY: number = 0
  original: any = null
  lastClickTime: number = 0
  diagonal: P = {x: 0, y: 0}//对角
  handlePoint: P = {x: 0, y: 0}//对角

  constructor(props: ShapeConfig) {
    this.config = getPath(props)
    this.children = this.config.children.map((conf: ShapeConfig) => {
      return getShapeFromConfig(conf)
    })
  }

  abstract render(ctx: CanvasRenderingContext2D): void

  abstract isIn(p: P, cu: CanvasUtil2): boolean

  isInBox(p: P): boolean {
    const {x, y} = p
    let rect = this.config
    return rect.leftX < x && x < rect.rightX
      && rect.topY < y && y < rect.bottomY
  }

  shapeIsIn(p: P, cu: CanvasUtil2): boolean {
    //如果操作中，那么永远返回ture，保持事件一直直接传递到当前图形上
    if (this.enterL ||
      this.enterLT ||
      this.enterLTR) {
      return true
    }

    const {x: handX, y: handY} = cu.handMove
    let {x, y} = p
    x = (x - handX) / cu.handScale//上面的简写
    y = (y - handY) / cu.handScale

    let rect = this.config
    //修正当前鼠标点为变换过后的点，确保和图形同一transform
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

    if (this.isSelect) {
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

      //未命中 点
      document.body.style.cursor = "default"
      this.resetHover()
    }
    return this.isIn({x, y}, cu)
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
        for (let i = 0; i < this.children.length; i++) {
          let shape = this.children[i]
          let isBreak = shape.event(event, parent?.concat([this]))
          if (isBreak) break
        }
      }

      if (event.capture) return true

      if (this.isSelect) {
        this.isSelectHover = true
      } else {
        //如果已经选中了，那就不要再加hover效果了
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
      return true
      // console.log('冒泡', this.config.name)
    } else {
      document.body.style.cursor = "default"
      this.isSelectHover = this.isHover = false
      cu.setInShapeNull(this)
      for (let i = 0; i < this.children.length; i++) {
        let shape = this.children[i]
        let isBreak = shape.event(event, parent?.concat([this]))
        if (isBreak) break
      }
    }
    return false
  }

  emit(event: BaseEvent2, p: BaseShape[] = []) {
    let {e, point, type} = event
    // @ts-ignore
    this[type]?.(event, p)
  }

  mousedown(event: BaseEvent2, p: BaseShape[] = []) {
    // console.log('mousedown', this)
    let {e, point, type} = event
    let {x, y, cu} = this.getXY(point)

    //向下传递事件
    if (Date.now() - this.lastClickTime < 300) {
      console.log('dblclick')
      // cu.selectedShape = null
      // this.config.selected = false
      // cu.draw()
      // this.isSelect = false
      this.isCapture = false
      for (let i = 0; i < this.children.length; i++) {
        let shape = this.children[i]
        let isBreak = shape.event(event, p?.concat([this]), () => {
          cu.childIsIn = true
        })
        if (isBreak) break
      }
      if (!cu.childIsIn) {
        this.isCapture = true
      }
      cu.childIsIn = false
      return
    }
    this.lastClickTime = Date.now()

    this.original = cloneDeep(this.config)
    cu.startX = x
    cu.startY = y
    cu.offsetX = x - this.config.x
    cu.offsetY = y - this.config.y

    let rect = this.config

    //按下左边
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
      this.enterL = true
      return
    }

    //按下左上
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
      this.enterLT = true
      return
    }

    //按下左上旋转
    if (this.hoverLTR) {
      this.enterLTR = true
      return
    }

    //TODO 应该由子类实现
    //按下左上，拉动圆角那个点
    if (this.hoverRd1) {
      this.enterRd1 = true
      return
    }

    //默认选中以及拖动
    this.enter = true
    if (this.isSelect) return
    this.isSelect = true
    this.isSelectHover = true
    this.isCapture = true
    this.isHover = false
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

  mousemove(event: BaseEvent2, p: BaseShape[] = []) {
    // console.log('mousemove', this.enterLTR)
    let {e, point, type} = event
    // console.log('mousemove', this.config.name, `isHover：${this.isHover}`)
    if (this.enter) {
      return this.move(point)
    }

    if (this.enterL) {
      return this.dragL(point)
    }

    if (this.enterLT) {
      return this.dragLT(point)
    }

    if (this.enterLTR) {
      return this.dragLTR(point)
    }

    if (this.enterRd1) {
      return this.dragRd1(point)
    }
  }

  dragRd1(point: P) {
    let {x, y, cu} = this.getXY(point)
    let dx = (x - cu.startX)
    this.config.radius = this.original.radius + dx
    cu.render()
    console.log('th.enterRd1')
  }

  //拖动左上旋转
  dragLTR(point: P) {
    let {x, y, cu} = this.getXY(point)
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
    console.log('getAngle', a)
    this.config.rotate = a
    cu.render()
  }

  //拖动左上
  dragLT(point: P) {
    let {x, y, cu} = this.getXY(point)

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
    cu.render()
  }

  //拖动左边
  dragL(point: P) {
    let {x, y, cu} = this.getXY(point)
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
  }

  //移动图形
  move(point: P) {
    let {x, y, cu} = this.getXY(point)
    let dx = (x - cu.startX)
    let dy = (y - cu.startY)
    this.config.x = this.original.x + dx
    this.config.y = this.original.y + dy
    this.config = getPath(this.config, this.original)
    // cu.hoverShape = this
    cu.render()
  }

  mouseup(e: BaseEvent2, p: BaseShape[] = []) {
    // if (e.capture) return
    // console.log('mouseup')
    this.resetEnter()
  }

  //获取缩放平移之后的x和y值
  getXY(point: P) {
    let {x, y} = point
    let cu = CanvasUtil2.getInstance()
    const {x: handX, y: handY} = cu.handMove
    x = (x - handX) / cu.handScale//上面的简写
    y = (y - handY) / cu.handScale
    return {x, y, cu}
  }

  resetHover() {
    this.hoverL = false
    this.hoverLT = false
    this.hoverLTR = false
    this.hoverRd1 = false
  }

  resetEnter() {
    this.enter = false
    this.enterL = false
    this.enterLT = false
    this.enterLTR = false
    this.enterRd1 = false
  }

  getState() {
    return {
      isHover: this.isHover,
      isSelect: this.isSelect,
      isSelectHover: this.isSelectHover,
      isEdit: this.isEdit,
      enterLT: this.enterLT,
      enterL: this.enterL
    }
  }
}
