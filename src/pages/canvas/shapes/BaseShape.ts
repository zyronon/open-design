import {BaseEvent2, P, ShapeProps, ShapeType} from "../utils/type"
import CanvasUtil2 from "../CanvasUtil2"
import {clone, cloneDeep} from "lodash"
import getCenterPoint, {getAngle2, getRotatedPoint} from "../../../utils"
import {getShapeFromConfig} from "../utils/common"
import EventBus from "../../../utils/event-bus"
import {EventMapTypes} from "../../canvas20221111/type"
import {BaseConfig} from "../config/BaseConfig"
import helper from "../utils/helper"
import draw from "../utils/draw"

export abstract class BaseShape {
  hoverRd1: boolean = false
  enterRd1: boolean = false
  hoverLeft: boolean = false
  enterLeft: boolean = false
  hoverLeftTop: boolean = false
  enterLeftTop: boolean = false
  hoverLTR: boolean = false
  enterLTR: boolean = false
  hoverRight: boolean = false
  enterRight: boolean = false
  hoverTop: boolean = false
  enterTop: boolean = false
  public conf: BaseConfig
  children: BaseShape[] = []
  isHover: boolean = false
  isSelect: boolean = false
  isSelectHover: boolean = false //是否选中之后hover
  isEdit: boolean = false
  isCapture: boolean = true//是否捕获事件，为true不会再往下传递事件
  enter: boolean = false
  startX: number = 0
  startY: number = 0
  original: BaseConfig
  diagonal: P = {x: 0, y: 0}//对面的点（和handlePoint相反的点），如果handlePoint是中间点，那么这个也是中间点
  handlePoint: P = {x: 0, y: 0}//鼠标按住那条边的中间点（当前角度），非鼠标点
  parent?: BaseShape

  constructor(props: ShapeProps) {
    // console.log('props', clone(props))
    this.conf = helper.initConf(props.conf, props.ctx, props.parent?.conf,)
    this.parent = props.parent
    this.original = cloneDeep(this.conf)
    // console.log('config', clone(this.config))
    this.children = this.conf.children?.map((conf: BaseConfig) => {
      return getShapeFromConfig({conf, parent: this, ctx: props.ctx})
    }) ?? []
  }

  abstract render(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any

  abstract renderHover(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any

  abstract renderSelected(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any

  abstract renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void

  abstract renderEdit(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any

  abstract childMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean

  abstract childMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean

  abstract childMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean

  abstract childDbClick(event: BaseEvent2, parents: BaseShape[]): boolean

  //判断是否hover在图形上
  abstract isHoverIn(mousePoint: P, cu: CanvasUtil2): boolean

  //当select时，判断是否在图形上
  abstract isInOnSelect(p: P, cu: CanvasUtil2): boolean

  /**
   * @desc 判断是否在图形上，之前
   * 用于子类的enter之类的变量判断
   * 如果变量为ture，那么方法直接返回true，不用再走后续判断是否在图形上
   * */
  abstract beforeShapeIsIn(): boolean

  resetHover() {
    this.hoverLeft = false
    this.hoverTop = false
    this.hoverLeftTop = false
    this.hoverLTR = false
    this.hoverRd1 = false
    this.hoverRight = false
  }

  resetEnter() {
    this.enter = false
    this.enterTop = false
    this.enterLeft = false
    this.enterLeftTop = false
    this.enterLTR = false
    this.enterRd1 = false
    this.enterRight = false
  }

  /**
   * 事件向下传递的先决条件：有子级，自己没有父级
   * 1、有子级
   * 2、自己没有父级
   * 3、类型为FRAME
   * 再判断是否捕获、是否是设计模式
   * */
  canNext(cu: CanvasUtil2): boolean {
    if (this.conf.type === ShapeType.FRAME) {
      if (this.children.length && !this.parent) {
        return true
      }
    }
    return !this.isCapture || !cu.isDesignMode()
  }

  getStatus() {
    return `
    <div>
        handlePoint:${this.handlePoint.x.toFixed(2)},${this.handlePoint.y.toFixed(2)}
</div>
    <div>
        diagonal:${this.diagonal.x.toFixed(2)},${this.diagonal.y.toFixed(2)}
</div>
    <div>
        realRotation:${this.conf.realRotation}
</div>
    <div>
        absoluteX:${this.conf.absolute.x.toFixed(2)}
</div>
    <div>
        absoluteY:${this.conf.absolute.y.toFixed(2)}    
</div>
    <div>
        originalX:${this.conf.original.x.toFixed(2)}
</div>
    <div>
        originalY:${this.conf.original.y.toFixed(2)}    
</div>
    <div>
        centerX:${this.conf.center.x.toFixed(2)}
</div>
    <div>
        centerY:${this.conf.center.y.toFixed(2)}    
</div>
    `
  }

  getState() {
    return {
      isHover: this.isHover,
      isSelect: this.isSelect,
      isSelectHover: this.isSelectHover,
      isEdit: this.isEdit,
      enterLT: this.enterLeftTop,
      enterL: this.enterLeft
    }
  }

  getRotate(conf = this.conf): number {
    let {rotation, flipHorizontal, flipVertical} = conf
    let r = rotation
    if (flipHorizontal && flipVertical) {
      r = (180 + rotation)
    } else {
      if (flipHorizontal) {
        if (rotation <= 0) {
          r = -180 - rotation
        } else {
          r = 180 - rotation
        }
      }
    }
    //这里要加上父组件旋转的角度
    if (this.parent) {
      r += this.parent.getRotate()
    }
    return r
  }

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
    let rect = this.conf
    return rect.box.leftX < x && x < rect.box.rightX
      && rect.box.topY < y && y < rect.box.bottomY
  }

  shapeIsIn(mousePoint: P, cu: CanvasUtil2, parent?: BaseShape): boolean {
    //如果操作中，那么永远返回ture，保持事件一直直接传递到当前图形上
    if (this.enter ||
      this.enterLeft ||
      this.enterTop ||
      this.enterRight ||
      this.enterLeftTop ||
      this.enterLTR) {
      return true
    }
    if (this.beforeShapeIsIn()) return true

    let {x, y} = mousePoint

    let {
      w, h, rotation, radius,
      box, realRotation,
      flipHorizontal, flipVertical, center
    } = this.conf
    const {leftX, rightX, topY, bottomY,} = box
    if (realRotation) {
      let s2 = getRotatedPoint({x, y}, center, -realRotation)
      x = s2.x
      y = s2.y
    }

    if (this.isSelect) {
      /*
      * 同上原因，判断是否在图形内，不需要翻转点。
      * */
      if (flipHorizontal) x = helper.getReversePoint(x, center.x)
      if (flipVertical) y = helper.getReversePoint(y, center.y)
      let edge = 10
      let angle = 7
      let rotation = 27
      //左边
      if ((leftX! - edge < x && x < leftX! + edge) &&
        (topY! + edge < y && y < bottomY! - edge)
      ) {
        // console.log('hoverLeft')
        document.body.style.cursor = "col-resize"
        this.hoverLeft = true
        return true
      }
      //左边
      if ((leftX! + edge < x && x < rightX! - edge) &&
        (topY! - edge < y && y < topY! + edge)
      ) {
        // console.log('hoverLeft')
        document.body.style.cursor = "row-resize"
        this.hoverTop = true
        return true
      }

      //右边
      if ((rightX! - edge < x && x < rightX! + edge) &&
        (topY! + edge < y && y < bottomY! - edge)
      ) {
        // console.log('hoverR')
        document.body.style.cursor = "col-resize"
        this.hoverRight = true
        return true
      }

      //左上
      if ((leftX! - angle < x && x < leftX! + angle) &&
        (topY! - angle < y && y < topY! + angle)
      ) {
        // console.log('1', flipHorizontal)
        this.hoverLeftTop = true
        this.hoverLeft = false
        document.body.style.cursor = "nwse-resize"
        return true
      }

      //左上旋转
      if ((leftX! - rotation < x && x < leftX! - angle) &&
        (topY! - rotation < y && y < topY! - angle)
      ) {
        this.hoverLTR = true

        this.hoverLeftTop = false
        this.hoverLeft = false
        document.body.style.cursor = "pointer"
        return true
      }

      let r = radius
      let rr = 5
      //左上，拉动圆角那个点
      if ((leftX! + r - rr < x && x < leftX! + r + rr / 2) &&
        (topY! + r - rr < y && y < topY! + r + rr / 2)
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

  shapeRender(ctx: CanvasRenderingContext2D, parent?: BaseConfig, parent2?: BaseShape) {
    ctx.save()
    let {x, y} = draw.calcPosition(ctx, this.conf, this.original, this.getState(), parent, parent2)
    const {isHover, isSelect, isEdit, isSelectHover} = this

    if (isHover) {
      this.render(ctx, {x, y}, parent,)
      draw.hover(ctx, {...this.conf, x, y})
    } else if (isSelect) {
      this.render(ctx, {x, y}, parent,)
      draw.selected(ctx, {...this.conf, x, y})
      if (isSelectHover) {
        this.renderSelectedHover(ctx, {...this.conf, x, y})
      }
    } else if (isEdit) {
      this.renderEdit(ctx, {...this.conf, x, y})
      // edit(ctx, {...this.config, x, y})
    } else {
      this.render(ctx, {x, y}, parent,)
    }

    ctx.restore()
    draw.drawRound(ctx, this.conf.box.topLeft)
    draw.drawRound(ctx, this.conf.box.topRight)
    draw.drawRound(ctx, this.conf.box.bottomLeft)
    draw.drawRound(ctx, this.conf.box.bottomRight)
    draw.drawRound(ctx, this.conf.center)
    draw.drawRound(ctx, this.conf.original)
    // ctx.save()
    // let rect = this.config
    // ctx.fillStyle = 'gray'
    // ctx.font = `${rect.fontWeight} ${rect.fontSize}rem "${rect.fontFamily}", sans-serif`;
    // ctx.textBaseline = 'top'
    // ctx.fillText(rect.name, x, y - 18);
    // ctx.restore()

    // this.config = helper.getPath(this.config, undefined, parent)
    for (let i = 0; i < this.children.length; i++) {
      let shape = this.children[i]
      shape.shapeRender(ctx, this.conf, this)
    }
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
    // 如果在操作中，那么就不要再向下传递事件啦，再向下传递事件，会导致子父冲突
    if (this.enter ||
      this.enterLeft ||
      this.enterRight ||
      this.enterLeftTop ||
      this.enterLTR) {
      /** @desc 把事件消费了，不然父级会使用
       * */
      event.stopPropagation()
      return this.emit(event, parent)
    }

    let cu = CanvasUtil2.getInstance()
    if (this.shapeIsIn(point, cu, parent?.[parent?.length - 1])) {
      // console.log('in')
      // return true

      // console.log('捕获', this.config.name)
      if (this.canNext(cu)) {
        // if (true) {
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
        // if (!eventIsNext) {
        if (true) {
          this.emit(event, parent)
        }
      }
      event.stopPropagation()

      return true
      // console.log('冒泡', this.config.name)
    } else {
      // console.log('out')
      // document.body.style.cursor = "default"
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

  dblclick(event: BaseEvent2, parents: BaseShape[] = []) {
    console.log('on-dblclick',)
    if (this.childDbClick(event, parents)) return

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

  mousedown(event: BaseEvent2, parents: BaseShape[] = []) {
    // console.log('mousedown', this.config)
    EventBus.emit(EventMapTypes.onMouseDown, this)

    if (this.childMouseDown(event, parents)) return

    let {e, point: {x, y}, type} = event
    let cu = CanvasUtil2.getInstance()
    this.original = cloneDeep(this.conf)
    this.children.map(shape => {
      shape.original = cloneDeep(shape.conf)
    })
    cu.startX = x
    cu.startY = y
    cu.offsetX = x - this.conf.x
    cu.offsetY = y - this.conf.y

    if (this.isEdit) {
      return
    }

    //按下左边
    if (this.hoverLeft) {
      // console.log('config', cloneDeep(this.config))
      let {w, h, realRotation, center, flipHorizontal, flipVertical} = this.conf
      let lx = this.conf.x
      let ly = this.conf.y
      //反转当前xy到0度
      let reverseXy = getRotatedPoint({x: lx, y: ly}, center, -realRotation)
      /**
       * 根据flipHorizontal、flipVertical计算出当前按的那条边的中间点
       * 如果水平翻转：x在左边，直接使用。未翻转：x加上宽度
       * 如果垂直翻转：y在下边，要减去高度的一半。未翻转：y加上高度的一半
       * */
      let currentHandLineCenterPoint = {
        x: reverseXy.x + (flipHorizontal ? -w : 0),
        y: reverseXy.y + (flipVertical ? -(h / 2) : (h / 2))
      }
      //根据当前角度，转回来。得到的点就是当前鼠标按住那条边的中间点（当前角度），非鼠标点
      let handlePoint = getRotatedPoint(
        currentHandLineCenterPoint,
        center, realRotation)
      this.handlePoint = handlePoint
      //翻转得到对面的点
      this.diagonal = {
        x: helper.getReversePoint(handlePoint.x, center.x),
        y: helper.getReversePoint(handlePoint.y, center.y),
      }
      this.enterLeft = true
      return
    }

    //按下上边
    if (this.hoverTop) {
      // console.log('config', cloneDeep(this.config))
      let {w, h, realRotation, center, flipHorizontal, flipVertical} = this.conf
      let handLineCenterPoint = {
        x: center.x,
        y: center.y + (flipVertical ? (h / 2) : -(h / 2))
      }
      //根据当前角度，转回来。得到的点就是当前鼠标按住那条边的中间点（当前角度），非鼠标点
      this.handlePoint = getRotatedPoint(handLineCenterPoint, center, realRotation)
      //翻转得到对面的点
      this.diagonal = helper.getReversePoint2(this.handlePoint, center)
      this.enterTop = true
      return
    }

    //按下左边
    if (this.hoverRight) {
      // console.log('config', cloneDeep(this.config))
      let {w, h, absolute, center, realRotation, flipHorizontal, flipVertical} = this.conf
      /**
       * 根据flipHorizontal、flipVertical计算出当前按的那条边的中间点
       * 如果水平翻转：x在左边，直接使用。未翻转：x加上宽度
       * 如果垂直翻转：y在下边，要减去高度的一半。未翻转：y加上高度的一半
       * */
      let handLineCenterPoint = {
        x: center.x + (flipHorizontal ? -(w / 2) : (w / 2)),
        y: center.y
      }
      //根据当前角度，转回来。得到的点就是当前鼠标按住那条边的中间点（当前角度），非鼠标点
      this.handlePoint = getRotatedPoint(handLineCenterPoint, center, realRotation)
      //翻转得到对面的点
      this.diagonal = helper.getReversePoint2(this.handlePoint, center)
      this.enterRight = true
      return
    }

    //按下左上
    if (this.hoverLeftTop) {
      // console.log('config', cloneDeep(this.config))
      let {w, h, absolute, realRotation, original, center, flipHorizontal, flipVertical} = this.conf
      this.handlePoint = absolute
      this.diagonal = helper.getReversePoint2(this.handlePoint, center)
      this.enterLeftTop = true
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
    cu.setSelectShape(this, parents)
  }

  mousemove(event: BaseEvent2, parents: BaseShape[] = []) {
    // console.log('mousemove', this.enterLTR)
    if (this.childMouseMove(event, parents)) return

    let {e, point, type} = event
    // console.log('mousemove', this.config.name, `isHover：${this.isHover}`)


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
    // cu.setInShape(this, parents)
    let cu = CanvasUtil2.getInstance()
    cu.setInShape(this, parents)


    if (this.enter) {
      return this.move(point)
    }

    if (this.enterLeft) {
      return this.dragLeft(point)
    }
    if (this.enterTop) {
      return this.dragTop(point)
    }

    if (this.enterRight) {
      return this.dragRight(point)
    }

    if (this.enterLeftTop) {
      return this.dragLeftTop(point)
    }

    if (this.enterLTR) {
      return this.dragLTR(point)
    }

    if (this.enterRd1) {
      return this.dragRd1(point)
    }
  }

  mouseup(event: BaseEvent2, parents: BaseShape[] = []) {
    // if (e.capture) return
    // console.log('mouseup')
    if (this.childMouseUp(event, parents)) return
    this.resetEnter()
  }

  //移动图形
  move(point: P, fromParent?: { dx: number, dy: number }) {
    let dx: number, dy: number
    if (fromParent) {
      dx = fromParent.dx
      dy = fromParent.dy
    } else {
      let {x, y,} = point
      let cu = CanvasUtil2.getInstance()
      dx = (x - cu.startX)
      dy = (y - cu.startY)
    }

    this.conf.absolute.x = this.original.absolute.x + dx
    this.conf.absolute.y = this.original.absolute.y + dx
    this.conf.center.x = this.original.center.x + dx
    this.conf.center.y = this.original.center.y + dy

    let pRotate = this.parent?.getRotate()
    //当有父级并且父级有角度时，特殊计算xy的值
    if (this.parent && pRotate) {
      /**
       * 先把ab值，负回父角度的位置。（此时的ab值即父级未旋转时的值，一开始initConf的xy也是取的这个值）
       * 然后把ab值和父级的original相减，就可以得出最新的xy值
       * */
      let rXy = getRotatedPoint(this.conf.absolute, this.parent.conf.center, -pRotate)
      this.conf.x = rXy.x - this.parent.conf.original.x
      this.conf.y = rXy.y - this.parent.conf.original.y
    } else {
      this.conf.x = this.original.x + dx
      this.conf.y = this.original.y + dy
    }
    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    this.children.map(shape => {
      shape.move(helper.getXy(), {dx, dy})
    })
    if (!fromParent) {
      let cu = CanvasUtil2.getInstance()
      cu.render()
    }
  }

  //拖动左上，改变圆角按钮
  dragRd1(point: P) {
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let dx = (x - cu.startX)
    this.conf.radius = this.original.radius + dx
    cu.render()
    console.log('th.enterRd1')
  }

  //拖动左上旋转
  dragLTR(point: P) {
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
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
    let newRotation = getAngle2(this.original.center, this.original.original, current)

    let newAbsolute = getRotatedPoint(this.original.original, this.original.center, newRotation)
    this.conf.absolute = this.conf.box.topLeft = newAbsolute

    let parentRealRotation = this.parent?.conf.realRotation
    //当有父级并且父级有角度时，特殊计算xy的值
    if (this.parent && parentRealRotation) {
      /**
       * 先把ab值，负回父角度的位置。（此时的ab值即父级未旋转时的值，一开始initConf的xy也是取的这个值）
       * 然后把ab值和父级的original相减，就可以得出最新的xy值
       * */
      let rXy = getRotatedPoint(newAbsolute, this.parent.conf.center, -parentRealRotation)
      this.conf.x = rXy.x - this.parent.conf.original.x
      this.conf.y = rXy.y - this.parent.conf.original.y
    } else {
      this.conf.x = newAbsolute.x
      this.conf.y = newAbsolute.y
    }

    //这里要减去，父级的旋转角度
    let endA = (newRotation - (this.parent?.conf?.realRotation ?? 0))
    this.conf.rotation = endA < 180 ? endA : endA - 360
    this.conf.realRotation = newRotation

    const oldRealRotation = this.original.realRotation

    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    this.children.map(shape => {
      let conf = shape.conf
      //absolute和center这两个点围着父组件的中心点转
      let reverseTopLeft = getRotatedPoint(shape.original.absolute, this.original.center, -oldRealRotation)
      let topLeft = getRotatedPoint(reverseTopLeft, this.original.center, newRotation)
      conf.absolute = conf.box.topLeft = topLeft

      reverseTopLeft = getRotatedPoint(shape.original.center, this.original.center, -oldRealRotation)
      topLeft = getRotatedPoint(reverseTopLeft, this.original.center, newRotation)
      conf.center = topLeft
      // shape.dragLTR(point)
    })
    cu.render()
  }

  //拖动左上
  dragLeftTop(point: P) {
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    const conf = this.conf
    let {w, h, absolute, realRotation, original, center, flipHorizontal, flipVertical} = conf
    let current = {x, y}
    let newCenter = getCenterPoint(current, this.diagonal)
    let zeroDegreeTopLeft = getRotatedPoint(current, newCenter, -realRotation)
    let zeroDegreeBottomRight = getRotatedPoint(this.diagonal, newCenter, -realRotation)

    let newWidth = zeroDegreeBottomRight.x - zeroDegreeTopLeft.x
    let newHeight = zeroDegreeBottomRight.y - zeroDegreeTopLeft.y

    conf.x = current.x
    conf.y = current.y
    conf.w = Math.abs(newWidth)
    conf.h = newHeight
    conf.center = newCenter
    // console.log(conf)
    this.conf = helper.calcConf(conf, this.parent?.conf)
    cu.render()
  }

  //拖动左边
  dragLeft(point: P) {
    // console.log('拖动左边')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let conf = this.conf
    const {flipHorizontal, flipVertical, realRotation} = conf
    if (realRotation || flipHorizontal || flipVertical) {
      const current = {x, y}
      const handlePoint = this.handlePoint
      const zeroAngleCurrentPoint = getRotatedPoint(current, handlePoint, -realRotation)
      const zeroAngleMovePoint = {x: zeroAngleCurrentPoint.x, y: handlePoint.y}
      const currentAngleMovePoint = getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
      const newWidth = Math.hypot(currentAngleMovePoint.x - this.diagonal.x, currentAngleMovePoint.y - this.diagonal.y)
      const newCenter = {
        x: this.diagonal.x + (currentAngleMovePoint.x - this.diagonal.x) / 2,
        y: this.diagonal.y + (currentAngleMovePoint.y - this.diagonal.y) / 2
      }
      conf.w = newWidth
      conf.center = newCenter

      /*变化：非水平翻转时需要处理*/
      if (!flipHorizontal) {
        let zeroAngleXy = getRotatedPoint(this.original, newCenter, -realRotation)
        /*变化：x减去多的宽度*/
        zeroAngleXy.x -= (newWidth - this.original.w)
        let angleXy = getRotatedPoint(zeroAngleXy, newCenter, realRotation)
        conf.x = angleXy.x
        conf.y = angleXy.y
      }
    } else {
      conf.x = (x - cu.offsetX)
      conf.w = this.original.box.rightX - this.conf.x
      conf.center.x = this.conf.x + this.conf.w / 2
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    cu.render()
  }

  //拖动上边
  dragTop(point: P) {
    // console.log('拖动上边')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let conf = this.conf
    const {flipHorizontal, flipVertical, realRotation} = conf
    if (realRotation || flipHorizontal || flipVertical) {
      const current = {x, y}
      const handlePoint = this.handlePoint
      const zeroAngleCurrentPoint = getRotatedPoint(current, handlePoint, -realRotation)
      const zeroAngleMovePoint = {x: handlePoint.x, y: zeroAngleCurrentPoint.y}
      const currentAngleMovePoint = getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
      const newHeight = Math.hypot(currentAngleMovePoint.x - this.diagonal.x, currentAngleMovePoint.y - this.diagonal.y)
      const newCenter = {
        x: this.diagonal.x + (currentAngleMovePoint.x - this.diagonal.x) / 2,
        y: this.diagonal.y + (currentAngleMovePoint.y - this.diagonal.y) / 2
      }
      conf.h = newHeight
      conf.center = newCenter

      let zeroAngleXy = getRotatedPoint(this.original, newCenter, -realRotation)
      zeroAngleXy.y -= (newHeight - this.original.h)
      let angleXy = getRotatedPoint(zeroAngleXy, newCenter, realRotation)
      conf.x = angleXy.x
      conf.y = angleXy.y
    } else {
      conf.y = (y - cu.offsetY)
      conf.h = this.original.box.bottomY - conf.y
      conf.center.y = conf.y + conf.h / 2
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    cu.render()
  }

  //拖动右边
  dragRight(point: P) {
    // console.log('拖动右边')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let conf = this.conf
    const {flipHorizontal, realRotation, absolute} = conf
    if (realRotation) {
      const current = {x, y}
      const handlePoint = this.handlePoint
      //0度的当前点：以当前边中间点为圆心，负角度偏转当前点，得到0度的当前点
      const zeroAngleCurrentPoint = getRotatedPoint(current, handlePoint, -realRotation)
      //0度的移动点：x取其0度的当前点的，y取当前边中间点的（保证在一条直线上，因为只能拖动x，y不需要变动）
      const zeroAngleMovePoint = {x: zeroAngleCurrentPoint.x, y: handlePoint.y}
      // 当前角度的移动点：以当前边中间点为圆心，正角度偏转
      const currentAngleMovePoint = getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
      //最新宽度：利用勾股定理求出斜边(不能直接zeroAngleMovePoint.x - this.diagonal.x相减，会有细微的差别)
      const newWidth = Math.hypot(currentAngleMovePoint.x - this.diagonal.x, currentAngleMovePoint.y - this.diagonal.y)
      //最新中心点：
      const newCenter = {
        x: this.diagonal.x + (currentAngleMovePoint.x - this.diagonal.x) / 2,
        y: this.diagonal.y + (currentAngleMovePoint.y - this.diagonal.y) / 2
      }
      conf.w = newWidth
      conf.center = newCenter
    } else {
      let dx = (x - cu.startX)
      /** 如果水平翻转，那么移动距离取反*/
      if (this.original.flipHorizontal) dx = -dx
      conf.w = this.original.w + dx

      /** 是否要反转w值，因为反向拉动会使w值，越来越小，小于0之后就是负值了
       * 所以当拉动的距离Math.abs(dx)大于 原始的original.w时
       * 证明，有可能需要反转w值了，但存在图形原本就已经翻转的情况
       * 所以，用x 与 absolute.x 相比较，判断不同翻转状态下，是否同向还是反向拉伸
       * */
      let isReverseW = false
      if (this.original.w < Math.abs(dx)) {
        if (this.original.flipHorizontal) {
          if (x > absolute.x) {
            isReverseW = true
          }
        } else {
          if (x < absolute.x) {
            isReverseW = true
          }
        }
      }
      console.log('isReverseW',isReverseW)
      /** 如果反向拉伸，w取反，图形水平翻转
       * 反之，图形保持和原图形一样的翻转
       * */
      if (isReverseW) {
        conf.flipHorizontal = !this.original.flipHorizontal
        conf.w = -conf.w
        conf.rotation = helper.getRotationByFlipHorizontal(this.original.rotation)
      } else {
        conf.flipHorizontal = this.original.flipHorizontal
        conf.rotation = this.original.rotation
      }

      let w2 = conf.w / 2
      /** 同上*/
      conf.center.x = this.conf.x + (conf.flipHorizontal ? -w2 : w2)
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    cu.render()
  }

  flip(type: number) {
    let conf = this.conf
    let {
      center, absolute, realRotation, rotation,
    } = conf
    console.log('r', rotation)
    if (type === 0) {
      conf.absolute = helper.horizontalReversePoint(conf.absolute, center)
      conf.flipHorizontal = !conf.flipHorizontal
      // conf.rotation = helper.getRotationByFlipConfig(conf)
      if (rotation <= 0) {
        conf.rotation = -180 - rotation
      } else {
        conf.rotation = 180 - rotation
      }
      if (this.parent) {
        //逻辑同move一样
        let pConf = this.parent.conf
        let rXy = getRotatedPoint(conf.absolute, pConf.center, -pConf.realRotation)
        conf.x = rXy.x - pConf.original.x
        conf.y = rXy.y - pConf.original.y
        conf.rotation -= pConf.rotation
      } else {
        conf = helper.horizontalReversePoint(conf, center)
      }
    } else {
      conf.absolute = helper.verticalReversePoint(absolute, center)
      conf.flipVertical = !conf.flipVertical
      // conf.rotation = helper.getRotationByFlipConfig(conf)
      conf.rotation = -conf.rotation
      if (this.parent) {
        //逻辑同move一样
        let pConf = this.parent.conf
        let rXy = getRotatedPoint(conf.absolute, pConf.center, -pConf.realRotation)
        conf.x = rXy.x - pConf.original.x
        conf.y = rXy.y - pConf.original.y
        conf.rotation -= pConf.rotation
      } else {
        conf = helper.verticalReversePoint(conf, center)
      }
    }
    conf.realRotation = -realRotation
    this.conf = helper.calcConf(conf, this.parent?.conf)
  }
}
