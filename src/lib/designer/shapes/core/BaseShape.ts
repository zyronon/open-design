import {
  BaseEvent2,
  CurrentOperationInfo,
  EditModeType,
  EditType,
  LineType,
  MouseOptionType,
  P,
  ShapeProps,
  ShapeStatus,
  ShapeType
} from "../../types/type"
import CanvasUtil, {CU} from "../../engine/CanvasUtil"
import {cloneDeep, merge} from "lodash"
import {getShapeFromConfig} from "../../utils/common"
import EventBus from "../../event/eventBus"
import {BaseConfig, Rect} from "../../config/BaseConfig"
import helper from "../../utils/helper"
import draw from "../../utils/draw"
import {defaultConfig} from "../../utils/constant"
import {Math2} from "../../utils/math"
import {Bezier} from "../../utils/bezier"
import {BBox, Bezier as BezierJs} from "bezier-js";
import {EventKeys} from "../../event/eventKeys";
import {HandleMirroring, PenNetworkLine, PenNetworkNode} from "../../config/PenConfig";
import {generateNode} from "../../utils/template"
import {Pen} from "../Pen";

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

  defaultCurrentOperationInfo: CurrentOperationInfo = {
    type: undefined,
    lineIndex: -1,
    pointIndex: -1,
    cpIndex: -1
  }
  //编辑模式下：选择状态时，选中的点，用于与编辑状态时按下的点相连
  editStartPointInfo: CurrentOperationInfo = cloneDeep(this.defaultCurrentOperationInfo)
  //编辑模式下，鼠标hover时保存的信息
  editHover: CurrentOperationInfo = cloneDeep(this.defaultCurrentOperationInfo)
  //编辑模式下，鼠标按下时保存的信息
  editEnter: CurrentOperationInfo = cloneDeep(this.defaultCurrentOperationInfo)
  //编辑模式下，编辑状态时，临时点，要与鼠标的点的点相连接
  tempPoint?: P

  constructor(props: ShapeProps) {
    // console.log('props', cloneDeep(props))
    this.conf = helper.initConf(props.conf, props.parent?.conf)
    // console.log('this.conf', cloneDeep(this.conf))
    //如果是一条线，或一个点，计算出来有问题
    this.calcNewCenterAndWidthAndHeight()
    // console.log('this.conf', cloneDeep(this.conf))

    this.parent = props.parent
    this.original = cloneDeep(this.conf)
    // console.log('config', clone(this.conf))
    this.children = this.conf.children?.map((conf: BaseConfig) => {
      return getShapeFromConfig({conf, parent: this})
    }) ?? []

    // @ts-ignore
    window.t = () => this.checkAcr()
  }

  get status() {
    return this._status
  }

  set status(val) {
    let cu = CanvasUtil.getInstance()
    console.log('set-staus', this.conf.name, val, this._status)
    if (val !== this._status) {
      if (this._status === ShapeStatus.Edit) {
        this.calcNewCenterAndWidthAndHeight()
        this.editStartPointInfo = cloneDeep(this.defaultCurrentOperationInfo)
      }
      if (val === ShapeStatus.Select) {
        this.editStartPointInfo = cloneDeep(this.defaultCurrentOperationInfo)
        cu.editShape = undefined
        cu.mode = ShapeType.SELECT
      }
      if (val === ShapeStatus.Edit) {
        if (!this.conf.penNetwork.paths.length) {
          this.getPenNetwork()
        }
        cu.editShape = this
        cu.mode = ShapeType.EDIT
        cu.editModeType = EditModeType.Select
      }
      this._status = val
      EventBus.emit(EventKeys.OPTION_MODE, this._status)
      cu.render()
    }
    console.log('set-staus', this.conf.name, val, this._status)

  }

  get isSelectHover() {
    return this._isSelectHover
  }

  set isSelectHover(val) {
    if (val !== this._isSelectHover) {
      this._isSelectHover = val
      CanvasUtil.getInstance().render()
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
  isInShape(mousePoint: P, cu: CanvasUtil): boolean {
    return helper.isInBox(mousePoint, this.conf.box)
  }

  //当select时，判断是否在图形上
  isInShapeOnSelect(p: P, cu: CanvasUtil): boolean {
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

  //图形转线条
  getPenNetwork() {
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
  canTransmitChildren(cu: CanvasUtil): boolean {
    if (this.hoverType !== MouseOptionType.None) return false
    if (this.conf.type === ShapeType.FRAME) {
      if (this.children.length && !this.parent) {
        return true
      }
    }
    return !this.isCapture || !cu.isDesignMode()
  }

  checkMousePointOnEditStatus(point: P): CurrentOperationInfo {
    // console.log('------------------')
    let {center, realRotation, flipVertical, flipHorizontal} = this.conf
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

    for (let i = 0; i < nodes.length; i++) {
      if (helper.isInPoint(fixMousePoint, nodes[i], judgePointDistance)) {
        // console.log('在点上')
        return {type: EditType.Point, lineIndex: -1, pointIndex: i, cpIndex: -1}
      }
    }

    //判断是否在点上、线上、hover在线的中点上
    for (let lineIndex = 0; lineIndex < paths.length; lineIndex++) {
      let line = paths[lineIndex]
      let lineType = line[4]
      let result = helper.isInLine(fixMousePoint, line, lineType, nodes, ctrlNodes)
      if (result.is) {
        console.log('在线上')
        let returnData = {
          type: EditType.Line,
          lineIndex,
          lineCenterPoint: helper.getLineCenterPoint(line, lineType, nodes, ctrlNodes),
          hoverPoint: fixMousePoint,
          hoverPointT: result.t,
          pointIndex: -1,
          cpIndex: -1
        }
        if (helper.isInPoint(fixMousePoint, returnData.lineCenterPoint, judgePointDistance)) {
          console.log('hover在线的中点上')
          returnData.hoverPointT = 0.5
          returnData.type = EditType.CenterPoint
        }
        return returnData
      }
    }

    //判断是否在cp点上
    let {pointIndex, type} = this.editStartPointInfo
    if (type === EditType.Point || type === EditType.ControlPoint) {
      let waitCheckPoints: any[] = []
      waitCheckPoints.push({pointIndex})
      paths.map((line, index) => {
        if (line.slice(0, 2).includes(pointIndex)) {
          if (line[0] !== pointIndex) waitCheckPoints.push({pointIndex: line[0]})
          if (line[1] !== pointIndex) waitCheckPoints.push({pointIndex: line[1]})
        }
      })

      // console.log('waitCheckPoints', waitCheckPoints, pointIndex)
      for (let i = 0; i < waitCheckPoints.length; i++) {
        let item = waitCheckPoints[i]
        for (let j = 0; j < nodes[item.pointIndex].cps.length; j++) {
          let cpIndex = nodes[item.pointIndex].cps[j]
          if (cpIndex !== -1) {
            if (helper.isInPoint(fixMousePoint, ctrlNodes[cpIndex], judgePointDistance)) {
              console.log('在cp点上')
              return {type: EditType.ControlPoint, pointIndex: item.pointIndex, lineIndex: -1, cpIndex: j}
            }
          }
        }
      }
    }
    return {type: undefined, pointIndex: -1, lineIndex: -1, cpIndex: -1}
  }

  _isInShape(mousePoint: P, cu: CanvasUtil): boolean {
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
    // this.log('render')
    let {x, y} = draw.calcPosition(ctx, this.conf)
    let newLayout = {...this.conf.layout, x, y}
    // let newLayout = {...this.conf.layout, }
    // console.log('this.status', this.status)
    // console.log('newLayout',newLayout,this.conf.center)
    if (this.status === ShapeStatus.Edit) {
      this.drawEdit(ctx, newLayout)
    } else {
      this.drawShape(ctx, newLayout, parent,)
    }
    // ctx.globalCompositeOperation = 'source-atop'
    //恢复本次图形渲染前的矩阵变换。
    //可以用ctx.restore() 来恢复，但那样会导致clip方法裁剪的区域也被恢复（即仅作用于本组件）。
    //导致后续绘制子组件时，如果超出父组件边界时，无法被裁剪。
    let nv = CanvasUtil.getInstance().storedTransform
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
      CanvasUtil.getInstance().waitRenderOtherStatusFunc.push(() => this.renderOtherStatus(ctx, newLayout))
    }
    // console.log('render')

    // this.renderOtherStatus(ctx, {x, y})
  }

  renderOtherStatus(ctx: CanvasRenderingContext2D, newLayout: Rect) {
    let cu = CanvasUtil.getInstance()
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
    console.log(this.conf.name, ':', val, ',id:', this.conf.id)
  }

  /** @desc 事件转发方法
   * @param event 合成的事件
   * @param parents 父级链
   * @param isParentDbClick 是否是来自父级双击，是的话，不用转发事件
   * @param from
   * */
  event(event: BaseEvent2, parents?: BaseShape[], isParentDbClick?: boolean, from?: string): boolean {
    //TODO 感觉应该在这里先判断是否被消费了

    let {nativeEvent, point, type} = event

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
      this.dispatch(event, parents)
      return true
    }

    let cu = CanvasUtil.getInstance()

    //只有在状态是普通或者hover时，需要判断父级是否裁剪。因为选中和编辑时，所有事件都能直接传递到图形上
    if (this.status === ShapeStatus.Normal || this.status === ShapeStatus.Hover) {
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
        this.dispatch(event, parents)
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

  dispatch(event: BaseEvent2, p: BaseShape[] = []) {
    // @ts-ignore
    this['_' + event.type]?.(event, p)
  }

  _dblclick(event: BaseEvent2, parents: BaseShape[] = []) {
    console.log('on-dblclick', this.conf.name, this._status)
    // console.log('core-dblclick', this.editStartPointInfo, this.editHover)
    if (this.onDbClick(event, parents)) return
    if (this.status === ShapeStatus.Edit) {
      let cu = CanvasUtil.getInstance()
      const {pointIndex, type} = this.editStartPointInfo
      const {nodes, paths, ctrlNodes} = this.conf.penNetwork

      if (type) {
        if (type === EditType.Point) {
          //关联的线条，边缘点需要特殊处理
          let relationLines = paths.filter((line) => line.slice(0, 2).includes(pointIndex))
          if (relationLines.length === 0) return
          let point = nodes[pointIndex]
          // console.log('relationLines', relationLines)
          // console.log('point.handleMirroring', point.handleMirroring)
          if (point.handleMirroring === HandleMirroring.RightAngle) {
            switch (relationLines.length) {
              case 1:
                let cp1 = {x: point.x - 100, y: point.y}
                let cp2 = {x: point.x + 100, y: point.y}
                ctrlNodes.push(cp1)
                ctrlNodes.push(cp2)
                point.cps = [ctrlNodes.length - 2, ctrlNodes.length - 1]
                let currentLine = relationLines[0]
                let otherPoint = nodes[currentLine[0] === pointIndex ? currentLine[1] : currentLine[0]]
                //如果是二次曲线，只需要改变空的那个控制点，其他控制点保持不变
                if (currentLine[4] === LineType.Bezier2) {
                  currentLine[4] = LineType.Bezier3
                  //如果另一个点在当前点的右边
                  if (otherPoint.x >= point.x) {
                    if (currentLine[3] === -1) currentLine[3] = point.cps[1]
                    else currentLine[2] = point.cps[1]
                  } else {
                    if (currentLine[3] === -1) currentLine[3] = point.cps[0]
                    else currentLine[2] = point.cps[0]
                  }
                } else {
                  currentLine[4] = LineType.Bezier2
                  if (otherPoint.x >= point.x) {
                    currentLine[2] = point.cps[0]
                    currentLine[3] = point.cps[1]
                  } else {
                    currentLine[2] = point.cps[1]
                    currentLine[3] = point.cps[0]
                  }
                }
                point.handleMirroring = HandleMirroring.MirrorAngleAndLength
                break
              case 2:
                let line0 = relationLines[0]
                let line1 = relationLines[1]
                let line0NodeIndex = line0[0] === pointIndex ? line0[1] : line0[0]
                let line1NodeIndex = line1[0] === pointIndex ? line1[1] : line1[0]
                let node0 = nodes[line0NodeIndex]
                let node1 = nodes[line1NodeIndex]
                let {l, r} = Bezier.getTargetPointControlPoints(
                  node0,
                  point,
                  node1)
                // console.log(l, r)
                ctrlNodes.push(l)
                ctrlNodes.push(r)
                point.cps = [ctrlNodes.length - 2, ctrlNodes.length - 1]

                //判断l或r，与其中一个点x连成的线条，是否与另一条线交叉。不交叉说明l或r应该是x的cp点
                let rr = Math2.isIntersection(node0, point, node1, l)
                if (rr) {
                  line1[0] === pointIndex ? (line1[2] = point.cps[1]) : (line1[3] = point.cps[1])
                  line0[0] === pointIndex ? (line0[2] = point.cps[0]) : (line0[3] = point.cps[0])
                } else {
                  if (line1[0] === pointIndex) {
                    line1[2] = point.cps[0]
                  } else {
                    line1[3] = point.cps[0]
                  }
                  if (line0[0] === pointIndex) {
                    line0[2] = point.cps[1]
                  } else {
                    line0[3] = point.cps[1]
                  }
                }

                if (line0[4] === LineType.Bezier2) {
                  line0[4] = LineType.Bezier3
                } else {
                  line0[4] = LineType.Bezier2
                }
                if (line1[4] === LineType.Bezier2) {
                  line1[4] = LineType.Bezier3
                } else {
                  line1[4] = LineType.Bezier2
                }
                point.handleMirroring = HandleMirroring.MirrorAngleAndLength
                break
              default:
              //TODO 超过两条边时
            }
          } else {
            point.cps = [-1, -1]
            point.handleMirroring = HandleMirroring.RightAngle
            paths.map((line, index) => {
              if (line.slice(0, 2).includes(pointIndex)) {
                if (line[0] === pointIndex) line[2] = -1
                if (line[1] === pointIndex) line[3] = -1
                if (line[4] === LineType.Bezier3) {
                  line[4] = LineType.Bezier2
                } else {
                  line[4] = LineType.Line
                }
              }
            })
          }
          cu.render()
        } else {
          this.status = ShapeStatus.Select
        }
      } else {
        //2024/5/13这里必须先把原来的图形的状态改为Select，不然后面toPen生成的Pen的状态一直是Edit，不知道是为什么
        this.status = ShapeStatus.Select
        if (this.conf.isCustom && this.constructor.name !== 'Pen') {
          this.toPen()
        }
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

    let cu = CanvasUtil.getInstance()
    // console.log('_mousedown', this.conf.name, this.conf.id, this._status, cu.children)

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
      const {nodes, paths, ctrlNodes} = this.conf.penNetwork

      let result = this.checkMousePointOnEditStatus(event.point)
      // console.log('result', cloneDeep(result))
      let {lineIndex, pointIndex, cpIndex, type} = result

      if (cu.editModeType === EditModeType.Select) {
        //这里还得再判断点击结果，因为如果是原地点击的话，editHover是没有值的
        // let {lineIndex, pointIndex, cpIndex, type} = this.editHover
        //如果hover在点上，先处理hover
        if (type) {
          //图省事儿，直接把editHover设为默认值。不然鼠标移动点或线时。还会渲染lineCenterPoint
          //但lineCenterPoint的点又不正确
          this.editHover = cloneDeep(this.defaultCurrentOperationInfo)
          if (type === EditType.CenterPoint) {
            this.conf.isCustom = true
            let point: PenNetworkNode = {
              ...result.lineCenterPoint!,
              cornerRadius: 0,
              realCornerRadius: 0,
              handleMirroring: HandleMirroring.RightAngle,
              cornerCps: [-1, -1],
              cps: [-1, -1],
            }
            let line: PenNetworkLine = paths[lineIndex]
            let lineType = line[4]
            if (lineType === LineType.Line) {
              nodes.push(point)
              paths.splice(lineIndex + 1, 0, [nodes.length - 1, line[1], -1, -1, LineType.Line])
              line[1] = nodes.length - 1
            } else {
              let startPoint = nodes[line[0]]
              let endPoint = nodes[line[1]]
              let p0 = ctrlNodes[line[2]]
              let p1 = ctrlNodes[line[3]]
              let b: BezierJs
              if (lineType === LineType.Bezier2) {
                let cp: P
                if (line[2] !== -1) cp = p0
                if (line[3] !== -1) cp = p1
                b = new BezierJs(startPoint, cp!, endPoint)
              }
              if (lineType === LineType.Bezier3) {
                b = new BezierJs(startPoint, p0, p1, endPoint)
              }
              let {left, right} = b!.split(0.5)

              if (p0) {
                p0.x = left.points[1].x
                p0.y = left.points[1].y
              } else {
                //如果没有控制点，那么加一个
                ctrlNodes.push(left.points[1])
                line[2] = ctrlNodes.length - 1
                //记得同步到point里面的cps里面去
                startPoint.cps[1] = line[2]
              }

              if (startPoint.handleMirroring === HandleMirroring.MirrorAngleAndLength) {
                startPoint.handleMirroring = HandleMirroring.MirrorAngle
              } else {
                startPoint.handleMirroring = HandleMirroring.NoMirror
              }

              //如果是三次曲线，会在多出的中间点出加上控制点。所以这里要取第2个值，第一个值是中间点的控制点
              let cpIndex = lineType === LineType.Bezier3 ? 2 : 1
              if (p1) {
                p1.x = right.points[cpIndex].x
                p1.y = right.points[cpIndex].y
              } else {
                ctrlNodes.push(right.points[cpIndex])
                line[3] = ctrlNodes.length - 1
                endPoint.cps[0] = line[3]
              }

              if (endPoint.handleMirroring === HandleMirroring.MirrorAngleAndLength) {
                endPoint.handleMirroring = HandleMirroring.MirrorAngle
              } else {
                endPoint.handleMirroring = HandleMirroring.NoMirror
              }

              //先定义，后push的，所以length不减1
              let newLine: PenNetworkLine = [nodes.length, line[1], -1, line[3], LineType.Bezier2]
              if (lineType === LineType.Bezier3) {
                ctrlNodes.push(left.points[2])
                ctrlNodes.push(right.points[1])
                point.handleMirroring = HandleMirroring.MirrorAngleAndLength
                point.cps = [ctrlNodes.length - 2, ctrlNodes.length - 1]
                newLine = [nodes.length, line[1], ctrlNodes.length - 1, line[3], LineType.Bezier3]
                line[3] = ctrlNodes.length - 2
              } else {
                line[3] = -1
              }
              nodes.push(point)
              paths.splice(lineIndex + 1, 0, newLine)
              line[1] = nodes.length - 1
              // console.log('b2', b!.bbox())
            }
            //这里新增了一个点，但是老配置如果不更新。后面移动时就会找错点
            this.original = cloneDeep(this.conf)
            cu.render()
            result.lineIndex = -1
            result.pointIndex = nodes.length - 1
            result.type = EditType.Point
          }

          if (type !== EditType.Line) {
            EventBus.emit(EventKeys.POINT_INFO, {
              pointIndex: pointIndex,
              lineIndex: lineIndex,
              point: this.getPoint(result)
            })
          }

          this.editEnter = result
          if (JSON.stringify(this.editStartPointInfo) !== JSON.stringify(result)) {
            this.editStartPointInfo = result
            cu.render()
          }
          return
        }

        //能走到这，说明未选中任何点。那么判断是否已选中，选中就给取消掉
        if (this.editStartPointInfo.type) {
          this.editStartPointInfo = cloneDeep(this.defaultCurrentOperationInfo)
          cu.render()
        }
      }

      if (cu.editModeType === EditModeType.Edit) {
        this.conf.isCustom = true
        this.mouseDown = true
        let fixMousePoint = {
          x: event.point.x - center.x,
          y: event.point.y - center.y
        }
        let endPoint: PenNetworkNode = {
          ...fixMousePoint,
          cornerRadius: 0,
          realCornerRadius: 0,
          handleMirroring: HandleMirroring.RightAngle,
          cornerCps: [-1, -1],
          cps: [-1, -1],
        }

        let espi = this.editStartPointInfo
        // console.log('type', type)
        // console.log('espi', espi)
        if (espi.type) {
          if (type) {
            if (type === EditType.Point) {
              let lastPoint = nodes[pointIndex]
              if (lastPoint.cps[1] !== -1) {
                paths.push([espi.pointIndex, pointIndex, lastPoint.cps[1], -1, LineType.Bezier2])
              } else {
                paths.push([espi.pointIndex, pointIndex, -1, -1, LineType.Line])
              }
              this.editStartPointInfo.lineIndex = -1
              this.editStartPointInfo.pointIndex = pointIndex
              this.editStartPointInfo.type = EditType.Point
            } else {
              //TODO 如果是按在线上
              console.log(2, result)
              helper.splitLine(this.conf.penNetwork, result)
              let lastPoint = nodes[espi.pointIndex]
              if (lastPoint.cps[1] !== -1) {
                paths.push([espi.pointIndex, nodes.length - 1, lastPoint.cps[1], -1, LineType.Bezier2])
              } else {
                paths.push([espi.pointIndex, nodes.length - 1, -1, -1, LineType.Line])
              }
              this.editStartPointInfo.lineIndex = -1
              this.editStartPointInfo.pointIndex = nodes.length - 1
              this.editStartPointInfo.type = EditType.Point
              this.tempPoint = undefined
            }
          } else {
            let lastPoint = nodes[espi.pointIndex]
            nodes.push(endPoint)
            if (lastPoint.cps[1] !== -1) {
              paths.push([espi.pointIndex, nodes.length - 1, lastPoint.cps[1], -1, LineType.Bezier2])
            } else {
              paths.push([espi.pointIndex, nodes.length - 1, -1, -1, LineType.Line])
            }
            this.editStartPointInfo.lineIndex = -1
            this.editStartPointInfo.pointIndex = nodes.length - 1
            this.editStartPointInfo.type = EditType.Point
          }
        } else {
          if (type) {
            if (type === EditType.Point) {
              this.editStartPointInfo.lineIndex = -1
              this.editStartPointInfo.pointIndex = pointIndex
              this.editStartPointInfo.type = EditType.Point
              this.tempPoint = undefined
            } else {
              helper.splitLine(this.conf.penNetwork, result)
              this.editStartPointInfo.lineIndex = -1
              this.editStartPointInfo.pointIndex = result.pointIndex
              this.editStartPointInfo.type = EditType.Point
              this.tempPoint = undefined
            }
          } else {
            if (this.tempPoint) {
              let startPoint: PenNetworkNode = {
                ...this.tempPoint,
                cornerRadius: 0,
                realCornerRadius: 0,
                handleMirroring: HandleMirroring.RightAngle,
                cornerCps: [-1, -1],
                cps: [-1, -1],
              }
              nodes.push(startPoint)
              nodes.push(endPoint)
              paths.push([nodes.length - 2, nodes.length - 1, -1, -1, LineType.Line])
              this.editStartPointInfo.lineIndex = -1
              this.editStartPointInfo.pointIndex = nodes.length - 1
              this.editStartPointInfo.type = EditType.Point
              this.tempPoint = undefined
            } else {
              this.tempPoint = fixMousePoint
            }
          }
        }
        cu.render()
      }
    }

    if (this.onMouseDowned(event, parents)) return
  }

  _mousemove(event: BaseEvent2, parents: BaseShape[] = []) {
    // console.log('mousemove', this.conf.name, this._status)
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
      let {nativeEvent, point, type} = event
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
      let cu = CanvasUtil.getInstance()
      let {center, realRotation, flipHorizontal, flipVertical} = this.conf
      const {nodes, paths, ctrlNodes} = this.conf.penNetwork

      if (cu.editModeType === EditModeType.Select) {
        const {lineIndex, cpIndex, pointIndex, type} = this.editEnter
        // console.log('this.editEnter', this.editEnter)
        //未选中任何内容，还属于判断阶段
        if (type) {

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
          const {nodes: oldNodes, paths: oldPaths, ctrlNodes: oldCtrlNodes} = this.original.penNetwork

          if (type === EditType.ControlPoint) {
            let point = nodes[pointIndex]
            let cp0 = ctrlNodes[point.cps[0]]
            let oldCp0 = oldCtrlNodes[point.cps[0]]
            let cp1 = ctrlNodes[point.cps[1]]
            let oldCp1 = oldCtrlNodes[point.cps[1]]

            // let oldPoint = oldNodes[paths[lineIndex][pointIndex][0]]
            if (cpIndex === 0) {
              cp0.x += event.movement.x
              cp0.y += event.movement.y
              if (point.handleMirroring === HandleMirroring.MirrorAngleAndLength) {
                let p = Math2.getRotatedPoint(cp0, point, 180)
                cp1.x = p.x
                cp1.y = p.y
              }
              if (point.handleMirroring === HandleMirroring.MirrorAngle) {
                //这里不能直接用反转，因为长度不一直对称
                let moveDegree = Math2.getDegree(point, oldCp0, cp0)
                let p = Math2.getRotatedPoint(oldCp1, point, moveDegree)
                cp1.x = p.x
                cp1.y = p.y
              }
            }
            if (cpIndex === 1) {
              cp1.x += event.movement.x
              cp1.y += event.movement.y
              if (point.handleMirroring === HandleMirroring.MirrorAngleAndLength) {
                let p = Math2.getRotatedPoint(cp1, point, 180)
                cp0.x = p.x
                cp0.y = p.y
              }
              if (point.handleMirroring === HandleMirroring.MirrorAngle) {
                let moveDegree = Math2.getDegree(point, oldCp1, cp1)
                let p = Math2.getRotatedPoint(oldCp0, point, moveDegree)
                cp0.x = p.x
                cp0.y = p.y
              }
            }
            this.conf.isCache = false
            cu.render()
          }

          if (type === EditType.Point || type === EditType.CenterPoint) {
            this.movePoint(pointIndex, event.movement)
            this.conf.isCache = false
            cu.render()
          }

          if (type === EditType.Line) {
            this.movePoint(paths[lineIndex][0], event.movement)
            this.movePoint(paths[lineIndex][1], event.movement)
            this.conf.isCache = false
            cu.render()
          }
          // this.checkAcr()
        } else {
          let result = this.checkMousePointOnEditStatus(event.point)
          // console.log('re',result)
          //用于判断是否与之前保存的值不同，仅在不同时才重绘
          if (this.editHover.type !== result.type) {
            this.editHover = cloneDeep(result)
            document.body.style.cursor = "pointer"
            cu.render()
            return true
          }
          //hover时，消费事件。不然会把cursor = "default"
          if (result.type) {
            document.body.style.cursor = "pointer"
            return true
          }
          document.body.style.cursor = "default"
        }
      }

      if (cu.editModeType === EditModeType.Edit) {
        let result = this.checkMousePointOnEditStatus(event.point)
        // console.log('re',result)
        //用于判断是否与之前保存的值不同，仅在不同时才重绘
        //TODO 可以提取成方法，cu.editModeType === EditModeType.Select也判断了
        if (this.editHover.type !== result.type) {
          this.editHover = cloneDeep(result)
          cu.render()
        }

        if (this.tempPoint) {
          let lastPoint = this.tempPoint
          let ctx = cu.ctx
          cu.waitRenderOtherStatusFunc.push(() => {
            let fixLastPoint = {
              x: center.x + lastPoint.x,
              y: center.y + lastPoint.y,
            }
            ctx.save()
            ctx.beginPath()
            ctx.moveTo2(fixLastPoint)
            ctx.strokeStyle = defaultConfig.strokeStyle
            ctx.lineTo2(event.point)
            ctx.stroke()
            draw.drawRound(ctx, event.point)
            ctx.restore()
          })
          cu.render()
          return
        }
        let {pointIndex, lineIndex, type} = this.editStartPointInfo
        if (!type) return

        if (type === EditType.Point) {
          // console.log('pen-onMouseMove', lastPoint.center, event.point)
          let lastPoint = nodes[pointIndex]
          let ctx = cu.ctx
          if (this.mouseDown) {
            let line = paths[paths.length - 1]
            let fixMousePoint = {
              x: event.point.x - center.x,
              y: event.point.y - center.y
            }
            let cp1 = helper.reversePoint(cloneDeep(fixMousePoint), lastPoint)
            if (line[3] === -1) {
              ctrlNodes.push(fixMousePoint)
              ctrlNodes.push(cp1)
              lastPoint.cps[0] = ctrlNodes.length - 1
              lastPoint.cps[1] = ctrlNodes.length - 2
              lastPoint.handleMirroring = HandleMirroring.MirrorAngleAndLength
              line[3] = lastPoint.cps[0]
              if (line[4] === LineType.Line) {
                line[4] = LineType.Bezier2
              } else {
                line[4] = LineType.Bezier3
              }
            } else {
              ctrlNodes[lastPoint.cps[0]] = cp1
              ctrlNodes[lastPoint.cps[1]] = fixMousePoint
            }
          } else {
            cu.waitRenderOtherStatusFunc.push(() => {
              let fixLastPoint = {
                x: center.x + lastPoint.x,
                y: center.y + lastPoint.y,
              }
              ctx.save()
              ctx.beginPath()
              ctx.moveTo2(fixLastPoint)
              ctx.strokeStyle = defaultConfig.strokeStyle
              if (lastPoint.cps.length && lastPoint.cps[1] !== -1) {
                let cp = ctrlNodes[lastPoint.cps[1]]
                let fixLastPointCp2 = {
                  x: center.x + cp.x,
                  y: center.y + cp.y,
                }
                ctx.quadraticCurveTo2(fixLastPointCp2, event.point)
              } else {
                ctx.lineTo2(event.point)
              }
              ctx.stroke()
              draw.drawRound(ctx, event.point)
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
      CanvasUtil.getInstance().render()
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
    if (!this.conf.isCustom) return
    let {center, realRotation, flipHorizontal, flipVertical, layout} = this.conf
    const {nodes, paths, ctrlNodes} = this.conf.penNetwork

    let maxX: number, minX: number, maxY: number, minY: number
    maxX = maxY = 0
    minX = minY = Infinity

    let checkLine = (node: PenNetworkNode) => {
      let x = center.x + node.x
      let y = center.y + node.y
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

    paths.map((line) => {
      let startPoint = nodes[line[0]]
      let endPoint = nodes[line[1]]
      switch (line[4]) {
        case LineType.Line:
          checkLine(startPoint)
          checkLine(endPoint)
          break
        case LineType.Bezier2:
          let cp: number = 0
          if (line[2] !== -1) cp = line[2]
          if (line[3] !== -1) cp = line[3]
          let b2 = new BezierJs(startPoint, ctrlNodes[cp], endPoint)
          checkBezier(b2.bbox())
          break
        case LineType.Bezier3:
          let b3 = new BezierJs(startPoint, ctrlNodes[line[2]], ctrlNodes[line[3]], endPoint)
          checkBezier(b3.bbox())
          break
      }
    })

    //处理只有一个点的情况
    if (paths.length === 0) {
      minY = maxY = layout.x
      minX = maxX = layout.y
    }

    // console.log(
    //   'maxX', maxX,
    //   'minX', minX,
    //   'maxY', maxY,
    //   'minY', minY,
    // )

    let newWidth = maxX - minX
    let newHeight = maxY - minY

    let newCenter = {
      x: minX + newWidth / 2,
      y: minY + newHeight / 2,
    }
    // console.log('newCenter', newCenter)

    //因为lineShapes的点的值，是相对于center的。所以还需要修正。新center减去老center得到偏移量
    //点的值再减去偏移值，就是以新center为相对值的点值
    let dx = newCenter.x - center.x
    let dy = newCenter.y - center.y
    nodes.map(p => {
      p.x -= dx
      p.y -= dy
    })
    ctrlNodes.map(p => {
      p.x -= dx
      p.y -= dy
    })
    if (flipHorizontal) newCenter.x = helper._reversePoint(newCenter.x, center.x)
    if (flipVertical) newCenter.y = helper._reversePoint(newCenter.y, center.y)

    //如果有旋转，那么新center要相对于老center旋转。因为所有的点和老中心点是没有度数的
    //所以计算出来的最大值和最小值都是0度情况下的值，对应算出来的新中心点也是0度。
    //如果直接使用会导致偏移。
    if (realRotation) {
      newCenter = Math2.getRotatedPoint(newCenter, center, realRotation)
    }
    // console.log('newCenter', newCenter)
    //TODO
    if (newWidth === 0 || newHeight === 0 || paths.length === 0) {
      this.conf.isPointOrLine = true
      let w = 10 / CU.i().handScale
      if ([0, Infinity].includes(newWidth)) {
        newWidth = w
      }
      if ([0, Infinity].includes(newHeight)) {
        newHeight = w
      }
    } else {
      this.conf.isPointOrLine = false
    }

    this.conf.center = newCenter
    this.conf.layout.w = newWidth
    this.conf.layout.h = newHeight
    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    this.notifyConfUpdate()
  }

  protected notifyConfUpdate() {
    EventBus.emit(EventKeys.ON_CONF_CHANGE)
  }

  pointRadiusChange(e: any, val: any) {
    let point = this.getPoint({
      type: EditType.Point,
      pointIndex: val.pointIndex,
      cpIndex: -1,
      lineIndex: -1,
    })
    point.cornerRadius = e
    if (e === 0) {
      point.realCornerRadius = 0
    } else {
      this.conf.isCache = false
    }
    this.checkAcr3(val.pointIndex, e)
    CanvasUtil.getInstance().render()
    EventBus.emit(EventKeys.POINT_INFO, Object.assign({}, val, {point}))
  }

  checkAcr3(nodeIndex: number, e: number) {
    const {nodes, paths, ctrlNodes} = this.conf.penNetwork
    let newPaths = cloneDeep(paths)
    let newNodes = cloneDeep(nodes)

    let currentNode = nodes[nodeIndex]
    currentNode.cornerRadius = e!
    const {linePoints} = this.conf.cache

    let lines = newPaths.filter(p => p.slice(0, 2).includes(nodeIndex))
    if (lines.length === 2) {
      let line0 = lines[0]
      let line1 = lines[1]
      let line0NodeIndex = line0[0] === nodeIndex ? line0[1] : line0[0]
      let line1NodeIndex = line1[0] === nodeIndex ? line1[1] : line1[0]
      let node0 = newNodes[line0NodeIndex]
      let node1 = newNodes[line1NodeIndex]

      let endRadius = e

      // let line0PointIndex = linePoints.get(`${line0NodeIndex}-${line0.id}`)
      // let line1PointIndex = linePoints.get(`${line1NodeIndex}-${line1.id}`)
      // if (line0PointIndex !== undefined || line1PointIndex !== undefined) {
      //   const {nodes: cacheNodes} = this.conf.cache
      //   let _node0 = node0
      //   let _node1 = node1
      //   if (line0PointIndex !== undefined) {
      //     _node0 = cacheNodes[line0PointIndex]
      //   }
      //   if (line1PointIndex !== undefined) {
      //     _node1 = cacheNodes[line1PointIndex]
      //   }
      //
      //
      //   let {
      //     adjacentSide,
      //     tan,
      //     d2,
      //     degree
      //   } = this.getAdjacentSide(currentNode, _node0, _node1, endRadius)
      //
      //   let frontSide = Math2.getHypotenuse2(currentNode, _node0)
      //   let backSide = Math2.getHypotenuse2(currentNode, _node1)
      //
      //   let min = Math.min(frontSide, backSide)
      //   let secondMaxRadius = tan * min
      //   if (e > secondMaxRadius) {
      //     endRadius = secondMaxRadius + (e - secondMaxRadius) / 100
      //   }
      // }

      let maxR = 200
      if (endRadius > maxR) {
        endRadius = maxR
      }
      currentNode.realCornerRadius = endRadius
    }
  }

  checkAcr() {
    this.checkAcr2()
  }

  checkAcr2() {
    const {nodes, paths, ctrlNodes} = this.conf.penNetwork
    let newPaths = cloneDeep(paths).map((v, i) => ({id: i, line: v}))
    let newNodes = cloneDeep(nodes)
    let newCtrlNodes = cloneDeep(ctrlNodes)

    nodes.map((currentNode, nodeIndex) => {
      // let nodeIndex = 0
      // let currentNode = nodes[nodeIndex]
      let r = currentNode.realCornerRadius
      if (r) {
        //找到包含这个点的所有边
        let lines = newPaths.filter(p => p.line.slice(0, 2).includes(nodeIndex))
        if (lines.length === 2) {
          let line0 = lines[0]
          let line1 = lines[1]
          let line0NodeIndex = line0.line[0] === nodeIndex ? line0.line[1] : line0.line[0]
          let line1NodeIndex = line1.line[0] === nodeIndex ? line1.line[1] : line1.line[0]
          let node0 = newNodes[line0NodeIndex]
          let node1 = newNodes[line1NodeIndex]
          let arcP0
          let arcP1
          let arcCenter: any
          let newLine0: PenNetworkLine
          let newLine1: PenNetworkLine
          let centerLine: PenNetworkLine

          if (line0.line[4] === LineType.Line && line1.line[4] === LineType.Line) {
            let {
              adjacentSide,
              tan,
              d2,
              degree
            } = this.getAdjacentSide(currentNode, node0, node1, r)

            let frontSide = Math2.getHypotenuse2(currentNode, node0)
            let backSide = Math2.getHypotenuse2(currentNode, node1)

            let min = Math.min(frontSide, backSide)
            let maxR = tan * min
            if (maxR < r) r = maxR
            //因为r变了，这里重新算一下邻边
            adjacentSide = r / tan

            //如果邻边比最小的边还长，那么设置为最小边长
            if (adjacentSide > min) adjacentSide = min

            let k = adjacentSide / frontSide
            arcP0 = generateNode({
              x: currentNode.x + (node0.x - currentNode.x) * k,
              y: currentNode.y + (node0.y - currentNode.y) * k,
            })
            let k2 = adjacentSide / backSide
            arcP1 = generateNode({
              x: currentNode.x + (node1.x - currentNode.x) * k2,
              y: currentNode.y + (node1.y - currentNode.y) * k2,
            })

            newNodes.push(arcP0)
            newLine0 = [line0NodeIndex, newNodes.length - 1, -1, -1, line0.line[4]]
            newNodes.push(arcP1)
            newLine1 = [newNodes.length - 1, line1NodeIndex, -1, -1, line0.line[4]]

            // newPaths3[line0.id].line[4] = newNodes.length-2
            // newPaths3[line1.id].line[4] = newNodes.length-1

            //中心点，因为r是半径，求斜边用sin可以算
            let sin = Math.abs(Math.sin(Math2.jiaodu2hudu(d2)))
            let k3 = (r / sin) / frontSide
            arcCenter = generateNode({
              x: currentNode.x + (node0.x - currentNode.x) * k3,
              y: currentNode.y + (node0.y - currentNode.y) * k3,
            })
            arcCenter = Math2.getRotatedPoint(arcCenter, currentNode, degree > 180 ? -d2 : d2)

            let arc = Bezier.arcToBezier3_2(arcP0, arcP1, arcCenter)
            newCtrlNodes.push(...arc)
            centerLine = [
              newNodes.length - 2,
              newNodes.length - 1,
              newCtrlNodes.length - 2,
              newCtrlNodes.length - 1,
              LineType.Bezier3]

          } else if (line0.line[4] !== LineType.Line && line1.line[4] !== LineType.Line) {
            let curve0
            if (line0.line[4] === LineType.Bezier2) {
              let cp: number = 0
              if (line0.line[2] !== -1) cp = line0.line[2]
              if (line0.line[3] !== -1) cp = line0.line[3]
              curve0 = new BezierJs([currentNode, newCtrlNodes[cp], node0])
            } else {
              if (line0.line[0] === nodeIndex) {
                curve0 = new BezierJs([currentNode, newCtrlNodes[line0.line[2]], newCtrlNodes[line0.line[3]], node0])
              } else {
                curve0 = new BezierJs([currentNode, newCtrlNodes[line0.line[3]], newCtrlNodes[line0.line[2]], node0])
              }
            }

            let curve1
            if (line1.line[4] === LineType.Bezier2) {
              let cp: number = 0
              if (line1.line[2] !== -1) cp = line1.line[2]
              if (line1.line[3] !== -1) cp = line1.line[3]
              curve1 = new BezierJs([currentNode, newCtrlNodes[cp], node1])
            } else {
              if (line1.line[0] === nodeIndex) {
                curve1 = new BezierJs([currentNode, newCtrlNodes[line1.line[2]], newCtrlNodes[line1.line[3]], node1])
              } else {
                curve1 = new BezierJs([currentNode, newCtrlNodes[line1.line[3]], newCtrlNodes[line1.line[2]], node1])
              }
            }

            let result = this.getTT2(currentNode, curve0, curve1, node0, node1, r)
            const {arcP0, arcP1, t0, t1, maxR} = result

            let {tan, d2, degree} = this.getAdjacentSide(currentNode, arcP0, arcP1, maxR)
            console.log('re', result,)

            let newR = tan * maxR
            //中心点，因为r是半径，求斜边用sin可以算
            // let sin = Math.abs(Math.sin(Math2.jiaodu2hudu(d2)))
            // let line0Length = Math2.getHypotenuse2(currentNode, arcP0)
            //这里可以直接使用maxR，因为这里的arc曲线的实现方式不同与其他。这里arc曲线的起点和终点都是恒等于r
            // r又经过限制，不能超出三（二）次曲线的最大长度（非起点和终点连一起的长度）
            // let line0Length = maxR
            // let k3 = (newR / sin) / line0Length
            // let arcCenter = generateNode({
            //   x: currentNode.x + (arcP0.x - currentNode.x) * k3,
            //   y: currentNode.y + (arcP0.y - currentNode.y) * k3,
            // })
            // arcCenter = Math2.getRotatedPoint(arcCenter, currentNode, degree > 180 ? -d2 : d2)
            // let arc = Bezier.arcToBezier3_2(arcP0, arcP1, arcCenter)

            let curve0Split = curve0.split(t0)
            let curve1Split = curve1.split(t1)
            let curve0LeftPoints = curve0Split.left.points
            let curve1LeftPoints = curve1Split.left.points
            let curve0RightPoints = curve0Split.right.points
            let curve1RightPoints = curve1Split.right.points

            newNodes.push(arcP0)
            newCtrlNodes.push(curve0RightPoints[curve0RightPoints.length - 2])
            newLine0 = [
              line0NodeIndex,
              newNodes.length - 1,
              newCtrlNodes.length - 1,
              -1,
              line0.line[4]
              // LineType.Line
            ]
            newNodes.push(arcP1)
            newCtrlNodes.push(curve1RightPoints[curve1RightPoints.length - 3])
            newCtrlNodes.push(curve1RightPoints[curve1RightPoints.length - 2])
            newLine1 = [
              newNodes.length - 1,
              line1NodeIndex,
              newCtrlNodes.length - 2,
              newCtrlNodes.length - 1,
              line1.line[4],
            ]

            newCtrlNodes.push(curve0LeftPoints[curve0LeftPoints.length - 2])
            newCtrlNodes.push(curve1LeftPoints[curve1LeftPoints.length - 2])

            centerLine = [
              newNodes.length - 2,
              newNodes.length - 1,
              newCtrlNodes.length - 2,
              newCtrlNodes.length - 1,
              LineType.Bezier3
            ]
          } else {
            let zhiLine
            let wanLine: { line: any; id?: number }
            let zhiP
            let zhiIndex
            let wanP: P
            let wanIndex
            if (line0.line[4] === LineType.Line) {
              zhiLine = line0
              wanLine = line1
            } else {
              zhiLine = line1
              wanLine = line0
            }
            if (zhiLine.line[0] === nodeIndex) {
              zhiIndex = zhiLine.line[1]
            } else {
              zhiIndex = zhiLine.line[0]
            }

            if (wanLine.line[0] === nodeIndex) {
              wanIndex = wanLine.line[1]
            } else {
              wanIndex = wanLine.line[0]
            }
            wanP = nodes[wanIndex]
            zhiP = nodes[zhiIndex]

            let curve
            if (wanLine.line[4] === LineType.Bezier2) {
              let cp: number = 0
              if (wanLine.line[2] !== -1) cp = wanLine.line[2]
              if (wanLine.line[3] !== -1) cp = wanLine.line[3]
              curve = new BezierJs([currentNode, newCtrlNodes[cp], wanP])
            } else {
              if (wanLine.line[0] === nodeIndex) {
                curve = new BezierJs([currentNode, newCtrlNodes[wanLine.line[2]], newCtrlNodes[wanLine.line[3]], wanP])
              } else {
                curve = new BezierJs([currentNode, newCtrlNodes[wanLine.line[3]], newCtrlNodes[wanLine.line[2]], wanP])
              }
            }
            let result = this.getT(currentNode, zhiP, curve, r)
            let {degree, d2, side1, side2, adjacentSide, point_T, t, maxR} = result

            if (t > 0.02 && t <= 1) {
              let c = curve.split(t)
              let cp0 = c.right.points[1]
              newCtrlNodes.push(cp0)
              if (wanLine.line[4] === LineType.Bezier3) {
                newCtrlNodes.push(c.right.points[2])
              }
              let k2 = adjacentSide / side1
              arcP0 = generateNode({
                x: currentNode.x + (zhiP.x - currentNode.x) * k2,
                y: currentNode.y + (zhiP.y - currentNode.y) * k2,
              })

              newNodes.push(arcP0)
              newLine0 = [zhiIndex, newNodes.length - 1, -1, -1, zhiLine.line[4]]

              arcP1 = point_T as any
              newNodes.push(arcP1)
              newLine1 = [
                newNodes.length - 1, wanIndex,
                newCtrlNodes.length - 1,
                -1, wanLine.line[4]]

              if (wanLine.line[4] === LineType.Bezier3) {
                newLine1[2] = newCtrlNodes.length - 2
                newLine1[3] = newCtrlNodes.length - 1
              }

              //中心点，因为r是半径，求斜边用sin可以算
              let sin = Math.abs(Math.sin(Math2.jiaodu2hudu(d2)))
              let k3 = (maxR / sin) / side1
              arcCenter = generateNode({
                x: currentNode.x + (zhiP.x - currentNode.x) * k3,
                y: currentNode.y + (zhiP.y - currentNode.y) * k3,
              })
              arcCenter = Math2.getRotatedPoint(arcCenter, currentNode, degree > 180 ? -d2 : d2)
              let arc = Bezier.arcToBezier3_2(arcP0, arcP1, arcCenter)
              newCtrlNodes.push(arc[0])
              newCtrlNodes.push(c.left.points[1])
              // newCtrlNodes.push(...arc)

              centerLine = [
                newNodes.length - 2,
                newNodes.length - 1,
                newCtrlNodes.length - 2,
                newCtrlNodes.length - 1,
                LineType.Bezier3]
            }
          }

          let r1 = newPaths.findIndex(v => v.id === line0.id)
          newPaths.splice(r1, 1)
          let r2 = newPaths.findIndex(v => v.id === line1.id)
          newPaths.splice(r2, 1)

          newPaths.push({id: newPaths.length + 1, line: newLine0!})
          newPaths.push({id: newPaths.length + 1, line: newLine1!})
          newPaths.push({id: newPaths.length + 1, line: centerLine!})

          let cu = CanvasUtil.getInstance()
          cu.waitRenderOtherStatusFunc.push(() => {
            let ctx = cu.ctx
            ctx.save()
            // draw.calcPosition(ctx, this.conf)
            // draw.round2(ctx, curve0RightPoints[curve0RightPoints.length - 2], 4)
            // draw.round2(ctx, curve1RightPoints[curve1RightPoints.length - 2], 4)
            // draw.round2(ctx, arcP0, 4)
            // draw.round2(ctx, arcP1, 4)
            // draw.round2(ctx, currentNode, 4)
            // draw.round2(ctx, arcCenter, 4)
            // draw.round2(ctx, arc[0], 4)
            // draw.round2(ctx, arc[1], 4)
            //
            // ctx.moveTo2(arcP0)
            // ctx.bezierCurveTo2(curve0LeftPoints[curve0LeftPoints.length - 2],
            // curve1LeftPoints[curve1LeftPoints.length - 2], arcP1)
            // ctx.moveTo2(arcP0)
            // ctx.arcTo2(currentNode, arcP1, newR)
            // ctx.stroke()
            ctx.restore()
          })
        }
      }
    })

    this.conf.cache.nodes = newNodes
    this.conf.cache.paths = newPaths.map(v => v.line)
    this.conf.cache.ctrlNodes = newCtrlNodes
    // console.log('cache', cloneDeep(this.conf.cache))
  }

  //因为渲染时需要保持曲线的曲率，但曲线又被圆弧分割，所以要保持曲率就得计算出曲线被分割时的终点和起点以及控制点
  getTT2(center: P, curve0: BezierJs, curve1: BezierJs, p0: P, p1: P, r: number) {
    let side0 = Math2.getHypotenuse2(center, p0)
    let side1 = Math2.getHypotenuse2(center, p1)
    let min = Math.min(side0, side1)
    let result = {
      t0: -1,
      t1: -1,
      arcP0: generateNode({x: 0, y: 0}),
      arcP1: generateNode({x: 0, y: 0}),
      maxR: r
    }
    if (r < min) {
      let LUT: any[] = curve0.getLUT(100);
      let tempLUT = cloneDeep(LUT)
      let start = 0, count = 0;
      let values: any[] = [];
      while (++count < 25) {
        let i = start + Bezier.findClosest(
          center,
          tempLUT.slice(start),
          tempLUT[start - 2]?.distance,
          tempLUT[start - 1]?.distance,
          r,
        );
        if (i < start) break;
        if (i > 0 && i === start) break;
        values.push(i);
        start = i + 2;
      }
      if (values.length === 1) {
        let arcPoint0 = tempLUT[values![0]]
        result.t0 = arcPoint0.t
        result.arcP0 = arcPoint0
        LUT = curve1.getLUT(100);
        let tempLUT2 = cloneDeep(LUT)
        let start = 0, count = 0;
        let values2: any[] = [];
        while (++count < 25) {
          let i = start + Bezier.findClosest(
            center,
            tempLUT2.slice(start),
            tempLUT2[start - 2]?.distance,
            tempLUT2[start - 1]?.distance,
            r,
          );
          if (i < start) break;
          if (i > 0 && i === start) break;
          values2.push(i);
          start = i + 2;
        }
        if (values2.length === 1) {
          let arcPoint1 = tempLUT2[values2![0]]
          result.t1 = arcPoint1.t
          result.arcP1 = arcPoint1
        }
      }
    } else {
      result.maxR = min
      let LUT: any[]
      if (side0 > side1) {
        result.t1 = 1
        result.arcP1 = generateNode(p1)
        LUT = curve0.getLUT(100);
      } else {
        result.t0 = 1
        result.arcP0 = generateNode(p0)
        LUT = curve1.getLUT(100);
      }
      let tempLUT = cloneDeep(LUT)
      let start = 0, count = 0;
      let values: any[] = [];
      while (++count < 25) {
        let i = start + Bezier.findClosest(
          center,
          tempLUT.slice(start),
          tempLUT[start - 2]?.distance,
          tempLUT[start - 1]?.distance,
          result.maxR,
        );
        if (i < start) break;
        if (i > 0 && i === start) break;
        values.push(i);
        start = i + 2;
      }
      if (values.length === 1) {
        let arcPoint = tempLUT[values![0]]
        if (side0 > side1) {
          result.t0 = arcPoint.t
          result.arcP0 = arcPoint
        } else {
          result.t1 = arcPoint.t
          result.arcP1 = arcPoint
        }
      }
    }
    return result
  }

  //因为渲染时需要保持曲线的曲率，但曲线又被圆弧分割，所以要保持曲率就得计算出曲线被分割时的终点和起点以及控制点
  getT(center: P, point: P, curve: BezierJs, r: number) {
    let side1 = Math2.getHypotenuse2(center, point)

    const check = (t: number) => {
      let point_T = curve.get(t)
      let side2 = Math2.getHypotenuse2(center, point_T)
      let temp = this.getAdjacentSide(center, point, point_T, r)
      let min = Math.min(side1, side2)
      let maxR = temp.tan * min
      if (maxR < r) {
        console.log('直接return', maxR)
        return {
          t,
          adjacentSide: maxR / temp.tan,
          d2: temp.d2,
          degree: temp.degree,
          side1: side1,
          side2: side2,
          point_T: point_T,
          maxR
        }
      }
    }
    // let extrema = curve.extrema()
    // if (extrema.values.length) {
    //   for (let i = 0; i < extrema.x.length; i++) {
    //     let t = extrema.x[i]
    //     let result = check(t)
    //     if (result) return result
    //   }
    //   for (let i = 0; i < extrema.y.length; i++) {
    //     let t = extrema.y[i]
    //     let result = check(t)
    //     if (result) return result
    //   }
    // }
    let point_T
    let side2
    let temp
    let adjacentSide
    let min = 0
    let result = {
      t: -1,
      adjacentSide: 0,
      d2: 0,
      degree: 0,
      side1: 0,
      side2: 0,
      point_T: {x: 0, y: 0},
      maxR: r
    }

    for (let index = 1, i = 0.1; index <= 10; index++, i = i + 0.1) {
      point_T = curve.get(i)
      side2 = Math2.getHypotenuse2(center, point_T)
      temp = this.getAdjacentSide(center, point, point_T, r)
      adjacentSide = temp.adjacentSide
      min = Math.min(side1, side2)

      // console.log('i', i, 'side1', side1, 'side2', side2, 'min', min, 'adjacent', adjacentSide, 'd2', temp.d2)
      if (min.toFixed2(0) >= adjacentSide.toFixed2(0)) {
        //这里j<=i+0.1是因为如果i等于0.2时刚好合适,那么j加到0.19000000000000006时，j再加0.01就会大于0.2。。。。
        for (let indexJ = 1, j = i - 0.1; indexJ <= 11; indexJ++, j = j + 0.01) {
          point_T = curve.get(j)
          side2 = Math2.getHypotenuse2(center, point_T)
          temp = this.getAdjacentSide(center, point, point_T, r)
          adjacentSide = temp.adjacentSide

          min = Math.min(side1, side2)
          if (min.toFixed2(0) >= adjacentSide.toFixed2(0)) {
            // console.log('j', j, 'side1', side1, 'side2', side2, 'min', min, 'adjacent', adjacentSide, 'd2', temp.d2)
            result.t = j
            result.adjacentSide = adjacentSide
            result.d2 = temp.d2
            result.degree = temp.degree
            result.side1 = side1
            result.side2 = side2
            result.point_T = point_T
            break
          }
        }
        break
      }
    }

    if (result.t === -1) {
      let point_T = curve.get(1)
      let side2 = Math2.getHypotenuse2(center, point_T)
      let temp = this.getAdjacentSide(center, point, point_T, r)
      let min = Math.min(side1, side2)
      let maxR = temp.tan * min
      return {
        t: 1,
        adjacentSide: min,
        d2: temp.d2,
        degree: temp.degree,
        side1: side1,
        side2: side2,
        point_T: point_T,
        maxR
      }
    }
    return result
  }

  //获取acr圆弧的邻边长
  getAdjacentSide(center: P, start: P, end: P, r: number) {
    let degree = Math2.getDegree(center, start, end)
    let d2 = degree / 2
    if (degree > 180) {
      d2 = (360 - degree) / 2
    }
    // console.log('角度', degree, d2)
    //得到已知角度tan值
    let tan = Math.abs(Math.tan(Math2.jiaodu2hudu(d2)))
    // console.log('tan值', tan)
    //tanA = a/b。可知b = a/ tanA。所以领边的长就是lines2.point?.radius! / tan
    return {tan, adjacentSide: r / tan, degree, d2}
  }

  movePoint(pointIndex: number, move: P) {
    const {nodes, ctrlNodes} = this.conf.penNetwork

    let point = nodes[pointIndex]
    helper.movePoint2(point, move)

    point.cps.map(v => {
      if (v !== -1) helper.movePoint2(ctrlNodes[v], move)
    })
  }

  getPoint({type, pointIndex, cpIndex}: CurrentOperationInfo) {
    const {nodes, ctrlNodes} = this.conf.penNetwork
    let point: PenNetworkNode = generateNode()
    if (type === EditType.ControlPoint) {
      point = merge(point, ctrlNodes[nodes[pointIndex].cps[cpIndex]])
    } else {
      point = nodes[pointIndex]
    }
    return point
  }

  lineGet(t: number, {p0, p1}: { p0: P, p1: P }) {


  }

  toPen(): BaseShape {
    return this
  }

}