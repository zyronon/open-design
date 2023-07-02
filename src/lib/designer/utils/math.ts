import {clone} from "lodash"
import {LineType, P} from "../types/type"
import {PenNetworkLine, PenNetworkNode} from "../config/PenConfig";
import {Bezier} from "bezier-js";

const Math2 = {
  getHypotenuse2(p1: P, p2: P): number {
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
      x: (point.x - center.x) * Math.cos(this.jiaodu2hudu(rotate)) - (point.y - center.y) * Math.sin(this.jiaodu2hudu(rotate)) + center.x,
      y: (point.x - center.x) * Math.sin(this.jiaodu2hudu(rotate)) + (point.y - center.y) * Math.cos(this.jiaodu2hudu(rotate)) + center.y
    }
  },
  cuberoot(x: any) {
    var y = Math.pow(Math.abs(x), 1 / 3)
    return x < 0 ? -y : y
  },
  //网上找的，解一元三次方程：ax^3+bx^2+cx+d=0
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
  //获取两点之间角度
  getDegree(center: P, one: P, two: P): number {
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
  //判断两条直线是否交叉
  // https://stackoverflow.com/questions/37127144/how-can-i-fill-enclosed-shapes-in-a-line
  isIntersection(p0: P, p1: P, p2: P, p3: P): P {
    let d1x = p1.x - p0.x,
      d1y = p1.y - p0.y,
      d2x = p3.x - p2.x,
      d2y = p3.y - p2.y,
      d = d1x * d2y - d2x * d1y,
      px, py, s, t;
    if (d) {
      px = p0.x - p2.x;
      py = p0.y - p2.y;
      s = (d1x * py - d1y * px) / d;
      if (s >= 0 && s <= 1) {
        t = (d2x * py - d2y * px) / d;
        if (t >= 0 && t <= 1) return {x: p0.x + (t * d1x), y: p0.y + (t * d1y)};
      }
    }
    return null as any
  },
  isIntersection2(line: PenNetworkLine, line2: PenNetworkLine, nodes: PenNetworkNode[], ctrlNodes: P[]) {
    let p1 = nodes[line[0]],
      p2 = nodes[line[1]],
      p3 = nodes[line2[0]],
      p4 = nodes[line2[1]]
    if (line[6] === LineType.Line && line2[6] === LineType.Line) {

    } else if (line[6] === LineType.Line && line2[6] === LineType.Bezier2) {
      let cp: P
      if (line2[2] !== -1) cp = ctrlNodes[line2[2]]
      if (line2[3] !== -1) cp = ctrlNodes[line2[3]]
      let b = new Bezier(p3, cp!, p4)
      let intersects = b.intersects({p1, p2})
      if (intersects.length) {
        let lastIntersects = intersects[intersects.length - 1] as number
        if (lastIntersects === 0) return null
        let a = b.split(lastIntersects)
        // console.log('Bezier2', a)
        return {
          intersectsPoint: b.get(lastIntersects as number),
          startLine: {
            type: line[6],
            lines: [
              [nodes[line[0]], nodes[line[1]]]
            ]
          },
          endLine: {
            type: line2[6],
            lines: [
              a.left.points
            ]
          }
        }
      }
    } else if (line[6] === LineType.Line && line2[6] === LineType.Bezier3) {
      let b = new Bezier(p3, ctrlNodes[line2[2]],ctrlNodes[line2[3]], p4)
      let intersects = b.intersects({p1, p2})
      if (intersects.length) {
        let lastIntersects = intersects[intersects.length - 1] as number
        if (lastIntersects === 0) return null
        let a = b.split(lastIntersects)
        console.log('Bezier3', a)
        return {
          intersectsPoint: b.get(lastIntersects as number),
          startLine: {
            type: line[6],
            lines: [
              [nodes[line[0]], nodes[line[1]]]
            ]
          },
          endLine: {
            type: line2[6],
            lines: [
              a.left.points
            ]
          }
        }
      }
    }
    return null as any
  }
}
export {Math2}

