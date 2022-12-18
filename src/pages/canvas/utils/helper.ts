import {BaseConfig} from "../config/BaseConfig"
import {getRotatedPoint} from "../../../utils"
// @ts-ignore
import {v4 as uuid} from 'uuid'
import {clone} from "lodash"
import {P, ShapeType} from "./type"

export default {
  /**
   * @desc 获取翻转点
   * @param val 要翻转的点
   * @param centerVal 中心点
   * */
  getReversePoint(val: number, centerVal: number) {
    return centerVal + Math.abs(val - centerVal) * (val < centerVal ? 1 : -1)
  },

  /**
   * @desc 获取翻转点
   * @param point 要翻转的点
   * @param center 中心点
   * */
  getReversePoint2(point: P, center: P): P {
    let x = this.getReversePoint(point.x, center.x)
    let y = this.getReversePoint(point.y, center.y)
    return {x, y}
  },

  /**
   * @desc 水平翻转点
   * @param point 要翻转的点
   * @param center 中心点
   * */
  horizontalReversePoint(point: P, center: P) {
    point.x = this.getReversePoint(point.x, center.x)
    return point
  },
  /**
   * @desc 垂直翻转点
   * @param point 要翻转的点
   * @param center 中心点
   * */
  verticalReversePoint<T>(point: any, center: P): T {
    point.y = this.getReversePoint(point.y, center.y)
    return point
  },
  //废弃
  getPath(conf: BaseConfig, ctx?: any, pConf?: BaseConfig) {
    return conf
  },
  getRotate(conf: BaseConfig): number {
    let {rotation, flipHorizontal, flipVertical} = conf
    let r = rotation
    if (flipHorizontal && flipVertical) {
      r = (180 + rotation)
    } else {
      if (flipHorizontal) {
        r = (180 - rotation)
      }
    }
    return r
  },
  initConf(conf: BaseConfig, ctx: CanvasRenderingContext2D, pConf?: BaseConfig) {
    // console.log('initConf')
    if (conf.id) return conf
    let {
      x, y, w, h, flipHorizontal
    } = conf
    if (conf.type === ShapeType.FRAME) {
      ctx.font = `400 18rem "SourceHanSansCN", sans-serif`
      let m = ctx.measureText(conf.name)
      conf.nameWidth = m.width
    }
    let center = {x: x + (w / 2), y: y + (h / 2)}
    conf.id = uuid()
    conf.percent = {x: 0, y: 0,}
    conf.absolute = {x, y}
    conf.original = clone(conf.absolute)
    conf.realRotation = conf.rotation

    const {x: ax, y: ay} = conf.absolute
    let topLeft = {x: ax, y: ay}
    let topRight = {x: ax + w, y: ay}
    let bottomLeft = {x: ax, y: ay + h}
    let bottomRight = {x: ax + w, y: ay + h}

    /** @desc 水平翻转所有的点
     * */
    if (flipHorizontal) {
      topLeft = this.horizontalReversePoint(topLeft, center)
      topRight = this.horizontalReversePoint(topRight, center)
      bottomLeft = this.horizontalReversePoint(bottomLeft, center)
      bottomRight = this.horizontalReversePoint(bottomRight, center)
      conf.absolute = this.horizontalReversePoint(conf.absolute, center)
      conf.realRotation = -conf.rotation
    }
    /**
     *如果父组件旋转了,那么子组件的ab值也要旋转
     * */
    if (pConf) {
      //根据父级，计算出自己的0度绝对值x,y
      const zeroAb = {x: x + pConf.original.x, y: y + pConf.original.y,}
      conf.original = clone(zeroAb)
      let rotatedAb = getRotatedPoint(zeroAb, center, conf.realRotation)
      //用旋转后的ab值，减去老的ab值，就是xy的偏移量。与原xy相加得到旋转后的xy值
      conf.x = x + (rotatedAb.x - zeroAb.x)
      conf.y = y + (rotatedAb.y - zeroAb.y)
      //TODO 可能计算不准确
      conf.percent = {x: x / pConf.w, y: y / pConf.h,}

      let rotation = conf.realRotation
      topLeft = getRotatedPoint(topLeft, center, rotation)
      topRight = getRotatedPoint(topRight, center, rotation)
      bottomLeft = getRotatedPoint(bottomLeft, center, rotation)
      bottomRight = getRotatedPoint(bottomRight, center, rotation)

      if (pConf.realRotation) {
        topLeft = getRotatedPoint(topLeft, pConf.center, pConf.realRotation)
        topRight = getRotatedPoint(topRight, pConf.center, pConf.realRotation)
        bottomLeft = getRotatedPoint(bottomLeft, pConf.center, pConf.realRotation)
        bottomRight = getRotatedPoint(bottomRight, pConf.center, pConf.realRotation)
        conf.absolute = topLeft

        let xs = [topLeft.x, topRight.x, bottomLeft.x, bottomRight.x,]
        let ys = [topLeft.y, topRight.y, bottomLeft.y, bottomRight.y,]
        let maxX = Math.max(...xs)
        let minX = Math.min(...xs)
        let maxY = Math.max(...ys)
        let minY = Math.min(...ys)
        //TODO 这里是否可以直接以父角度旋转老的中心点得到新的？
        /**
         * 父组件旋转了，那么中心点也要相应的偏移
         * 通过四个边点来确定中心点
         * */
        center = {
          x: minX + (maxX - minX) / 2,
          y: minY + (maxY - minY) / 2
        }

        // /**
        //  *  父组件旋转了，那么original值应该重置为负的（自转角度加上父角度）后的absolute值。
        //  *  因为旋转操作时， original点始终是0度的absolute点，
        //  *  这样计算current和original以center点计算角度时，才会得到总的旋转角度（即包括父角度）
        //  * */
        // let reverseXy = getRotatedPoint(conf.absolute, center, -(conf.realRotation))
        // conf.original = reverseXy
      }
      conf.realRotation = this.getRotate(conf) + pConf.realRotation
    } else {
      let rotation = conf.realRotation
      if (rotation) {
        topLeft = getRotatedPoint(topLeft, center, rotation)
        topRight = getRotatedPoint(topRight, center, rotation)
        bottomLeft = getRotatedPoint(bottomLeft, center, rotation)
        bottomRight = getRotatedPoint(bottomRight, center, rotation)
        conf.absolute = topLeft
        conf.x = conf.absolute.x
        conf.y = conf.absolute.y
      }
    }
    conf.rotation = this.getRotate(conf)
    conf.center = center

    conf.box = {
      leftX: conf.center.x - w / 2,
      rightX: conf.center.x + w / 2,
      topY: conf.center.y - h / 2,
      bottomY: conf.center.y + h / 2,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    }
    return conf
  },
  calcConf(conf: BaseConfig, pConf?: BaseConfig): BaseConfig {
    let {
      x, y, w, h,
      center, flipHorizontal, flipVertical, realRotation
    } = conf

    //todo 计算original

    if (pConf) {

    } else {
      conf.absolute = {x: conf.x, y: conf.y}
    }

    let reverseXy = getRotatedPoint(conf.absolute, center, -realRotation)
    if (flipHorizontal) {
      conf.original = reverseXy = this.horizontalReversePoint(reverseXy, center)
    }
    if (flipVertical) {
      conf.original = reverseXy = this.verticalReversePoint(reverseXy, center)
    }
    const {x: ax, y: ay} = reverseXy
    let topLeft = {x: ax, y: ay}
    let topRight = {x: ax + w, y: ay}
    let bottomLeft = {x: ax, y: ay + h}
    let bottomRight = {x: ax + w, y: ay + h}

    if (realRotation) {
      topLeft = getRotatedPoint(topLeft, center, realRotation)
      topRight = getRotatedPoint(topRight, center, realRotation)
      bottomLeft = getRotatedPoint(bottomLeft, center, realRotation)
      bottomRight = getRotatedPoint(bottomRight, center, realRotation)
      // conf.absolute = conf.topLeft
      // conf.x = x + (conf.absolute.x - ax)
      // conf.y = y + (conf.absolute.y - ay)
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
    return conf
  },

  /**
   * @description 根据长度（即T）获取对应的点
   *  //P = (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
   * //x = (1−t)3x + 3(1−t)2tx +3(1−t)t2x + t3x
   * */
  getBezierPointByLength(t: number, points: any) {
    let [p1, p2, p3, p4] = points
    let x = Math.pow(1 - t, 3) * p1.x + 3 * Math.pow(1 - t, 2) * t * p2.x
      + 3 * (1 - t) * Math.pow(t, 2) * p3.x + Math.pow(t, 3) * p4.x
    let y = Math.pow(1 - t, 3) * p1.y + 3 * Math.pow(1 - t, 2) * t * p2.y
      + 3 * (1 - t) * Math.pow(t, 2) * p3.y + Math.pow(t, 3) * p4.y
    return {x, y}
  },
  /**
   * //采用https://juejin.cn/post/6995482699037147166#heading-13
   * //t取的1/4和3/4，算的结果较为精准
   * //同样的曲线，t取的1/4和3/4的结果，比t取的1/3和2/3的结果，没有小数点
   * //文章最后那里写错了
   * // 将公式(5)和公式(6)代入化简可得：这步应该是
   * // P1 =(3Pc − Pd )/72
   * // P2 =(3Pd − Pc )/72
   *
   * @description 获取指定一段贝塞尔曲线上的两个控制点
   * @param tp1 线段上1/4的点
   * @param tp2 线段上3/4的点
   * @param start 起始点
   * @param end 终点
   * */
  getBezier3ControlPoints(tp1: any, tp2: any, start: any, end: any) {
    let xb = 64 * tp1.x - 27 * start.x - end.x
    let yb = 64 * tp1.y - 27 * start.y - end.y
    let xc = 64 * tp2.x - start.x - 27 * end.x
    let yc = 64 * tp2.y - start.y - 27 * end.y

    let x1 = (3 * xb - xc) / 72
    let y1 = (3 * yb - yc) / 72
    let x2 = (3 * xc - xb) / 72
    let y2 = (3 * yc - yb) / 72
    return [{x: x1, y: y1}, {x: x2, y: y2}]
  },
  /**
   * //网上找的牛顿法,解一元三次方程。也算不出来正确的值
   * //https://www.zhihu.com/question/30570430
   * */
  test(xTarget: any, cp1: any, cp2: any) {
    let {x: x1, y: y1} = cp1
    let {x: x2, y: y2} = cp2
    var tolerance = 0.00001,
      t0 = 0.6,
      x = 3 * (1 - t0) * (1 - t0) * t0 * x1 + 3 * (1 - t0) * t0 * t0 * x2 + t0 * t0 * t0,
      t
    while (Math.abs(x - xTarget) > tolerance) {
      t = t0 - (3 * (1 - t0) * (1 - t0) * t0 * x1 + 3 * (1 - t0) * t0 * t0 * x2 + t0 * t0 * t0 - xTarget) /
        (3 * (1 - t0) * (1 - t0) * x1 + 6 * (1 - t0) * t0 * (x2 - x1) + 3 * t0 * t0 * (1 - x2))
      t0 = t
      x = 3 * (1 - t0) * (1 - t0) * t0 * x1 + 3 * (1 - t0) * t0 * t0 * x2 + t0 * t0 * t0
    }
    //return 3*(1-t)*(1-t)*t*y1 + 3*(1-t)*t*t*y2 + t*t*t;//这个是返回与x对应的y值
    return t
  },
  con(val: any) {
    console.log(JSON.stringify(val, null, 2))
  },
  cuberoot(x: any) {
    var y = Math.pow(Math.abs(x), 1 / 3)
    return x < 0 ? -y : y
  },
  /**
   * //网上找的，解一元三次方程
   * */
  solveCubic(a: number, b: number, c: number, d: number) {
    // console.log(arguments)
    if (Math.abs(a) < 1e-8) { // Quadratic case, ax^2+bx+c=0
      a = b
      b = c
      c = d
      if (Math.abs(a) < 1e-8) { // Linear case, ax+b=0
        a = b
        b = c
        if (Math.abs(a) < 1e-8) // Degenerate case
          return []
        return [-b / a]
      }

      var D = b * b - 4 * a * c
      if (Math.abs(D) < 1e-8)
        return [-b / (2 * a)]
      else if (D > 0)
        return [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)]
      return []
    }

    // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
    var p = (3 * a * c - b * b) / (3 * a * a)
    var q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a)
    var roots

    if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1/3
      roots = [this.cuberoot(-q)]
    } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
      roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : [])
    } else {
      var D = q * q / 4 + p * p * p / 27
      if (Math.abs(D) < 1e-8) {       // D = 0 -> two roots
        roots = [-1.5 * q / p, 3 * q / p]
      } else if (D > 0) {             // Only one real root
        var u = this.cuberoot(-q / 2 - Math.sqrt(D))
        roots = [u - p / (3 * u)]
      } else {                        // D < 0, three roots, but needs to use complex numbers/trigonometric solution
        var u = 2 * Math.sqrt(-p / 3)
        var t = Math.acos(3 * q / p / u) / 3  // D < 0 implies p < 0 and acos argument in [-1..1]
        var k = 2 * Math.PI / 3
        roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)]
      }
    }

    // Convert back from depressed cubic
    for (var i = 0; i < roots.length; i++)
      roots[i] -= b / (3 * a)
    return roots
  },
  async sleep(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, time)
    })
  },
  /**
   * //自己根据wiki写的，解一元三次方程.解出来是NaN。有问题，先不研究了
   * */
  MySolveCubic(a: number, b: number, c: number, d: number) {
    console.log(arguments)
    let one = (
      ((b * c) /
        (6 * Math.pow(a, 2)))
      -
      (Math.pow(b, 3) /
        (27 * Math.pow(a, 3)))
      -
      (d / (2 * a))
    )
    let two = (
      (c / (3 * a))
      -
      (Math.pow(b, 2) / (9 * Math.pow(a, 2)))
    )
    let w = Math.pow(one, 2) + Math.pow(two, 3)

    console.log('w', w)

    // let w2 =
    one = 36 * a * b * c
      - 8 * Math.pow(b, 3)
      - 108 * Math.pow(a, 2) * d

    two = 12 * a * c - 4 * Math.pow(b, 2)

    w = Math.pow(one, 2) + Math.pow(two, 3)

    let r2 = (
      -2 * b
      +
      Math.cbrt(
        one
        +
        Math.sqrt(w)
      )
      +
      Math.cbrt(
        one
        -
        Math.sqrt(w)
      )
    ) / (6 * a)

    console.log('r', r2)

    let
      r = -(b / (3 * a))
        +
        Math.cbrt(
          one
          +
          Math.sqrt(w)
        )
        +
        Math.cbrt(
          one
          -
          Math.sqrt(w)
        )

    // console.log('r', r)

    // return -2 * b + (
    // )
  },
  getXy() {
    return {x: 0, y: 0}
  }


}