import {CanvasUtil} from "./utils/CanvasUtil";
import {getBezierPointByLength} from "./utils";

export type IState = {
  rectList: Shape[],
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
  selectRect?: Shape,
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
  cu: CanvasUtil,
  drawCount: number

  selectDrawType: string,
  drawType: ShapeType,
  drawType2: ShapeType,
  drawType3: ShapeType,
  drawType4: ShapeType,
  drawType5: ShapeType,
  drawType6: ShapeType,

  selectShape: any
}


export enum ShapeType {
  SELECT = 100,
  SCALE = 101,

  FRAME = 102,
  SLICE = 103,

  RECT = 104,
  ELLIPSE = 105,
  ARROW = 106,
  LINE = 107,
  POLYGON = 108,
  STAR = 109,
  IMG = 110,

  PEN = 111,
  PENCIL = 112,

  TEXT = 113,
  MOVE = 114,

  COMPONENT = 115,
  HOVER = 102,
}


export interface RectImg {
  img: any,
}

export interface Shape extends RectText, RectImg {
  id: number | string,
  name?: number | string,
  x: number,
  y: number,
  w: number,
  h: number,
  rotate: number,
  lineWidth: number,
  type: ShapeType,
  color: string,
  fillColor: string,
  borderColor: string,
  leftX?: number,
  topY?: number,
  rightX?: number,
  bottomY?: number,
  radius: number,
  children: Shape[],
  flipVertical?: boolean,
  flipHorizontal?: boolean,
  points?: any[]
}

export interface ShapeConfig {
  id: number | string,
  name?: number | string,
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
  ry: number,
  rotate: number,
  lineWidth: number,
  type: ShapeType,
  color: string,
  fillColor: string,
  borderColor: string,
  leftX: number,
  topY: number,
  rightX: number,
  bottomY: number,
  centerX: number,
  centerY: number,
  radius: number,
  children: Shape[],
  flipVertical?: boolean,
  flipHorizontal?: boolean,
  points?: any[]
}

export enum TextMode {
  AUTO_W = 1,
  AUTO_H = 2,
  FIXED = 3,
}

export enum TextBaseline {
  LEFT = 1,
  RIGHT = 2,
  CENTER = 3,
}

export enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
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

export enum FontFamily {
  SourceHanSerifCN = 'SourceHanSerifCN',
  SourceHanSansCN = 'SourceHanSansCN',
}

export interface RectText {
  brokenTexts: string[],
  texts: string[],
  textLineHeight: number,
  letterSpacing: number,
  textMode: TextMode,
  textBaseline: TextBaseline,
  textAlign: TextAlign,
  fontFamily: FontFamily,
  fontWeight: FontWeight,
  fontSize: number,
}


export const EventMapTypes = {
  // onClick = 'click',
  onDoubleClick: 'dblclick',
  onMouseMove: 'mousemove',
  onMouseDown: 'mousedown',
  onMouseUp: 'mouseup',
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
}

export const EventTypes = {
  onClick: 'click',
  onWheel: 'wheel',
  ...EventMapTypes
}

export interface BaseEvent extends MouseEvent {
  capture: boolean
}

export interface Point {
  x: number,
  y: number,
}

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

export interface Point2 {
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
  cp1: Point2,//右边的控制点
  center: Point2//中边的点
  cp2: Point2//左边的控制点
  type: BezierPointType,
}


export function getDefaultPoint(use: boolean = false): Point2 {
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