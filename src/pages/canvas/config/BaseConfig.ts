//属性参考：https://developers.mastergo.com/apis/node-frame.html
import {P, P2, ShapeType} from "../utils/type"

interface Layout {
  absoluteTransform: Transform//图层节点相对于包含它的页面的位置，以变换矩阵的方式呈现。
  relativeTransform: Transform//图层节点相对于它的父级节点的位置，作为变换矩阵呈现。
  x: number,//图层节点的位置，等价于 relativeTransform[0][2]。
  y: number,//图层节点的位置，等价于 relativeTransform[1][2]。
  bound: Rect//图层节点的 rect。
  /** @desc 图层节点的旋转角度.值域为 [-180, 180]。
   * 其值等价于：Math.atan2(-relativeTransform[1][0], relativeTransform[0][0])
   * */
  rotation: number,
  w: number,
  h: number,
  percent: P,//相对于父级的百分比坐标
  absolute: P,//坐标绝对值
  original: P,//坐标未翻转、旋转的值
  center: P,//中心点坐标
  box: {
    leftX: number,
    topY: number,
    rightX: number,
    bottomY: number,
  }
  leftX: number,//废弃
  topY: number,//废弃
  rightX: number,//废弃
  bottomY: number,//废弃
  rotate: number,
  radius: number,
  topLeft: P,//废弃
  topRight: P,//废弃
  bottomLeft: P,//废弃
  bottomRight: P,//废弃
}

interface Geometry {
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
}

export interface BaseConfig extends Layout, Geometry {
  id: number | string,
  /**
   * 存放一些组件额外，但又不是必须的数据。
   * 比如直尺的 方向
   * */
  data?: any,
  name: string,
  nameWidth: number,
  lineWidth: number,
  type: ShapeType,
  fillColor: string,
  borderColor: string,
  children: any[],
  flipVertical?: boolean,
  flipHorizontal?: boolean,
  points: any[],
  /**
   * @desc 是否是自定义图形
   * 默认的图形，都是固定的渲染方式
   * 当进行过编辑之后，就需要根据点来渲染
   * */
  isCustom: boolean,

  isVisible: boolean,//节点是否可见
  isLocked: boolean,//节点是否被锁定

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
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

type Transform = [[number, number, number], [number, number, number]]
