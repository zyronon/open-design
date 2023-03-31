import { P } from "../types/type"
import { Math2 } from "./math"

const Bezier = {
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
  getTargetPointControlPoint(previousPoint: P, targetPoint: P, nextPoint: P) {
    // @ts-ignore
    // console.log(...arguments)
    let { x: p1X, y: p1Y } = previousPoint
    let { x: p2X, y: p2Y } = nextPoint
    let m = (p2Y - p1Y) / (p2X - p1X)
    // console.log('m', m)
    let A = Math2.getHypotenuse2(nextPoint, previousPoint)
    let X = A * 0.25
    let rx = targetPoint.x + (X / Math.sqrt(1 + Math.pow(m, 2)));
    let ry = targetPoint.y + (m * (X / Math.sqrt(1 + Math.pow(m, 2))));
    let cpR = { x: rx, y: ry }
    let cpL = Math2.getRotatedPoint(cpR, targetPoint, 180)
    //这里计算出的cpR，是固定的在当前点的右边。比较哪个控制点离previousPoint近，需要视情况调换两个值用于绘制曲线。
    let cpAndPreviousPointLength1 = Math2.getHypotenuse2(cpL, previousPoint)
    let cpAndPreviousPointLength2 = Math2.getHypotenuse2(cpR, previousPoint)
    if (cpAndPreviousPointLength1 < cpAndPreviousPointLength2) {
      return { l: cpL, r: cpR }
    }
    return { l: cpR, r: cpL }
    //下面是直接将X加上b的x，代入直线方程求y，会出现方向正确，但d点与b点的长度不等于X的问题
    // let dx = X + targetPoint.x
    // let dy = X / m + targetPoint.y
    // console.log(dx, dy)
    // return {x: dx, y: dy}
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
  getControlPointsByLinePoint(tp1: any, tp2: any, start: any, end: any) {
    let xb = 64 * tp1.x - 27 * start.x - end.x
    let yb = 64 * tp1.y - 27 * start.y - end.y
    let xc = 64 * tp2.x - start.x - 27 * end.x
    let yc = 64 * tp2.y - start.y - 27 * end.y

    let x1 = (3 * xb - xc) / 72
    let y1 = (3 * yb - yc) / 72
    let x2 = (3 * xc - xb) / 72
    let y2 = (3 * yc - yb) / 72
    return [{ x: x1, y: y1 }, { x: x2, y: y2 }]
  },
  /**
   * @description 根据长度（即T）获取对应的点
   *  //P = (1−t)3P0 + 3(1−t)2tP1 +3(1−t)t2P2 + t3P3
   * //x = (1−t)3x + 3(1−t)2tx +3(1−t)t2x + t3x
   * */
  getPointByT_3(t: number, points: [P, P, P, P]) {
    let [p0, p1, p2, p3] = points
    let x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x
      + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x
    let y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y
      + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y
    return { x, y }
  }, /**
   * @description 根据长度（即T）获取对应的点
   *  //P = (1−t)2P0 + 2(1−t)tP1 + t2P2
   * */
  getPointByT_2(t: number, points: [P, P, P]) {
    let [p0, p1, p2] = points
    let x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x
    let y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y
    return { x, y }
  },
  /**
   * #####三次曲线#####
   * 已知四个控制点，及曲线中的某一个点的 x/y，反推求 t
   * @param {number} p0 起点 x/y
   * @param {number} p1 控制点1 x/y
   * @param {number} p2 控制点2 x/y
   * @param {number} p3 终点 x/y
   * @param {number} target 曲线中的某个点 x/y
   * @returns {number[]} t[]
   */
  getTByPoint_3(p0: number, p1: number, p2: number, p3: number, target: number): number[] {
    const a = -p0 + 3 * p1 - 3 * p2 + p3
    const b = 3 * p0 - 6 * p1 + 3 * p2
    const c = -3 * p0 + 3 * p1
    const d = p0 - target

    // 盛金公式, 预先需满足, a !== 0
    // 判别式
    const A = Math.pow(b, 2) - 3 * a * c
    const B = b * c - 9 * a * d
    const C = Math.pow(c, 2) - 3 * b * d
    const delta = Math.pow(B, 2) - 4 * A * C

    let t1 = -100, t2 = -100, t3 = -100

    // 3个相同实数根
    if (A === B && A === 0) {
      t1 = -b / (3 * a)
      t2 = -c / b
      t3 = -3 * d / c
      return [t1, t2, t3].filter(v => 0 <= v && v <= 1.01)
    }

    // 1个实数根和1对共轭复数根
    if (delta > 0) {
      const v = Math.pow(B, 2) - 4 * A * C
      const xsv = v < 0 ? -1 : 1

      const m1 = A * b + 3 * a * (-B + (v * xsv) ** (1 / 2) * xsv) / 2
      const m2 = A * b + 3 * a * (-B - (v * xsv) ** (1 / 2) * xsv) / 2

      const xs1 = m1 < 0 ? -1 : 1
      const xs2 = m2 < 0 ? -1 : 1

      t1 = (-b - (m1 * xs1) ** (1 / 3) * xs1 - (m2 * xs2) ** (1 / 3) * xs2) / (3 * a)
      // 涉及虚数，可不考虑。i ** 2 = -1
    }

    // 3个实数根
    if (delta === 0) {
      const K = B / A
      t1 = -b / a + K
      t2 = t3 = -K / 2
    }

    // 3个不相等实数根
    if (delta < 0) {
      const xsA = A < 0 ? -1 : 1
      const T = (2 * A * b - 3 * a * B) / (2 * (A * xsA) ** (3 / 2) * xsA)
      const theta = Math.acos(T)

      if (A > 0 && T < 1 && T > -1) {
        t1 = (-b - 2 * A ** (1 / 2) * Math.cos(theta / 3)) / (3 * a)
        t2 = (-b + A ** (1 / 2) * (Math.cos(theta / 3) + 3 ** (1 / 2) * Math.sin(theta / 3))) / (3 * a)
        t3 = (-b + A ** (1 / 2) * (Math.cos(theta / 3) - 3 ** (1 / 2) * Math.sin(theta / 3))) / (3 * a)
      }
    }
    return [t1, t2, t3].filter(v => 0 <= v && v <= 1)
  },
  /**
   * #####二次曲线#####
   * 已知三个控制点，及曲线中的某一个点的 x/y，反推求 t
   * P = (1−t)2P0 + 2(1−t)tP1 + t2P2
   * 将上面的方程改写成标准形式，得到：
   * at^2 + bt + c = 0
   * 其中
   * a =  p0 - 2 * p1 + p2
   * b = 2 * (p1 - p0)
   * c = p0 - target
   * */
  getTByPoint_2(p0: number, p1: number, p2: number, target: number): number[] {
    let a = p0 - 2 * p1 + p2
    let b = 2 * (p1 - p0)
    let c = p0 - target

    // 求解二次方程
    let delta = b * b - 4 * a * c;
    if (delta < 0) {
      return [];
    }
    let t1 = (-b + Math.sqrt(delta)) / (2 * a);
    let t2 = (-b - Math.sqrt(delta)) / (2 * a);
    return [t1, t2].filter(v => 0 <= v && v <= 1)
  }
}
export { Bezier }