import {clone, inRange} from "lodash"
import {jiaodu2hudu} from "../../../utils"
import {P, P2} from "../types/type"
import helper from "./helper";

const Math2 = {
  getTan(p1: P | P2, p2: P | P2) {
    let {x: p1X, y: p1Y} = p1
    let {x: p2X, y: p2Y} = p2
    let a = Math.abs(p2Y - p1Y)
    let b = Math.abs(p2X - p1X)
    let c = Math.hypot(a, b)
    let d = Math.asin(b / c)
    console.log('d', d)
    let r = this.hudu2juedu(d)
    console.log('r', r)
  },
  /**
   * #获取目标点的贝塞尔控制点
   *
   * 简介：求平行于目标点targetPoint（命名b）的对边（命名A）（previousPoint（命名a）-nextPoint（命名c）），长度为对边A的0.25倍（命名X）的点（命名r）的坐标
   * 可以简化为：一个三角形，三条边分别命名为A,B,C，三个点分别为a,b,c。如何求出平行于A边，过b点的任一点r？
   * 原理：分开两步，先算A边的斜率m，得到斜率之后，利用已经条件：b点坐标，长度X，斜率m。列方程组可求出r点坐标
   *  - 首先计算出边A的斜率，即通过点a和点c的坐标计算得到。假设点a的坐标为(x1,y1)，点c的坐标为(x3,y3)，则边A的斜率为：
   *  ```
   *   m = (y3 - y1) / (x3 - x1)
   *   ```
   *  - 然后，以点b为起点，使用斜率m来计算直线的方程式。设过点b的直线上的任意一点的坐标为(x,y)，则直线的方程式为：
   *  ```
   *  y - yb = m(x - xb)
   *  ```
   *  - 然后，使用任意一个x值，代入上述方程式求出对应的y值，即可得到过点b且平行于边A的直线上的任意一点的坐标。
   *
   *  - 但是此刻我们只有已知长度X，并没有x或y值去反向求对应值。如果直接将x等于xb + X代入直线方程求y。那么会出现方向正确，但r点与b点的长度不等于X的问题
   *  所以又是一个新的问题：已知b点坐标，已知r点与b点的长度为X，斜率m。求r点的坐标？
   *
   *  -设点b的坐标为 (xb, yb)，点r的坐标为 (xr, yr)，则有：
   *  -由于已知点b、斜率m和点r与点b的长度X，可以得到过点b且斜率为m的直线的方程为：
   *  ```
   *  yr - yb = m(xr - xb)
   *  ```
   *  - 又因为点r与点b的长度为X，所以可以列出点r在直线上的距离方程：
   *  ```
   *  f = sqrt((xr - xb)^2 + (yr - yb)^2) = X
   *  ```
   *  其中，f为点r到点b的距离，X为已知的长度。
   *
   *  - 将直线方程代入距离方程中，可以得到：
   *  ```
   *  sqrt((xr - xb)^2 + (m(xr - xb))^2) = X
   *  ```
   *  - 对上述方程进行变形，得到：
   *  ```
   *  (xr - xb)^2 + (m(xr - xb))^2 = X^2
   *  ```
   *  - 展开并化简，得到一个关于xr的二次方程：
   *  ```
   *  (m^2 + 1) xr^2 - 2(xb + m^2 xr) xr + (xb^2 + m^2 yb^2 - X^2) = 0
   *
   *  ```*
   *  - 需要注意的是，如果边A的斜率不存在（即垂直于x轴），则需要使用其他方法来求解。此时，可以先通过点b和点c的坐标计算出边b的长度，
   *  然后将直线向y轴正方向移动相应的距离即可得到过点b且平行于A的直线上的任意一点。
   *
   * */
  getTargetPointBezierControlPoint(previousPoint: P | P2, targetPoint: P | P2, nextPoint: P | P2) {
    // @ts-ignore
    // console.log(...arguments)
    let {x: p1X, y: p1Y} = previousPoint
    let {x: p2X, y: p2Y} = nextPoint
    let m = (p2Y - p1Y) / (p2X - p1X)
    // console.log('m', m)
    let A = this.getHypotenuse2(nextPoint, previousPoint)
    let X = A * 0.25
    let rx = targetPoint.x + (X / Math.sqrt(1 + Math.pow(m, 2)));
    let ry = targetPoint.y + (m * (X / Math.sqrt(1 + Math.pow(m, 2))));
    let cpR = {x: rx, y: ry}
    let cpL = this.getRotatedPoint(cpR, targetPoint, 180)
    //这里计算出的cpR，是固定的在当前点的右边。比较哪个控制点离previousPoint近，需要视情况调换两个值用于绘制曲线。
    let cpAndPreviousPointLength1 = this.getHypotenuse2(cpL, previousPoint)
    let cpAndPreviousPointLength2 = this.getHypotenuse2(cpR, previousPoint)
    if (cpAndPreviousPointLength1 < cpAndPreviousPointLength2) {
      return {l: cpL, r: cpR}
    }
    return {l: cpR, r: cpL}
    //下面是直接将X加上b的x，代入直线方程求y，会出现方向正确，但d点与b点的长度不等于X的问题
    // let dx = X + targetPoint.x
    // let dy = X / m + targetPoint.y
    // console.log(dx, dy)
    // return {x: dx, y: dy}
  },
  getHypotenuse2(p1: any, p2: any) {
    let {x: p1X, y: p1Y} = p1
    let {x: p2X, y: p2Y} = p2
    return Math.hypot(p2X - p1X, p2Y - p1Y)
  },
  getHypotenuse(one: number[], two: number[]) {
    let [oneX, oneY] = one
    let [twoX, twoY] = two
    let dx = twoX - oneX
    let dy = twoY - oneY
    // return Math.sqrt(dx * dx + dy * dy)
    return Math.hypot(dx, dy)
  },
  //获取圆上的另一个点
  getRoundOtherPoint3(p1: any, c: any, angle: number) {
    let {x, y} = p1
    let {cx, cy} = c
    let hypotenuse = this.getHypotenuse([cx, cy], [x, y])
    // console.log('hypotenuse', hypotenuse)
    let s = Math.abs(y) / Math.abs(hypotenuse)
    // console.log(s)
    let a = Math.acos(s)
    // console.log(a)
    let b = this.hudu2juedu(a) + angle
    // console.log(b)
    let x1 = Math.sin(this.jiaodu2hudu(b)) * Math.abs(hypotenuse)
    let y1 = Math.cos(this.jiaodu2hudu(b)) * Math.abs(hypotenuse)
    return [x1, y1]
  },
  hudu2juedu(v: number) {
    if (!v) return 0
    return v * 180 / Math.PI
  },
  jiaodu2hudu(v: number) {
    if (!v) return 0
    return (v * Math.PI) / 180
  },
  /**
   * 计算向量夹角，单位是弧度
   * @param {Array.<2>} av
   * @param {Array.<2>} bv
   * @returns {number}
   */
  computedIncludedAngle(av: any, bv: any) {
    return Math.atan2(av[1], av[0]) - Math.atan2(bv[1], bv[0])
  },
  //获取两点之间角度
  getAngle(center: number[], one: number[], two: number[]) {
    let [cx, cy] = center
    let [x1, y1] = one
    let [x2, y2] = two
    //2个点之间的角度获取
    let c1 = Math.atan2(y1 - cy, x1 - cx) * 180 / (Math.PI)
    let c2 = Math.atan2(y2 - cy, x2 - cx) * 180 / (Math.PI)
    let angle
    c1 = c1 <= -90 ? (360 + c1) : c1
    c2 = c2 <= -90 ? (360 + c2) : c2

    //夹角获取
    angle = Math.floor(c2 - c1)
    angle = angle < 0 ? angle + 360 : angle
    return angle
  },
  /**
   * @desc 点绕中心坐标点旋转一定角度后点的坐标
   * 参考：https://blog.csdn.net/sinat_32560085/article/details/106389000，这个易理解
   * 参考：https://blog.csdn.net/qq_27278957/article/details/120080648
   * 旋转公式：
   *  点a(x, y)
   *  旋转中心c(x, y)
   *  旋转后点n(x, y)
   *  旋转角度θ
   * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
   * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
   */
  getRotatedPoint(point: any, center: any, rotate: number) {
    if (rotate === 0) return clone(point)
    return {
      x: (point.x - center.x) * Math.cos(jiaodu2hudu(rotate)) - (point.y - center.y) * Math.sin(jiaodu2hudu(rotate)) + center.x,
      y: (point.x - center.x) * Math.sin(jiaodu2hudu(rotate)) + (point.y - center.y) * Math.cos(jiaodu2hudu(rotate)) + center.y
    }
  },
  /**
   * 获取两点之间连线后的中点坐标
   * @param  {Object} p1 点1的坐标
   * @param  {Object} p2 点2的坐标
   * @return {Object}    中点坐标
   */
  getCenterPoint(p1: P, p2: P): P {
    return {
      x: p1.x + ((p2.x - p1.x) / 2),
      y: p1.y + ((p2.y - p1.y) / 2)
    }
  },
  /**
   * @desc 判断鼠标m是否在p点内
   * @param m 鼠标坐标
   * @param p 判断点坐标
   * @param r 半径
   * */
  isInPoint(m: P, p: P, r: number) {
    return (p.x - r < m.x && m.x < p.x + r) &&
      (p.y - r < m.y && m.y < p.y + r)
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

  //获取两点之间角度
  getDegree(center: P, one: P, two: P) {
    let {x: cx, y: cy} = center
    let {x: x1, y: y1} = one
    let {x: x2, y: y2} = two
    //2个点之间的角度获取
    let c1 = Math.atan2(y1 - cy, x1 - cx) * 180 / (Math.PI)
    let c2 = Math.atan2(y2 - cy, x2 - cx) * 180 / (Math.PI)
    let angle
    c1 = c1 <= -90 ? (360 + c1) : c1
    c2 = c2 <= -90 ? (360 + c2) : c2

    //夹角获取
    // angle = Math.floor(c2 - c1);
    angle = c2 - c1
    angle = angle < 0 ? angle + 360 : angle
    return angle
  },
  //判断点是否在盒子内
  isInBox(target: P, box: any): boolean {
    const {x, y} = target
    return box.leftX < x && x < box.rightX
      && box.topY < y && y < box.bottomY
  },
  isInLine(target: P, line: [p1: P, p2: P]) {
    let line1 = Math2.getHypotenuse2(target, line[0])
    let line2 = Math2.getHypotenuse2(target, line[1])
    let line3 = Math2.getHypotenuse2(line[0], line[1])
    // let d = 0.02
    let d = 0.04
    if (inRange(line1 + line2, line3 - d, line3 + d)) {
      // console.log('在线上')
      return true
    }
    return false
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
}
export {Math2}

