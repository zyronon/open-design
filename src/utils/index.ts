//获取斜边长度
//给一个圆心点和其他点
import {P2} from "../pages/canvas/type"

export function getHypotenuse(one: number[], two: number[]) {
  let [oneX, oneY] = one
  let [twoX, twoY] = two
  let dx = twoX - oneX
  let dy = twoY - oneY
  // return Math.sqrt(dx * dx + dy * dy)
  return Math.hypot(dx, dy)
}

/**
 * 计算向量夹角，单位是弧度
 * @param {Array.<2>} av
 * @param {Array.<2>} bv
 * @returns {number}
 */
export function computedIncludedAngle(av: any, bv: any) {
  return Math.atan2(av[1], av[0]) - Math.atan2(bv[1], bv[0]);
}

export function getHypotenuse2(p1: any, p2: any) {
  let {x: p1X, y: p1Y} = p1
  let {x: p2X, y: p2Y} = p2
  // return Math.sqrt(Math.pow(p2X - p1X, 2) + Math.pow(p2Y - p1Y, 2))
  return Math.hypot(p2X - p1X, p2Y - p1Y)
}

export function hudu2juedu(v: number) {
  if (!v) return 0
  return v * 180 / Math.PI
}

export function jiaodu2hudu(v: number) {
  if (!v) return 0
  return (v * Math.PI) / 180
}

//获取圆上的另一个点
export function getRoundOtherPoint3(p1: any, c: any, angle: number) {
  let {x, y} = p1
  let {cx, cy} = c
  let hypotenuse = getHypotenuse([cx, cy], [x, y])
  // console.log('hypotenuse', hypotenuse)
  let s = Math.abs(y) / Math.abs(hypotenuse)
  // console.log(s)
  let a = Math.acos(s)
  // console.log(a)
  let b = hudu2juedu(a) + angle
  // console.log(b)
  let x1 = Math.sin(jiaodu2hudu(b)) * Math.abs(hypotenuse)
  let y1 = Math.cos(jiaodu2hudu(b)) * Math.abs(hypotenuse)
  return [x1, y1]
}

//获取两点之间角度
export function getAngle(center: number[], one: number[], two: number[]) {
  let [cx, cy] = center
  let [x1, y1] = one
  let [x2, y2] = two
  //2个点之间的角度获取
  let c1 = Math.atan2(y1 - cy, x1 - cx) * 180 / (Math.PI);
  let c2 = Math.atan2(y2 - cy, x2 - cx) * 180 / (Math.PI);
  let angle;
  c1 = c1 <= -90 ? (360 + c1) : c1;
  c2 = c2 <= -90 ? (360 + c2) : c2;

  //夹角获取
  angle = Math.floor(c2 - c1);
  angle = angle < 0 ? angle + 360 : angle;
  return angle;
}

//获取两点之间角度
export function getAngle2(center: P2, one: P2, two: P2) {
  let {x: cx, y: cy} = center
  let {x: x1, y: y1} = one
  let {x: x2, y: y2} = two
  //2个点之间的角度获取
  let c1 = Math.atan2(y1 - cy, x1 - cx) * 180 / (Math.PI);
  let c2 = Math.atan2(y2 - cy, x2 - cx) * 180 / (Math.PI);
  let angle;
  c1 = c1 <= -90 ? (360 + c1) : c1;
  c2 = c2 <= -90 ? (360 + c2) : c2;

  //夹角获取
  // angle = Math.floor(c2 - c1);
  angle = c2 - c1
  angle = angle < 0 ? angle + 360 : angle;
  return angle;
}

/**
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
export function getRotatedPoint(point: any, center: any, rotate: any) {
  return {
    x: (point.x - center.x) * Math.cos(jiaodu2hudu(rotate)) - (point.y - center.y) * Math.sin(jiaodu2hudu(rotate)) + center.x,
    y: (point.x - center.x) * Math.sin(jiaodu2hudu(rotate)) + (point.y - center.y) * Math.cos(jiaodu2hudu(rotate)) + center.y
  }
}

/**
 * 获取两点之间连线后的中点坐标
 * @param  {Object} p1 点1的坐标
 * @param  {Object} p2 点2的坐标
 * @return {Object}    中点坐标
 */
export default function getCenterPoint(p1: any, p2: any) {
  return {
    x: p1.x + ((p2.x - p1.x) / 2),
    y: p1.y + ((p2.y - p1.y) / 2)
  }
}