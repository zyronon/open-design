import CanvasUtil from "../engine/CanvasUtil"
import {BaseConfig} from "../config/BaseConfig"
import {BaseShape} from "../shapes/core/BaseShape"

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
  cu: CanvasUtil,
  mode: ShapeType,
  editModeType: EditModeType,
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
  BOX_SELECTION = 'BOX_SELECTION',
}

export interface ShapeProps {
  conf: BaseConfig,
  parent?: BaseShape,
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
  onKeyPress: 'keypress',
  onKeyDown: 'keydown',
  onModeChange: 'onModeChange',
}


export interface BaseEvent2 {
  capture: boolean,
  e: MouseEvent,
  nativeEvent: MouseEvent,
  screenPoint: P,//屏幕左上角
  canvasPoint: P,//起点为canvas dom的左上角
  point: P,//经过反向transform的点（平移、缩放）
  movement: P,//经过反向transform的点（平移、缩放）
  type: string
  stopPropagation: Function
  cancelStopPropagation: Function
}

export enum LineType {
  Line = 1,
  Bezier2 = 2,
  Bezier3 = 3,
}

//简单点
export interface P {
  x: number,
  y: number,
}

//复杂的点
export interface P2 extends P {
  use: boolean
  px: number//相对于父级的百分比x
  py: number//相对于父级的百分比y
  rx: number//相对于父级的相对值x
  ry: number//相对于父级的相对值y
}

//贝塞尔点的类型
//TODO 已废弃
export enum BezierPointType {
  RightAngle = 'RightAngle',//直角
  MirrorAngleAndLength = 'MirrorAngleAndLength',//完全对称
  MirrorAngle = 'MirrorAngle',//角度对称
  NoMirror = 'NoMirror',//不对称
}

// 三次贝塞尔曲线:用上一个点的center、cp2和当前点的cp1和center可以组成
// 二次贝塞尔曲线：同上，只不过取任中一个cp点作为控制点
// 直线：直接取两个点的center点相连
export interface BezierPoint {
  id: string,
  radius?: number,//显示的圆角
  realRadius?: number,//真实的圆角
  acrPoint?: P,
  acrCp?: P,
  cp1: P2,//右边的控制点
  center: P2//中边的点
  cp2: P2//左边的控制点
  type: BezierPointType,
}

//TODO 已废弃
export enum PointType {
  Single = 'Single',
  Common = 'Common',
}

//TODO 已废弃
export interface PointInfo {
  type: PointType,
  targetId?: string,
  point?: BezierPoint
}

export type Line = {
  startPoint: BezierPoint,
  endPoint: BezierPoint
}

//TODO 已废弃
export type LineShape = {
  close: boolean,
  points: PointInfo[]
}

//TODO 已废弃
export type LinePath = {
  close: boolean,
  path: Path2D
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

export enum MouseOptionType {
  None = 0,
  Top = 1,
  Left = 2,
  Bottom = 3,
  Right = 4,
  TopLeft = 5,
  TopRight = 6,
  BottomLeft = 7,
  BottomRight = 8,
  TopLeftRotation = 9,
  TopRightRotation = 10,
  BottomLeftRotation = 11,
  BottomRightRotation = 12,
}

export enum ShapeStatus {
  Normal = 'Normal',
  Hover = 'Hover',
  Select = 'Select',//手动选中时的状态，联动修改canvas的画布状态为 select
  NewSelect = 'NewSelect',//创建时的选中状态，仅展示用，这些canvas画布的状态不能改变.所以单独新增一个状态
  // SelectHover = 'SelectHover',
  Edit = 'Edit'
}

export enum ShapeEditStatus {
  Select = 'Select',
  Wait = 'Wait',
  Edit = 'Edit',
  Curve = 'Curve',
  Cut = 'Cut',
}

export enum EditModeType {
  Select = 'Select',
  Wait = 'Wait',
  Edit = 'Edit',
  Curve = 'Curve',
  Cut = 'Cut',
}

export enum StrokeAlign {
  CENTER = 'CENTER',
  INSIDE = 'INSIDE',
  OUTSIDE = 'OUTSIDE',
}

export enum EditType {
  Line = 'Line',
  Point = 'Point',
  CenterPoint = 'CenterPoint',
  ControlPoint = 'ControlPoint',
}

//当前操作信息
export type CurrentOperationInfo = {
  type: EditType | undefined,
  lineIndex: number,
  pointIndex: number,
  cpIndex: number
  lineCenterPoint?: P,
  hoverPoint?: P,
  hoverPointT?: number,
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

export enum FontFamily {
  SourceHanSerifCN = 'SourceHanSerifCN',
  SourceHanSansCN = 'SourceHanSansCN',
}
