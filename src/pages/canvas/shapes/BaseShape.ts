import {BaseEvent2, P, ShapeConfig, ShapeType} from "../type"
import {calcPosition, getPath, hover, selected} from "../utils"
import CanvasUtil2 from "../CanvasUtil2"
import {clone, cloneDeep} from "lodash"
import getCenterPoint, {getAngle, getAngle2, getRotatedPoint} from "../../../utils"
import {getShapeFromConfig} from "./common"
import EventBus from "../../../utils/event-bus"
import {EventMapTypes} from "../../canvas20221111/type"


export abstract class BaseShape {
  hoverRd1: boolean = false
  enterRd1: boolean = false
  hoverL: boolean = false
  enterL: boolean = false
  hoverLT: boolean = false
  enterLT: boolean = false
  hoverLTR: boolean = false
  enterLTR: boolean = false
  public config: ShapeConfig
  children: BaseShape[] = []
  isHover: boolean = false
  isSelect: boolean = false
  isSelectHover: boolean = false //是否选中之后hover
  isEdit: boolean = false
  isCapture: boolean = true//是否捕获事件，为true不会再往下传递事件
  enter: boolean = false
  startX: number = 0
  startY: number = 0
  original: ShapeConfig
  diagonal: P = {x: 0, y: 0}//对角
  handlePoint: P = {x: 0, y: 0}

  constructor(props: ShapeConfig) {
    // console.log('props', clone(props))
    this.config = getPath(props)
    this.original = cloneDeep(this.config)
    // console.log('config', clone(this.config))
    this.children = this.config.children.map((conf: ShapeConfig) => {
      return getShapeFromConfig(conf)
    })
  }

  abstract render(ctx: CanvasRenderingContext2D, xy: P, parent?: ShapeConfig): any

  abstract renderHover(ctx: CanvasRenderingContext2D, xy: P, parent?: ShapeConfig): any

  abstract renderSelected(ctx: CanvasRenderingContext2D, xy: P, parent?: ShapeConfig): any

  abstract renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void

  abstract renderEdit(ctx: CanvasRenderingContext2D, xy: P, parent?: ShapeConfig): any

  shapeRender(ctx: CanvasRenderingContext2D, parent?: ShapeConfig) {
    ctx.save()
    let {x, y} = calcPosition(ctx, this.config, this.original, this.getState(), parent)
    const {isHover, isSelect, isEdit, isSelectHover} = this

    if (isHover) {
      this.render(ctx, {x, y}, parent,)
      hover(ctx, {...this.config, x, y})
    } else if (isSelect) {
      this.render(ctx, {x, y}, parent,)
      selected(ctx, {...this.config, x, y})
      if (isSelectHover) {
        this.renderSelectedHover(ctx, {...this.config, x, y})
      }
    } else if (isEdit) {
      this.renderEdit(ctx, {...this.config, x, y})
      // edit(ctx, {...this.config, x, y})
    } else {
      this.render(ctx, {x, y}, parent,)
    }

    ctx.restore()

    // ctx.save()
    // let rect = this.config
    // ctx.fillStyle = 'gray'
    // ctx.font = `${rect.fontWeight} ${rect.fontSize}rem "${rect.fontFamily}", sans-serif`;
    // ctx.textBaseline = 'top'
    // ctx.fillText(rect.name, x, y - 18);
    // ctx.restore()

    // this.config.x = x
    // this.config.y = y
    // this.config = getPath(this.config, null, parent)
    for (let i = 0; i < this.children.length; i++) {
      let shape = this.children[i]
      shape.shapeRender(ctx, this.config)
    }
  }

  //判断是否hover在图形上
  abstract isHoverIn(p: P, cu: CanvasUtil2): boolean

  //当select时，判断是否在图形上
  abstract isInOnSelect(p: P, cu: CanvasUtil2): boolean

  /**
   * @desc 判断是否在图形上，之前
   * 用于子类的enter之类的变量判断
   * 如果变量为ture，那么方法直接返回true，不用再走后续判断是否在图形上
   * */
  abstract beforeShapeIsIn(): boolean

  /**
   * @desc 判断鼠标m是否在p点内
   * @param m 鼠标坐标
   * @param p 判断点坐标
   * @param r 半径
   * */
  isInPoint(m: P, p: P, r: number) {
    return (p.x - r < m.x && m.x < p.x + r) &&
      (p.y - r < m.y && m.y < p.y + r)
  }

  isInBox(mousePoint: P): boolean {
    const {x, y} = mousePoint
    let rect = this.config
    return rect.leftX < x && x < rect.rightX
      && rect.topY < y && y < rect.bottomY
  }

  shapeIsIn(mousePoint: P, cu: CanvasUtil2): boolean {
    //如果操作中，那么永远返回ture，保持事件一直直接传递到当前图形上
    if (this.enter ||
      this.enterL ||
      this.enterLT ||
      this.enterLTR) {
      return true
    }
    if (this.beforeShapeIsIn()) {
      return true
    }

    //修正当前鼠标点为变换过后的点，确保和图形同一transform
    const {x: handX, y: handY} = cu.handMove
    let {x, y} = mousePoint
    x = (x - handX) / cu.handScale//上面的简写
    y = (y - handY) / cu.handScale

    let {w, h, rotate, flipHorizontal, flipVertical} = this.config
    let r = rotate
    if (flipHorizontal && flipVertical) {
      r = (180 + rotate)
    } else {
      if (flipHorizontal) {
        r = (rotate - 180)
      }
    }
    if (r) {
      let center = this.config.center
      let s2 = getRotatedPoint({x, y}, center, -r)
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

      if (this.isInOnSelect({x, y}, cu)) {
        return true
      }

      //未命中 点
      document.body.style.cursor = "default"
      this.resetHover()
    }
    return this.isHoverIn({x, y}, cu)
  }

  /** @desc 事件转发方法
   * @param event 合成的事件
   * @param parent 父级链
   * @param isParentDbClick 是否是来自父级双击，是的话，不用转发事件
   * */
  event(event: BaseEvent2, parent?: BaseShape[], isParentDbClick?: boolean) {
    let {e, point, type} = event
    // if (this.config.name === '父组件')debugger
    // console.log('event', this.config.name, `type：${type}`,)
    if (event.capture) return true

    let cu = CanvasUtil2.getInstance()
    if (this.shapeIsIn(point, cu)) {
      // console.log('in')
      // return true

      // console.log('捕获', this.config.name)
      if (!this.isCapture || !cu.isDesign()) {
        for (let i = 0; i < this.children.length; i++) {
          let shape = this.children[i]
          let isBreak = shape.event(event, parent?.concat([this]))
          if (isBreak) break
        }
      }

      if (event.capture) return true

      if (isParentDbClick) {
        //这需要mousedown把图形选中，和链设置好
        this.mousedown(event, parent)
        //手动重置一个enter，不然会跟手
        this.mouseup(event, parent)
      } else {
        this.emit(event, parent)
      }
      event.stopPropagation()

      return true
      // console.log('冒泡', this.config.name)
    } else {
      // console.log('out')
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

  abstract childMouseDown(event: BaseEvent2, p: BaseShape[]): boolean

  abstract childDbClick(event: BaseEvent2, p: BaseShape[]): boolean

  abstract childMouseMove(mousePoint: P): boolean

  abstract childMouseUp(): boolean

  dblclick(event: BaseEvent2, p: BaseShape[] = []) {
    console.log('on-dblclick',)
    if (this.childDbClick(event, p)) return
    if (this.isEdit) {
      this.isSelect = this.isSelectHover = true
    } else {
      this.isHover = this.isSelect = this.isSelectHover = false
    }
    let cu = CanvasUtil2.getInstance()
    this.isEdit = !this.isEdit
    cu.editShape = this
    //节省一次刷新，放上面也可以
    cu.render()
  }

  mousedown(event: BaseEvent2, p: BaseShape[] = []) {
    console.log('mousedown', this.config)
    let {e, point, type} = event
    let {x, y, cu} = this.getXY(point)

    this.original = cloneDeep(this.config)
    cu.startX = x
    cu.startY = y
    cu.offsetX = x - this.config.x
    cu.offsetY = y - this.config.y

    if (this.childMouseDown(event, p)) return

    let rect = this.config

    if (this.isEdit) {
      return
    }

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
    EventBus.emit(EventMapTypes.onMouseDown, this)
    this.isSelect = true
    this.isSelectHover = true
    this.isCapture = true
    this.isHover = false
    //如果当前选中的图形不是自己，那么把那个图形设为未选中
    if (cu.selectedShape && cu.selectedShape !== this) {
      cu.selectedShape.isSelect = cu.selectedShape.isEdit = false
    }
    cu.selectedShapeParent.map((shape: BaseShape) => shape.isCapture = true)
    cu.selectedShapeParent = p
    cu.selectedShapeParent.map((shape: BaseShape) => shape.isCapture = false)
    cu.selectedShape = this
    cu.render()
  }

  mousemove(event: BaseEvent2, parent: BaseShape[] = []) {
    // console.log('mousemove', this.enterLTR)
    let {e, point, type} = event
    // console.log('mousemove', this.config.name, `isHover：${this.isHover}`)

    if (this.childMouseMove(point)) return

    //编辑模式下，不用添加hover样式
    if (!this.isEdit) {
      if (this.isSelect) {
        this.isSelectHover = true
      } else {
        //如果已经选中了，那就不要再加hover效果了
        this.isHover = true
      }
    }
    //设置当前的inShape为自己，这位的位置很重要，当前的inShape是唯一的
    //如果放在e.capture前面，那么会被子组件给覆盖。所以放在e.capture后面
    //子组件isSelect或者isHover之后会stopPropagation，那么父组件就不会往
    //下执行了
    // cu.setInShape(this, parent)
    let cu = CanvasUtil2.getInstance()
    cu.setInShape(this, parent)


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

  //拖动左上，改变圆角按钮
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
    let center = {
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
    let a = getAngle2(
      this.original.center,
      this.original.topLeft,
      current)
    // console.log('getAngle', a)

    let reverseTopLeft = getRotatedPoint(this.original.topLeft, this.original.center, -this.original.rotate)
    let topLeft = getRotatedPoint(reverseTopLeft, this.original.center, a)
    this.config.topLeft = topLeft
    this.config.x = topLeft.x
    this.config.y = topLeft.y
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
      this.config.center.x = this.config.x + this.config.w / 2
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
    this.config.center.x = this.original.center.x + dx
    this.config.center.y = this.original.center.y + dy
    this.config = getPath(this.config, this.original)
    cu.render()
  }

  mouseup(e: BaseEvent2, p: BaseShape[] = []) {
    // if (e.capture) return
    console.log('mouseup')
    this.childMouseUp()
    this.resetEnter()
  }

  //获取缩放平移之后的x和y值
  getXY(point: P) {
    let {x, y} = point
    let cu = CanvasUtil2.getInstance()
    //修正当前鼠标点为变换过后的点，确保和图形同一transform
    const {x: handX, y: handY} = cu.handMove
    x = (x - handX) / cu.handScale
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

  flip(type: number) {
    const conf = this.config
    let {
      x, y, center, rotate
    } = conf
    if (type === 0) {
      conf.x = center.x + Math.abs(x - center.x) * (x < center.x ? 1 : -1)
      if (conf.rotate < 0) {
        conf.rotate = -(180 + rotate)
      } else {
        conf.rotate = 180 - conf.rotate
      }
      conf.flipHorizontal = !conf.flipHorizontal
    } else {
      conf.y = center.y + Math.abs(y - center.y) * (y < center.y ? 1 : -1)
      conf.rotate = -conf.rotate
      conf.flipVertical = !conf.flipVertical
    }
  }
}
