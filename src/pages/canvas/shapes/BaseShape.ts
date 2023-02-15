import {BaseEvent2, MouseOptionType, P, ShapeProps, ShapeType} from "../utils/type"
import CanvasUtil2 from "../CanvasUtil2"
import {clone, cloneDeep, merge} from "lodash"
import getCenterPoint, {getAngle2, getRotatedPoint} from "../../../utils"
import {getShapeFromConfig} from "../utils/common"
import EventBus from "../../../utils/event-bus"
import {EventMapTypes} from "../../canvas20221111/type"
import {BaseConfig} from "../config/BaseConfig"
import helper from "../utils/helper"
import draw from "../utils/draw"
import {ShapeConfig} from "../../canvas-20221124/type"
import {getPath} from "../../canvas-20221124/utils"

export abstract class BaseShape {
  hoverRd1: boolean = false
  enterRd1: boolean = false
  hoverType: MouseOptionType = MouseOptionType.None
  enterType: MouseOptionType = MouseOptionType.None
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
    this.conf = helper.initConf(props.conf, props.parent?.conf)
    this.parent = props.parent
    this.original = cloneDeep(this.conf)
    // console.log('config', clone(this.config))
    this.children = this.conf.children?.map((conf: BaseConfig) => {
      return getShapeFromConfig({conf, parent: this})
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
    this.hoverType = MouseOptionType.None
  }

  resetEnter() {
    this.enterType = MouseOptionType.None
    this.enter = false
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
    <div>
        relativeCenterX:${this.conf.relativeCenter?.x.toFixed(2)}
</div>
    <div>
        relativeCenterY:${this.conf.relativeCenter?.y.toFixed(2)}    
</div>
    `
  }

  getState() {
    return {
      isHover: this.isHover,
      isSelect: this.isSelect,
      isSelectHover: this.isSelectHover,
      isEdit: this.isEdit,
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
    if (this.enter || this.enterType !== MouseOptionType.None) {
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
      if (flipHorizontal) x = helper._reversePoint(x, center.x)
      if (flipVertical) y = helper._reversePoint(y, center.y)
      let edge = 10
      let angle = 7
      let rotation = 27
      //左边
      if ((leftX! - edge < x && x < leftX! + edge) &&
        (topY! + edge < y && y < bottomY! - edge)
      ) {
        document.body.style.cursor = "col-resize"
        this.hoverType = MouseOptionType.Left
        return true
      }
      //左边
      if ((leftX! + edge < x && x < rightX! - edge) &&
        (topY! - edge < y && y < topY! + edge)
      ) {
        document.body.style.cursor = "row-resize"
        this.hoverType = MouseOptionType.Top
        return true
      }

      //右边
      if ((rightX! - edge < x && x < rightX! + edge) &&
        (topY! + edge < y && y < bottomY! - edge)
      ) {
        document.body.style.cursor = "col-resize"
        this.hoverType = MouseOptionType.Right
        return true
      }

      //左上
      if ((leftX! - angle < x && x < leftX! + angle) &&
        (topY! - angle < y && y < topY! + angle)
      ) {
        document.body.style.cursor = "nwse-resize"
        this.hoverType = MouseOptionType.TopLeft
        return true
      }

      //左上旋转
      if ((leftX! - rotation < x && x < leftX! - angle) &&
        (topY! - rotation < y && y < topY! - angle)
      ) {
        document.body.style.cursor = "pointer"
        this.hoverType = MouseOptionType.TopLeftRotation
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

  shapeRender(ctx: CanvasRenderingContext2D, parent?: BaseConfig) {
    ctx.save()
    let {x, y} = draw.calcPosition(ctx, this.conf, this.original, this.getState(), parent)
    const {isHover, isSelect, isEdit, isSelectHover} = this

    let newConf = merge(cloneDeep(this.conf), {layout: {x, y}})
    if (isHover) {
      this.render(ctx, {x, y}, parent,)
      draw.hover(ctx, newConf)
    } else if (isSelect) {
      this.render(ctx, {x, y}, parent,)
      draw.selected(ctx, newConf)
      if (isSelectHover) {
        this.renderSelectedHover(ctx, newConf)
      }
    } else if (isEdit) {
      this.renderEdit(ctx, newConf)
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
      shape.shapeRender(ctx, this.conf)
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
    if (this.enterType !== MouseOptionType.None || this.enter) {
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
    cu.offsetX = x - this.conf.layout.x
    cu.offsetY = y - this.conf.layout.y

    if (this.isEdit) {
      return
    }

    this.enterType = this.hoverType
    let {layout: {w, h,}, absolute, center, realRotation, flipHorizontal, flipVertical} = this.conf
    let handLineCenterPoint
    switch (this.hoverType) {
      case MouseOptionType.Left:
        // console.log('Left')
        /** 这里的x的值与Right的计算相反*/
        handLineCenterPoint = {
          x: center.x + (flipHorizontal ? (w / 2) : -(w / 2)),
          y: center.y
        }
        this.handlePoint = getRotatedPoint(handLineCenterPoint, center, realRotation)
        this.diagonal = helper.reversePoint(this.handlePoint, center)
        return
      case MouseOptionType.Right:
        // console.log('Right')
        /**
         * 根据flipHorizontal、flipVertical计算出当前按的那条边的中间点
         * 如果水平翻转：x在左边，直接使用。未翻转：x加上宽度
         * 如果垂直翻转：y在下边，要减去高度的一半。未翻转：y加上高度的一半
         * */
        handLineCenterPoint = {
          x: center.x + (flipHorizontal ? -(w / 2) : (w / 2)),
          y: center.y
        }
        //根据当前角度，转回来。得到的点就是当前鼠标按住那条边的中间点（当前角度），非鼠标点
        this.handlePoint = getRotatedPoint(handLineCenterPoint, center, realRotation)
        //翻转得到对面的点
        this.diagonal = helper.reversePoint(this.handlePoint, center)
        return
      case MouseOptionType.Top:
        handLineCenterPoint = {
          x: center.x,
          y: center.y + (flipVertical ? (h / 2) : -(h / 2))
        }
        //根据当前角度，转回来。得到的点就是当前鼠标按住那条边的中间点（当前角度），非鼠标点
        this.handlePoint = getRotatedPoint(handLineCenterPoint, center, realRotation)
        //翻转得到对面的点
        this.diagonal = helper.reversePoint(this.handlePoint, center)
        return
      case MouseOptionType.Bottom:
      case MouseOptionType.TopLeft:
        this.handlePoint = absolute
        this.diagonal = helper.reversePoint(this.handlePoint, center)
        return
      case MouseOptionType.TopRight:
      case MouseOptionType.BottomLeft:
      case MouseOptionType.BottomRight:
      case MouseOptionType.TopLeftRotation:
      case MouseOptionType.TopRightRotation:
      case MouseOptionType.BottomLeftRotation:
      case MouseOptionType.BottomRightRotation:
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

    switch (this.enterType) {
      case MouseOptionType.Left:
        return this.dragLeft(point)
      case MouseOptionType.Right:
        return this.dragRight(point)
      case MouseOptionType.Top:
        return this.dragTop(point)
      case MouseOptionType.Bottom:
      case MouseOptionType.TopLeft:
        return this.dragTopLeft(point)
      case MouseOptionType.TopRight:
      case MouseOptionType.BottomLeft:
      case MouseOptionType.BottomRight:
      case MouseOptionType.TopLeftRotation:
        return this.dragTopLeftRotation(point)
      case MouseOptionType.TopRightRotation:
      case MouseOptionType.BottomLeftRotation:
      case MouseOptionType.BottomRightRotation:
    }

    if (this.enter) {
      return this.move(point)
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
  move(point: P) {
    let cu = CanvasUtil2.getInstance()
    let {x, y,} = point

    this.conf.center.x = this.original.center.x + (x - cu.startX)
    this.conf.center.y = this.original.center.y + (y - cu.startY)

    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    this.calcChildrenConf()
    cu.render()
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
  dragTopLeftRotation(point: P) {
    // console.log('dragTopLeftRotation')
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

    //这里要减去，父级的旋转角度
    let endA = (newRotation - (this.parent?.conf?.realRotation ?? 0))
    this.conf.rotation = endA < 180 ? endA : endA - 360
    this.conf.realRotation = newRotation
    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    this.calcChildrenConf()
    cu.render()
  }

  //拖动左上
  dragTopLeft(point: P) {
    // console.log('dragTopLeft')
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

    conf.layout.x = current.x
    conf.layout.y = current.y
    conf.layout.w = Math.abs(newWidth)
    conf.layout.h = newHeight
    conf.center = newCenter
    // console.log(conf)
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.calcChildrenConf()
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
      conf.layout.h = newHeight
      conf.center = newCenter

      let zeroAngleXy = getRotatedPoint(this.original.layout, newCenter, -realRotation)
      zeroAngleXy.y -= (newHeight - this.original.layout.h)
      let angleXy = getRotatedPoint(zeroAngleXy, newCenter, realRotation)
      conf.layout.x = angleXy.x
      conf.layout.y = angleXy.y
    } else {
      conf.layout.y = (y - cu.offsetY)
      conf.layout.h = this.original.box.bottomY - conf.layout.y
      conf.center.y = conf.layout.y + conf.layout.h / 2
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.calcChildrenConf()
    cu.render()
  }

  //拖动左边
  dragLeft(point: P) {
    // console.log('拖动左边')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let conf = this.conf
    const {realRotation} = conf
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
      // console.log(currentAngleMovePoint.x, this.diagonal.x)
      let isReverseW = false
      if (this.original.flipHorizontal) {
        if (currentAngleMovePoint.x < this.diagonal.x) {
          isReverseW = true
        }
      } else {
        if (currentAngleMovePoint.x > this.diagonal.x) {
          isReverseW = true
        }
      }
      if (isReverseW) {
        conf.flipHorizontal = !this.original.flipHorizontal
        conf.rotation = helper.getRotationByFlipHorizontal(this.original.rotation)
      } else {
        conf.flipHorizontal = this.original.flipHorizontal
        conf.rotation = this.original.rotation
      }
      conf.layout.w = newWidth
      conf.center = newCenter
    } else {
      //dx和dragRight相反
      let dx = (cu.startX - x)
      //如果水平翻转，那么移动距离取反
      if (this.original.flipHorizontal) dx = -dx
      conf.layout.w = this.original.layout.w + dx
      //是否要反转w值，因为反向拉动会使w值，越来越小，小于0之后就是负值了,判断拖动距离 加上 宽度是否小于0就完事了
      let isReverseW = false
      if (this.original.layout.w + dx < 0) {
        isReverseW = true
      }
      // console.log('isReverseW',isReverseW)
      //如果反向拉伸，w取反，图形水平翻转,反之，图形保持和原图形一样的翻转
      if (isReverseW) {
        conf.flipHorizontal = !this.original.flipHorizontal
        conf.layout.w = -conf.layout.w
        conf.rotation = helper.getRotationByFlipHorizontal(this.original.rotation)
      } else {
        conf.flipHorizontal = this.original.flipHorizontal
        conf.rotation = this.original.rotation
      }
      let dx2 = dx / 2
      //同上
      conf.center.x = this.original.center.x + (this.original.flipHorizontal ? dx2 : -dx2)
    }

    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    this.calcChildrenConf()
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
      // console.log(currentAngleMovePoint.x, this.diagonal.x)
      let isReverseW = false
      if (this.original.flipHorizontal) {
        if (currentAngleMovePoint.x > this.diagonal.x) {
          isReverseW = true
        }
      } else {
        if (currentAngleMovePoint.x < this.diagonal.x) {
          isReverseW = true
        }
      }

      if (isReverseW) {
        conf.flipHorizontal = !this.original.flipHorizontal
        conf.rotation = helper.getRotationByFlipHorizontal(this.original.rotation)
      } else {
        conf.flipHorizontal = this.original.flipHorizontal
        conf.rotation = this.original.rotation
      }

      conf.layout.w = newWidth
      conf.center = newCenter
    } else {
      let dx = (x - cu.startX)
      /** 如果水平翻转，那么移动距离取反*/
      if (this.original.flipHorizontal) dx = -dx
      conf.layout.w = this.original.layout.w + dx
      console.log('  dx', dx)

      /** 是否要反转w值，因为反向拉动会使w值，越来越小，小于0之后就是负值了
       * 判断拖动距离 加上 宽度是否小于0就完事了
       * */
      let isReverseW = false
      if (this.original.layout.w + dx < 0) {
        isReverseW = true
      }
      // console.log('isReverseW',isReverseW)
      /** 如果反向拉伸，w取反，图形水平翻转
       * 反之，图形保持和原图形一样的翻转
       * */
      if (isReverseW) {
        conf.flipHorizontal = !this.original.flipHorizontal
        conf.layout.w = -conf.layout.w
        conf.rotation = helper.getRotationByFlipHorizontal(this.original.rotation)
      } else {
        conf.flipHorizontal = this.original.flipHorizontal
        conf.rotation = this.original.rotation
      }
      let w2 = conf.layout.w / 2
      /** 同上*/
      conf.center.x = this.conf.layout.x + (conf.flipHorizontal ? -w2 : w2)
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    cu.render()
  }

  //计算子组件的配置
  calcChildrenConf(cb?: Function) {
    this.children.map((shape: BaseShape) => {
      if (cb) shape = cb(shape)
      else {
        shape.conf = helper.calcConfByParent(shape.conf, shape?.parent?.conf)
      }
      shape.calcChildrenConf(cb)
    })
  }

  flip2(type: number) {
    let conf = this.conf
    let {
      center, absolute, realRotation, rotation,
    } = conf
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
        conf.layout.x = rXy.x - pConf.original.x
        conf.layout.y = rXy.y - pConf.original.y
        conf.rotation -= pConf.rotation
      } else {
        conf.layout = helper.horizontalReversePoint(conf.layout, center)
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
        conf.layout.x = rXy.x - pConf.original.x
        conf.layout.y = rXy.y - pConf.original.y
        conf.rotation -= pConf.rotation
      } else {
        conf.layout = helper.verticalReversePoint(conf.layout, center)
      }
    }
    conf.realRotation = -realRotation
    this.conf = helper.calcConf(conf, this.parent?.conf)
  }

  flip(type: number) {
    let conf = this.conf
    let {
      center, absolute, realRotation, rotation,
    } = conf
    if (type === 0) {
      conf.absolute = helper.horizontalReversePoint(absolute, center)
      conf.flipHorizontal = !conf.flipHorizontal
      // conf.rotation = helper.getRotationByFlipConfig(conf)
      // if (rotation <= 0) {
      //   conf.rotation = -180 - rotation
      // } else {
      //   conf.rotation = 180 - rotation
      // }
      if (this.parent) {
        //逻辑同move一样
        let pConf = this.parent.conf
        let rXy = getRotatedPoint(conf.absolute, pConf.center, -pConf.realRotation)
        conf.layout.x = rXy.x - pConf.original.x
        conf.layout.y = rXy.y - pConf.original.y
        // conf.rotation -= pConf.rotation
      } else {
        conf.layout = helper.horizontalReversePoint(conf.layout, center)
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
        conf.layout.x = rXy.x - pConf.original.x
        conf.layout.y = rXy.y - pConf.original.y
        conf.rotation -= pConf.rotation
      } else {
        conf.layout = helper.verticalReversePoint(conf.layout, center)
      }
    }
    conf.realRotation = -realRotation
    conf.rotation = -rotation
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.changeChildrenFlip(type, this.conf.center)
    CanvasUtil2.getInstance().render()
  }

  changeChildrenFlip(type: number, center: P) {
    this.children.forEach(item => {
      if (type === 0) {
        item.conf.absolute = helper.horizontalReversePoint(item.conf.absolute, center)
        item.conf.center = helper.horizontalReversePoint(item.conf.center, center)
        item.conf.flipHorizontal = !item.conf.flipHorizontal
      } else {
        item.conf.absolute = helper.verticalReversePoint(item.conf.absolute, center)
        item.conf.center = helper.verticalReversePoint(item.conf.center, center)
        item.conf.flipVertical = !item.conf.flipVertical
      }
      item.conf.realRotation = -item.conf.realRotation
      item.conf = helper.calcConf(item.conf)
      item.changeChildrenFlip(type, center)
    })
  }
}
