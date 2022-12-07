import CanvasUtil2 from "../CanvasUtil2"
import {BaseConfig} from "../config/BaseConfig"
import {BaseShape} from "../shapes/BaseShape"
import {RulerLine} from "../shapes/RulerLine"

export type IState = {
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  canvasRect: DOMRect,
  enter: boolean,
  hoverLeft: boolean,
  enterLeft: boolean,
  hoverLT: boolean,
  enterLT: boolean,
  hoverRT: boolean,
  enterRT: boolean,
  hoverLTR: boolean,//左上角 旋转
  enterLTR: boolean,
  startX: number,
  startY: number,
  offsetX: number,
  offsetY: number,
  handMove: {
    x: number,
    y: number,
  },
  oldHandMove: {
    x: number,
    y: number,
  },
  currentPoint: {
    x: number,
    y: number,
  },
  handScale: number,
  oldHandScale: number,
  sPoint: { x: number, y: number },
  activeHand: boolean,
  fps: number,
  currentMat: any
  rectColor: any
  rectColorType: any
  showPicker: boolean,
  usePencil: boolean,
  enterPencil: boolean,
  usePen: boolean,
  enterPen: boolean,
  isEdit: boolean,
  cu: CanvasUtil2,
  drawCount: number

  selectDrawType: string,
  drawType: ShapeType,
  drawType2: ShapeType,
  drawType3: ShapeType,
  drawType4: ShapeType,
  drawType5: ShapeType,
  drawType6: ShapeType,

  selectShape?: BaseShape
}


//图形类型
export enum ShapeType {
  SELECT = 'SELECT',
  SCALE = 'SCALE',

  FRAME = 'FRAME',
  SLICE = 'SLICE',

  RECTANGLE = 'RECTANGLE',
  ELLIPSE = 'ELLIPSE',
  ARROW = 'ARROW',
  LINE = 'LINE',
  POLYGON = 'POLYGON',
  STAR = 'STAR',
  IMAGE = 'IMAGE',

  PEN = 'PEN',
  PENCIL = 'PENCIL',

  TEXT = 'TEXT',
  MOVE = 'MOVE',

  COMPONENT = 'COMPONENT',
  RULER = 'RULER',
  RULER_LINE = 'RULER_LINE',
  HOVER = 'HOVER',
  EDIT = 'EDIT',
}


export interface ShapeProps {
  conf: BaseConfig,
  parent?: BaseShape,
  ctx: any
}

export enum FontWeight {
  LIGHT = 300,
  REGULAR = 400,
  Normal = 500,
  MEDIUM = 600,
  BOLD = 700,
  HEAVY = 900,
}

export enum RectColorType {
  FillColor = 'fillColor',
  BorderColor = 'borderColor',
}

export const EventTypes = {
  onClick: 'click',
  onWheel: 'wheel',
  onDbClick: 'dblclick',
  onMouseMove: 'mousemove',
  onMouseDown: 'mousedown',
  onMouseUp: 'mouseup',
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
  onDraw: 'draw',
}


export interface BaseEvent2 {
  capture: boolean,
  e: MouseEvent,
  point: P,
  type: string
  stopPropagation: Function
  cancelStopPropagation: Function
}

//贝塞尔点的类型
export enum BezierPointType {
  RightAngle = 'RightAngle',//直角
  MirrorAngleAndLength = 'MirrorAngleAndLength',//完全对称
  MirrorAngle = 'MirrorAngle',//角度对称
  NoMirror = 'NoMirror',//不对称
}

export enum LineType {
  Line = 0,
  Bezier2 = 1,
  Bezier3 = 2,
}

//简单点
export interface P {
  x: number,
  y: number,
}

//复杂的点
export interface P2 {
  use: boolean
  x: number,
  y: number,
  px: number//相对于父级的百分比x
  py: number//相对于父级的百分比y
  rx: number//相对于父级的相对值x
  ry: number//相对于父级的相对值y
}

// 三次贝塞尔曲线:用上一个点的center、cp2和当前点的cp1和center可以组成
// 二次贝塞尔曲线：同上，只不过取任中一个cp点作为控制点
// 直线：直接取两个点的center点相连
export interface BezierPoint {
  cp1: P2,//右边的控制点
  center: P2//中边的点
  cp2: P2//左边的控制点
  type: BezierPointType,
}


export function getP2(use: boolean = false): P2 {
  return {
    use,
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    rx: 0,
    ry: 0,
  }
}

export function getP(): P {
  return {x: 0, y: 0}
}

export type ShapeState = {
  isHover: boolean,
  isSelect: boolean,
  isSelectHover: boolean,
  isEdit: boolean,
  enterLT: boolean,
  enterL: boolean
}