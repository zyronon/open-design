import {BaseShape} from "./shapes/BaseShape"
import EventBus from "../../utils/event-bus"
import {
  BaseEvent2,
  BezierPointType,
  EditModeType,
  EventTypes,
  getP2,
  P,
  ShapeEditStatus,
  ShapeStatus,
  ShapeType
} from "./utils/type"
import {cloneDeep} from "lodash"
import {defaultConfig} from "./utils/constant"
import {mat4} from "gl-matrix"
import {getShapeFromConfig} from "./utils/common"
import {Rectangle} from "./shapes/Rectangle"
import {BaseConfig} from "./config/BaseConfig"
import helper from "./utils/helper"
import draw from "./utils/draw"
import {Pen} from "./shapes/Pen"

const out: any = new Float32Array([
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
])
export default class CanvasUtil2 {
  static instance: CanvasUtil2

  static getInstance(canvas?: HTMLCanvasElement) {
    if (canvas) {
      if (this.instance) {
        this.instance.init(canvas)
      } else {
        this.instance = new CanvasUtil2(canvas)
      }
    }
    return this.instance
  }

  // @ts-ignore
  private canvas: HTMLCanvasElement
  // @ts-ignore
  public ctx: CanvasRenderingContext2D
  // @ts-ignore
  public canvasRect: DOMRect
  private dpr: number = 0
  public children: BaseShape[] = []
  public currentMat: any = new Float32Array(defaultConfig.currentMat)
  public storedTransform: any = new Float32Array(defaultConfig.currentMat)
  handScale: number = defaultConfig.handScale
  handMove: P = defaultConfig.handMove
  //当hover时，只向hover那个图形传递事件。不用递归整个树去判断isIn
  hoverShape: any
  //因为当hover只向hover图形传递事件，所以无法获得父级链，这里用个变量保存起来
  //当hover时，传递这个就可以正确获得父级链
  hoverShapeParent: any
  //选中图形
  selectedShape: any
  //选中图形的父级链，选中新的图形时，需要把老的父级链的isCapture全部设为ture,
  //原因：选中新图形后，hover老图形时依然能hover中，所以需要把老的父级链isCapture全部设为ture
  //屏蔽事件向下传递
  selectedShapeParent: any = []
  editShape?: BaseShape
  //用于标记子组件是否选中
  childIsIn: boolean = false
  // mode: ShapeType = ShapeType.PEN
  _mode: ShapeType = ShapeType.SELECT
  editModeType: EditModeType = EditModeType.Select
  mouseStart: P = {x: 0, y: 0} //鼠标起点
  fixMouseStart: P = {x: 0, y: 0} //修正后的鼠标起点（修正为0度）
  isMouseDown: boolean = false
  drawShapeConfig: any = null
  newShape: BaseShape | undefined
  cursor: string = 'default'
  _data: any = {}
  private renderTime: any = undefined
  waitRenderOtherStatusFunc: any[] = []

  constructor(canvas: HTMLCanvasElement) {
    this.init(canvas)
  }


  get mode() {
    return this._mode
  }

  set mode(val) {
    if (val !== this._mode) {
      if (val === ShapeType.EDIT) {
        this.editModeType = EditModeType.Select
      }
      this._mode = val
      EventBus.emit(EventTypes.onModeChange, val)
    }
  }

  init(canvas: HTMLCanvasElement) {
    this.children = []
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let canvasRect = canvas.getBoundingClientRect()
    let {width, height} = canvasRect
    let dpr = window.devicePixelRatio
    if (dpr) {
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      canvas.height = height * dpr
      canvas.width = width * dpr
      ctx.scale(dpr, dpr)
    }
    this.canvas = canvas
    this.ctx = ctx
    this.dpr = dpr
    this.canvasRect = canvasRect
    this.initEvent(true)
    this.initEvent()
  }

  addChildren(rects: any) {
    cloneDeep(rects).map((conf: BaseConfig) => {
      let r = getShapeFromConfig({conf})
      r && this.children.push(r)
    })
  }

  isDesignMode() {
    return this.mode === ShapeType.SELECT
  }

  setHoverShape(target: BaseShape, parent?: BaseShape[]) {
    if (this.hoverShapeParent !== parent) {
      this.hoverShapeParent = parent
    }
    if (this.hoverShape !== target) {
      this.hoverShape = target
    }
  }

  setHoverShapeIsNull(target: BaseShape) {
    if (this.hoverShape === target) {
      this.hoverShape = null
    }
  }

  //设置选中的Shape
  setSelectShape(shape: BaseShape, parent?: BaseShape[]) {
    //如果当前选中的图形不是自己，那么把那个图形设为未选中
    if (this.selectedShape && this.selectedShape !== shape) {
      this.selectedShape.status = ShapeStatus.Normal
    }
    this.selectedShapeParent.map((shape: BaseShape) => shape.isCapture = true)
    this.selectedShapeParent = parent
    this.selectedShapeParent.map((shape: BaseShape) => shape.isCapture = false)
    this.selectedShape = shape
    this.render()
  }

  /**
   * @desc 下一次有空再渲染,0.3秒延迟，避免每加载完成一个文件就渲染一次
   * */
  nextRender() {
    clearTimeout(this.renderTime)
    this.renderTime = setTimeout(() => {
      this.render()
    }, 300)
  }

  render() {
    // console.log('重绘所有图形')
    EventBus.emit(EventTypes.onDraw)
    draw.clear({x: 0, y: 0, w: this.canvas.width, h: this.canvas.height}, this.ctx)
    this.ctx.save()
    if (this.currentMat) {
      // console.log('缩放：', currentMat[0], currentMat[5])
      let nv = this.currentMat
      // console.log('平移：', nv)
      // this.ctx.setTransform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13])
      this.ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13])
      // ctx.translate(currentMat[12], currentMat[13])
      // ctx.scale(currentMat[0], currentMat[5])
    }
    this.storedTransform = this.ctx.getTransform()
    this.ctx.lineCap = 'round'
    // console.log('this.children,', this.children)
    for (let i = 0; i < this.children.length; i++) {
      let shape = this.children[i]
      shape.render(this.ctx)
    }
    this.waitRenderOtherStatusFunc.map(cb => cb())
    this.waitRenderOtherStatusFunc = []
    this.ctx.restore()
  }

  initEvent(isClear: boolean = false) {
    const fn = isClear ? 'removeEventListener' : 'addEventListener'
    Object.values([
      // EventTypes.onDoubleClick,
      EventTypes.onMouseMove,
      EventTypes.onMouseDown,
      EventTypes.onMouseUp,
      // EventTypes.onMouseEnter,
      // EventTypes.onMouseLeave,
    ]).forEach(eventName => {
      //忘记为啥与true了
      this.canvas[fn](eventName, this.handleEvent, true)
    })
    this.canvas[fn](EventTypes.onWheel, this.onWheel)
    this.canvas[fn](EventTypes.onDbClick, this.handleEvent)
    this.canvas[fn](EventTypes.onKeyDown, this.onKeyDown)
    this.canvas[fn](EventTypes.onMouseLeave, () => {
      document.body.style.cursor = 'default'
    })
  }

  //TODO　这里过滤会导致mouseup丢失
  // handleEvent = throttle(e => this._handleEvent(e), 0)

  handleEvent = async (e: any) => {
    let screenPoint = {x: e.x, y: e.y}
    let canvasPoint = {x: e.x - this.canvasRect.left, y: e.y - this.canvasRect.top}

    //修正当前鼠标点为变换过后的点，确保和图形同一transform
    const {x: handX, y: handY} = this.handMove
    let point = {x: (canvasPoint.x - handX) / this.handScale, y: (canvasPoint.y - handY) / this.handScale}
    let event: BaseEvent2 = {
      capture: false,
      e,
      screenPoint,
      canvasPoint,
      point,
      type: e.type,
      stopPropagation() {
        this.capture = true
      },
      cancelStopPropagation() {
        this.capture = false
      }
    }
    // if (e.type !== 'mousemove') {
    if (e.type === 'dblclick') {
      console.log('handleEvent', e.type)
    }
    if (this.mode === ShapeType.EDIT) {
      if (this.editShape) {
        this.editShape.event(event, [], false, 'edit')
      }
    } else {
      if (this.isDesignMode()) {
        //有hoverShape就单传，没有遍历所有组件
        if (this.hoverShape) {
          this.hoverShape.event(event, this.hoverShapeParent, false, 'hover')
        } else {
          for (let i = 0; i < this.children.length; i++) {
            let shape = this.children[i]
            shape.event(event, [], false, 'for')
            if (event.capture) break
          }
        }
      }
    }

    switch (event.type) {
      case EventTypes.onMouseMove:
        this.onMouseMove(event)
        break
      case EventTypes.onMouseDown:
        this.onMouseDown(event)
        break
      case EventTypes.onMouseUp:
        this.onMouseUp(event)
        break
      case EventTypes.onDbClick:
        this.onDbClick(event)
        break
    }
  }

  onKeyDown = (e: any) => {
    console.log('onKeyDown', e.keyCode)
    //Esc
    if (e.keyCode === 27) {
      if (this.editShape) {
        if (this.editShape.status === ShapeStatus.Edit) {
          if (this.editShape._editStatus === ShapeEditStatus.Edit) {
            this.editShape._editStatus = ShapeEditStatus.Wait
          } else {
            this.editShape.status = ShapeStatus.Select
            this.selectedShape = this.editShape
            this.editShape = undefined
            this.mode = ShapeType.SELECT
          }
          return this.render()
        }
      }
      if (this.selectedShape) {
        this.selectedShape = undefined
      }
    }
    //Del
    if (e.keyCode === 46) {
      if (this.editShape) {
        return
      }
      if (this.selectedShape) {
        this.delChild(this.children, this.selectedShape.conf.id)
      }
      this.selectedShape = undefined
      this.editShape = undefined
      this.hoverShape = undefined
    }
    this.render()
  }

  delChild(list: BaseShape[], targetId: string) {
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (item.conf.id === targetId) {
        list.splice(i, 1)
        break
      }
      if (item.children.length) {
        this.delChild(item.children, targetId)
      }
    }
  }

  onDbClick(e: any) {
    if (e.capture) return
    console.log('cu-onDbClick', e)
    if (this.editShape) {
      this.editShape.status = ShapeStatus.Select
      this.editShape = undefined
      this.mode = ShapeType.SELECT
      this.render()
    }
  }

  onMouseDown(e: BaseEvent2,) {
    if (e.capture) return
    // console.log('onMouseDown', e)
    if (this.editShape) return
    // console.log('cu-onMouseDown', e)
    this.selectedShapeParent.map((shape: BaseShape) => shape.isCapture = true)
    if (this.selectedShape) {
      this.selectedShape.status = ShapeStatus.Normal
      this.render()
      this.selectedShapeParent = []
      this.selectedShape = null
    }
    if (!this.isDesignMode()) {
      this.mouseStart.x = e.point.x
      this.mouseStart.y = e.point.y
      this.isMouseDown = true

      switch (this.mode) {
        case ShapeType.PEN:
          this.editShape = new Pen({
            conf: helper.getDefaultShapeConfig({
              layout: {x: this.mouseStart.x, y: this.mouseStart.y, w: 1, h: 1},
              // layout: {x: 0, y: 0, w: 0, h: 0},
              // center: {x: this.mouseStart.x, y: this.mouseStart.y},
              name: 'Pen',
              type: ShapeType.PEN,
              isCustom: true,
              lineShapes: [
                [
                  {
                    cp1: getP2(),
                    // center: {...getP2(true), ...this.mouseStart},
                    center: {...getP2(true), ...{x: 0, y: 0}},
                    cp2: getP2(),
                    type: BezierPointType.RightAngle
                  }
                ]
              ]
            } as BaseConfig),
          })
          this.editShape.status = ShapeStatus.Edit
          this.editShape._editStatus = ShapeEditStatus.Edit
          EventBus.emit(EventTypes.onMouseDown, this.editShape)
          this.children.push(this.editShape)
          this.render()
          this.mode = ShapeType.EDIT
      }
    }
  }

  onMouseMove(e: BaseEvent2,) {
    if (e.capture) return
    // console.log('cu-onMouseMove', e)
    if (this.isMouseDown) {
      let w = e.point.x - this.mouseStart.x
      let h = e.point.y - this.mouseStart.y
      switch (this.mode) {
        case ShapeType.RECTANGLE:
          if (this.newShape) {
            this.newShape.conf.w = w
            this.newShape.conf.h = h
            this.newShape.conf.center = {
              x: this.newShape.conf.x + (w / 2),
              y: this.newShape.conf.y + (h / 2)
            }
            //太小了select都看不见
            if (w > 10) {
              this.newShape.status = ShapeStatus.Select
            }
            // EventBus.emit(EventMapTypes.onMouseMove, this.newShape)
            this.newShape.conf = helper.getPath(this.newShape.conf)
            this.render()
          } else {
            let x = this.mouseStart.x
            let y = this.mouseStart.y
            this.newShape = new Rectangle({
              "x": x,
              "y": y,
              "abX": 0,
              "abY": 0,
              "w": 0,
              "h": 0,
              "rotate": 0,
              "lineWidth": 2,
              "type": ShapeType.RECTANGLE,
              "color": "gray",
              "radius": 0,
              "children": [],
              "borderColor": "rgb(216,216,216)",
              "fillColor": "rgb(216,216,216)",
            })
            EventBus.emit(EventTypes.onMouseDown, this.newShape)
            this.children.push(this.newShape)
          }
          // this.drawNewShape(coordinate)
          break
        case ShapeType.MOVE:
          const transform = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            // x - startX, y - startY, 0, 1,
            //因为transform是连续的，所以用当前偏移量，而不是从x-startX
            e.e.movementX, e.e.movementY, 0, 1,
          ])
          const newCurrentMat = mat4.multiply(out, transform, this.currentMat)
          this.currentMat = newCurrentMat
          this.handMove = {
            x: newCurrentMat[12],
            y: newCurrentMat[13],
          }
          this.render()
          break
        case ShapeType.PEN:
      }
    }
  }

  onMouseUp(e: BaseEvent2,) {
    if (e.capture) return
    // console.log('cu-onMouseUp', e)
    if (this.isMouseDown) {
      this.isMouseDown = false
      if (this.newShape) {
        this.setSelectShape(this.newShape!, [])
        this.newShape = undefined
      }
      if (this.mode !== ShapeType.MOVE && this.mode !== ShapeType.EDIT) {
        this.setMode(ShapeType.SELECT)
      }
      return
    }
    EventBus.emit(EventTypes.onMouseUp, null)
  }

  onWheel = (e: any) => {
    // console.log('e', e)
    let {clientX, clientY, deltaY} = e

    let x = clientX - this.canvasRect.left
    let y = clientY - this.canvasRect.top

    const zoom = 1 + (deltaY < 0 ? 0.25 : -0.25)
    //因为transform是连续变换，每次都是放大0.1倍，所以要让x和y变成0.1倍。这样缩放和平移是对等的
    //QA：其实要平移的值，也可以直接用x，y剩以当前的总倍数，比如放在1.7倍，那么x*0.7，就是要平移的x坐标
    //但是下次再缩放时，要加或减去上次平移的xy坐标
    x = x * (1 - zoom)
    y = y * (1 - zoom)
    const transform = new Float32Array([
      zoom, 0, 0, 0,
      0, zoom, 0, 0,
      0, 0, 1, 0,
      x, y, 0, 1,
    ])
    const newCurrentMat = mat4.multiply(out, transform, this.currentMat)
    this.currentMat = newCurrentMat
    this.handMove = {
      x: newCurrentMat[12],
      y: newCurrentMat[13],
    }
    this.handScale = newCurrentMat[0]
    // console.log('this.handMove', this.handMove)
    // console.log('this.handScale', this.handScale)
    // console.log('this.currentMat', this.currentMat)
    EventBus.emit(EventTypes.onWheel, this.handScale)
    this.render()
  }

  clear() {
    this.handScale = defaultConfig.handScale
    this.handMove = defaultConfig.handMove
    this.currentMat = new Float32Array(defaultConfig.currentMat)
    this.selectedShape = null
    this.hoverShape = null
    this.editShape = undefined
    this.children = []
    this.mode = ShapeType.SELECT
  }

  printO(list: any, needId = false) {
    return list.map((item: any) => {
      if (item.children) {
        item.conf.children = this.printO(item.children, needId)
      }
      if (needId) {
        return item.conf
      }
      return {...item.conf, id: null}
    })
  }

  print() {
    return this.printO(cloneDeep(this.children))
  }

  print2() {
    // console.log(this.currentMat, this.handScale, this.handMove)
    return this.printO(cloneDeep(this.children), true)
  }

  setMode(mode: ShapeType) {
    console.log('mode', mode)
    this.mode = mode
  }
}