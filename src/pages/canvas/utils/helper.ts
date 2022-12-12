import {BaseConfig} from "../config/BaseConfig"
import {getRotatedPoint} from "../../../utils"
// @ts-ignore
import {v4 as uuid} from 'uuid'
import {clone} from "lodash"

export default {
  /**
   * @desc 获取翻转点
   * @param val 要翻转的点
   * @param centerVal 中心点
   * */
  getReversePoint(val: number, centerVal: number) {
    return centerVal + Math.abs(val - centerVal) * (val < centerVal ? 1 : -1)
  },
  getPath(conf: BaseConfig, ctx?: any, pConf?: BaseConfig) {
    // console.log('getPath')
    //根据老的config，计算出最新的rx,ry
    let {
      x, y, w, h, rotation,
      center, flipHorizontal, flipVertical
    } = conf

    if (!conf.id) {
      conf.id = uuid()

      //根据父级，计算出自己的绝对值x,y
      if (pConf) {
        conf.percent = {x: x / pConf.w, y: y / pConf.h,}
        conf.absolute = {x: x + pConf.original.x, y: y + pConf.original.y,}
        conf.original = clone(conf.absolute)
      } else {
        conf.percent = {x: 0, y: 0,}
        conf.absolute = {x, y,}
        conf.original = clone(conf.absolute)
      }
      const {x: ax, y: ay} = conf.absolute
      conf.center = {
        x: ax + (w / 2),
        y: ay + (h / 2)
      }
      conf.topLeft = {
        x: ax,
        y: ay
      }
      conf.topRight = {
        x: ax + w,
        y: ay
      }
      conf.bottomLeft = {
        x: ax,
        y: ay + h
      }
      conf.bottomRight = {
        x: ax + w,
        y: ay + h
      }
      if (rotation) {
        conf.topLeft = getRotatedPoint(conf.absolute, conf.center, rotation)
        conf.topRight = getRotatedPoint(conf.topRight, conf.center, rotation)
        conf.bottomLeft = getRotatedPoint(conf.bottomLeft, conf.center, rotation)
        conf.bottomRight = getRotatedPoint(conf.bottomRight, conf.center, rotation)
        conf.absolute = conf.topLeft
        conf.x = x + (conf.absolute.x - ax)
        conf.y = y + (conf.absolute.y - ay)
      }

      /**
       *如果父组件旋转了,那么子组件的ab值也要旋转
       * */
      if (pConf?.rotation) {
        conf.topLeft = getRotatedPoint(conf.topLeft, pConf.center, pConf.rotation)
        conf.topRight = getRotatedPoint(conf.topRight, pConf.center, pConf.rotation)
        conf.bottomLeft = getRotatedPoint(conf.bottomLeft, pConf.center, pConf.rotation)
        conf.bottomRight = getRotatedPoint(conf.bottomRight, pConf.center, pConf.rotation)
        conf.absolute = conf.topLeft
      }

      let xs = [
        conf.topLeft.x,
        conf.topRight.x,
        conf.bottomLeft.x,
        conf.bottomRight.x,
      ]
      let ys = [
        conf.topLeft.y,
        conf.topRight.y,
        conf.bottomLeft.y,
        conf.bottomRight.y,
      ]
      let maxX = Math.max(...xs)
      let minX = Math.min(...xs)
      let maxY = Math.max(...ys)
      let minY = Math.min(...ys)
      conf.center = {
        x: minX + (maxX - minX) / 2,
        y: minY + (maxY - minY) / 2
      }

      conf.box = {
        leftX: conf.center.x - w / 2,
        rightX: conf.center.x + w / 2,
        topY: conf.center.y - h / 2,
        bottomY: conf.center.y + h / 2,
      }
    }
    return conf
  },

  getRotate(conf: BaseConfig): number {
    let {rotation, flipHorizontal, flipVertical} = conf
    let r = rotation
    if (flipHorizontal && flipVertical) {
      r = (180 + rotation)
    } else {
      if (flipHorizontal) {
        r = (rotation - 180)
      }
    }
    return r
  },
  initConf(conf: BaseConfig, ctx: CanvasRenderingContext2D, pConf?: BaseConfig) {
    // console.log('initConf')
    let {
      x, y, w, h,
    } = conf
    if (!conf.id) {
      ctx.font = `400 18rem "SourceHanSansCN", sans-serif`
      let m = ctx.measureText(conf.name)
      conf.nameWidth = m.width
      conf.id = uuid()

      //根据父级，计算出自己的绝对值x,y
      if (pConf) {
        conf.percent = {x: x / pConf.w, y: y / pConf.h,}
        conf.absolute = {x: x + pConf.original.x, y: y + pConf.original.y,}
        conf.original = clone(conf.absolute)
        conf.realRotation = this.getRotate(conf) + pConf.realRotation
      } else {
        conf.percent = {x: 0, y: 0,}
        conf.absolute = {x, y,}
        conf.original = clone(conf.absolute)
        conf.realRotation = this.getRotate(conf)
      }
      const {x: ax, y: ay} = conf.absolute
      conf.center = {
        x: ax + (w / 2),
        y: ay + (h / 2)
      }
      conf.topLeft = {
        x: ax,
        y: ay
      }
      conf.topRight = {
        x: ax + w,
        y: ay
      }
      conf.bottomLeft = {
        x: ax,
        y: ay + h
      }
      conf.bottomRight = {
        x: ax + w,
        y: ay + h
      }
      if (conf.rotation) {
        conf.topLeft = getRotatedPoint(conf.topLeft, conf.center, conf.rotation)
        conf.topRight = getRotatedPoint(conf.topRight, conf.center, conf.rotation)
        conf.bottomLeft = getRotatedPoint(conf.bottomLeft, conf.center, conf.rotation)
        conf.bottomRight = getRotatedPoint(conf.bottomRight, conf.center, conf.rotation)
        conf.absolute = conf.topLeft
        conf.x = x + (conf.absolute.x - ax)
        conf.y = y + (conf.absolute.y - ay)
      }

      /**
       *如果父组件旋转了,那么子组件的ab值也要旋转
       * */
      if (pConf?.realRotation) {
        conf.topLeft = getRotatedPoint(conf.topLeft, pConf.center, pConf.realRotation)
        conf.topRight = getRotatedPoint(conf.topRight, pConf.center, pConf.realRotation)
        conf.bottomLeft = getRotatedPoint(conf.bottomLeft, pConf.center, pConf.realRotation)
        conf.bottomRight = getRotatedPoint(conf.bottomRight, pConf.center, pConf.realRotation)
        conf.absolute = conf.topLeft

        let xs = [
          conf.topLeft.x,
          conf.topRight.x,
          conf.bottomLeft.x,
          conf.bottomRight.x,
        ]
        let ys = [
          conf.topLeft.y,
          conf.topRight.y,
          conf.bottomLeft.y,
          conf.bottomRight.y,
        ]
        let maxX = Math.max(...xs)
        let minX = Math.min(...xs)
        let maxY = Math.max(...ys)
        let minY = Math.min(...ys)
        /**
         * 父组件旋转了，那么中心点也要相应的偏移
         * 通过四个边点来确定中心点
         * */
        conf.center = {
          x: minX + (maxX - minX) / 2,
          y: minY + (maxY - minY) / 2
        }

        /**
         *  父组件旋转了，那么original值应该重置为负的（自转角度加上父角度）后的absolute值。
         *  因为旋转操作时， original点始终是0度的absolute点，
         *  这样计算current和original以center点计算角度时，才会得到总的旋转角度（即包括父角度）
         * */
        let reverseXy = getRotatedPoint(conf.absolute, conf.center, -(conf.realRotation))
        conf.original = reverseXy
      }

      conf.box = {
        leftX: conf.center.x - w / 2,
        rightX: conf.center.x + w / 2,
        topY: conf.center.y - h / 2,
        bottomY: conf.center.y + h / 2,
      }
    }
    return conf
  },
  calcPath(conf: BaseConfig, rotation = conf.rotation, pConf?: BaseConfig) {
    let {
      x, y, w, h,
      center, flipHorizontal, flipVertical
    } = conf

    //todo 计算original

    conf.box = {
      leftX: center.x - w / 2,
      rightX: center.x + w / 2,
      topY: center.y - h / 2,
      bottomY: center.y + h / 2,
    }

    // conf.absolute = {x, y}
    let reverseXy = getRotatedPoint(conf.absolute, center, -rotation)
    const {x: ax, y: ay} = reverseXy
    conf.topLeft = {
      x: ax,
      y: ay
    }
    conf.topRight = {
      x: ax + w,
      y: ay
    }
    conf.bottomLeft = {
      x: ax,
      y: ay + h
    }
    conf.bottomRight = {
      x: ax + w,
      y: ay + h
    }
    if (rotation) {
      conf.topLeft = getRotatedPoint(conf.topLeft, center, rotation)
      conf.topRight = getRotatedPoint(conf.topRight, center, rotation)
      conf.bottomLeft = getRotatedPoint(conf.bottomLeft, center, rotation)
      conf.bottomRight = getRotatedPoint(conf.bottomRight, center, rotation)
      // conf.absolute = conf.topLeft
      // conf.x = x + (conf.absolute.x - ax)
      // conf.y = y + (conf.absolute.y - ay)
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