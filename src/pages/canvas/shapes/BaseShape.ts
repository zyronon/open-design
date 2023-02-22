import {BaseEvent2, MouseOptionType, P, ShapeProps, ShapeStatus, ShapeType} from "../utils/type"
import CanvasUtil2 from "../CanvasUtil2"
import {cloneDeep, merge} from "lodash"
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
  hoverType: MouseOptionType = MouseOptionType.None
  enterType: MouseOptionType = MouseOptionType.None
  conf: BaseConfig
  children: BaseShape[] = []
  _status: ShapeStatus = ShapeStatus.Normal
  isSelectHover: boolean = false
  isCapture: boolean = true//是否捕获事件，为true不会再往下传递事件
  enter: boolean = false
  startX: number = 0
  startY: number = 0
  original: BaseConfig
  diagonal: P = {x: 0, y: 0}//对面的点（和handlePoint相反的点），如果handlePoint是中间点，那么这个也是中间点
  handlePoint: P = {x: 0, y: 0}//鼠标按住那条边的中间点（当前角度），非鼠标点
  parent?: BaseShape

  get status() {
    return this._status
  }

  set status(val) {
    this._status = val
    CanvasUtil2.getInstance().render()
  }

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

  shapeRender(ctx: CanvasRenderingContext2D, parent?: BaseConfig) {
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.save()
    let {x, y} = draw.calcPosition(ctx, this.conf, this.original,)
    this.render(ctx, {x, y}, parent,)
    // ctx.globalCompositeOperation = 'source-atop'
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
      shape.shapeRender(ctx, this.conf)
    }
    ctx.restore()

    if (this.status !== ShapeStatus.Normal) {
      CanvasUtil2.getInstance().waitRenderOtherStatusFunc.push(() => this.renderOtherStatus(ctx, {x, y}))
    }
    // this.renderOtherStatus(ctx, {x, y})
  }

  renderOtherStatus(ctx: CanvasRenderingContext2D, {x, y}: any) {
    ctx.save()
    draw.calcPosition(ctx, this.conf, this.original,)
    let newConf = merge(cloneDeep(this.conf), {layout: {x, y}})
    if (this.status === ShapeStatus.Hover) {
      draw.hover(ctx, newConf)
    }
    if (this.status === ShapeStatus.Select) {
      draw.selected(ctx, newConf)
      if (this.isSelectHover) {
        this.renderSelectedHover(ctx, newConf)
      }
    }
    if (this.status === ShapeStatus.Edit) {
      this.renderEdit(ctx, newConf)
    }
    ctx.restore()
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

    if (this.status === ShapeStatus.Select) {
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
      this.hoverType = MouseOptionType.None
    }
    return this.isHoverIn({x, y}, cu)
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

    // 如果在操作中，那么就不要再向下传递事件啦，再向下传递事件，会导致子父冲突
    if (this.enterType !== MouseOptionType.None || this.enter) {
      //把事件消费了，不然父级会使用
      event.stopPropagation()
      this.emit(event, parents)
      return true
    }
    let cu = CanvasUtil2.getInstance()
    if (this.shapeIsIn(point, cu, parents?.[parents?.length - 1])) {
      this.log('in:' + cu.inShape?.conf?.name)
      if (
        //如果是容器，并且裁剪了、或者父级不裁剪
        (this.conf.clip && this.conf.type === ShapeType.FRAME)
        || !this.parent?.conf.clip
      ) {
        cu.setInShape(this, parents)
      }
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
    } else {
      this.log('noin')
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

    if (this.status === ShapeStatus.Edit) {
      this.status = ShapeStatus.Select
    } else {
      this.status = ShapeStatus.Normal
    }
    let cu = CanvasUtil2.getInstance()
    this.status = ShapeStatus.Select
    cu.editShape = this
    //节省一次刷新，放上面也可以
    cu.render()
  }

  mousedown(event: BaseEvent2, parents: BaseShape[] = []) {
    // console.log('mousedown', this.conf.name, this.enterType, this.hoverType)
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

    if (this.status === ShapeStatus.Edit) {
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
    if (this.status === ShapeStatus.Select) return
    this.status = ShapeStatus.Select
    this.isCapture = true
    //如果当前选中的图形不是自己，那么把那个图形设为未选中
    cu.setSelectShape(this, parents)
  }

  mousemove(event: BaseEvent2, parents: BaseShape[] = []) {
    // console.log('mousemove', this.conf.name, this.enterType, this.hoverType)
    if (this.childMouseMove(event, parents)) return
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
    let {center, original,} = this.conf
    let current = {x, y}
    // console.log('x-------', x, '          y--------', y)
    let newRotation = getAngle2(center, original, current)

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
    let current = {x, y}
    let newCenter = getCenterPoint(current, this.diagonal)
    let zeroDegreeTopLeft = getRotatedPoint(current, newCenter, -realRotation)
    let zeroDegreeBottomRight = getRotatedPoint(this.diagonal, newCenter, -realRotation)

    let newWidth = zeroDegreeBottomRight.x - zeroDegreeTopLeft.x
    let newHeight = zeroDegreeBottomRight.y - zeroDegreeTopLeft.y

    conf.layout.w = Math.abs(newWidth)
    conf.layout.h = Math.abs(newHeight)
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
    console.log('拖动左边')
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
        if (conf.flipHorizontal === this.original.flipHorizontal) {
          this.flip(0, false)
        }
      } else {
        if (conf.flipHorizontal !== this.original.flipHorizontal) {
          this.flip(0, false)
        }
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

  flip(type: number, isCalcRotation: boolean = true) {
    let conf = this.conf

    if (isCalcRotation) {
      let {realRotation,} = conf
      conf.realRotation = -realRotation
      conf.rotation = (conf.realRotation - (this.parent?.conf?.realRotation ?? 0)).toFixed2(2)
    }
    if (type === 0) {
      conf.flipHorizontal = !conf.flipHorizontal
    } else {
      conf.flipVertical = !conf.flipVertical
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.changeChildrenFlip(type, this.conf.center)
    CanvasUtil2.getInstance().render()
  }

  changeChildrenFlip(type: number, center: P) {
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
      item.changeChildrenFlip(type, center)
    })
  }
}
