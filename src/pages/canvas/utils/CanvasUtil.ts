import { Shape } from "./Shape";
import { clear, draw } from "../utils";
import { cloneDeep, throttle } from "lodash";
import { BaseEvent, EventType, ShapeType } from "../type";
import EventBus from "../../../utils/event-bus";
import Frame from "./Frame";
import { mat4 } from "gl-matrix";

const out: any = new Float32Array([
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
]);

export class CanvasUtil {
  // @ts-ignore
  private canvas: HTMLCanvasElement;
  // @ts-ignore
  public ctx: CanvasRenderingContext2D;
  // @ts-ignore
  private canvasRect: DOMRect;
  // @ts-ignore
  private dpr: number;
  // @ts-ignore
  private children: any[]
  static instance: CanvasUtil | null
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
  currentMat: any = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])
  handScale: number = 1
  handMove: {
    x: number,
    y: number,
  } = { x: 0, y: 0, }


  constructor(canvas: HTMLCanvasElement) {
    this.init(canvas)
  }

  //设置inShape
  setInShape(shape: Shape, parent?: Shape[]) {
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

  //设置inShape为null
  setInShapeNull(target: Shape) {
    if (this.inShape === target) {
      this.inShape = null
      this.render()
    }
  }

  init(canvas: HTMLCanvasElement) {
    this.children = []
    let canvasRect = canvas.getBoundingClientRect()
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let { width, height } = canvasRect
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
  }

  static getInstance(canvas?: any) {
    if (!this.instance) {
      this.instance = new CanvasUtil(canvas)
    } else {
      if (canvas) {
        this.instance.init(canvas)
      }
    }
    return this.instance
  }

  setMode(mode: ShapeType) {
    console.log('mode', mode)
    this.mode = mode
  }

  print(list: any) {
    return list.map((item: any) => {
      if (item.children) {
        item.children = this.print(item.children)
      }
      return item.config
    })
  }

  print2() {
    return this.print(cloneDeep(this.children))
  }

  _render() {
    EventBus.emit('draw')

    // if (true){
    if (false){
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
    clear({ x: 0, y: 0, w: this.canvas.width, h: this.canvas.height }, this.ctx)
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

  isDesign() {
    return this.mode === ShapeType.SELECT
  }

  // draw = debounce(this._draw, 50)
  render = throttle(this._render, 0)
  //TODO　这里过滤会导致mouseup丢失
  handleEvent = throttle(e => this._handleEvent(e), 0)

  initEvent() {
    Object.values(EventType).forEach(eventName => {
      this.canvas.addEventListener(eventName, this.handleEvent, true)
    })
    // this.canvas.addEventListener('wheel', this.onWheel)
  }

  onWheel = (e: any) => {
    // console.log('e', e)
    let { clientX, clientY, deltaY } = e;


    let x = clientX - this.canvasRect.left
    let y = clientY - this.canvasRect.top

    const zoom = 1 + (deltaY < 0 ? 0.25 : -0.25);
    //因为transform是连续变换，每次都是放大0.1倍，所以要让x和y变成0.1倍。这样缩放和平移是对等的
    //QA：其实要平移的值，也可以直接用x，y剩以当前的总倍数，比如放在1.7倍，那么x*0.7，就是要平移的x坐标
    //但是下次再缩放时，要加或减去上次平移的xy坐标
    x = x * (1 - zoom);
    y = y * (1 - zoom);
    const transform = new Float32Array([
      zoom, 0, 0, 0,
      0, zoom, 0, 0,
      0, 0, 1, 0,
      x, y, 0, 1,
    ]);
    const newCurrentMat = mat4.multiply(out, transform, this.currentMat);
    this.currentMat = newCurrentMat
    this.handMove = {
      x: newCurrentMat[12],
      y: newCurrentMat[13],
    }
    this.handScale = newCurrentMat[0]
    console.log(newCurrentMat)
    this.render()
  }

  _handleEvent = (e: any) => {
    if (e.type === EventType.onMouseEnter) {
      if (this.mode !== ShapeType.SELECT) {
        document.body.style.cursor = "crosshair"
      }
      return
    }
    if (e.type === EventType.onMouseLeave) {
      if (this.mode !== ShapeType.SELECT) {
        document.body.style.cursor = "default"
      }
      return
    }

    //重写禁止传播事件
    e.stopPropagation = () => e.capture = true
    // console.log('e.type', e.type)
    let x = e.x - this.canvasRect.left
    let y = e.y - this.canvasRect.top
    let baseEvent = {
      e,
      coordinate: { x, y },
      type: e.type
    }

    if (!this.isDesign()) {
      if (e.type === EventType.onMouseMove) {
        this.onMouseMove(e, { x, y })
      }
      if (e.type === EventType.onMouseDown) {
        this.onMouseDown(e, { x, y })
      }
      if (e.type === EventType.onMouseUp) {
        this.onMouseUp(e, { x, y })
      }
      return;
    }

    if (this.inShape) {

      this.inShape.event(baseEvent, this.inShapeParent)
    } else {
      this.children
        .forEach(shape => shape.event(baseEvent, [], () => {
          this.childIsIn = true
        }))
      if (!this.childIsIn) {
        // this.hoverShape?.isHover = false
        // this.draw()
      }
      this.childIsIn = false
    }
    if (e.type === EventType.onMouseMove) {
      this.onMouseMove(e, { x, y })
    }
    if (e.type === EventType.onMouseDown) {
      this.onMouseDown(e, { x, y })
    }
    if (e.type === EventType.onMouseUp) {
      this.onMouseUp(e, { x, y })
    }
  }

  drawNewShape(coordinate: any) {
    this.render()
    let x = this.startX
    let y = this.startY
    let w = coordinate.x - this.startX
    let h = coordinate.y - this.startY
    this.drawShapeConfig = {
      "x": x,
      "y": y,
      "abX": x,
      "abY": y,
      "w": w,
      "h": h,
      "rotate": 0,
      "lineWidth": 2,
      "type": 102,
      "color": "gray",
      "radius": 1,
      "children": [],
      "borderColor": "rgb(216,216,216)",
      "fillColor": "rgb(216,216,216)",
    }
    draw(this.ctx, this.drawShapeConfig, { isSelect: true })
  }

  onMouseMove(e: BaseEvent, coordinate: any,) {
    if (e.capture) return
    // console.log('canvas画布-onMouseMove')
    if (this.isMouseDown) this.drawNewShape(coordinate)
  }

  onMouseDown(e: BaseEvent, coordinate: any,) {
    if (e.capture) return
    // console.log('canvas画布-onMouseDown')
    if (!this.isDesign()) {
      if (this.selectedShape) {
        this.selectedShape.isSelect = false
      }
      this.startX = coordinate.x
      this.startY = coordinate.y
      this.isMouseDown = true
    }
  }

  onMouseUp(e: BaseEvent, coordinate: any,) {
    if (e.capture) return
    // console.log('canvas画布-onMouseUp')

    this.selectedShapeParent.map((shape: Shape) => shape.isCapture = true)
    if (this.selectedShape) {
      this.selectedShape.isSelect = false
      this.render()
    }
    if (this.isMouseDown) {
      this.isMouseDown = false
      document.body.style.cursor = "default"
      this.setMode(ShapeType.SELECT)
      let frame = new Frame(this.drawShapeConfig);
      frame.isSelect = true
      this.selectedShape = frame
      this.addChild(frame)
      this.render()
    }
  }

  clearChild() {
    this.handScale = 1
    this.handMove = { x: 0, y: 0, }
    this.currentMat = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
    this.children = []
  }

  addChild(shape: Shape) {
    this.children.push(shape)
  }
}