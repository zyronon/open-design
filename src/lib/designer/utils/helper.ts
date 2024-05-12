import {BaseConfig} from "../config/BaseConfig"
import {getRotatedPoint} from "../../../utils"
import {v4 as uuid} from 'uuid'
import {cloneDeep, inRange, merge} from "lodash"
import {BezierPoint, CurrentOperationInfo, EditType, Line, LineType, P, StrokeAlign} from "../types/type"
import {Colors, defaultConfig} from "./constant"
import {Bezier} from "./bezier"
import {Math2} from "./math"
import {HandleMirroring, PenNetwork, PenNetworkLine, PenNetworkNode} from "../config/PenConfig"
import {Bezier as BezierJs} from "bezier-js";

export default {
  /**
   * @desc 翻转点
   * @param val 要翻转的点
   * @param centerVal 中心点
   * */
  _reversePoint(val: number, centerVal: number) {
    return centerVal + Math.abs(val - centerVal) * (val < centerVal ? 1 : -1)
  },
  /**
   * @desc 获取翻转点
   * @param point 要翻转的点
   * @param center 中心点
   * */
  reversePoint(point: any, center: P): P {
    let x = this._reversePoint(point.x, center.x)
    let y = this._reversePoint(point.y, center.y)
    return {x, y}
  },
  /**
   * @desc 水平翻转点
   * @param point 要翻转的点
   * @param center 中心点
   * */
  horizontalReversePoint(point: any, center: P) {
    point.x = this._reversePoint(point.x, center.x)
    return point
  },
  /**
   * @desc 垂直翻转点
   * @param point 要翻转的点
   * @param center 中心点
   * */
  verticalReversePoint<T>(point: any, center: P): T {
    point.y = this._reversePoint(point.y, center.y)
    return point
  },
  getRotationByFlipHorizontal(rotation: number): number {
    if (rotation <= 0) {
      return -180 - rotation
    } else {
      return 180 - rotation
    }
  },
  getRotationByFlipVertical(rotation: number): number {
    return -rotation
  },
  /** 根据初始配置，翻转方向来获取，最终要显示的角度
   * flipHorizontal 为false时，方法不会执行。不适合实时计算。
   * 只适合初始化是计算角度
   * */
  getRotationByInitConf(conf: BaseConfig, rotation?: number): number {
    let {flipHorizontal, flipVertical} = conf
    let r = rotation || conf.rotation
    if (flipHorizontal) r = this.getRotationByFlipHorizontal(r)
    if (flipVertical) r = this.getRotationByFlipVertical(r)
    return r
  },
  initConf(conf: BaseConfig, pConf?: BaseConfig) {
    conf = this.getDefaultShapeConfig(conf)
    if (conf.id) return conf
    let {
      layout: {x, y, w, h}, flipHorizontal, flipVertical
    } = conf
    conf.id = uuid()
    const w2 = w / 2, h2 = h / 2

    //默认中心点
    let center = {x: x + w2, y: y + h2}

    if (pConf) {
      conf.realRotation = pConf.realRotation + conf.rotation
      conf.percent = {x: x / pConf.layout.w, y: y / pConf.layout.h,}
      //如果有父级，那么中心点加要上自己的xy和父级的start的xy值
      center = {x: (pConf.start.x + x) + w2, y: (pConf.start.y + y) + h2}
      conf.relativeCenter = {
        x: center.x - pConf.original.x,
        y: center.y - pConf.original.y,
      }
      //根据父级的角度旋转，就是最终的中心点
      center = getRotatedPoint(center, pConf.center, pConf.realRotation)
    } else {
      conf.relativeCenter = conf.percent = {x: 0, y: 0,}
      conf.realRotation = conf.rotation
    }

    const {x: cx, y: cy} = center
    let topLeft = {x: cx - w2, y: cy - h2}
    let topRight = {x: cx + w2, y: cy - h2}
    let bottomLeft = {x: cx - w2, y: cy + h2}
    let bottomRight = {x: cx + w2, y: cy + h2}

    conf.start = cloneDeep(topLeft)
    //水平翻转所有的点
    if (flipHorizontal) {
      topLeft = this.horizontalReversePoint(topLeft, center)
      topRight = this.horizontalReversePoint(topRight, center)
      bottomLeft = this.horizontalReversePoint(bottomLeft, center)
      bottomRight = this.horizontalReversePoint(bottomRight, center)
      conf.realRotation = -conf.realRotation
    }
    if (flipVertical) {
      topLeft = this.verticalReversePoint(topLeft, center)
      topRight = this.verticalReversePoint(topRight, center)
      bottomLeft = this.verticalReversePoint(bottomLeft, center)
      bottomRight = this.verticalReversePoint(bottomRight, center)
      conf.realRotation = -conf.realRotation
    }

    conf.absolute = cloneDeep(topLeft)
    conf.original = cloneDeep(topLeft)

    let rotation = conf.realRotation
    if (rotation) {
      topLeft = getRotatedPoint(topLeft, center, rotation)
      topRight = getRotatedPoint(topRight, center, rotation)
      bottomLeft = getRotatedPoint(bottomLeft, center, rotation)
      bottomRight = getRotatedPoint(bottomRight, center, rotation)
      conf.absolute = cloneDeep(topLeft)
    }
    //如果没有父级，那么layout的xy和ab的xy一样
    if (!pConf) {
      conf.layout.x = conf.absolute.x
      conf.layout.y = conf.absolute.y
    }
    conf.rotation = this.getRotationByInitConf(conf)
    conf.center = center

    conf.box = {
      leftX: center.x - w2,
      rightX: center.x + w2,
      topY: center.y - h2,
      bottomY: center.y + h2,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    }
    conf.strokeAlign = StrokeAlign.INSIDE

    if (conf.isCustom === undefined) conf.isCustom = false
    // @ts-ignore
    if (conf.isComplete === undefined) conf.isComplete = true

    // console.log('initConf', cloneDeep(conf))
    return conf
  },
  calcConf(conf: BaseConfig, pConf?: BaseConfig): BaseConfig {
    let {
      layout: {x, y, w, h},
      center, flipHorizontal, flipVertical, realRotation
    } = conf
    const w2 = w / 2, h2 = h / 2

    const {x: cx, y: cy} = center
    let topLeft = {x: cx - w2, y: cy - h2}
    let topRight = {x: cx + w2, y: cy - h2}
    let bottomLeft = {x: cx - w2, y: cy + h2}
    let bottomRight = {x: cx + w2, y: cy + h2}

    //水平翻转所有的点
    if (flipHorizontal) {
      topLeft = this.horizontalReversePoint(topLeft, center)
      topRight = this.horizontalReversePoint(topRight, center)
      bottomLeft = this.horizontalReversePoint(bottomLeft, center)
      bottomRight = this.horizontalReversePoint(bottomRight, center)
    }
    if (flipVertical) {
      topLeft = this.verticalReversePoint(topLeft, center)
      topRight = this.verticalReversePoint(topRight, center)
      bottomLeft = this.verticalReversePoint(bottomLeft, center)
      bottomRight = this.verticalReversePoint(bottomRight, center)
    }
    conf.original = cloneDeep(topLeft)
    conf.absolute = cloneDeep(topLeft)

    let rotation = realRotation
    if (rotation) {
      topLeft = getRotatedPoint(topLeft, center, rotation)
      topRight = getRotatedPoint(topRight, center, rotation)
      bottomLeft = getRotatedPoint(bottomLeft, center, rotation)
      bottomRight = getRotatedPoint(bottomRight, center, rotation)
      conf.absolute = cloneDeep(topLeft)
    }

    if (pConf) {
      /**
       * 直接将ab值以父中心点父角度负回去。这样ab值就是0度的（此时的ab值即父级未旋转时的值，一开始initConf的xy也是取的这个值）
       * 然后减去父original值，就是自己离父级的xy值
       * 2023-2-9注：
       * 不用把ab按自己的中心点负回去，再以父中心点父角度负回去。这样子计算出来不正确
       * // let rXy = getRotatedPoint(this.conf.absolute, this.conf.center, -this.conf.realRotation)
       * // rXy = getRotatedPoint(rXy, pCenter, -pRotate)
       * */
      let rXy = getRotatedPoint(conf.absolute, pConf.center, -pConf.realRotation)
      conf.layout.x = rXy.x - pConf.original.x
      conf.layout.y = rXy.y - pConf.original.y

      let rCenter = getRotatedPoint(center, pConf.center, -pConf.realRotation)
      conf.relativeCenter.x = rCenter.x - pConf.original.x
      conf.relativeCenter.y = rCenter.y - pConf.original.y

      conf.realRotation = (pConf.realRotation + conf.rotation).toFixed2()
    } else {
      //如果没有父级，那么layout的xy和ab的xy一样
      conf.layout.x = conf.absolute.x
      conf.layout.y = conf.absolute.y
    }

    conf.box = {
      leftX: center.x - w / 2,
      rightX: center.x + w / 2,
      topY: center.y - h / 2,
      bottomY: center.y + h / 2,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    }
    // console.log('calcConf', cloneDeep(conf))
    return conf
  },
  getCenter(conf: BaseConfig, pConf?: BaseConfig) {
    let {
      absolute,
      layout: {x, y, w, h}, flipHorizontal, flipVertical
    } = conf
    conf.id = uuid()
    const w2 = w / 2, h2 = h / 2

    //默认中心点
    let center = {x: x + w2, y: y + h2}

    if (pConf) {
      conf.realRotation = pConf.realRotation + conf.rotation
      conf.percent = {x: x / pConf.layout.w, y: y / pConf.layout.h,}
      //如果有父级，那么中心点加要上自己的xy和父级的start的xy值
      center = {x: (pConf.start.x + x) + w2, y: (pConf.start.y + y) + h2}
      conf.relativeCenter = {
        x: center.x - pConf.original.x,
        y: center.y - pConf.original.y,
      }
      //根据父级的角度旋转，就是最终的中心点
      center = getRotatedPoint(center, pConf.center, pConf.realRotation)
    } else {
      conf.relativeCenter = conf.percent = {x: 0, y: 0,}
      conf.realRotation = conf.rotation
    }

    const {x: cx, y: cy} = center
    let topLeft = {x: cx - w2, y: cy - h2}
    let topRight = {x: cx + w2, y: cy - h2}
    let bottomLeft = {x: cx - w2, y: cy + h2}
    let bottomRight = {x: cx + w2, y: cy + h2}

    conf.start = cloneDeep(topLeft)
    //水平翻转所有的点
    if (flipHorizontal) {
      topLeft = this.horizontalReversePoint(topLeft, center)
      topRight = this.horizontalReversePoint(topRight, center)
      bottomLeft = this.horizontalReversePoint(bottomLeft, center)
      bottomRight = this.horizontalReversePoint(bottomRight, center)
      conf.realRotation = -conf.realRotation
    }
    if (flipVertical) {
      topLeft = this.verticalReversePoint(topLeft, center)
      topRight = this.verticalReversePoint(topRight, center)
      bottomLeft = this.verticalReversePoint(bottomLeft, center)
      bottomRight = this.verticalReversePoint(bottomRight, center)
      conf.realRotation = -conf.realRotation
    }

    conf.absolute = cloneDeep(topLeft)
    conf.original = cloneDeep(topLeft)

    let rotation = conf.realRotation
    if (rotation) {
      topLeft = getRotatedPoint(topLeft, center, rotation)
      topRight = getRotatedPoint(topRight, center, rotation)
      bottomLeft = getRotatedPoint(bottomLeft, center, rotation)
      bottomRight = getRotatedPoint(bottomRight, center, rotation)
      conf.absolute = cloneDeep(topLeft)
    }
    //如果没有父级，那么layout的xy和ab的xy一样
    if (!pConf) {
      conf.layout.x = conf.absolute.x
      conf.layout.y = conf.absolute.y
    }
    conf.rotation = this.getRotationByInitConf(conf)
    conf.center = center

    conf.box = {
      leftX: center.x - w2,
      rightX: center.x + w2,
      topY: center.y - h2,
      bottomY: center.y + h2,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    }
    conf.strokeAlign = StrokeAlign.INSIDE
    // console.log('initConf', conf)
    return conf
  },
  calcConfByParent(conf: BaseConfig, pConf?: BaseConfig): BaseConfig {
    let {
      layout: {x, y, w, h},
      original,
      center,
      relativeCenter,
      flipHorizontal, flipVertical, realRotation
    } = conf

    const w2 = w / 2, h2 = h / 2

    // let center = {x: x + w2, y: x + h2}
    if (pConf) {
      conf.realRotation = pConf.realRotation + conf.rotation
      let pOriginal = pConf.original
      // if (pConf.flipHorizontal) {
      //   pOriginal = this.horizontalReversePoint(pOriginal, pConf.center)
      // }
      // if (pConf.flipVertical) {
      //   pOriginal = this.verticalReversePoint(pOriginal, pConf.center)
      // }
      center = {x: pOriginal.x + relativeCenter.x, y: pOriginal.y + relativeCenter.y}
      //根据父级的角度旋转 ，就是最终的中心点
      center = getRotatedPoint(center, pConf.center, pConf.realRotation)
    }

    const {x: cx, y: cy} = center
    let topLeft = {x: cx - w2, y: cy - h2}
    let topRight = {x: cx + w2, y: cy - h2}
    let bottomLeft = {x: cx - w2, y: cy + h2}
    let bottomRight = {x: cx + w2, y: cy + h2}

    //水平翻转所有的点
    if (flipHorizontal) {
      topLeft = this.horizontalReversePoint(topLeft, center)
      topRight = this.horizontalReversePoint(topRight, center)
      bottomLeft = this.horizontalReversePoint(bottomLeft, center)
      bottomRight = this.horizontalReversePoint(bottomRight, center)
      // conf.layout = this.horizontalReversePoint(conf.layout, center)
      conf.absolute = this.horizontalReversePoint(conf.absolute, center)
      // conf.realRotation = -conf.realRotation
    }
    if (flipVertical) {
      topLeft = this.verticalReversePoint(topLeft, center)
      topRight = this.verticalReversePoint(topRight, center)
      bottomLeft = this.verticalReversePoint(bottomLeft, center)
      bottomRight = this.verticalReversePoint(bottomRight, center)
      // conf.layout = this.verticalReversePoint(conf.layout, center)
      conf.absolute = this.verticalReversePoint(conf.absolute, center)
      // conf.realRotation = -conf.realRotation
    }

    conf.absolute = cloneDeep(topLeft)
    conf.original = cloneDeep(topLeft)

    let rotation = conf.realRotation
    if (rotation) {
      topLeft = getRotatedPoint(topLeft, center, rotation)
      topRight = getRotatedPoint(topRight, center, rotation)
      bottomLeft = getRotatedPoint(bottomLeft, center, rotation)
      bottomRight = getRotatedPoint(bottomRight, center, rotation)
      conf.absolute = cloneDeep(topLeft)
    }
    //如果没有父级，那么layout的xy和ab的xy一样
    if (!pConf) {
      conf.layout.x = conf.absolute.x
      conf.layout.y = conf.absolute.y
    }
    // conf.rotation = this.getRotationByInitConf(conf)
    conf.center = center

    conf.box = {
      leftX: center.x - w2,
      rightX: center.x + w2,
      topY: center.y - h2,
      bottomY: center.y + h2,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    }
    // console.log('calcConfByParent', cloneDeep(conf))
    return conf
  },
  con(val: any) {
    console.log(JSON.stringify(val, null, 2))
  },
  async sleep(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, time)
    })
  },
  getXy() {
    return {x: 0, y: 0}
  },
  getDefaultShapeConfig(newConfig?: BaseConfig): BaseConfig {
    return merge({
      lineWidth: defaultConfig.lineWidth,
      fillColor: Colors.FillColor,
      borderColor: Colors.Border,
      children: [],
      flipHorizontal: false,
      flipVertical: false,
      radius: 0,
      lineShapes: [],
      cacheLineShapes: [],
      commonPoints: [],
      rotation: 0,
      layout: {
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0,
      },
      isCustom: false,
      isVisible: false,
      isLocked: false,
      cornerSmooth: 0,
      cornerRadius: 0,
      topLeftRadius: 0,
      topRightRadius: 0,
      bottomLeftRadius: 0,
      bottomRightRadius: 0,
      opacity: 0,
      blendMode: 0,
      isMask: false,
      effects: [],
      isCache: false,
      isPointOrLine: false,
      penNetwork: {
        ctrlNodes: [],
        paths: [],
        nodes: [],
        regions: []
      },
      cache: {
        ctrlNodes: [],
        paths: [],
        nodes: [],
        regions: []
      }
    } as any, newConfig)
  },
  //TODO 废弃
  judgeLineType({startPoint, endPoint}: Line): LineType {
    let lineType: LineType = LineType.Line
    if (!startPoint.cp2.use && !endPoint.cp1.use) {
      lineType = LineType.Line
    } else {
      if (startPoint.cp2.use && endPoint.cp1.use) {
        lineType = LineType.Bezier3
      } else {
        lineType = LineType.Bezier2
      }
    }
    return lineType
  },
  judgeLineType2(line: PenNetworkLine): LineType {
    let lineType: LineType = LineType.Line
    if (line[2] === -1 && line[3] === -1) {
      lineType = LineType.Line
    } else {
      if (line[2] !== -1 && line[3] !== -1) {
        lineType = LineType.Bezier3
      } else {
        lineType = LineType.Bezier2
      }
    }
    return lineType
  },
  //获取线段的中间点
  getLineCenterPoint(line: PenNetworkLine, lineType: LineType, nodes: PenNetworkNode[], ctrlNodes: P[]) {
    let p0 = nodes[line[0]]
    let p1 = nodes[line[1]]
    switch (lineType) {
      case LineType.Line:
        return this.getStraightLineCenterPoint(p0, p1)
      case LineType.Bezier2:
        let cp: P
        if (line[2] !== -1) cp = ctrlNodes[line[2]]
        if (line[3] !== -1) cp = ctrlNodes[line[3]]
        return Bezier.getPointByT_2(0.5, [p0, cp!, p1])
      case LineType.Bezier3:
        return Bezier.getPointByT_3(0.5, [p0, ctrlNodes[line[2]], ctrlNodes[line[3]], p1])
    }
  },
  //获取直线的中间点
  getStraightLineCenterPoint(p0: P, p1: P): P {
    return {
      x: p0.x + ((p1.x - p0.x) / 2),
      y: p0.y + ((p1.y - p0.y) / 2)
    }
  },
  //判断点是否在盒子内
  isInBox(target: P, box: any): boolean {
    const {x, y} = target
    return box.leftX < x && x < box.rightX
      && box.topY < y && y < box.bottomY
  },
  /**
   * @desc 判断鼠标m是否在p点内
   * @param judge 鼠标坐标
   * @param target 判断点坐标
   * @param r 半径
   * */
  isInPoint(judge: P, target: P, r: number): boolean {
    return (target.x - r < judge.x && judge.x < target.x + r) &&
      (target.y - r < judge.y && judge.y < target.y + r)
  },
  isInLine(target: P, line: PenNetworkLine, lineType: LineType, nodes: PenNetworkNode[], ctrlNodes: P[]): {
    t: number,
    is: boolean
  } {
    let start = nodes[line[0]]
    let end = nodes[line[1]]
    let line1 = Math2.getHypotenuse2(target, start)
    let line2 = Math2.getHypotenuse2(target, end)
    let line3 = Math2.getHypotenuse2(start, end)
    let result = {
      t: 0,
      is: false
    }
    if (lineType === LineType.Line) {
      // let d = 0.02
      let d = 0.04
      result.is = inRange(line1 + line2, line3 - d, line3 + d);
      if (result.is) {
        result.t = Math2.getLineT({p1: start, p2: end}, target)
      }
    }
    let p1 = ctrlNodes[line[2]]
    let p2 = ctrlNodes[line[3]]
    if (lineType === LineType.Bezier2) {
      let cp: P
      if (line[2] !== -1) cp = p1
      if (line[3] !== -1) cp = p2
      let t1 = Bezier.getTByPoint_2(start.x, cp!.x, end.x, target.x)
      let t2 = Bezier.getTByPoint_2(start.y, cp!.y, end.y, target.y)
      // console.log(t1, t2)
      let t = -1
      if (t1.length === 1) t = t1[0]
      if (t2.length === 1) t = t2[0]
      if (t !== -1) {
        let p = Bezier.getPointByT_2(t, [start, cp!, end])
        // console.log('p', target, p, r)
        // console.log('t', t)
        result.is = this.isInPoint(target, p, 4)
        result.t = t
      }
    }
    if (lineType === LineType.Bezier3) {
      let t1 = Bezier.getTByPoint_3(start.x, p1.x, p2.x, end.x, target.x)
      let t2 = Bezier.getTByPoint_3(start.y, p1.y, p2.y, end.y, target.y)
      if (t1.length || t2.length) {
        let t = t1[0] ?? t2[0]
        let p = Bezier.getPointByT_3(t, [start, p1, p2, end])
        // console.log('p', target, p, r)
        result.is = this.isInPoint(target, p, 4)
        result.t = t
      }
    }
    return result
  },

  //TODO 废弃
  movePoint(target: P, oldPoint: P, move: P) {
    target.x = oldPoint.x + move.x
    target.y = oldPoint.y + move.y
  },
  movePoint2(target: P, move: P) {
    target.x += move.x
    target.y += move.y
  },
  /**
   * 判断点是否在图形内
   * 参考：https://myst729.github.io/posts/2013/two-solutions-for-point-in-polygon-problem/
   * 参考：https://juejin.cn/post/6963596759742283807
   * */
  isInPolygon(p: P, polygon: BezierPoint[], center: P) {
    let px = p.x, py = p.y, flag = false
    for (let i = 0, l = polygon.length, j = l - 1; i < l; j = i, i++) {
      let sx = polygon[i].center.x + center.x,
        sy = polygon[i].center.y + center.y,
        tx = polygon[j].center.x + center.x,
        ty = polygon[j].center.y + center.y
      // 点与多边形顶点重合
      if ((sx === px && sy === py) || (tx === px && ty === py)) {
        return true
      }
      // 判断线段两端点是否在射线两侧
      if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
        // 线段上与射线 Y 坐标相同的点的 X 坐标
        let x = sx + (py - sy) * (tx - sx) / (ty - sy)
        // 点在多边形的边上
        if (x === px) {
          return true
        }
        // 射线穿过多边形的边界
        if (x > px) {
          flag = !flag
        }
      }
    }
    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag
  },
  //分割线条
  splitLine(penNetwork: PenNetwork, result: CurrentOperationInfo) {
    const {nodes, paths, ctrlNodes} = penNetwork
    let {lineIndex, pointIndex, hoverPoint, hoverPointT} = result

    let point: PenNetworkNode = {
      ...hoverPoint!,
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
      let newPointIndex = nodes.length - 1;
      paths.splice(lineIndex + 1, 0, [newPointIndex, line[1], -1, -1, LineType.Line])
      line[1] = newPointIndex
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
      let {left, right} = b!.split(hoverPointT!)

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
    result.lineIndex = -1
    result.pointIndex = nodes.length - 1
    result.type = EditType.Point
    return result
  },
  getBoxCenter(points: P[]) {
    let maxX: number, minX: number, maxY: number, minY: number
    maxX = maxY = 0
    minX = minY = Infinity
    points.map((v: P) => {
      if (v.x > maxX) maxX = v.x
      if (v.x < minX) minX = v.x
      if (v.y > maxY) maxY = v.y
      if (v.y < minY) minY = v.y
    })

    // console.log(minX, maxX, minY, maxY)

    let center = {x: 0, y: 0}
    center.x = minX + (maxX - minX) / 2
    center.y = minY + (maxY - minY) / 2

    // console.log('c', center)
    return center
  }
}