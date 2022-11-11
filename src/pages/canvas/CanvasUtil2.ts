import {BaseShape} from "./shapes/BaseShape";
import EventBus from "../../utils/event-bus";
import {clear} from "./utils";
import {EventMapTypes, EventTypes, P, ShapeConfig, ShapeType} from "./type";
import {cloneDeep} from "lodash";
import {rects} from "./constant";
import {Frame} from "./shapes/Frame";
import {Ellipse} from "./shapes/Ellipse";
import {Rectangle} from "./shapes/Rectangle";
import {Shape} from "./utils/Shape";

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
  private canvas: HTMLCanvasElement;
  // @ts-ignore
  public ctx: CanvasRenderingContext2D;
  // @ts-ignore
  private canvasRect: DOMRect;
  private dpr: number = 0
  private children: any[] = []
  private currentMat: any = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])
  handScale: number = 1
  handMove: P = {x: 0, y: 0,}
  //当hover时，只向hover那个图形传递事件。不用递归整个树去判断isIn
  inShape: any
  //因为当hover只向hover图形传递事件，所以无法获得父级链，这里用个变量保存起来
  //当hover时，传递这个就可以正确获得父级链
  inShapeParent: any
  //选中图形
  selectedShape: any
  //选中图形的父级链，选中新的图形时，需要把老的父级链的isCapture全部设为ture,
  //原因：选中新图形后，hover老图形时依然能hover中，所以需要把老的低级链isCapture全部设为ture
  //屏蔽事件向下传递
  selectedShapeParent: any = []
  //用于标记子组件是否选中
  childIsIn: boolean = false
  mode: ShapeType = ShapeType.SELECT
  startX: number = -1
  startY: number = -1
  offsetX: number = -1
  offsetY: number = -1
  isMouseDown: boolean = false
  drawShapeConfig: any = null
  cursor: string = 'default'
  _data: any = {}


  constructor(canvas: HTMLCanvasElement) {
    this.init(canvas)
  }

  init(canvas: HTMLCanvasElement) {
    this.children = []
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let canvasRect = canvas.getBoundingClientRect()
    let {width, height} = canvasRect
    let dpr = window.devicePixelRatio;
    if (dpr) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.height = height * dpr;
      canvas.width = width * dpr;
      ctx.scale(dpr, dpr);
    }
    this.canvas = canvas
    this.ctx = ctx
    this.dpr = dpr
    this.canvasRect = canvasRect
    this.initEvent(true)
    this.initEvent()
  }

  addChildren(rects: any) {
    cloneDeep(rects).map((conf: ShapeConfig) => {
      let r
      switch (conf.type) {
        case ShapeType.FRAME:
          r = new Frame(conf)
          break
        case ShapeType.RECTANGLE:
          r = new Rectangle(conf)
          break
        case ShapeType.ELLIPSE:
          r = new Ellipse(conf)
          break
      }
      r && this.children.push(r)
    })
  }


  //设置inShape
  setInShape(shape: BaseShape, parent?: BaseShape[]) {
    this.inShapeParent = parent
    if (this.inShape !== shape) {
      // console.log('shape', shape?.config?.name)
      if (this.inShape) {
        this.inShape.isHover = false
      }
      this.inShape = shape
      //进入改成走居部重绘了，移出还是用的全体重绘
      this.render()
    }
  }

  isDesign() {
    return true
  }

  //设置inShape为null
  setInShapeNull(target: BaseShape) {
    if (this.inShape === target) {
      this.inShape = null
      this.render()
    }
  }

  render() {
    EventBus.emit(EventTypes.draw)
    // if (true){
    if (false) {
      this.currentMat = new Float32Array([
        1.25, 0, 0, 0,
        0, 1.25, 0, 0,
        0, 0, 1, 0,
        -96.75, -87, 0, 1,
      ])
      this.handScale = this.currentMat[0]
      this.handMove = {
        x: this.currentMat[12],
        y: this.currentMat[13],
      }
    }
    // console.log('重绘所有图形')
    clear({x: 0, y: 0, w: this.canvas.width, h: this.canvas.height}, this.ctx)
    this.ctx.save()
    if (this.currentMat) {
      // console.log('平移：', currentMat[12], currentMat[13])
      // console.log('缩放：', currentMat[0], currentMat[5])
      let nv = this.currentMat
      // console.log(nv)
      this.ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13]);
      // ctx.translate(currentMat[12], currentMat[13])
      // ctx.scale(currentMat[0], currentMat[5])
    }
    this.ctx.lineCap = 'round'
    // console.log('this.children,', this.children)
    this.children.forEach(shape => shape.render(this.ctx))
    this.ctx.restore()
  }


  initEvent(isClear: boolean = false) {
    Object.values([
      EventTypes.onDoubleClick,
      EventTypes.onMouseMove,
      EventTypes.onMouseDown,
      EventTypes.onMouseUp,
      EventTypes.onMouseEnter,
      EventTypes.onMouseLeave,
    ]).forEach(eventName => {
      this.canvas[isClear ? 'removeEventListener' : 'addEventListener'](eventName, this.handleEvent, true)
    })
  }

  handleEvent = (e: any) => {
    e.stopPropagation = () => e.capture = true
    let x = e.x - this.canvasRect.left
    let y = e.y - this.canvasRect.top
    let baseEvent = {
      e,
      coordinate: {x, y},
      type: e.type
    }
    this.children.forEach(shape => shape.event(baseEvent, []))
  }

  clear() {
    this.handScale = 1
    this.handMove = {x: 0, y: 0,}
    this.currentMat = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
    this.children = []
  }

  print2() {
  }

  print() {
  }

  setMode(val: any) {
  }
}

