import {getBezierPointByLength} from "./utils"
import CanvasUtil2 from "./CanvasUtil2"

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
  cu: CanvasUtil2,
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
  HOVER = 'HOVER',
  EDIT = 'EDIT',
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

export interface ShapeProps {
  conf: ShapeConfig,
  old?: null,
  parent?: ShapeConfig
}

//属性参考：https://developers.mastergo.com/apis/node-frame.html
export interface ShapeConfig {
  id: number | string,
  name?: number | string,

  w: number,
  h: number,
  rx: number,
  ry: number,
  leftX: number,
  topY: number,
  rightX: number,
  bottomY: number,
  centerX: number,
  centerY: number,
  location: P2,
  rotate: number,
  lineWidth: number,
  type: ShapeType,
  color: string,
  fillColor: string,
  borderColor: string,
  radius: number,
  children: any[],
  flipVertical?: boolean,
  flipHorizontal?: boolean,
  points: any[],
  isCustom: boolean,
  topLeft: P,
  topRight: P,
  bottomLeft: P,
  bottomRight: P,
  center: P,
  isVisible: boolean,//节点是否可见
  isLocked: boolean,//节点是否被锁定
  /**
   * @desc Geometry-related properties
   * */
  fills: any[]//图层的填充。
  strokes: any[]//图层的描边。
  /** @desc 描边类型。
   * 'SOLID': 实线。
   'DASH': 虚线。
   'CUSTOM': 自定义。
   * */
  strokeStyle: 'SOLID' | 'DASH' | 'CUSTOM'
  strokeWeight: number,//四个方向描边的粗细
  strokeTopWeight: number,
  strokeLeftWeight: number,
  strokeRightWeight: number,
  strokeBottomWeight: number,
  /** @desc 描边相对于图层边界的对齐方式。
   * 'CENTER': 居中。
   * 'INSIDE': 内部。
   * 'OUTSIDE': 外部。
   * */
  strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE'
  /** @desc 端点的装饰。
   * 'NONE': 正常。
   * 'ROUND': 圆角。
   * 'SQUARE': 方型。
   * 'LINE_ARROW': 普通箭头。
   * 'TRIANGLE_ARROW': 三角箭头。
   * 'ROUND_ARROW' 圆箭头。
   * 'RING' 圆环。
   * 'DIAMOND' 方块。
   * 'LINE' 直线。
   * */
  strokeCap: 'NONE' | 'ROUND' | 'SQUARE' | 'LINE_ARROW' | 'TRIANGLE_ARROW' | 'ROUND_ARROW' | 'RING' | 'DIAMOND' | 'LINE'
  /** @desc 边角的装饰。
   * 'MITER': 直角。
   * 'BEVEL': 斜切。
   * 'ROUND': 圆角。
   * */
  strokeJoin: 'MITER' | 'BEVEL' | 'ROUND'
  strokeDashes: [number, number]//包含数字的数组。数组偶数下标元素代表虚线的长度，奇数下标元素代表虚线的间距。
  dashCap: 'NONE' | 'ROUND' | 'SQUARE' //虚线端点装饰。
  /**
   *  @desc Corner-related properties
   * */
  cornerSmooth: number,//控制角的平滑程度，值域为 [0, 1]。
  cornerRadius: number,//圆角。
  topLeftRadius: number,
  topRightRadius: number,
  bottomLeftRadius: number,
  bottomRightRadius: number,
  /**
   * @desc Blend-related properties
   * */
  opacity: number,//读取或设置图层的透明度，其值必须在 [0, 1] 区间。
  blendMode: number//图层的混合模式。
  isMask: boolean//图层是否是蒙版。
  effects: any[]//返回一个特效数组，具体数据结构可以查看 Effect。
  /**
   * @desc Layout-related properties
   * */
  absoluteTransform: Transform//图层节点相对于包含它的页面的位置，以变换矩阵的方式呈现。
  relativeTransform: Transform//图层节点相对于它的父级节点的位置，作为变换矩阵呈现。
  x: number,//图层节点的位置，等价于 relativeTransform[0][2]。
  y: number,//图层节点的位置，等价于 relativeTransform[1][2]。
  bound: Rect//图层节点的 rect。
  /** @desc 图层节点的旋转角度.值域为 [-180, 180]。
   * 其值等价于：Math.atan2(-relativeTransform[1][0], relativeTransform[0][0])
   * */
  rotation: number,
  width: number,
  height: number
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

type Transform = [[number, number, number], [number, number, number]]

export interface EllipseConfig extends ShapeConfig {
  /** @desc 圆弧总长度*/
  totalLength: number
  /** @desc 圆弧起点长度*/
  startLength: number
  /** @desc 圆弧起点*/
  startPoint: P
  /** @desc 起点长度对应的 鼠标控制点*/
  startMouseControlPoint: P
  /** @desc 圆弧终点*/
  endPoint: P
  /** @desc 终点长度对应的 鼠标控制点*/
  endMouseControlPoint: P
  /** @desc 所有控制点，总的12个*/
  cps: P[]
  getCps: Function
}

export interface TextConfig extends ShapeConfig {
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
  ...EventMapTypes,//TODO 当老的删除CanvasUtil.ts删除掉这行
  onDbClick: 'dblclick',
  onMouseMove: 'mousemove',
  onMouseDown: 'mousedown',
  onMouseUp: 'mouseup',
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
  onDraw: 'draw',
}


export interface BaseEvent extends MouseEvent {
  capture: boolean,
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