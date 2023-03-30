import {BaseConfig} from "../config/BaseConfig"
import {getRotatedPoint} from "../../../utils"
import {v4 as uuid} from 'uuid'
import {cloneDeep, merge} from "lodash"
import {BezierPoint, BezierPointType, getP2, Line, LineType, P, P2, StrokeAlign} from "../types/type"
import {Colors, defaultConfig} from "./constant"
import {Bezier} from "./bezier"

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
    if (!conf.lineShapes) {
      conf.lineShapes = []
      conf.commonPoints = []
    }

    // console.log('initConf', conf)
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
        "w": 200,
        "h": 200,
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
    } as any, newConfig)
  },
  getDefaultBezierPoint(p: P) {
    return {
      id: uuid(),
      cp1: getP2(),
      center: {...getP2(true), ...p},
      cp2: getP2(),
      type: BezierPointType.RightAngle
    }
  },
  judgeLineType(line: Line): LineType {
    let lineType: LineType = LineType.Line
    if (
      line.end.type === BezierPointType.RightAngle &&
      line.start.type === BezierPointType.RightAngle
    ) {
      lineType = LineType.Line
    } else if (
      line.end.type !== BezierPointType.RightAngle &&
      line.start.type !== BezierPointType.RightAngle) {
      lineType = LineType.Bezier3
    } else {
      if (line.start.cp2.use || line.end.cp1.use) {
        lineType = LineType.Bezier2
      } else {
        lineType = LineType.Line
      }
    }
    return lineType
  },
  getLineCenterPoint(line: Line, lineType: LineType) {
    let {start: p0, end: p1} = line
    switch (lineType) {
      case LineType.Line:
        return {
          x: p0.center.x + ((p1.center.x - p0.center.x) / 2),
          y: p0.center.y + ((p1.center.y - p0.center.y) / 2)
        }
      case LineType.Bezier2:
        let cp: P2
        if (p0.cp2.use) cp = p0.cp2
        if (p1.cp1.use) cp = p1.cp1
        return Bezier.getPointByT_2(0.5, [p0.center, cp!, p1.center])
      case LineType.Bezier3:
        return Bezier.getPointByT_3(0.5, [p0.center, p0.cp2, p1.cp1, p1.center])
    }

  }
}