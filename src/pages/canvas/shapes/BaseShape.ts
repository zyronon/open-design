import {BaseEvent2, MouseOptionType, P, ShapeProps, ShapeStatus, ShapeType} from "../utils/type"
import CanvasUtil2 from "../CanvasUtil2"
import {cloneDeep} from "lodash"
import {getRotatedPoint} from "../../../utils"
import {getShapeFromConfig} from "../utils/common"
import EventBus from "../../../utils/event-bus"
import {EventMapTypes} from "../../canvas20221111/type"
import {BaseConfig, Rect} from "../config/BaseConfig"
import helper from "../utils/helper"
import draw from "../utils/draw"

export abstract class BaseShape {
  hoverType: MouseOptionType = MouseOptionType.None
  enterType: MouseOptionType = MouseOptionType.None
  conf: BaseConfig
  children: BaseShape[] = []
  _status: ShapeStatus = ShapeStatus.Normal
  _isSelectHover: boolean = false
  isCapture: boolean = true//是否捕获事件，为true不会再往下传递事件
  enter: boolean = false
  startX: number = 0
  startY: number = 0
  original: BaseConfig
  diagonal: P = {x: 0, y: 0}//对面的点（和handlePoint相反的点），如果handlePoint是中间点，那么这个也是中间点
  handLineCenterPoint: P = {x: 0, y: 0}//鼠标按住那条边的中间点（当前角度），非鼠标点
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

  get status() {
    return this._status
  }

  set status(val) {
    if (val !== this._status) {
      if (this._status === ShapeStatus.Edit) {
        this.calcNewCenterAndWidthAndHeight()
      }
      this._status = val
      CanvasUtil2.getInstance().render()
    }
  }

  get isSelectHover() {
    return this._isSelectHover
  }

  set isSelectHover(val) {
    if (val !== this._isSelectHover) {
      this._isSelectHover = val
      CanvasUtil2.getInstance().render()
    }
  }

  abstract drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig): any

  abstract drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect,): any

  abstract drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect): any

  abstract drawSelectedHover(ctx: CanvasRenderingContext2D, newLayout: Rect): void

  abstract drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect): any

  abstract onMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean

  abstract onMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean

  abstract onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean

  abstract onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean

  //子类判断是否在图形上
  abstract isInShape(mousePoint: P, cu: CanvasUtil2): boolean

  //当select时，判断是否在图形上
  abstract isInShapeOnSelect(p: P, cu: CanvasUtil2): boolean

  /**
   * @desc 子类判断是否在图形上的回调
   * 用于子类的enter之类的变量判断
   * 如果变量为ture，那么方法直接返回true，不用再走后续判断是否在图形上
   * */
  abstract beforeIsInShape(): boolean

  //传递事件之前的回调，用于子类直接消费而不经过父类判断
  abstract beforeEvent(event: BaseEvent2): boolean

  getStatus() {
    return `
    <div>
        handlePoint:${this.handLineCenterPoint.x.toFixed(2)},${this.handLineCenterPoint.y.toFixed(2)}
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

  /**
   * 事件向下传递的先决条件
   * 1、有子级
   * 2、自己没有父级
   * 3、类型为FRAME
   * 4、当前hoverType等于空
   * 再判断是否捕获、是否是设计模式
   * */
  canNext(cu: CanvasUtil2): boolean {
    if (this.hoverType !== MouseOptionType.None) return false
    if (this.conf.type === ShapeType.FRAME) {
      if (this.children.length && !this.parent) {
        return true
      }
    }
    return !this.isCapture || !cu.isDesignMode()
  }

  _isInShape(mousePoint: P, cu: CanvasUtil2, parent?: BaseShape): boolean {
    //如果操作中，那么永远返回ture，保持事件一直直接传递到当前图形上
    if (this.enter || this.enterType !== MouseOptionType.None) return true
    if (this.beforeIsInShape()) return true

    let {x, y} = mousePoint

    let {
      w, h, radius,
      box, realRotation,
      flipHorizontal, flipVertical, center
    } = this.conf
    const {leftX, rightX, topY, bottomY,} = box
    //反转到0度，好判断
    if (realRotation) {
      let s2 = getRotatedPoint({x, y}, center, -realRotation)
      x = s2.x
      y = s2.y
    }

    if (this.status === ShapeStatus.Select) {
      /*
      * 同上原因，判断是否在图形内，不需要翻转点。
      * */
      if (flipHorizontal) x = helper._reversePoint(x, center.x)
      if (flipVertical) y = helper._reversePoint(y, center.y)
      let edge = 10 / cu.handScale
      let angle = 7 / cu.handScale
      let rotation = 27 / cu.handScale
      //左边
      if ((leftX! - edge < x && x < leftX! + edge) &&
        (topY! + edge < y && y < bottomY! - edge)
      ) {
        document.body.style.cursor = "col-resize"
        this.hoverType = MouseOptionType.Left
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
      //上边
      if ((leftX! + edge < x && x < rightX! - edge) &&
        (topY! - edge < y && y < topY! + edge)
      ) {
        document.body.style.cursor = "row-resize"
        this.hoverType = MouseOptionType.Top
        return true
      }
      //下边
      if ((leftX! + edge < x && x < rightX! - edge) &&
        (bottomY! - edge < y && y < bottomY! + edge)
      ) {
        document.body.style.cursor = "row-resize"
        this.hoverType = MouseOptionType.Bottom
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

      if (this.isInShapeOnSelect({x, y}, cu)) {
        return true
      }

      //未命中 点
      document.body.style.cursor = "default"
      this.hoverType = MouseOptionType.None
    }
    return this.isInShape({x, y}, cu)
  }

  render(ctx: CanvasRenderingContext2D, parent?: BaseConfig) {
    ctx.save()
    let {x, y} = draw.calcPosition(ctx, this.conf)
    let newLayout = {...this.conf.layout, x, y}
    this.drawShape(ctx, newLayout, parent,)
    // ctx.globalCompositeOperation = 'source-atop'
    //恢复本次图形渲染前的矩阵变换。
    //可以用ctx.restore() 来恢复，但那样会导致clip方法裁剪的区域也被恢复（即仅作用于本组件）。
    //导致后续绘制子组件时，如果超出父组件边界时，无法被裁剪。
    let nv = CanvasUtil2.getInstance().storedTransform
    ctx.setTransform(nv.a, nv.b, nv.c, nv.d, nv.e, nv.f)

    if (false) {
      draw.drawRound(ctx, this.conf.box.topLeft)
      draw.drawRound(ctx, this.conf.box.topRight)
      draw.drawRound(ctx, this.conf.box.bottomLeft)
      draw.drawRound(ctx, this.conf.box.bottomRight)
      draw.drawRound(ctx, this.conf.center)
      draw.drawRound(ctx, this.conf.original)
    }

    for (let i = 0; i < this.children.length; i++) {
      let shape = this.children[i]
      shape.render(ctx, this.conf)
    }
    ctx.restore()

    if (this.status !== ShapeStatus.Normal) {
      CanvasUtil2.getInstance().waitRenderOtherStatusFunc.push(() => this.renderOtherStatus(ctx, newLayout))
    }
    // this.renderOtherStatus(ctx, {x, y})
  }

  renderOtherStatus(ctx: CanvasRenderingContext2D, newLayout: Rect) {
    let cu = CanvasUtil2.getInstance()
    ctx.save()
    draw.calcPosition(ctx, this.conf)
    ctx.lineWidth = 2 / cu.handScale
    if (this.status === ShapeStatus.Hover) {
      this.drawHover(ctx, newLayout)
    }
    if (this.status === ShapeStatus.Select) {
      this.drawSelected(ctx, newLayout)
      if (this.isSelectHover) {
        this.drawSelectedHover(ctx, newLayout)
      }
    }
    if (this.status === ShapeStatus.Edit) {
      this.drawEdit(ctx, newLayout)
    }
    ctx.restore()
  }

  log(val: string) {
    console.log(this.conf.name, ':', val)
  }

  /** @desc 事件转发方法
   * @param event 合成的事件
   * @param parents 父级链
   * @param isParentDbClick 是否是来自父级双击，是的话，不用转发事件
   * */
  event(event: BaseEvent2, parents?: BaseShape[], isParentDbClick?: boolean): boolean {
    let {e, point, type} = event

    if (this.beforeEvent(event)) return true

    // 如果在操作中，那么就不要再向下传递事件啦，再向下传递事件，会导致子父冲突
    if (this.enterType !== MouseOptionType.None || this.enter) {
      //把事件消费了，不然父级会使用
      event.stopPropagation()
      this.emit(event, parents)
      return true
    }
    let cu = CanvasUtil2.getInstance()
    if (this._isInShape(point, cu, parents?.[parents?.length - 1])) {
      // this.log('in:' + cu.inShape?.conf?.name)
      if (
        //如果是容器，并且裁剪了、或者父级不裁剪
        (this.conf.clip && this.conf.type === ShapeType.FRAME)
        || !this.parent?.conf.clip
      ) {
        cu.setInShape(this, parents)
      }
      if (isParentDbClick) {
        //这需要mousedown把图形选中，和链设置好
        this._mousedown(event, parents)
        //手动重置一个enter，不然会跟手
        this._mouseup(event, parents)
      } else {
        if (this.canNext(cu)) {
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].event(event, parents?.concat([this]))
            //如果事件被子组件消费了，就不往下执行了
            if (event.capture) return true
          }
        }
        //顺序不能反，先消费事件。因为emit里面可能会恢复事件。
        event.stopPropagation()
        this.emit(event, parents)
      }
      return true
    } else {
      // this.log('noin')
      if (this.status === ShapeStatus.Hover) this.status = ShapeStatus.Normal
      if (this.isSelectHover) this.isSelectHover = false
      cu.setInShapeNull(this)
      if (this.conf.clip) {
        //如果裁剪，自己已经不在容器内。那么要把子组件状态重置（适用于，子组件有一半在父组件外面的情况）
        this.children.map(item => {
          if (item.status === ShapeStatus.Hover) item.status = ShapeStatus.Normal
        })
        //状态等于选中的子组件。还是要向下传递事件，以触发对应4个角的hover
        for (let i = 0; i < this.children.length; i++) {
          if (this.children[i].status === ShapeStatus.Select) {
            this.children[i].event(event, parents?.concat([this]))
            if (event.capture) break
          }
        }
      } else {
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].event(event, parents?.concat([this]))
          if (event.capture) break
        }
      }
      return false
    }
  }

  emit(event: BaseEvent2, p: BaseShape[] = []) {
    // @ts-ignore
    this['_' + event.type]?.(event, p)
  }

  _dblclick(event: BaseEvent2, parents: BaseShape[] = []) {
    console.log('on-dblclick',)
    if (this.onDbClick(event, parents)) return
  }

  _mousedown(event: BaseEvent2, parents: BaseShape[] = []) {
    // console.log('mousedown', this.conf.name, this.enterType, this.hoverType)
    EventBus.emit(EventMapTypes.onMouseDown, this)

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

    if (this.onMouseDown(event, parents)) return

    if (this.status === ShapeStatus.Edit) {
      return
    }

    this.enterType = this.hoverType
    let {layout: {w, h,}, absolute, center, realRotation, flipHorizontal, flipVertical} = this.conf
    //按住那条线0度时的中间点
    let handLineZeroDegreesCenterPoint
    let w2 = w / 2
    let h2 = h / 2
    switch (this.hoverType) {
      case MouseOptionType.Left:
        // console.log('Left')
        handLineZeroDegreesCenterPoint = {x: center.x + (flipHorizontal ? w2 : -w2), y: center.y}
        //根据当前角度，转回来。得到的点就是当前鼠标按住那条边当前角度的中间点，非鼠标点
        this.handLineCenterPoint = getRotatedPoint(handLineZeroDegreesCenterPoint, center, realRotation)
        //翻转得到对面的点
        this.diagonal = helper.reversePoint(this.handLineCenterPoint, center)
        return
      case MouseOptionType.Right:
        // console.log('Right')
        /** 这里的x的值与Right的计算相反*/
        handLineZeroDegreesCenterPoint = {x: center.x + (flipHorizontal ? -w2 : w2), y: center.y}
        this.handLineCenterPoint = getRotatedPoint(handLineZeroDegreesCenterPoint, center, realRotation)
        this.diagonal = helper.reversePoint(this.handLineCenterPoint, center)
        return
      case MouseOptionType.Top:
        handLineZeroDegreesCenterPoint = {x: center.x, y: center.y + (flipVertical ? h2 : -h2)}
        this.handLineCenterPoint = getRotatedPoint(handLineZeroDegreesCenterPoint, center, realRotation)
        this.diagonal = helper.reversePoint(this.handLineCenterPoint, center)
        return
      case MouseOptionType.Bottom:
        /** 这里的y的值与Top的计算相反*/
        handLineZeroDegreesCenterPoint = {x: center.x, y: center.y + (flipVertical ? -h2 : h2)}
        this.handLineCenterPoint = getRotatedPoint(handLineZeroDegreesCenterPoint, center, realRotation)
        this.diagonal = helper.reversePoint(this.handLineCenterPoint, center)
        return
      case MouseOptionType.TopLeft:
        this.handLineCenterPoint = absolute
        this.diagonal = helper.reversePoint(this.handLineCenterPoint, center)
        return
      case MouseOptionType.TopRight:
      case MouseOptionType.BottomLeft:
      case MouseOptionType.BottomRight:
      case MouseOptionType.TopLeftRotation:
      case MouseOptionType.TopRightRotation:
      case MouseOptionType.BottomLeftRotation:
      case MouseOptionType.BottomRightRotation:
    }


    //默认选中以及拖动
    this.enter = true
    if (this.status === ShapeStatus.Select) return
    this.status = ShapeStatus.Select
    this.isSelectHover = true
    this.isCapture = true
    //如果当前选中的图形不是自己，那么把那个图形设为未选中
    cu.setSelectShape(this, parents)
  }

  _mousemove(event: BaseEvent2, parents: BaseShape[] = []) {
    // console.log('mousemove', this.conf.name, this.enterType, this.hoverType)
    if (this.onMouseMove(event, parents)) return
    let {e, point, type} = event

    //编辑模式下，不用添加hover样式
    if (this.status !== ShapeStatus.Edit) {
      if (this.status === ShapeStatus.Normal) {
        this.status = ShapeStatus.Hover
        if (this.parent) {
          if (this.parent.status === ShapeStatus.Hover) {
            this.parent.status = ShapeStatus.Normal
          }
        }
      }
      if (this.status === ShapeStatus.Select) {
        this.isSelectHover = true
      }
    }

    switch (this.enterType) {
      case MouseOptionType.Left:
        return this.dragLeft(point)
      case MouseOptionType.Right:
        return this.dragRight(point)
      case MouseOptionType.Top:
        return this.dragTop(point)
      case MouseOptionType.Bottom:
        return this.dragBottom(point)
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
  }

  _mouseup(event: BaseEvent2, parents: BaseShape[] = []) {
    // if (e.capture) return
    // console.log('mouseup')
    if (this.onMouseUp(event, parents)) return
    this.enterType = MouseOptionType.None
    this.enter = false
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

  //拖动左上旋转
  dragTopLeftRotation(point: P) {
    // console.log('dragTopLeftRotation')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let {center, original,} = this.conf
    let current = {x, y}
    // console.log('x-------', x, '          y--------', y)
    let newRotation = helper.getDegree(center, original, current)

    //这里要减去，父级的旋转角度
    let realRotation = (newRotation < 180 ? newRotation : newRotation - 360)
    console.log('旋转角度', realRotation)

    this.conf.realRotation = realRotation.toFixed2()
    this.conf.rotation = (realRotation - (this.parent?.conf?.realRotation ?? 0)).toFixed2()

    // console.log('dragTopLeftRotation', this.conf)
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
    let {realRotation} = conf
    let isReverseW = false
    let isReverseH = false
    let current = {x, y}
    let newCenter = helper.getCenterPoint(current, this.diagonal)
    let zeroDegreeTopLeft = getRotatedPoint(current, newCenter, -realRotation)
    let zeroDegreeBottomRight = getRotatedPoint(this.diagonal, newCenter, -realRotation)

    let newWidth = zeroDegreeBottomRight.x - zeroDegreeTopLeft.x
    let newHeight = zeroDegreeBottomRight.y - zeroDegreeTopLeft.y

    conf.layout.w = Math.abs(newWidth)
    conf.layout.h = Math.abs(newHeight)
    conf.center = newCenter

    if (this.original.flipHorizontal) {
      if (zeroDegreeTopLeft.x < this.diagonal.x) {
        isReverseW = true
      }
    } else {
      if (zeroDegreeTopLeft.x > this.diagonal.x) {
        isReverseW = true
      }
    }
    if (this.original.flipVertical) {
      if (zeroDegreeTopLeft.y < this.diagonal.y) {
        isReverseH = true
      }
    } else {
      if (zeroDegreeTopLeft.y > this.diagonal.y) {
        isReverseH = true
      }
    }
    if (isReverseW) {
      if (conf.flipHorizontal === this.original.flipHorizontal) this.flip(0, 'Diagonal')
    } else {
      if (conf.flipHorizontal !== this.original.flipHorizontal) this.flip(0, 'Diagonal')
    }
    if (isReverseH) {
      if (conf.flipVertical === this.original.flipVertical) this.flip(1, 'Diagonal')
    } else {
      if (conf.flipVertical !== this.original.flipVertical) this.flip(1, 'Diagonal')
    }
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
    let isReverseW = false
    const {realRotation} = conf
    if (realRotation) {
      const current = {x, y}
      const handlePoint = this.handLineCenterPoint
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
      if (this.original.flipVertical) {
        if (currentAngleMovePoint.y < this.diagonal.y) isReverseW = true
      } else {
        if (currentAngleMovePoint.y > this.diagonal.y) isReverseW = true
      }
    } else {
      // conf.layout.y = (y - cu.offsetY)
      // conf.layout.h = this.original.box.bottomY - conf.layout.y
      // conf.center.y = conf.layout.y + conf.layout.h / 2
      let d = y - cu.startY
      if (this.original.flipVertical) d = -d
      conf.layout.h = this.original.layout.h - d
      let d2 = d / 2
      conf.center.y = this.original.center.y + (this.original.flipVertical ? -d2 : d2)
      if (conf.layout.h < 0) {
        isReverseW = true
      }
      conf.layout.h = Math.abs(conf.layout.h)
    }
    if (isReverseW) {
      if (conf.flipVertical === this.original.flipVertical) this.flip(1, 'Diagonal')
    } else {
      if (conf.flipVertical !== this.original.flipVertical) this.flip(1, 'Diagonal')
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.calcChildrenConf()
    cu.render()
  }

  //拖动下边
  dragBottom(point: P) {
    // console.log('拖动下边')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let conf = this.conf
    let isReverseW = false
    const {realRotation} = conf
    if (realRotation) {
      const current = {x, y}
      const handlePoint = this.handLineCenterPoint
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
      if (this.original.flipVertical) {
        if (currentAngleMovePoint.y > this.diagonal.y) isReverseW = true
      } else {
        if (currentAngleMovePoint.y < this.diagonal.y) isReverseW = true
      }
    } else {
      // conf.layout.y = (y - cu.offsetY)
      // conf.layout.h = this.original.box.bottomY - conf.layout.y
      // conf.center.y = conf.layout.y + conf.layout.h / 2
      let d = y - cu.startY
      if (this.original.flipVertical) d = -d
      conf.layout.h = this.original.layout.h + d
      let d2 = d / 2
      conf.center.y = this.original.center.y + (this.original.flipVertical ? -d2 : d2)
      if (conf.layout.h < 0) {
        isReverseW = true
      }
      conf.layout.h = Math.abs(conf.layout.h)
    }
    if (isReverseW) {
      if (conf.flipVertical === this.original.flipVertical) this.flip(1, 'Diagonal')
    } else {
      if (conf.flipVertical !== this.original.flipVertical) this.flip(1, 'Diagonal')
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.calcChildrenConf()
    cu.render()
  }

  //拖动左边，最完整的
  dragLeft(point: P) {
    // console.log('拖动左边')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let conf = this.conf
    const {realRotation} = conf
    let isReverseW = false
    if (realRotation) {
      const current = {x, y}
      const handlePoint = this.handLineCenterPoint
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
      conf.layout.w = newWidth
      conf.center = newCenter
      if (this.original.flipHorizontal) {
        if (currentAngleMovePoint.x < this.diagonal.x) isReverseW = true
      } else {
        if (currentAngleMovePoint.x > this.diagonal.x) isReverseW = true
      }
    } else {
      //dx和dragRight相反
      let d = x - cu.startX
      //如果水平翻转，那么移动距离取反
      if (this.original.flipHorizontal) d = -d
      //原始值，加或减去移动的值
      conf.layout.w = this.original.layout.w - d
      let d2 = d / 2
      conf.center.x = this.original.center.x + (this.original.flipHorizontal ? -d2 : d2)
      //是否要反转w值，因为反向拉动会使w值，越来越小，小于0之后就是负值了
      if (conf.layout.w < 0) {
        isReverseW = true
      }
      //反向拉动会使w为负值，取绝对值
      conf.layout.w = Math.abs(conf.layout.w)
    }
    //如果反向拉伸，图形水平翻转,反之，图形保持和原图形一样的翻转
    if (isReverseW) {
      if (conf.flipHorizontal === this.original.flipHorizontal) this.flip(0, 'Diagonal')
    } else {
      if (conf.flipHorizontal !== this.original.flipHorizontal) this.flip(0, 'Diagonal')
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
    const {realRotation} = conf
    let isReverseW = false

    if (realRotation) {
      const current = {x, y}
      const handlePoint = this.handLineCenterPoint
      const zeroAngleCurrentPoint = getRotatedPoint(current, handlePoint, -realRotation)
      const zeroAngleMovePoint = {x: zeroAngleCurrentPoint.x, y: handlePoint.y}
      const currentAngleMovePoint = getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
      const newWidth = Math.hypot(currentAngleMovePoint.x - this.diagonal.x, currentAngleMovePoint.y - this.diagonal.y)
      const newCenter = {
        x: this.diagonal.x + (currentAngleMovePoint.x - this.diagonal.x) / 2,
        y: this.diagonal.y + (currentAngleMovePoint.y - this.diagonal.y) / 2
      }
      conf.layout.w = newWidth
      conf.center = newCenter
      if (this.original.flipHorizontal) {
        //这里判断和left不同
        if (currentAngleMovePoint.x > this.diagonal.x) isReverseW = true
      } else {
        //这里判断和left不同
        if (currentAngleMovePoint.x < this.diagonal.x) isReverseW = true
      }
    } else {
      let d = x - cu.startX
      if (this.original.flipHorizontal) d = -d
      //这里不同，left是减去dx
      conf.layout.w = this.original.layout.w + d
      let d2 = d / 2
      conf.center.x = this.original.center.x + (this.original.flipHorizontal ? -d2 : d2)
      if (conf.layout.w < 0) {
        isReverseW = true
      }
      conf.layout.w = Math.abs(conf.layout.w)
    }
    if (isReverseW) {
      if (conf.flipHorizontal === this.original.flipHorizontal) this.flip(0, 'Diagonal')
    } else {
      if (conf.flipHorizontal !== this.original.flipHorizontal) this.flip(0, 'Diagonal')
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.calcChildrenConf()
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

  flip(type: number, flipType = 'Symmetric') {
    let conf = this.conf
    if (type === 0) {
      conf.flipHorizontal = !conf.flipHorizontal
    } else {
      conf.flipVertical = !conf.flipVertical
    }
    if (flipType === 'Symmetric') {
      let {realRotation,} = conf
      conf.realRotation = -realRotation
      conf.rotation = (conf.realRotation - (this.parent?.conf?.realRotation ?? 0)).toFixed2(2)
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    if (flipType === 'Symmetric') {
      this.childrenSymmetricFlip(type, this.conf.center)
      CanvasUtil2.getInstance().render()
    } else {
      this.childrenDiagonalFlip(type, this.conf)
    }
  }

  //对称翻转
  childrenSymmetricFlip(type: number, center: P) {
    this.children.forEach(item => {
      item.conf.realRotation = -item.conf.realRotation
      if (type === 0) {
        item.conf.center = helper.horizontalReversePoint(item.conf.center, center)
        item.conf.flipHorizontal = !item.conf.flipHorizontal
      } else {
        item.conf.center = helper.verticalReversePoint(item.conf.center, center)
        item.conf.flipVertical = !item.conf.flipVertical
      }
      item.conf = helper.calcConf(item.conf, item.parent?.conf)
      item.childrenSymmetricFlip(type, center)
    })
  }

  //对角翻转。即拉伸一边到另一边。导致的翻转
  childrenDiagonalFlip(type: number, pConf: BaseConfig) {
    this.children.forEach(item => {
      if (type === 0) {
        // 这里不能用翻转来计算center,翻转后的relativeCenter后有一些偏差
        // item.conf.center = helper.horizontalReversePoint(item.conf.center, pConf.center)
        // item.conf.center = helper.getRotatedPoint(item.conf.center, pConf.center, 2 * pConf.realRotation)
        let pOriginal = pConf.original
        let center = {x: pOriginal.x + -item.conf.relativeCenter.x, y: pOriginal.y + item.conf.relativeCenter.y}
        item.conf.center = getRotatedPoint(center, pConf.center, pConf.realRotation)
        item.conf.flipHorizontal = !item.conf.flipHorizontal
      } else {
        let pOriginal = pConf.original
        let center = {x: pOriginal.x + item.conf.relativeCenter.x, y: pOriginal.y + -item.conf.relativeCenter.y}
        item.conf.center = getRotatedPoint(center, pConf.center, pConf.realRotation)
        item.conf.flipVertical = !item.conf.flipVertical
      }
      item.conf = helper.calcConf(item.conf, item.parent?.conf)
      item.childrenDiagonalFlip(type, item.conf)
    })
  }

  calcNewCenterAndWidthAndHeight() {
    // return
    if (!this.conf.isCustom) return
    let center = this.conf.center
    let temp: any = this.conf.lineShapes.reduce((previousValue: any, currentValue) => {
      previousValue.push({
        maxX: Math.max(...currentValue.map(p => center.x + p.center.x)),
        minX: Math.min(...currentValue.map(p => center.x + p.center.x)),
        maxY: Math.max(...currentValue.map(p => center.y + p.center.y)),
        minY: Math.min(...currentValue.map(p => center.y + p.center.y)),
      })
      return previousValue
    }, [])
    let maxX = Math.max(...temp.map((a: any) => a.maxX))
    let minX = Math.max(...temp.map((a: any) => a.minX))
    let maxY = Math.max(...temp.map((a: any) => a.maxY))
    let minY = Math.max(...temp.map((a: any) => a.minY))

    let newWidth = maxX - minX
    let newHeight = maxY - minY
    let newCenter = {
      x: minX + newWidth / 2,
      y: minY + newHeight / 2,
    }

    //因为lineShapes的点的值，是相对于center的。所以还需要修正。新center减去老center得到偏移量
    //点的值再减去偏移值，就是以新center为相对值的点值
    let dx = newCenter.x - center.x
    let dy = newCenter.y - center.y
    this.conf.lineShapes.map(line => {
      line.map(p => {
        p.center.x -= dx
        p.center.y -= dy
      })
    })
    this.conf.center = newCenter
    this.conf.layout.w = newWidth
    this.conf.layout.h = newHeight
    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    console.log('newCenter', newCenter)
  }
}