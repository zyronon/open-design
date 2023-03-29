import {
  BaseEvent2,
  BezierPoint,
  BezierPointType,
  CurrentOperationInfo,
  EditModeType,
  EditType,
  getP2,
  LinePath,
  LineShape,
  LineType,
  MouseOptionType,
  P,
  P2,
  PointInfo,
  PointType,
  ShapeProps,
  ShapeStatus,
  ShapeType
} from "../types/type"
import CanvasUtil2 from "../engine/CanvasUtil2"
import {cloneDeep, merge} from "lodash"
import {getShapeFromConfig} from "../utils/common"
import EventBus from "../utils/event-bus"
import {EventMapTypes} from "../../../pages/canvas20221111/type"
import {BaseConfig, Rect} from "../config/BaseConfig"
import helper from "../utils/helper"
import draw from "../utils/draw"
import {defaultConfig} from "../utils/constant"
import {v4 as uuid} from "uuid"
import {Math2} from "../utils/math"

export abstract class BaseShape {
  hoverType: MouseOptionType = MouseOptionType.None
  enterType: MouseOptionType = MouseOptionType.None
  conf: BaseConfig
  children: BaseShape[] = []
  _status: ShapeStatus = ShapeStatus.Normal
  _isSelectHover: boolean = false
  isCapture: boolean = true//是否捕获事件，为true不会再往下传递事件
  mouseDown: boolean = false
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
    let cu = CanvasUtil2.getInstance()
    if (val !== this._status) {
      if (this._status === ShapeStatus.Edit) {
        this.calcNewCenterAndWidthAndHeight()
        this.editStartPointInfo = cloneDeep(this.defaultCurrentOperationInfo)
      }
      if (val === ShapeStatus.Select) {
        //TODO 会导致子组件选中后，再选中父组件时，无法取消子组件
        // cu.selectedShape = this
        cu.editShape = undefined
        cu.mode = ShapeType.SELECT
      }
      if (val === ShapeStatus.Edit) {
        if (!this.conf.isCustom) {
          this.conf.lineShapes = this.getCustomPoint()
        }
        cu.editShape = this
        cu.mode = ShapeType.EDIT
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

  //获取自定义的点
  abstract getCustomPoint(): LineShape[]

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
    <div>
        lineIndex:${this.editStartPointInfo.lineIndex}
</div>
    <div>
        pointIndex:${this.editStartPointInfo.pointIndex}
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
  canTransmitChildren(cu: CanvasUtil2): boolean {
    if (this.hoverType !== MouseOptionType.None) return false
    if (this.conf.type === ShapeType.FRAME) {
      if (this.children.length && !this.parent) {
        return true
      }
    }
    return !this.isCapture || !cu.isDesignMode()
  }

  defaultCurrentOperationInfo: CurrentOperationInfo = {
    type: undefined,
    lineIndex: -1,
    pointIndex: -1,
    cpIndex: -1
  }
  hoverLineCenterPoint: P = {x: 0, y: 0}
  editStartPointInfo: CurrentOperationInfo = cloneDeep(this.defaultCurrentOperationInfo)
  editHover: CurrentOperationInfo = cloneDeep(this.defaultCurrentOperationInfo)
  editEnter: CurrentOperationInfo = cloneDeep(this.defaultCurrentOperationInfo)

  checkMousePointOnEditStatus(point: P): CurrentOperationInfo {
    let {center, lineShapes} = this.conf
    let fixMousePoint = {
      x: point.x - center.x,
      y: point.y - center.y
    }
    for (let lineIndex = 0; lineIndex < lineShapes.length; lineIndex++) {
      let lineShape = lineShapes[lineIndex]
      for (let pointIndex = 0; pointIndex < lineShape.points.length; pointIndex++) {
        let currentPoint = this.getPoint(lineShape.points[pointIndex])
        if (Math2.isInPoint(fixMousePoint, currentPoint.center, 4)) {
          console.log('在点上')
          return {type: EditType.Point, lineIndex, pointIndex, cpIndex: -1}
        }
        let previousPoint: BezierPoint
        if (pointIndex === 0) {
          if (lineShape.close) {
            previousPoint = this.getPoint(lineShape.points[lineShape.points.length - 1])
          } else {
            continue
          }
        } else {
          previousPoint = this.getPoint(lineShape.points[pointIndex - 1])
        }
        let line: any = [previousPoint.center, currentPoint.center]
        if (Math2.isInLine(fixMousePoint, line)) {
          console.log('在线上')
          let returnData = {
            type: EditType.Line,
            lineIndex,
            pointIndex,
            lineCenterPoint: Math2.getCenterPoint(previousPoint.center, currentPoint.center),
            cpIndex: -1
          }
          if (Math2.isInPoint(fixMousePoint, this.hoverLineCenterPoint, 4)) {
            console.log('hover在线的中点上')
            returnData.type = EditType.CenterPoint
          }
          return returnData
        }
      }
    }
    let {lineIndex, pointIndex} = this.editStartPointInfo
    if (pointIndex !== -1) {
      let waitCheckPoints: any[] = []
      let line = lineShapes[lineIndex]
      let point = this.getPoint(line.points[pointIndex])
      if (point.cp1.use) waitCheckPoints.push({pointIndex, index: 1, point: point.cp1})
      if (point.cp2.use) waitCheckPoints.push({pointIndex, index: 2, point: point.cp2})
      if (pointIndex === 0) {
        point = this.getPoint(line.points[line.points.length - 1])
        if (point.cp1.use) waitCheckPoints.push({pointIndex: line.points.length - 1, index: 1, point: point.cp1})
        if (point.cp2.use) waitCheckPoints.push({pointIndex: line.points.length - 1, index: 2, point: point.cp2})
      } else {
        point = this.getPoint(line.points[pointIndex - 1])
        if (point.cp1.use) waitCheckPoints.push({pointIndex: pointIndex - 1, index: 1, point: point.cp1})
        if (point.cp2.use) waitCheckPoints.push({pointIndex: pointIndex - 1, index: 2, point: point.cp2})
      }
      if (pointIndex === line.points.length - 1) {
        point = this.getPoint(line.points[0])
        if (point.cp1.use) waitCheckPoints.push({pointIndex: 0, index: 1, point: point.cp1})
        if (point.cp2.use) waitCheckPoints.push({pointIndex: 0, index: 2, point: point.cp2})
      } else {
        point = this.getPoint(line.points[pointIndex + 1])
        if (point.cp1.use) waitCheckPoints.push({pointIndex: pointIndex + 1, index: 1, point: point.cp1})
        if (point.cp2.use) waitCheckPoints.push({pointIndex: pointIndex + 1, index: 2, point: point.cp2})
      }
      for (let i = 0; i < waitCheckPoints.length; i++) {
        let item = waitCheckPoints[i]
        if (Math2.isInPoint(fixMousePoint, item.point, 4)) {
          console.log('在cp点上')
          return {type: EditType.ControlPoint, lineIndex, pointIndex: item.pointIndex, cpIndex: item.index}
        }
      }

    }
    return {type: undefined, lineIndex: -1, pointIndex: -1, cpIndex: -1}
  }

  _isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
    //如果操作中，那么永远返回ture，保持事件一直直接传递到当前图形上
    if (this.mouseDown || this.enterType !== MouseOptionType.None) return true
    if (this.beforeIsInShape()) return true

    let {realRotation, flipHorizontal, flipVertical, center} = this.conf

    //反转到0度，好判断
    if (realRotation) {
      mousePoint = Math2.getRotatedPoint(mousePoint, center, -realRotation)
    }
    let {x, y} = mousePoint
    if (this.status === ShapeStatus.Select) {
      const {leftX, rightX, topY, bottomY,} = this.conf.box
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
    return this.isInShape(mousePoint, cu)
  }

  render(ctx: CanvasRenderingContext2D, parent?: BaseConfig) {
    ctx.save()
    let {x, y} = draw.calcPosition(ctx, this.conf)
    let newLayout = {...this.conf.layout, x, y}
    // let newLayout = {...this.conf.layout, }
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
   * @param from
   * */
  event(event: BaseEvent2, parents?: BaseShape[], isParentDbClick?: boolean, from?: string): boolean {
    let {e, point, type} = event
    // if (type !== 'mousemove') {
    // if (type === 'dblclick') {
    //   console.log(this.conf.name, event.type, from)
    // }
    // console.log(this.conf.name, event.type, from)

    if (this.beforeEvent(event)) return true

    // 下面几种特定情况，那么就不要再向下传递事件啦，再向下传递事件，会导致子父冲突
    if (this.enterType !== MouseOptionType.None || this.mouseDown || this.status === ShapeStatus.Edit) {
      //把事件消费了，不然父级会使用
      event.stopPropagation()
      this.emit(event, parents)
      return true
    }

    let cu = CanvasUtil2.getInstance()

    //只有在状态是普通或者hover时，需要判断父级是否裁剪。因为选中和编辑时，所有事件都能直接传递到图形上
    if (this.status == ShapeStatus.Normal || this.status === ShapeStatus.Hover) {
      //如果有父级，并且父级还裁剪了，那么先判断是否在父级里面
      if (!parents?.filter(item => item.conf.clip).every(item => item._isInShape(point, cu))) {
        if (this.status === ShapeStatus.Hover) this.status = ShapeStatus.Normal
        if (this.isSelectHover) this.isSelectHover = false
        cu.setHoverShapeIsNull(this)
        return false
      }
    }

    if (this._isInShape(point, cu)) {
      // this.log('in:' + cu.inShape?.conf?.name)
      cu.setHoverShape(this, parents)
      if (isParentDbClick) {
        //这需要mousedown把图形选中，和链设置好
        this._mousedown(event, parents)
        //手动重置一个enter，不然会跟手
        this._mouseup(event, parents)
      } else {
        if (this.canTransmitChildren(cu)) {
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].event(event, parents?.concat([this]), isParentDbClick, from)
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
      cu.setHoverShapeIsNull(this)
      if (this.conf.clip) {
        //状态等于选中的子组件。还是要向下传递事件，以触发对应4个角的hover
        for (let i = 0; i < this.children.length; i++) {
          if (this.children[i].status === ShapeStatus.Select) {
            this.children[i].event(event, parents?.concat([this]), isParentDbClick, from)
            if (event.capture) break
          }
        }
      } else {
        //容器未裁剪，子组件露了一半在外面，这种情况，子组件也需要事件
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].event(event, parents?.concat([this]), isParentDbClick, from)
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
    // console.log('on-dblclick',)
    console.log('base-dblclick', this.editStartPointInfo, this.editHover)
    if (this.onDbClick(event, parents)) return
    if (this.status === ShapeStatus.Edit) {
      let cu = CanvasUtil2.getInstance()
      const {lineIndex, pointIndex} = this.editStartPointInfo
      if (pointIndex !== -1) {
        let line = this.conf.lineShapes[lineIndex]
        let currentPoint = line.points[pointIndex]
        if (currentPoint.point!.type !== BezierPointType.RightAngle) {
          currentPoint.point!.cp1.use = false
          currentPoint.point!.cp2.use = false
          currentPoint.point!.type = BezierPointType.RightAngle
          cu.render()
          return
        }
        let previousPointInfo: PointInfo
        let nextPointInfo: PointInfo
        if (pointIndex === 0 && line.close) {
          previousPointInfo = line.points[line.points.length - 1]
        } else {
          previousPointInfo = line.points[pointIndex - 1]
        }
        if (pointIndex === line.points.length - 1 && line.close) {
          nextPointInfo = line.points[0]
        } else {
          nextPointInfo = line.points[pointIndex + 1]
        }
        console.log(previousPointInfo, nextPointInfo)
        let {l, r} = Math2.getTargetPointBezierControlPoint(
          previousPointInfo.point?.center!,
          currentPoint.point?.center!,
          nextPointInfo.point?.center!)
        currentPoint.point!.cp1 = {...getP2(true), ...l}
        currentPoint.point!.cp2 = {...getP2(true), ...r}
        currentPoint.point!.type = BezierPointType.MirrorAngleAndLength
        cu.render()
      } else {
        this.status = ShapeStatus.Select
      }
    } else {
      this.status = ShapeStatus.Edit
    }
  }

  _mousedown(event: BaseEvent2, parents: BaseShape[] = []) {
    this.log('base-mousedown')
    // console.log('mousedown', this.conf.name, this.enterType, this.hoverType)
    EventBus.emit(EventMapTypes.onMouseDown, this)
    if (this.onMouseDown(event, parents)) return

    let cu = CanvasUtil2.getInstance()
    this.original = cloneDeep(this.conf)
    cu.mouseStart = cloneDeep(event.point)
    cu.fixMouseStart = cloneDeep(event.point)
    let {center, realRotation,} = this.conf
    if (realRotation) {
      cu.fixMouseStart = Math2.getRotatedPoint(cu.fixMouseStart, center, -realRotation)
    }

    if (this.status === ShapeStatus.Normal) {

    }

    if (this.status === ShapeStatus.Hover) {
      this.mouseDown = true
      this.status = ShapeStatus.Select
      this.isSelectHover = true
      this.isCapture = true
      cu.setSelectShape(this, parents)
      return
    }

    if (this.status === ShapeStatus.Select) {
      this.mouseDown = true
      this.children.map(shape => {
        shape.original = cloneDeep(shape.conf)
      })

      this.enterType = this.hoverType
      let {layout: {w, h,}, absolute, flipHorizontal, flipVertical} = this.conf
      //按住那条线0度时的中间点
      let handLineZeroDegreesCenterPoint
      let w2 = w / 2
      let h2 = h / 2
      switch (this.hoverType) {
        case MouseOptionType.Left:
          // console.log('Left')
          handLineZeroDegreesCenterPoint = {x: center.x + (flipHorizontal ? w2 : -w2), y: center.y}
          //根据当前角度，转回来。得到的点就是当前鼠标按住那条边当前角度的中间点，非鼠标点
          this.handLineCenterPoint = Math2.getRotatedPoint(handLineZeroDegreesCenterPoint, center, realRotation)
          //翻转得到对面的点
          this.diagonal = helper.reversePoint(this.handLineCenterPoint, center)
          return
        case MouseOptionType.Right:
          // console.log('Right')
          /** 这里的x的值与Right的计算相反*/
          handLineZeroDegreesCenterPoint = {x: center.x + (flipHorizontal ? -w2 : w2), y: center.y}
          this.handLineCenterPoint = Math2.getRotatedPoint(handLineZeroDegreesCenterPoint, center, realRotation)
          this.diagonal = helper.reversePoint(this.handLineCenterPoint, center)
          return
        case MouseOptionType.Top:
          handLineZeroDegreesCenterPoint = {x: center.x, y: center.y + (flipVertical ? h2 : -h2)}
          this.handLineCenterPoint = Math2.getRotatedPoint(handLineZeroDegreesCenterPoint, center, realRotation)
          this.diagonal = helper.reversePoint(this.handLineCenterPoint, center)
          return
        case MouseOptionType.Bottom:
          /** 这里的y的值与Top的计算相反*/
          handLineZeroDegreesCenterPoint = {x: center.x, y: center.y + (flipVertical ? -h2 : h2)}
          this.handLineCenterPoint = Math2.getRotatedPoint(handLineZeroDegreesCenterPoint, center, realRotation)
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
      return
    }

    if (this.status === ShapeStatus.Edit) {
      if (cu.editModeType === EditModeType.Select) {
        let result = this.checkMousePointOnEditStatus(event.point)
        const {lineIndex, pointIndex, cpIndex, type} = result
        //如果hover在点上，先处理hover
        if (pointIndex !== -1) {
          this.conf.isCustom = true
          //图省事儿，直接把editHover设为默认值。不然鼠标移动点或线时。还会渲染hoverLineCenterPoint
          //但hoverLineCenterPoint的点又不正确
          this.editHover = {
            type: undefined,
            lineIndex: -1,
            pointIndex: -1,
            cpIndex: -1
          }
          this.editEnter = cloneDeep(result)

          if (type === EditType.CenterPoint) {
            this.conf.lineShapes[lineIndex].points.splice(pointIndex, 0, {
              type: PointType.Single,
              point: {
                id: uuid(),
                cp1: getP2(),
                center: {...getP2(true), ...this.hoverLineCenterPoint},
                cp2: getP2(),
                type: BezierPointType.RightAngle
              }
            })
            //这里新增了一个点，但是老配置如果不更新。后面移动时就会找错点
            this.original = cloneDeep(this.conf)
            cu.render()
          }

          if (this.editStartPointInfo.lineIndex !== lineIndex
            || this.editStartPointInfo.pointIndex !== pointIndex
            || this.editStartPointInfo.cpIndex !== cpIndex
          ) {
            this.editStartPointInfo = result
            cu.render()
          }
          return
        }

        //能走到这，说明未选中任何点。那么判断是否已选中，选中就给取消掉
        if (this.editStartPointInfo.pointIndex !== -1) {
          this.editStartPointInfo = cloneDeep(this.defaultCurrentOperationInfo)
          cu.render()
        }
      }

      if (cu.editModeType === EditModeType.Edit) {
        this.mouseDown = true
        let fixMousePoint = {
          x: event.point.x - center.x,
          y: event.point.y - center.y
        }
        let endPoint = helper.getDefaultBezierPoint(fixMousePoint)

        let {lineIndex, pointIndex} = this.editStartPointInfo
        if (pointIndex === -1) {
          //新增一条线
          this.conf.isCustom = true
          this.conf.lineShapes.push({
            close: false,
            points: [{type: PointType.Single, point: endPoint}]
          })
          this.editStartPointInfo.lineIndex = this.conf.lineShapes.length - 1
          this.editStartPointInfo.pointIndex = 0
        } else {
          let line = this.conf.lineShapes[lineIndex]
          if (line) {
            let pointInfo = line.points[pointIndex]
            //是否新增线段并将起点设为共同点
            let isChangeCommonAddNewLine = false
            //起点在线段的最后一位
            if (line.points.length - 1 === pointIndex) {
              //如果线段闭合，那么需要将起点设为共同点，并新增一条线
              if (line.close) {
                isChangeCommonAddNewLine = true
              } else {
                line.points.push({type: PointType.Single, point: endPoint})
                this.editStartPointInfo.pointIndex += 1
              }
            } else {
              isChangeCommonAddNewLine = true
            }

            if (isChangeCommonAddNewLine) {
              this.conf.lineShapes.push({
                close: false,
                points: [
                  {type: PointType.Common, targetId: pointInfo.point!.id},
                  {type: PointType.Single, point: endPoint},
                ]
              })
              if (pointInfo.type === PointType.Single) {
                this.conf.commonPoints.push(pointInfo.point!)
                this.conf.lineShapes[lineIndex].points[pointIndex].type = PointType.Common
                this.conf.lineShapes[lineIndex].points[pointIndex].targetId = pointInfo.point!.id
                this.conf.lineShapes[lineIndex].points[pointIndex].point = undefined
              }
              this.editStartPointInfo.lineIndex += 1
              this.editStartPointInfo.pointIndex = 1
            }
            this.conf.isCustom = true
          }
        }
        CanvasUtil2.getInstance().render()
      }
      return
    }
  }

  _mousemove(event: BaseEvent2, parents: BaseShape[] = []) {
    // console.log('mousemove', this.conf.name, this.enterType, this.hoverType)
    if (this.onMouseMove(event, parents)) return

    if (this.status === ShapeStatus.Normal) {
      this.status = ShapeStatus.Hover
      if (this.parent) {
        if (this.parent.status === ShapeStatus.Hover) {
          this.parent.status = ShapeStatus.Normal
        }
      }
    }

    if (this.status === ShapeStatus.Hover) {
    }

    if (this.status === ShapeStatus.Select) {
      this.isSelectHover = true
      let {e, point, type} = event
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
      if (this.mouseDown) {
        return this.move(point)
      }
    }

    if (this.status === ShapeStatus.Edit) {
      let cu = CanvasUtil2.getInstance()
      let {center, realRotation} = this.conf
      if (cu.editModeType === EditModeType.Select) {
        const {lineIndex, pointIndex, cpIndex, type} = this.editEnter
        if (pointIndex === -1) {
          let result = this.checkMousePointOnEditStatus(event.point)
          //用于判断是否与之前保存的值不同，仅在不同时才重绘
          if (this.editHover.pointIndex !== result.pointIndex) {
            if (result.type === EditType.Line) {
              this.hoverLineCenterPoint = result.lineCenterPoint!
            }
            if (result.type === EditType.ControlPoint) {
              this.editHover.cpIndex = result.cpIndex
            }
            this.editHover.type = result.type
            this.editHover.pointIndex = result.pointIndex
            this.editHover.lineIndex = result.lineIndex
            document.body.style.cursor = "pointer"
            cu.render()
            return true
          }
          //hover时，消费事件。不然会把cursor = "default"
          if (result.pointIndex !== -1) {
            document.body.style.cursor = "pointer"
            return true
          }
          document.body.style.cursor = "default"
        } else {
          //TODO 是否可以统一反转？
          //反转到0度，好判断
          if (realRotation) {
            event.point = Math2.getRotatedPoint(event.point, center, -realRotation)
          }

          let {x, y} = event.point
          let dx = x - cu.fixMouseStart.x
          let dy = y - cu.fixMouseStart.y

          if (type === EditType.ControlPoint) {
            let point = this.getPoint(this.conf.lineShapes[lineIndex].points[pointIndex])
            let oldPoint = this.getPoint(this.original.lineShapes[lineIndex].points[pointIndex], this.original)
            if (cpIndex === 1) {
              point.cp1.x = oldPoint.cp1.x + dx
              point.cp1.y = oldPoint.cp1.y + dy
              if (point.type === BezierPointType.MirrorAngleAndLength) {
                let p = Math2.getRotatedPoint(point.cp1, point.center, 180)
                point.cp2.x = p.x
                point.cp2.y = p.y
              }
              if (point.type === BezierPointType.MirrorAngle) {
                let moveDegree = Math2.getDegree(point.center, oldPoint.cp1, point.cp1)
                let p = Math2.getRotatedPoint(oldPoint.cp2, point.center, moveDegree)
                point.cp2.x = p.x
                point.cp2.y = p.y
              }
            }
            if (cpIndex === 2) {
              point.cp2.x = oldPoint.cp2.x + dx
              point.cp2.y = oldPoint.cp2.y + dy
              if (point.type === BezierPointType.MirrorAngleAndLength) {
                let p = Math2.getRotatedPoint(point.cp2, point.center, 180)
                point.cp1.x = p.x
                point.cp1.y = p.y
              }
              if (point.type === BezierPointType.MirrorAngle) {
                let moveDegree = Math2.getDegree(point.center, oldPoint.cp2, point.cp2)
                let p = Math2.getRotatedPoint(oldPoint.cp1, point.center, moveDegree)
                point.cp1.x = p.x
                point.cp1.y = p.y
              }
            }
            cu.render()
            return
          }
          if (type === EditType.Point || type === EditType.CenterPoint) {
            let point = this.getPoint(this.conf.lineShapes[lineIndex].points[pointIndex])
            let oldPoint = this.getPoint(this.original.lineShapes[lineIndex].points[pointIndex], this.original)
            point.center.x = oldPoint.center.x + dx
            point.center.y = oldPoint.center.y + dy
            if (point.cp1.use) {
              point.cp1.x = oldPoint.cp1.x + dx
              point.cp1.y = oldPoint.cp1.y + dy
            }
            if (point.cp2.use) {
              point.cp2.x = oldPoint.cp2.x + dx
              point.cp2.y = oldPoint.cp2.y + dy
            }
            cu.render()
            return
          }
          if (type === EditType.Line) {
            console.log('onMouseMove-enterLineIndex')
            console.log('dx', dx, 'dy', dy)
            let oldLine1Point = this.getPoint(this.original.lineShapes[lineIndex].points[pointIndex], this.original)
            let line1Point = this.getPoint(this.conf.lineShapes[lineIndex].points[pointIndex])
            line1Point.center.x = oldLine1Point.center.x + dx
            line1Point.center.y = oldLine1Point.center.y + dy
            let line0Point: BezierPoint
            let oldLine0Point: BezierPoint
            if (pointIndex === 0) {
              let length = this.conf.lineShapes[lineIndex].points.length
              line0Point = this.getPoint(this.conf.lineShapes[lineIndex].points[length - 1])
              oldLine0Point = this.getPoint(this.original.lineShapes[lineIndex].points[length - 1], this.original)
            } else {
              line0Point = this.getPoint(this.conf.lineShapes[lineIndex].points[pointIndex - 1])
              oldLine0Point = this.getPoint(this.original.lineShapes[lineIndex].points[pointIndex - 1], this.original)
            }
            line0Point.center.x = oldLine0Point.center.x + dx
            line0Point.center.y = oldLine0Point.center.y + dy
            cu.render()
            return
          }
        }
      }
      if (cu.editModeType === EditModeType.Edit) {
        let {lineIndex, pointIndex} = this.editStartPointInfo
        if (pointIndex == -1) return
        let lastPoint = this.getPoint(this.conf.lineShapes[lineIndex].points[pointIndex])
        if (lastPoint) {
          // console.log('pen-onMouseMove', lastPoint.center, event.point)
          let cu = CanvasUtil2.getInstance()
          let ctx = cu.ctx
          if (this.mouseDown) {
            let fixMousePoint = {
              x: event.point.x - center.x,
              y: event.point.y - center.y
            }
            lastPoint.cp2 = merge(getP2(true), fixMousePoint)
            let cp1 = helper.horizontalReversePoint(cloneDeep(lastPoint.cp2), lastPoint.center)
            lastPoint.cp1 = helper.verticalReversePoint(cp1, lastPoint.center)
            lastPoint.type = BezierPointType.MirrorAngleAndLength
          } else {
            cu.waitRenderOtherStatusFunc.push(() => {
              ctx.save()
              ctx.beginPath()
              let fixLastPoint = {
                x: center.x + lastPoint.center.x,
                y: center.y + lastPoint.center.y,
              }
              ctx.moveTo2(fixLastPoint)
              ctx.strokeStyle = defaultConfig.strokeStyle
              if (lastPoint.cp2.use) {
                let fixLastPointCp2 = {
                  x: center.x + lastPoint.cp2.x,
                  y: center.y + lastPoint.cp2.y,
                }
                ctx.quadraticCurveTo2(fixLastPointCp2, event.point)
              } else {
                ctx.lineTo2(event.point)
              }
              // ctx.closePath()
              ctx.stroke()
              draw.drawRound(ctx, fixLastPoint)
              ctx.restore()
            })
          }
          cu.render()
          return
        }
      }
    }
  }

  _mouseup(event: BaseEvent2, parents: BaseShape[] = []) {
    this.log('base-mouseup')
    // if (e.capture) return
    // console.log('mouseup')
    if (this.onMouseUp(event, parents)) return
    this.enterType = MouseOptionType.None
    this.editHover = cloneDeep(this.defaultCurrentOperationInfo)
    this.editEnter = cloneDeep(this.defaultCurrentOperationInfo)
    this.mouseDown = false
  }

  //移动图形
  move(point: P) {
    let cu = CanvasUtil2.getInstance()
    let {x, y,} = point

    this.conf.center.x = this.original.center.x + (x - cu.mouseStart.x)
    this.conf.center.y = this.original.center.y + (y - cu.mouseStart.y)

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
    let moveDegree = Math2.getDegree(center, original, current)

    //这里要减去，父级的旋转角度
    let realRotation = (moveDegree < 180 ? moveDegree : moveDegree - 360)
    // console.log('旋转角度', realRotation)

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
    let newCenter = Math2.getCenterPoint(current, this.diagonal)
    let zeroDegreeTopLeft = Math2.getRotatedPoint(current, newCenter, -realRotation)
    let zeroDegreeBottomRight = Math2.getRotatedPoint(this.diagonal, newCenter, -realRotation)

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
      const zeroAngleCurrentPoint = Math2.getRotatedPoint(current, handlePoint, -realRotation)
      const zeroAngleMovePoint = {x: handlePoint.x, y: zeroAngleCurrentPoint.y}
      const currentAngleMovePoint = Math2.getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
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
      let d = y - cu.mouseStart.y
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
      const zeroAngleCurrentPoint = Math2.getRotatedPoint(current, handlePoint, -realRotation)
      const zeroAngleMovePoint = {x: handlePoint.x, y: zeroAngleCurrentPoint.y}
      const currentAngleMovePoint = Math2.getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
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
      let d = y - cu.mouseStart.y
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
      const zeroAngleCurrentPoint = Math2.getRotatedPoint(current, handlePoint, -realRotation)
      //0度的移动点：x取其0度的当前点的，y取当前边中间点的（保证在一条直线上，因为只能拖动x，y不需要变动）
      const zeroAngleMovePoint = {x: zeroAngleCurrentPoint.x, y: handlePoint.y}
      // 当前角度的移动点：以当前边中间点为圆心，正角度偏转
      const currentAngleMovePoint = Math2.getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
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
      let d = x - cu.mouseStart.x
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
      const zeroAngleCurrentPoint = Math2.getRotatedPoint(current, handlePoint, -realRotation)
      const zeroAngleMovePoint = {x: zeroAngleCurrentPoint.x, y: handlePoint.y}
      const currentAngleMovePoint = Math2.getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
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
      let d = x - cu.mouseStart.x
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
        // item.conf.center = Math2.horizontalReversePoint(item.conf.center, pConf.center)
        // item.conf.center = Math2.getRotatedPoint(item.conf.center, pConf.center, 2 * pConf.realRotation)
        let pOriginal = pConf.original
        let center = {x: pOriginal.x + -item.conf.relativeCenter.x, y: pOriginal.y + item.conf.relativeCenter.y}
        item.conf.center = Math2.getRotatedPoint(center, pConf.center, pConf.realRotation)
        item.conf.flipHorizontal = !item.conf.flipHorizontal
      } else {
        let pOriginal = pConf.original
        let center = {x: pOriginal.x + item.conf.relativeCenter.x, y: pOriginal.y + -item.conf.relativeCenter.y}
        item.conf.center = Math2.getRotatedPoint(center, pConf.center, pConf.realRotation)
        item.conf.flipVertical = !item.conf.flipVertical
      }
      item.conf = helper.calcConf(item.conf, item.parent?.conf)
      item.childrenDiagonalFlip(type, item.conf)
    })
  }

  calcNewCenterAndWidthAndHeight() {
    console.log('重新计算中心点和宽高')
    // return
    if (!this.conf.isCustom) return
    let center = this.conf.center
    let temp: any = this.conf.lineShapes.reduce((previousValue: any[], currentValue) => {
      previousValue.push({
        maxX: Math.max(...currentValue.points.map(p => center.x + this.getPoint(p).center.x)),
        minX: Math.min(...currentValue.points.map(p => center.x + this.getPoint(p).center.x)),
        maxY: Math.max(...currentValue.points.map(p => center.y + this.getPoint(p).center.y)),
        minY: Math.min(...currentValue.points.map(p => center.y + this.getPoint(p).center.y)),
      })
      return previousValue
    }, [])
    console.log('temp', temp)
    let maxX = Math.max(...temp.map((a: any) => a.maxX))
    let minX = Math.min(...temp.map((a: any) => a.minX))
    let maxY = Math.max(...temp.map((a: any) => a.maxY))
    let minY = Math.min(...temp.map((a: any) => a.minY))

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
      line.points.map(pointInfo => {
        let p = this.getPoint(pointInfo)
        p.center.x -= dx
        p.center.y -= dy
        p.cp1.x -= dx
        p.cp1.y -= dy
        p.cp2.x -= dx
        p.cp2.y -= dy
      })
    })
    this.conf.center = newCenter
    this.conf.layout.w = newWidth
    this.conf.layout.h = newHeight
    this.conf = helper.calcConf(this.conf, this.parent?.conf)
  }

  getCustomShapePath(): LinePath[] {
    let pathList: LinePath[] = []
    this.conf.lineShapes.map((line) => {
      let path = new Path2D()
      line.points.map((pointInfo: PointInfo, index: number, array: PointInfo[]) => {
        let currentPoint = this.getPoint(pointInfo)
        let previousPoint: BezierPoint
        if (index === 0) {
          previousPoint = this.getPoint(array[array.length - 1])
        } else {
          previousPoint = this.getPoint(array[index - 1])
        }
        let lineType: LineType = LineType.Line
        if (
          currentPoint.type === BezierPointType.RightAngle &&
          previousPoint.type === BezierPointType.RightAngle
        ) {
          lineType = LineType.Line
        } else if (
          currentPoint.type !== BezierPointType.RightAngle &&
          previousPoint.type !== BezierPointType.RightAngle) {
          lineType = LineType.Bezier3
        } else {
          if (previousPoint.cp2.use || currentPoint.cp1.use) {
            lineType = LineType.Bezier2
          } else {
            lineType = LineType.Line
          }
        }

        // let fixPreviousPoint = cloneDeep(previousPoint)
        // fixPreviousPoint.center.x = fixPreviousPoint.center.x - center.x
        // fixPreviousPoint.center.y = fixPreviousPoint.center.y - center.y
        // let  fixPreviousPoint.center = this.getPointRelativeToCenter(previousPoint.center, center)
        // console.log('lineType', fixPreviousPoint.center, fixCurrentPoint.center)

        //未闭合的情况下，只需绘制一个起点即可
        if (index === 0 && !line.close) {
          path.lineTo2(currentPoint.center)
        } else {
          switch (lineType) {
            case LineType.Line:
              // ctx.beginPath()
              path.lineTo2(currentPoint.center)
              // ctx.stroke()
              break
            case LineType.Bezier3:
              // ctx.beginPath()
              path.lineTo2(previousPoint.center)
              path.bezierCurveTo2(
                previousPoint.cp2,
                currentPoint.cp1,
                currentPoint.center)
              // ctx.stroke()
              break
            case LineType.Bezier2:
              let cp: P2
              if (previousPoint.cp2.use) cp = previousPoint.cp2
              if (currentPoint.cp1.use) cp = currentPoint.cp1
              // ctx.beginPath()
              path.lineTo2(previousPoint.center)
              path.quadraticCurveTo2(cp!, currentPoint.center)
              // ctx.stroke()
              break
          }
        }
      })
      line.close && path.closePath()
      pathList.push({
        close: line.close,
        path,
      })
    })
    return pathList
  }

  getPoint(pointInfo: PointInfo, conf: BaseConfig = this.conf): BezierPoint {
    if (pointInfo.type === PointType.Single) {
      return pointInfo.point!
    } else {
      return this.conf.commonPoints[this.conf.commonPoints.findIndex(v => v.id === pointInfo.targetId)!]
    }
  }
}