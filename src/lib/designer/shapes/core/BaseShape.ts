import {
  BaseEvent2,
  BezierPoint,
  BezierPointType,
  CurrentOperationInfo,
  EditModeType,
  EditType,
  getP2,
  Line,
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
} from "../../types/type"
import CanvasUtil2 from "../../engine/CanvasUtil2"
import {cloneDeep, eq, merge} from "lodash"
import {getShapeFromConfig} from "../../utils/common"
import EventBus from "../../event/eventBus"
import {BaseConfig, Rect} from "../../config/BaseConfig"
import helper from "../../utils/helper"
import draw from "../../utils/draw"
import {defaultConfig} from "../../utils/constant"
import {v4 as uuid} from "uuid"
import {Math2} from "../../utils/math"
import {Bezier} from "../../utils/bezier"
import {BBox, Bezier as BezierJs} from "bezier-js";
import {EventKeys} from "../../event/eventKeys";
import {HandleMirroring, PenNetworkPath} from "../../config/PenConfig";

export class BaseShape {
  hoverType: MouseOptionType = MouseOptionType.None
  enterType: MouseOptionType = MouseOptionType.None
  conf: BaseConfig
  children: BaseShape[] = []
  _status: ShapeStatus = ShapeStatus.Normal
  _isSelectHover: boolean = false
  isCapture: boolean = true//是否捕获事件，为true不会再往下传递事件
  mouseDown: boolean = false
  moved: boolean = false
  original: BaseConfig
  diagonal: P = {x: 0, y: 0}//对面的点（和handlePoint相反的点），如果handlePoint是中间点，那么这个也是中间点
  handLineCenterPoint: P = {x: 0, y: 0}//鼠标按住那条边的中间点（当前角度），非鼠标点
  parent?: BaseShape

  constructor(props: ShapeProps) {
    // console.log('props', clone(props))
    this.conf = helper.initConf(props.conf, props.parent?.conf)
    if (this.conf.isCustom) {
      this.calcNewCenterAndWidthAndHeight()
    }
    this.parent = props.parent
    this.original = cloneDeep(this.conf)
    // console.log('config', clone(this.config))
    this.children = this.conf.children?.map((conf: BaseConfig) => {
      return getShapeFromConfig({conf, parent: this})
    }) ?? []

    this.checkAcr(true)
    // @ts-ignore
    window.t = () => this.checkAcr(true)
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
        this.editStartPointInfo = cloneDeep(this.defaultCurrentOperationInfo)
        //TODO 会导致子组件选中后，再选中父组件时，无法取消子组件
        // cu.selectedShape = this
        cu.editShape = undefined
        cu.mode = ShapeType.SELECT
        // TODO　先这样。一时半会儿用不到parents
        cu.setSelectShape(this, [])
      }
      if (val === ShapeStatus.Edit) {
        if (!this.conf.lineShapes.length) {
          this.conf.lineShapes = this.getCustomPoint()
        }
        cu.editShape = this
        cu.mode = ShapeType.EDIT
      }
      this._status = val
      EventBus.emit(EventKeys.MODE, this._status)
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

  init() {
  }

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig) {
  }

  drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect,) {
  }

  drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect) {
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, newLayout: Rect) {
  }

  drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect) {
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  onMouseDowned(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  //子类判断是否在图形上
  isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
    return helper.isInBox(mousePoint, this.conf.box)
  }

  //当select时，判断是否在图形上
  isInShapeOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  /**
   * @desc 子类判断是否在图形上的回调
   * 用于子类的enter之类的变量判断
   * 如果变量为ture，那么方法直接返回true，不用再走后续判断是否在图形上
   * */
  beforeIsInShape(): boolean {
    return false
  }

  //传递事件之前的回调，用于子类直接消费而不经过父类判断
  beforeEvent(event: BaseEvent2): boolean {
    return false
  }

  //获取自定义的点
  getCustomPoint(): LineShape[] {
    return []
  }

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

  checkMousePointOnEditStatus2(point: P): CurrentOperationInfo {
    // console.log('------------------')
    let {center, lineShapes, realRotation, flipVertical, flipHorizontal} = this.conf
    //反转到0度，好判断
    if (realRotation) {
      point = Math2.getRotatedPoint(point, center, -realRotation)
    }
    if (flipHorizontal) point.x = helper._reversePoint(point.x, center.x)
    if (flipVertical) point.y = helper._reversePoint(point.y, center.y)
    let judgePointDistance = 5 / 1
    let fixMousePoint = {
      x: point.x - center.x,
      y: point.y - center.y
    }
    const {nodes, paths, ctrlNodes} = this.conf.penNetwork

    //判断是否在点上、线上、hover在线的中点上
    for (let lineIndex = 0; lineIndex < paths.length; lineIndex++) {
      let path = paths[lineIndex]
      for (let pointIndex = 0; pointIndex < path.length; pointIndex++) {
        let line = path[pointIndex]
        let startPoint = nodes[path[pointIndex][0]]
        // console.log('isInPoint', fixMousePoint, startPoint.center)
        // console.log('s',helper.isInPoint(fixMousePoint, startPoint.center, judgePointDistance))
        if (helper.isInPoint(fixMousePoint, startPoint, judgePointDistance)) {
          console.log('在点上')
          return {type: EditType.Point, lineIndex, pointIndex, cpIndex: -1}
        }
        let endPoint = nodes[path[pointIndex][1]]
        let lineType = helper.judgeLineType2(line)
        if (helper.isInLine2(fixMousePoint, line, lineType, nodes, ctrlNodes)) {
          console.log('在线上')
          let returnData = {
            type: EditType.Line,
            lineType,
            lineIndex,
            pointIndex,
            lineCenterPoint: helper.getLineCenterPoint2(line, lineType, nodes, ctrlNodes),
            cpIndex: -1
          }
          if (helper.isInPoint(fixMousePoint, this.hoverLineCenterPoint, judgePointDistance)) {
            console.log('hover在线的中点上')
            returnData.type = EditType.CenterPoint
          }
          return returnData
        }
      }
    }

    //判断是否在cp点上
    let {lineIndex, pointIndex, type} = this.editStartPointInfo
    if (pointIndex !== -1 && type === EditType.Point) {
      let waitCheckPoints: any[] = []
      let path = paths[lineIndex]
      let line: PenNetworkPath = path[pointIndex]
      let point = nodes[line[0]]
      if (point.cps[0] !== -1) waitCheckPoints.push({pointIndex, index: 0, point: ctrlNodes[point.cps[0]]})
      if (point.cps[1] !== -1) waitCheckPoints.push({pointIndex, index: 1, point: ctrlNodes[point.cps[1]]})
      for (let i = 0; i < waitCheckPoints.length; i++) {
        let item = waitCheckPoints[i]
        if (helper.isInPoint(fixMousePoint, item.point, judgePointDistance)) {
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
    let {w, h} = this.conf.layout
    if (w === 0 || h === 0) {
      return
    }
    let {x, y} = draw.calcPosition(ctx, this.conf)
    let newLayout = {...this.conf.layout, x, y}
    // let newLayout = {...this.conf.layout, }
    // console.log('this.status', this.status)
    if (this.status === ShapeStatus.Edit) {
      this.drawEdit(ctx, newLayout)
    } else {
      this.drawShape(ctx, newLayout, parent,)
    }
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
    // draw.drawRound(ctx, this.conf.center)

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
    //TODO 感觉应该在这里先判断是否被消费了

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
    // console.log('core-dblclick', this.editStartPointInfo, this.editHover)
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
        let {l, r} = Bezier.getTargetPointControlPoints(
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
    // this.log('core-mousedown')
    // console.log('mousedown', this.conf.name, this.enterType, this.hoverType)
    EventBus.emit(EventKeys.SELECT_SHAPE, this)
    if (this.onMouseDown(event, parents)) return

    let cu = CanvasUtil2.getInstance()
    this.original = cloneDeep(this.conf)
    cu.mouseStart = cloneDeep(event.point)
    cu.fixMouseStart = cloneDeep(event.point)
    let {center, realRotation, flipHorizontal, flipVertical} = this.conf
    if (realRotation) {
      cu.fixMouseStart = Math2.getRotatedPoint(cu.fixMouseStart, center, -realRotation)
    }
    if (flipHorizontal) cu.fixMouseStart.x = helper._reversePoint(cu.fixMouseStart.x, center.x)
    if (flipVertical) cu.fixMouseStart.y = helper._reversePoint(cu.fixMouseStart.y, center.y)

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
          return;
        default:
          break
      }
    }

    if (this.status === ShapeStatus.Edit) {
      if (cu.editModeType === EditModeType.Select) {
        let result = this.checkMousePointOnEditStatus2(event.point)
        let {lineIndex, pointIndex, cpIndex, type, lineType} = result
        console.log('result', result)
        //如果hover在点上，先处理hover
        if (pointIndex !== -1) {
          this.conf.isCustom = true
          //图省事儿，直接把editHover设为默认值。不然鼠标移动点或线时。还会渲染hoverLineCenterPoint
          //但hoverLineCenterPoint的点又不正确
          this.editHover = cloneDeep(this.defaultCurrentOperationInfo)
          let point: BezierPoint = {
            id: uuid(),
            cp1: getP2(),
            center: {...getP2(true), ...this.hoverLineCenterPoint},
            cp2: getP2(),
            type: BezierPointType.RightAngle
          }
          if (type === EditType.CenterPoint) {
            if (lineType === LineType.Line) {
              this.conf.lineShapes[lineIndex].points.splice(pointIndex + 1, 0, {type: PointType.Single, point})
            } else {
              let lineShape = this.conf.lineShapes[lineIndex]
              let startPoint = this.getPoint(lineShape.points[pointIndex])
              let endPoint: BezierPoint
              if (pointIndex === lineShape.points.length - 1) {
                endPoint = this.getPoint(lineShape.points[0])
              } else {
                endPoint = this.getPoint(lineShape.points[pointIndex + 1])
              }
              let b: BezierJs
              if (lineType === LineType.Bezier2) {
                let cp: P2
                if (startPoint.cp2.use) cp = startPoint.cp2
                if (endPoint.cp1.use) cp = endPoint.cp1
                b = new BezierJs(startPoint.center, cp!, endPoint.center)
              }
              if (lineType === LineType.Bezier3) {
                b = new BezierJs(startPoint.center, startPoint.cp2, endPoint.cp1, endPoint.center)
              }
              let {left, right} = b!.split(0.5)

              startPoint.cp2.x = left.points[1].x
              startPoint.cp2.y = left.points[1].y
              startPoint.cp2.use = true
              if (startPoint.type === BezierPointType.MirrorAngleAndLength) {
                startPoint.type = BezierPointType.MirrorAngle
              } else {
                startPoint.type = BezierPointType.NoMirror
              }

              //如果是三次曲线，会在多出的中间点出加上控制点。所以这里要取第2个值，第一个值是中间点的控制点
              if (lineType === LineType.Bezier3) {
                endPoint.cp1.x = right.points[2].x
                endPoint.cp1.y = right.points[2].y
              } else {
                endPoint.cp1.x = right.points[1].x
                endPoint.cp1.y = right.points[1].y
              }
              endPoint.cp1.use = true
              if (endPoint.type === BezierPointType.MirrorAngleAndLength) {
                endPoint.type = BezierPointType.MirrorAngle
              } else {
                endPoint.type = BezierPointType.NoMirror
              }

              if (lineType === LineType.Bezier3) {
                point.type = BezierPointType.MirrorAngle
                point.cp1 = {...getP2(true), ...left.points[2]}
                point.cp2 = {...getP2(true), ...right.points[1]}
              }
              this.conf.lineShapes[lineIndex].points.splice(pointIndex + 1, 0, {type: PointType.Single, point})
              // console.log('b2', b!.bbox())
            }
            //这里新增了一个点，但是老配置如果不更新。后面移动时就会找错点
            this.original = cloneDeep(this.conf)
            cu.render()
            //新增一个点，下标也要加1，以选中它
            result.pointIndex += 1
          }
          const {nodes, paths} = this.conf.penNetwork

          EventBus.emit(EventKeys.POINT_INFO, {
            lineIndex,
            pointIndex,
            point: nodes[paths[lineIndex][pointIndex][0]]
          })

          this.editEnter = result
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
    }

    if (this.onMouseDowned(event, parents)) return
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
      let {center, realRotation, lineShapes, flipHorizontal, flipVertical} = this.conf
      if (cu.editModeType === EditModeType.Select) {
        const {lineIndex, pointIndex, cpIndex, type} = this.editEnter
        //未选中任何内容，还属于判断阶段
        if (pointIndex === -1) {
          let result = this.checkMousePointOnEditStatus2(event.point)
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
          this.originalLineShapes = cloneDeep(this.conf.lineShapes)

          //TODO 是否可以统一反转？
          //反转到0度，好判断
          if (realRotation) {
            event.point = Math2.getRotatedPoint(event.point, center, -realRotation)
          }
          if (flipHorizontal) event.point.x = helper._reversePoint(event.point.x, center.x)
          if (flipVertical) event.point.y = helper._reversePoint(event.point.y, center.y)

          let {x, y} = event.point
          let move = {x: x - cu.fixMouseStart.x, y: y - cu.fixMouseStart.y}
          // let move = {x: 0, y: y - cu.fixMouseStart.y}
          const {nodes, paths, ctrlNodes} = this.conf.penNetwork
          const {nodes: oldNodes, paths: oldPaths, ctrlNodes: oldCtrlNodes} = this.original.penNetwork

          // if (type === EditType.ControlPoint) {
          //   let point = this.getPoint(this.conf.lineShapes[lineIndex].points[pointIndex])
          //   let oldPoint = this.getPoint(this.original.lineShapes[lineIndex].points[pointIndex], this.original)
          //   if (cpIndex === 1) {
          //     point.cp1.x = oldPoint.cp1.x + move.x
          //     point.cp1.y = oldPoint.cp1.y + move.y
          //     if (point.type === BezierPointType.MirrorAngleAndLength) {
          //       let p = Math2.getRotatedPoint(point.cp1, point.center, 180)
          //       point.cp2.x = p.x
          //       point.cp2.y = p.y
          //     }
          //     if (point.type === BezierPointType.MirrorAngle) {
          //       let moveDegree = Math2.getDegree(point.center, oldPoint.cp1, point.cp1)
          //       let p = Math2.getRotatedPoint(oldPoint.cp2, point.center, moveDegree)
          //       point.cp2.x = p.x
          //       point.cp2.y = p.y
          //     }
          //   }
          //   if (cpIndex === 2) {
          //     point.cp2.x = oldPoint.cp2.x + move.x
          //     point.cp2.y = oldPoint.cp2.y + move.y
          //     if (point.type === BezierPointType.MirrorAngleAndLength) {
          //       let p = Math2.getRotatedPoint(point.cp2, point.center, 180)
          //       point.cp1.x = p.x
          //       point.cp1.y = p.y
          //     }
          //     if (point.type === BezierPointType.MirrorAngle) {
          //       let moveDegree = Math2.getDegree(point.center, oldPoint.cp2, point.cp2)
          //       let p = Math2.getRotatedPoint(oldPoint.cp1, point.center, moveDegree)
          //       point.cp1.x = p.x
          //       point.cp1.y = p.y
          //     }
          //   }
          //   cu.render()
          // }

          if (type === EditType.ControlPoint) {
            let point = nodes[paths[lineIndex][pointIndex][0]]
            let cp0 = ctrlNodes[point.cps[0]]
            let oldCp0 = oldCtrlNodes[point.cps[0]]
            let cp1 = ctrlNodes[point.cps[1]]
            let oldCp1 = oldCtrlNodes[point.cps[1]]

            // let oldPoint = oldNodes[paths[lineIndex][pointIndex][0]]
            if (cpIndex === 0) {
              cp0.x = oldCp0.x + move.x
              cp0.y = oldCp0.y + move.y
              if (point.handleMirroring === HandleMirroring.MirrorAngleAndLength) {
                let p = Math2.getRotatedPoint(cp0, point, 180)
                cp1.x = p.x
                cp1.y = p.y
              }
              if (point.handleMirroring === HandleMirroring.MirrorAngle) {
                let moveDegree = Math2.getDegree(point, oldCp0, cp0)
                let p = Math2.getRotatedPoint(oldCp1, point, moveDegree)
                cp1.x = p.x
                cp1.y = p.y
              }
            }
            if (cpIndex === 1) {
              cp1.x = oldCp1.x + move.x
              cp1.y = oldCp1.y + move.y
              if (point.handleMirroring === HandleMirroring.MirrorAngleAndLength) {
                let p = Math2.getRotatedPoint(cp1, point, 180)
                cp0.x = p.x
                cp0.y = p.y
              }
              if (point.handleMirroring === HandleMirroring.MirrorAngle) {
                let moveDegree = Math2.getDegree(point, oldCp1, cp1)
                let p = Math2.getRotatedPoint(cp1, point, moveDegree)
                cp0.x = p.x
                cp0.y = p.y
              }
            }
            cu.render()
          }


          if (type === EditType.Point || type === EditType.CenterPoint) {
            this.movePoint(lineIndex, pointIndex, move)
            cu.render()
          }

          if (type === EditType.Line) {
            console.log('onMouseMove-enterLineIndex')
            this.movePoint(lineIndex, pointIndex, move)
            if (pointIndex === paths[lineIndex].length - 1) {
              this.movePoint(lineIndex, 0, move)
            } else {
              this.movePoint(lineIndex, pointIndex + 1, move)
            }
            cu.render()
          }

          // this.checkAcr()
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
    // this.log('core-mouseup')
    // if (e.capture) return
    // console.log('mouseup')
    if (this.onMouseUp(event, parents)) return
    this.enterType = MouseOptionType.None
    this.editHover = cloneDeep(this.defaultCurrentOperationInfo)
    this.editEnter = cloneDeep(this.defaultCurrentOperationInfo)
    this.mouseDown = false
    this.moved = false
  }

  //移动图形
  move(point: P) {
  }

  //拖动左上旋转
  dragTopLeftRotation(point: P) {
  }

  //拖动左上
  dragTopLeft(point: P) {
  }

  //拖动上边
  dragTop(point: P) {
  }

  //拖动下边
  dragBottom(point: P) {
  }

  //拖动左边，最完整的
  dragLeft(point: P) {
  }

  //拖动右边
  dragRight(point: P) {
  }

  //计算子组件的配置
  calcChildrenConf(parent = this) {
    this.children.map((shape: BaseShape) => {
      shape.conf = helper.calcConfByParent(shape.conf, parent?.conf)
      shape.calcChildrenConf(shape)
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
    this.notifyConfUpdate()
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
    // console.log('重新计算中心点和宽高')
    // return
    if (!this.conf.isCustom) return
    let {center, realRotation, flipHorizontal, flipVertical} = this.conf

    let temp: any = this.conf.lineShapes.reduce((previousValue: any[], currentValue) => {
      let maxX: number, minX: number, maxY: number, minY: number
      maxX = maxY = 0
      minX = minY = Infinity
      let checkLine = (startPoint: BezierPoint) => {
        let x = center.x + startPoint.center.x
        let y = center.y + startPoint.center.y
        if (x > maxX) maxX = x
        if (x < minX) minX = x
        if (y > maxY) maxY = y
        if (y < minY) minY = y
      }
      let checkBezier = (info: BBox) => {
        let _maxX = center.x + info.x.max
        let _minX = center.x + info.x.min
        let _maxY = center.y + info.y.max
        let _minY = center.y + info.y.min
        if (_maxX > maxX) maxX = _maxX
        if (_minX < minX) minX = _minX
        if (_maxY > maxY) maxY = _maxY
        if (_minY < minY) minY = _minY
      }
      currentValue.points.map((pointInfo, index, array) => {
        let startPoint = this.getPoint(pointInfo)
        //未闭合的情况下，只需绘制一个终点即可
        if (index === array.length - 1 && !currentValue.close) {
          checkLine(startPoint)
        } else {
          let endPoint: BezierPoint
          if (index === array.length - 1) {
            endPoint = this.getPoint(array[0])
          } else {
            endPoint = this.getPoint(array[index + 1])
          }
          let lineType = helper.judgeLineType({startPoint, endPoint})
          switch (lineType) {
            case LineType.Line:
              checkLine(startPoint)
              break
            case LineType.Bezier3:
              let b3 = new BezierJs(startPoint.center, startPoint.cp2, endPoint.cp1, endPoint.center)
              checkBezier(b3.bbox())
              break
            case LineType.Bezier2:
              let cp: P2
              if (startPoint.cp2.use) cp = startPoint.cp2
              if (endPoint.cp1.use) cp = endPoint.cp1
              let b2 = new BezierJs(startPoint.center, cp!, endPoint.center)
              checkBezier(b2.bbox())
              break
          }
        }
      })
      previousValue.push({maxX, minX, maxY, minY})
      return previousValue
    }, [])
    // console.log('temp', temp)
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
        if (p.cp1.use) {
          p.cp1.x -= dx
          p.cp1.y -= dy
        }
        if (p.cp2.use) {
          p.cp2.x -= dx
          p.cp2.y -= dy
        }
      })
    })
    if (flipHorizontal) newCenter.x = helper._reversePoint(newCenter.x, center.x)
    if (flipVertical) newCenter.y = helper._reversePoint(newCenter.y, center.y)

    //如果有旋转，那么新center要相对于老center旋转。因为所有的点和老中心点是没有度数的
    //所以计算出来的最大值和最小值都是0度情况下的值，对应算出来的新中心点也是0度。
    //如果直接使用会导致偏移。
    if (realRotation) {
      newCenter = Math2.getRotatedPoint(newCenter, center, realRotation)
    }
    this.conf.center = newCenter
    this.conf.layout.w = newWidth
    this.conf.layout.h = newHeight
    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    this.notifyConfUpdate()
  }

  pointRadiusChange(e: any, val: any) {
    this.originalLineShapes = cloneDeep(this.conf.lineShapes)

    let point = this.getPoint(this.conf.lineShapes[val.lineIndex].points[val.pointIndex])
    point.radius = e
    if (e === 0) {
      point.realRadius = 0
    } else {
      this.checkAcr()
    }
    CanvasUtil2.getInstance().render()
    EventBus.emit(EventKeys.POINT_INFO, Object.assign({}, val, {point}))
  }

  getCustomShapePath(): LinePath[] {
    let pathList: LinePath[] = []
    this.conf.lineShapes.map((line) => {
      let path = new Path2D()
      line.points.map((pointInfo: PointInfo, index: number, array: PointInfo[]) => {
        let startPoint = this.getPoint(pointInfo)
        //未闭合的情况下，只需绘制一个终点即可
        if (index === array.length - 1 && !line.close) {
          path.lineTo2(startPoint.center)
        } else {
          let endPoint: BezierPoint
          if (index === array.length - 1) {
            endPoint = this.getPoint(array[0])
          } else {
            endPoint = this.getPoint(array[index + 1])
          }
          let lineType = helper.judgeLineType({startPoint, endPoint})
          switch (lineType) {
            case LineType.Line:
              // console.log('startPoint-radius', startPoint.radius)
              if (startPoint.radius) {
                path.arcTo2(startPoint.center, endPoint.center, startPoint.radius)
              } else {
                path.lineTo2(startPoint.center)
              }
              break
            case LineType.Bezier3:
              //这里写lineTo2是因为遇到第一个曲线时，要先连到起点，再开始画曲线
              //后续如果都是曲线，这个LineTo2其实也就失去了作用了，不过不影响，因为上一点画曲线时，已经画到这个点了。lineTo2相当于在原点了一次
              path.lineTo2(startPoint.center)
              path.bezierCurveTo2(startPoint.cp2, endPoint.cp1, endPoint.center)
              break
            case LineType.Bezier2:
              let cp: P2
              if (startPoint.cp2.use) cp = startPoint.cp2
              if (endPoint.cp1.use) cp = endPoint.cp1
              path.lineTo2(startPoint.center)
              path.quadraticCurveTo2(cp!, endPoint.center)
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

  getCustomShapePath2(): {strokePathList: LinePath[], fillPathList: LinePath[]} {
    let strokePathList: LinePath[] = []
    let fillPathList: LinePath[] = []
    this.conf.lineShapes.map((line) => {
      let strokePath = new Path2D()
      let fillPath = new Path2D()
      line.points.map((pointInfo: PointInfo, index: number, array: PointInfo[]) => {
        let startPoint = this.getPoint(pointInfo)
        //未闭合的情况下，只需绘制一个终点即可
        if (index === array.length - 1 && !line.close) {
          strokePath.lineTo2(startPoint.center)
          fillPath.lineTo2(startPoint.center)
        } else {
          if (index === 0) {
            strokePath.moveTo2(startPoint.center)
            fillPath.moveTo2(startPoint.center)
          }
          let endPoint: BezierPoint
          if (index === array.length - 1) {
            endPoint = this.getPoint(array[0])
          } else {
            endPoint = this.getPoint(array[index + 1])
          }
          let lineType = helper.judgeLineType({startPoint, endPoint})
          switch (lineType) {
            case LineType.Line:
              // console.log('startPoint-radius', startPoint.radius)
              if (startPoint.realRadius) {
                fillPath.arcTo2(startPoint.center, endPoint.center, startPoint.realRadius)
              } else {
                if (startPoint.acrPoint) {
                  fillPath.lineTo2(startPoint.center)
                  // fillPath.lineTo2(startPoint.acrPoint!)
                } else {
                  fillPath.lineTo2(startPoint.center)
                }
              }
              strokePath.lineTo2(startPoint.center)
              break
            case LineType.Bezier3:
              //这里写lineTo2是因为遇到第一个曲线时，要先连到起点，再开始画曲线
              //后续如果都是曲线，这个LineTo2其实也就失去了作用了，不过不影响，因为上一点画曲线时，已经画到这个点了。lineTo2相当于在原点了一次
              strokePath.lineTo2(startPoint.center)
              strokePath.bezierCurveTo2(startPoint.cp2, endPoint.cp1, endPoint.center)
              fillPath.lineTo2(startPoint.center)
              fillPath.bezierCurveTo2(startPoint.cp2, endPoint.cp1, endPoint.center)
              break
            case LineType.Bezier2:
              let cp: P2
              if (startPoint.cp2.use) cp = startPoint.cp2
              if (endPoint.cp1.use) cp = endPoint.cp1
              strokePath.lineTo2(startPoint.center)
              strokePath.quadraticCurveTo2(cp!, endPoint.center)

              if (startPoint.realRadius) {
                if (startPoint.radius! > startPoint.realRadius && false) {
                  // fillPath.arcTo2(startPoint.center, endPoint.acrPoint!, startPoint.realRadius)
                  // fillPath.quadraticCurveTo2(endPoint.acrCp!, endPoint.center)
                  fillPath.bezierCurveTo2(startPoint.center, endPoint.cp1, endPoint.center)
                } else {
                  fillPath.arcTo2(startPoint.center, endPoint.acrPoint!, startPoint.realRadius)
                  // fillPath.lineTo2(endPoint.acrPoint!)
                  fillPath.quadraticCurveTo2(endPoint.acrCp!, endPoint.center)
                }
              } else {
                fillPath.lineTo2(startPoint.center)
                if (endPoint.realRadius) {
                  // fillPath.quadraticCurveTo2(cp!, startPoint.acrPoint!)
                  fillPath.quadraticCurveTo2(startPoint.acrCp!, startPoint.acrPoint!)
                } else {
                  fillPath.quadraticCurveTo2(cp!, endPoint.center)
                }
              }
              // fillPath.quadraticCurveTo2(cp!, endPoint.center)
              break
          }
        }
      })
      if (line.close) {
        strokePath.closePath()
        fillPath.closePath()
      }
      strokePathList.push({close: line.close, path: strokePath})
      fillPathList.push({close: line.close, path: fillPath})
    })
    return {strokePathList, fillPathList}
  }

  getPoint(pointInfo: PointInfo, conf: BaseConfig = this.conf): BezierPoint {
    if (!pointInfo) return null as any
    if (pointInfo.type === PointType.Single) {
      return pointInfo.point!
    } else {
      return conf.commonPoints[this.conf.commonPoints.findIndex(v => v.id === pointInfo.targetId)!]
    }
  }

  protected notifyConfUpdate() {
    EventBus.emit(EventKeys.ON_CONF_CHANGE)
  }

  originalLineShapes: LineShape[] = []

  //检查圆弧，很耗时，需要手动调用
  checkAcr(isInit = false) {
    if (!this.originalLineShapes.length && !isInit) return
    console.time()
    this.conf.lineShapes.map((line, indexI, arrI) => {
      if (line.points.length > 2 && (this.originalLineShapes[indexI]?.points.length === line.points.length || isInit)) {
        line.points.map((point, indexJ, arrJ) => {
          let p = this.getPoint(point)
          if (p.radius) {
            let prePoint: BezierPoint = undefined as any
            let oldPrePoint: BezierPoint = undefined as any
            let nextPoint = this.getPoint(arrJ[indexJ + 1])
            if (indexJ === 0) {
              if (line.close) {
                prePoint = this.getPoint(arrJ[arrJ.length - 1])
                oldPrePoint = this.getPoint(this.originalLineShapes[indexI]?.points[arrJ.length - 1])
              }
            } else {
              prePoint = this.getPoint(arrJ[indexJ - 1])
              oldPrePoint = this.getPoint(this.originalLineShapes[indexI]?.points[indexJ - 1])
            }

            if (isInit) {
              this.judge(prePoint, p, nextPoint)
            } else {
              if (prePoint && oldPrePoint) {
                let oldCurrentPoint = this.getPoint(this.originalLineShapes[indexI].points[indexJ])
                let oldNextPoint = this.getPoint(this.originalLineShapes[indexI].points[indexJ + 1])

                //有任一一个不相同，则重新计算
                if (
                  !eq(prePoint, oldPrePoint) ||
                  !eq(p, oldCurrentPoint) ||
                  !eq(nextPoint, oldNextPoint)
                ) {
                  this.judge(prePoint, p, nextPoint)
                }
              }
            }
          }
        })
      }
    })
    console.timeEnd()
  }

  judge(prePoint: BezierPoint, currentPoint: BezierPoint, nextPoint: BezierPoint) {
    let lineType = helper.judgeLineType({startPoint: prePoint, endPoint: currentPoint})
    let lineType2 = helper.judgeLineType({startPoint: currentPoint, endPoint: nextPoint})

    if (lineType === LineType.Line && lineType2 === LineType.Line) {
      let {
        adjacentSide,
        tan
      } = this.getAdjacentSide(currentPoint.center, prePoint.center, nextPoint.center, currentPoint.radius!)

      let front = Math2.getHypotenuse2(currentPoint.center!, prePoint.center)
      let back = Math2.getHypotenuse2(currentPoint.center!, nextPoint.center)
      // console.log('当前radius（对边）对应的邻边长', adjacentSide)
      // console.log('front', front)
      // console.log('back', back)
      let maxRadius = currentPoint.radius
      if (back < adjacentSide) {
        maxRadius = back * tan
        adjacentSide = back
      }
      if (front < adjacentSide) {
        maxRadius = front * tan
      }
      currentPoint.realRadius = maxRadius
    } else if (lineType === LineType.Bezier2 && lineType2 === LineType.Bezier2) {
      this.judgeBothBezier2Line(prePoint, currentPoint, nextPoint)
    } else {
      //TODO
      if (lineType === LineType.Bezier2) {
        console.log('1')
        let center = currentPoint.center
        let radius = currentPoint.radius!
        for (let i = 0.1; i <= 1; i = i + 0.1) {
          let start = Bezier.getPointByT_2(-i, [prePoint.center!, prePoint.cp2!, currentPoint.center!])
          // console.log('i', i)
          console.log('start', start)
          let end = nextPoint?.center!
          let temp = this.getAdjacentSide(center, start, end, radius)
          let adjacent = temp.adjacentSide
          let front = Math2.getHypotenuse2(center!, start)
          let back = Math2.getHypotenuse2(center!, end)
          // console.log('front', front, 'back', back, 'adjacent', adjacent, 'radius', radius)

          if (back > adjacent && front > adjacent) {
            for (let j = i - 0.1; j <= i; j = j + 0.01) {
              start = Bezier.getPointByT_2(-j, [prePoint.center!, prePoint.cp2!, currentPoint.center!])
              // console.log('i', i)
              console.log('start', start)
              adjacent = this.getAdjacentSide(center, start, end, radius).adjacentSide
              if (back > adjacent && front > adjacent) {
                console.log('d2', j)
                prePoint!.acrPoint = start
                break
              }
            }
            break
          }
        }
      }
      if (lineType2 === LineType.Bezier2) {
        console.log('2')
        this.judgeAnyBezier2Line(prePoint, currentPoint, nextPoint)
      }
    }
  }

  judgeAnyBezier2Line(prePoint: BezierPoint, currentPoint: BezierPoint, nextPoint: BezierPoint, r?: number) {
    let center = currentPoint.center
    let radius = r ?? currentPoint.radius!
    let start = prePoint.center
    let frontSide = Math2.getHypotenuse2(center!, start)
    for (let index = 1, i = 0.1; index <= 10; index++, i = i + 0.1) {
      let endPoint = Bezier.getPointByT_2(i, [currentPoint.center!, nextPoint.cp1!, nextPoint.center!])
      let backSide = Math2.getHypotenuse2(center!, endPoint)
      let temp = this.getAdjacentSide(center, start, endPoint, radius)
      let adjacentSide = temp.adjacentSide
      console.log('i', i, 'frontSide', frontSide, 'back', backSide, 'adjacent', adjacentSide, 'radius', radius)
      if (backSide > adjacentSide && frontSide > adjacentSide) {
        for (let j = i - 0.1; j <= i; j = j + 0.01) {
          endPoint = Bezier.getPointByT_2(j, [currentPoint.center!, nextPoint.cp1!, nextPoint.center!])
          backSide = Math2.getHypotenuse2(center!, endPoint)
          console.log('j', j, 'frontSide', frontSide, 'back', backSide, 'adjacent', adjacentSide, 'radius', radius,)
          temp = this.getAdjacentSide(center, start, endPoint, radius)
          adjacentSide = temp.adjacentSide
          if (backSide > adjacentSide && frontSide > adjacentSide) {

            let bjs2 = new BezierJs([currentPoint.center!, nextPoint.cp1!, nextPoint.center!])
            let c = bjs2.split(j)

            let degree = temp.degree
            let d2 = temp.d2
            start = Math2.getRotatedPoint(endPoint, center, degree)
            prePoint.acrPoint = start

            //终点与中心点，构成的三角形
            //的对边
            let endAdjacentSide = Math.abs(endPoint.y - center.y)
            //对边除斜边得到sin
            let asin = Math.asin(endAdjacentSide / backSide)
            //角度
            let sinDegree = Math2.hudu2juedu(asin)

            //上面的角度加上圆弧的一半角度。
            let allDegree = sinDegree + d2
            //用三角公式就可以算出圆心。
            //sin = 对边/斜边
            let sin = Math.sin(Math2.jiaodu2hudu(d2))
            //得到斜边
            let hypotenuse = radius / sin

            let sinAll = Math.sin(Math2.jiaodu2hudu(allDegree))
            //对边
            let oppositeSide = sinAll * hypotenuse

            let cosAll = Math.cos(Math2.jiaodu2hudu(allDegree))
            //邻边
            let adjacentSide2 = cosAll * hypotenuse

            let arcCenter = {
              x: center.x - adjacentSide2,
              y: center.y - oppositeSide,
            }

            console.log('c', c, 'd2', j, 'start', start, 'hypotenuse', hypotenuse,
              'oppositeSide', oppositeSide,
              'adjacentSide2', adjacentSide2,
              'arcCenter', arcCenter
            )

            let s = Bezier.arcToBezier3_2(start, endPoint, arcCenter)
            console.log('s', s)

            nextPoint.acrCp = c.right.points[1]
            nextPoint.acrPoint = endPoint
            currentPoint.realRadius = radius

            let a = c.left.points[1]
            setTimeout(() => {
              let cu = CanvasUtil2.getInstance()
              let ctx = cu.ctx
              ctx.save()
              draw.calcPosition(ctx, this.conf)
              draw.round2(ctx, arcCenter, 4)
              draw.round2(ctx, c.left.points[1], 4)
              draw.round2(ctx, endPoint, 4)
              draw.round2(ctx, s[0], 4)
              draw.round2(ctx, s[1], 4)
              ctx.moveTo2(start)
              // ctx.bezierCurveTo2(s[0], s[1], endPoint)
              ctx.bezierCurveTo2(s[0], a, endPoint)
              ctx.stroke()

              ctx.restore()
            })
            break
          }
        }
        break
      } else {
        //走到这，说明没有符合条件的两个点
        if (index === 10 && false) {
          let maxRadius = currentPoint.radius
          let {tan, adjacentSide} = temp
          if (backSide < adjacentSide) {
            maxRadius = backSide * tan
            adjacentSide = backSide
          }
          if (frontSide < adjacentSide) {
            maxRadius = frontSide * tan
            adjacentSide = frontSide
          }
          currentPoint.realRadius = maxRadius
          this.judgeAnyBezier2Line(prePoint, currentPoint, nextPoint, Math.floor(maxRadius!))
        }
      }
    }
  }

  //判断两个都是贝塞尔曲线时的圆弧
  //TODO 判断的，不够精细，快速改变raduis时，因为t是0.1的增减幅度，会导致图形抖动
  //第4个参数r是第一遍for循环时，在两条线上都未找到合适的点。那么把两个曲线当成直线判断出最大邻边和最大radius。用这个最大的radius再调用这个方法
  //因为渲染时需要保持曲线的曲率，但曲线又被圆弧分割，所以要保持曲率就得计算出曲线被分割时的终点和起点以及控制点
  judgeBothBezier2Line(prePoint: BezierPoint, currentPoint: BezierPoint, nextPoint: BezierPoint, r?: number) {
    let frontT = -1
    let backT = -1
    let center = currentPoint.center
    let radius = r ?? currentPoint.radius!
    for (let index = 1, i = 0.1; index <= 10; index++, i = i + 0.1) {
      let start = Bezier.getPointByT_2(-i, [prePoint.center!, prePoint.cp2!, currentPoint.center!])
      let end = Bezier.getPointByT_2(i, [currentPoint.center!, nextPoint.cp1!, nextPoint.center!])
      // console.log('start', start, 'end', end)

      let temp = this.getAdjacentSide(center, start, end, radius)
      let adjacent = temp.adjacentSide
      let front = Math2.getHypotenuse2(center!, start)
      let back = Math2.getHypotenuse2(center!, end)
      // console.log('front', front, 'back', back, 'adjacent', adjacent, 'radius', radius)

      if (back > adjacent && front > adjacent) {
        frontT = -i
        backT = i
        // console.log('frontT', frontT, 'backT', backT, 'adjacent', adjacent)

        for (let j = i; j >= 0; j = j - 0.05) {
          start = Bezier.getPointByT_2(-j, [prePoint.center!, prePoint.cp2!, currentPoint.center!])
          adjacent = this.getAdjacentSide(center, start, end, radius).adjacentSide
          front = Math2.getHypotenuse2(center!, start)
          // console.log('j', j, 'front', front, 'start', start, 'adjacent', adjacent)
          if (front < adjacent) {
            frontT = -(j + 0.05)
            start = Bezier.getPointByT_2(frontT, [prePoint.center!, prePoint.cp2!, currentPoint.center!])
            break
          }
        }

        for (let j = i; j >= 0; j = j - 0.05) {
          end = Bezier.getPointByT_2(j, [currentPoint.center!, nextPoint.cp1!, nextPoint.center!])
          adjacent = this.getAdjacentSide(center, start, end, radius).adjacentSide
          back = Math2.getHypotenuse2(center!, end)
          if (back < adjacent) {
            backT = (j + 0.05)
            end = Bezier.getPointByT_2(j, [currentPoint.center!, nextPoint.cp1!, nextPoint.center!])
            break
          }
        }

        let bjs = new BezierJs([prePoint.center!, prePoint.cp2!, currentPoint.center!])
        let c = bjs.split(1 + frontT)

        prePoint.acrCp = c.left.points[1]
        prePoint.acrPoint = start

        let bjs2 = new BezierJs([currentPoint.center!, nextPoint.cp1!, nextPoint.center!])
        c = bjs2.split(backT)

        nextPoint.acrCp = c.right.points[1]
        nextPoint.acrPoint = end
        // console.log(
        //   'frontT', frontT,
        //   'start', start,
        //   'backT', backT,
        //   'end', end
        // )
        if (!r) {
          currentPoint.realRadius = currentPoint.radius
        }
        break
      } else {
        //走到这，说明没有符合条件的两个点
        if (index === 10 && r === undefined) {
          let maxRadius = currentPoint.radius
          let {tan, adjacentSide} = temp
          if (back < adjacentSide) {
            maxRadius = back * tan
            adjacentSide = back
          }
          if (front < adjacentSide) {
            maxRadius = front * tan
            adjacentSide = front
          }
          currentPoint.realRadius = maxRadius
          this.judgeBothBezier2Line(prePoint, currentPoint, nextPoint, Math.floor(maxRadius!))
        }
      }
    }
  }

  //获取acr圆弧的邻边长
  getAdjacentSide(center: P, start: P, end: P, r: number) {
    let degree = Math2.getDegree(center, end, start)
    let d2 = degree / 2
    // console.log('角度', degree, d2)
    //得到已知角度tan值
    let tan = Math.tan(Math2.jiaodu2hudu(d2))
    // console.log('tan值', tan)
    //tanA = a/b。可知b = a/ tanA。所以领边的长就是lines2.point?.radius! / tan
    // console.log('当前radius（对边）对应的邻边长', r / tan)
    return {tan, adjacentSide: r / tan, degree, d2}
  }

  movePoint(lineIndex: number, pointIndex: number, move: P) {
    const {nodes, paths, ctrlNodes} = this.conf.penNetwork
    const {nodes: oldNodes, paths: oldPaths, ctrlNodes: oldCtrlNodes} = this.original.penNetwork

    let path = paths[lineIndex]
    let oldPath = oldPaths[lineIndex]
    let line: PenNetworkPath = path[pointIndex]
    let oldLine: PenNetworkPath = oldPaths[lineIndex][pointIndex]

    let point = nodes[line[0]]
    let oldPoint = oldNodes[oldLine[0]]
    helper.movePoint2(point, oldPoint, move)

    if (line[2] !== -1) {
      helper.movePoint2(ctrlNodes[line[2]], oldCtrlNodes[line[2]], move)
    }

    let preLine: PenNetworkPath
    let oldPreLine: PenNetworkPath
    if (pointIndex === 0) {
      preLine = path[path.length - 1]
      oldPreLine = oldPath[path.length - 1]
    } else {
      preLine = path[pointIndex - 1]
      oldPreLine = oldPath[pointIndex - 1]
    }
    if (preLine[3] !== -1) {
      helper.movePoint2(ctrlNodes[preLine[3]], oldCtrlNodes[oldPreLine[3]], move)
    }
  }

}