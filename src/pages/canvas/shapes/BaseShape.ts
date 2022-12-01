import {BaseEvent2, P, ShapeProps} from "../utils/type"
import CanvasUtil2 from "../CanvasUtil2"
import {cloneDeep} from "lodash"
import getCenterPoint, {getAngle2, getRotatedPoint} from "../../../utils"
import {getShapeFromConfig} from "./common"
import EventBus from "../../../utils/event-bus"
import {EventMapTypes} from "../../canvas20221111/type"
import {BaseConfig} from "../config/BaseConfig"
import helper from "../utils/helper"
import draw from "../utils/draw"

export abstract class BaseShape {
  hoverRd1: boolean = false
  enterRd1: boolean = false
  hoverL: boolean = false
  enterL: boolean = false
  hoverLT: boolean = false
  enterLT: boolean = false
  hoverLTR: boolean = false
  enterLTR: boolean = false
  hoverR: boolean = false
  enterR: boolean = false
  public config: BaseConfig
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

  constructor(props: ShapeProps) {
    // console.log('props', clone(props))
    this.config = helper.getPath(props.conf, undefined, props.parent)
    this.original = cloneDeep(this.config)
    // console.log('config', clone(this.config))
    this.children = this.config.children.map((conf: BaseConfig) => {
      return getShapeFromConfig({conf, old: null, parent: this.config})
    })
  }

  resetHover() {
    this.hoverL = false
    this.hoverLT = false
    this.hoverLTR = false
    this.hoverRd1 = false
    this.hoverR = false
  }

  resetEnter() {
    this.enter = false
    this.enterL = false
    this.enterLT = false
    this.enterLTR = false
    this.enterRd1 = false
    this.enterR = false
  }

  abstract render(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any

  abstract renderHover(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any

  abstract renderSelected(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any

  abstract renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void

  abstract renderEdit(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any

  shapeRender(ctx: CanvasRenderingContext2D, parent?: BaseConfig) {
    ctx.save()
    let {x, y} = draw.calcPosition(ctx, this.config, this.original, this.getState(), parent)
    const {isHover, isSelect, isEdit, isSelectHover} = this

    if (isHover) {
      this.render(ctx, {x, y}, parent,)
      draw.hover(ctx, {...this.config, x, y})
    } else if (isSelect) {
      this.render(ctx, {x, y}, parent,)
      draw.selected(ctx, {...this.config, x, y})
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

    this.config = helper.getPath(this.config, undefined, parent)
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
      this.enterR ||
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

    let {
      w, h, rotate, radius,
      leftX, rightX, topY, bottomY,
      flipHorizontal, flipVertical, center
    } = this.config
    let r = this.getRotate()
    if (r) {
      /*
     * 翻转之后的角度与正常图形的角度并不匹配，但是不知道为什么masterGo和figma都是这样子设计的
     * 所以这里只需要负角度旋转回默认点就行了
     * */
      let s2 = getRotatedPoint({x, y}, center, -r)
      x = s2.x
      y = s2.y
    }

    if (this.isSelect) {
      /*
      * 同上原因，判断是否在图形内，不需要翻转点。
      * */
      // if (flipHorizontal) x = helper.getReversePoint(x, center.x)
      // if (flipVertical) y = helper.getReversePoint(y, center.y)
      let edge = 10
      let angle = 7
      let rotate = 27
      //左边
      if ((leftX! - edge < x && x < leftX! + edge) &&
        (topY! + edge < y && y < bottomY! - edge)
      ) {
        // console.log('hoverLeft')
        document.body.style.cursor = "col-resize"
        this.hoverL = true

        this.hoverLT = false
        return true
      }

      //右边
      if ((rightX! - edge < x && x < rightX! + edge) &&
        (topY! + edge < y && y < bottomY! - edge)
      ) {
        // console.log('hoverR')
        document.body.style.cursor = "col-resize"
        this.hoverR = true
        return true
      }

      //左上
      if ((leftX! - angle < x && x < leftX! + angle) &&
        (topY! - angle < y && y < topY! + angle)
      ) {
        // console.log('1', flipHorizontal)
        this.hoverLT = true
        this.hoverL = false
        document.body.style.cursor = "nwse-resize"
        return true
      }

      //左上旋转
      if ((leftX! - rotate < x && x < leftX! - angle) &&
        (topY! - rotate < y && y < topY! - angle)
      ) {
        this.hoverLTR = true

        this.hoverLT = false
        this.hoverL = false
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
    let {e, point, type} = event
    let {x, y, cu} = this.getXY(point)

    this.original = cloneDeep(this.config)
    cu.startX = x
    cu.startY = y
    cu.offsetX = x - this.config.x
    cu.offsetY = y - this.config.y

    if (this.childMouseDown(event, parents)) return

    let rect = this.config

    if (this.isEdit) {
      return
    }

    //按下左边
    if (this.hoverL) {
      // console.log('config', cloneDeep(this.config))
      let {w, h, rotate, center, flipHorizontal, flipVertical} = this.config
      let lx = this.config.x
      let ly = this.config.y
      //反转当前xy到0度
      let reverseXy = getRotatedPoint({x: lx, y: ly}, center, -this.getRotate())
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
        center, this.getRotate())
      this.handlePoint = handlePoint
      //翻转得到对面的点
      this.diagonal = {
        x: helper.getReversePoint(handlePoint.x, center.x),
        y: helper.getReversePoint(handlePoint.y, center.y),
      }
      this.enterL = true
      return
    }

    //按下左边
    if (this.hoverR) {
      // console.log('config', cloneDeep(this.config))
      let {w, h, rotate, center, flipHorizontal, flipVertical} = this.config
      let lx = this.config.x
      let ly = this.config.y
      //反转当前xy到0度
      let reverseXy = getRotatedPoint({x: lx, y: ly}, center, -this.getRotate())
      /**
       * 根据flipHorizontal、flipVertical计算出当前按的那条边的中间点
       * 如果水平翻转：x在左边，直接使用。未翻转：x加上宽度
       * 如果垂直翻转：y在下边，要减去高度的一半。未翻转：y加上高度的一半
       * */
      let currentHandLineCenterPoint = {
        x: reverseXy.x + (flipHorizontal ? 0 : w),
        y: reverseXy.y + (flipVertical ? -(h / 2) : (h / 2))
      }
      //根据当前角度，转回来。得到的点就是当前鼠标按住那条边的中间点（当前角度），非鼠标点
      let handlePoint = getRotatedPoint(
        currentHandLineCenterPoint,
        center, this.getRotate())
      this.handlePoint = handlePoint
      //翻转得到对面的点
      this.diagonal = {
        x: helper.getReversePoint(handlePoint.x, center.x),
        y: helper.getReversePoint(handlePoint.y, center.y),
      }
      this.enterR = true
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
    cu.setSelectShape(this, parents)
  }

  mousemove(event: BaseEvent2, parents: BaseShape[] = []) {
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
    // cu.setInShape(this, parents)
    let cu = CanvasUtil2.getInstance()
    cu.setInShape(this, parents)


    if (this.enter) {
      return this.move(point)
    }

    if (this.enterL) {
      return this.dragL(point)
    }
    if (this.enterR) {
      return this.dragR(point)
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
    this.config = helper.getPath(rect, this.original)
    cu.render()
  }

  //拖动左边
  dragL(point: P) {
    let {x, y, cu,} = this.getXY(point)
    const {flipHorizontal, flipVertical} = this.config
    let rotate = this.getRotate()
    if (rotate || flipHorizontal || flipVertical) {
      let rect = this.config
      const current = {x, y}
      const handlePoint = this.handlePoint
      const zeroAngleCurrentPoint = getRotatedPoint(current, handlePoint, -rotate)
      const zeroAngleMovePoint = {x: zeroAngleCurrentPoint.x, y: handlePoint.y}
      const currentAngleMovePoint = getRotatedPoint(zeroAngleMovePoint, handlePoint, rotate)
      const newWidth = Math.hypot(currentAngleMovePoint.x - this.diagonal.x, currentAngleMovePoint.y - this.diagonal.y)
      const newCenter = {
        x: this.diagonal.x + (currentAngleMovePoint.x - this.diagonal.x) / 2,
        y: this.diagonal.y + (currentAngleMovePoint.y - this.diagonal.y) / 2
      }
      rect.w = newWidth
      rect.center = newCenter

      /*变化：非水平翻转时需要处理*/
      if (!flipHorizontal) {
        let zeroAngleXy = getRotatedPoint(this.original, newCenter, -rotate)
        /*变化：x减去多的宽度*/
        zeroAngleXy.x -= (newWidth - this.original.w)
        let angleXy = getRotatedPoint(zeroAngleXy, newCenter, rotate)
        rect.x = angleXy.x
        rect.y = angleXy.y
      }
      this.config = helper.getPath(rect, this.original)
    } else {
      this.config.x = (x - cu.offsetX)
      this.config.w = this.original.rightX - this.config.x
      this.config.center.x = this.config.x + this.config.w / 2
      this.config = helper.getPath(this.config, this.original)
    }
    cu.render()
  }

  //拖动左边
  dragR(point: P) {
    let {x, y, cu,} = this.getXY(point)
    const {flipHorizontal, flipVertical} = this.config
    let rotate = this.getRotate()
    if (rotate || flipHorizontal || flipVertical) {
      let rect = this.config
      const current = {x, y}
      const handlePoint = this.handlePoint
      //0度的当前点：以当前边中间点为圆心，负角度偏转当前点，得到0度的当前点
      const zeroAngleCurrentPoint = getRotatedPoint(current, handlePoint, -rotate)
      //0度的移动点：x取其0度的当前点的，y取当前边中间点的（保证在一条直线上，因为只能拖动x，y不需要变动）
      const zeroAngleMovePoint = {x: zeroAngleCurrentPoint.x, y: handlePoint.y}
      // 当前角度的移动点：以当前边中间点为圆心，正角度偏转
      const currentAngleMovePoint = getRotatedPoint(zeroAngleMovePoint, handlePoint, rotate)
      //最新宽度：利用勾股定理求出斜边(不能直接zeroAngleMovePoint.x - this.diagonal.x相减，会有细微的差别)
      const newWidth = Math.hypot(currentAngleMovePoint.x - this.diagonal.x, currentAngleMovePoint.y - this.diagonal.y)
      //最新中心点：
      const newCenter = {
        x: this.diagonal.x + (currentAngleMovePoint.x - this.diagonal.x) / 2,
        y: this.diagonal.y + (currentAngleMovePoint.y - this.diagonal.y) / 2
      }
      rect.w = newWidth
      rect.center = newCenter
      //如果水平了翻转，那么xy值在左边，但是拖动的也是左边，所以要重新计算xy值
      if (flipHorizontal) {
        //0度的xy
        let zeroAngleXy = getRotatedPoint(this.original, newCenter, -rotate)
        //0度的x，加上当前移动的距离（新宽度减去原始宽度）
        zeroAngleXy.x += (newWidth - this.original.w)
        //再偏转回去
        let angleXy = getRotatedPoint(zeroAngleXy, newCenter, rotate)
        rect.x = angleXy.x
        rect.y = angleXy.y
      }
      this.config = helper.getPath(rect, this.original)
    } else {
      let dx = (x - cu.startX)
      this.config.w = this.original.w + dx
      this.config.center.x = this.config.x + this.config.w / 2
      this.config = helper.getPath(this.config, this.original)
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
    this.config = helper.getPath(this.config, this.original)
    cu.render()
  }

  mouseup(e: BaseEvent2, p: BaseShape[] = []) {
    // if (e.capture) return
    // console.log('mouseup')
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

  getRotate() {
    let {rotate, flipHorizontal, flipVertical} = this.config
    let r = rotate
    if (flipHorizontal && flipVertical) {
      r = (180 + rotate)
    } else {
      if (flipHorizontal) {
        r = (rotate - 180)
      }
    }
    return r
  }
}
