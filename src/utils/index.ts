//获取斜边长度
//给一个圆心点和其他点
export function getHypotenuse(one: number[], two: number[]) {
  let [oneX, oneY] = one
  let [twoX, twoY] = two
  let dx = twoX - oneX
  let dy = twoY - oneY
  return Math.sqrt(dx * dx + dy * dy)
}

export function getHypotenuse2(p1: any, p2: any) {
  let {x: p1X, y: p1Y} = p1
  let {x: p2X, y: p2Y} = p2
  return Math.sqrt(Math.pow(p2X - p1X, 2) + Math.pow(p2Y - p1Y, 2))
}

export function hudu2juedu(v: number) {
  return v * 180 / Math.PI
}

export function jiaodu2hudu(v: number) {
  return (v * Math.PI) / 180
}

//获取圆上的另一个点
export function getRoundOtherPoint(x: number, y: number) {
  let hypotenuse = getHypotenuse([0, 0], [x, y])
  // console.log('hypotenuse', hypotenuse)
  let s = Math.abs(y) / Math.abs(hypotenuse)
  // console.log(s)
  let a = Math.acos(s)
  // console.log(a)
  let b = hudu2juedu(a) + 20
  // console.log(b)
  let x1 = Math.sin(jiaodu2hudu(b)) * Math.abs(hypotenuse)
  let y1 = Math.cos(jiaodu2hudu(b)) * Math.abs(hypotenuse)
  return [x1, y1]
}

//获取圆上的另一个点
export function getRoundOtherPoint2(x: number, y: number, x2, y2) {
  let hypotenuse = getHypotenuse([x2, y2], [x, y])
  // console.log('hypotenuse', hypotenuse)
  let s = Math.abs(y) / Math.abs(hypotenuse)
  // console.log(s)
  let a = Math.acos(s)
  // console.log(a)
  let b = hudu2juedu(a) + 20
  // console.log(b)
  let x1 = Math.sin(jiaodu2hudu(b)) * Math.abs(hypotenuse)
  let y1 = Math.cos(jiaodu2hudu(b)) * Math.abs(hypotenuse)
  return [x1, y1]
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

export function getRotatedPoint(point, center, rotate) {
  /**
   * 旋转公式：
   *  点a(x, y)
   *  旋转中心c(x, y)
   *  旋转后点n(x, y)
   *  旋转角度θ
   * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
   * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
   */
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
export default function getCenterPoint(p1, p2) {
  return {
    x: p1.x + ((p2.x - p1.x) / 2),
    y: p1.y + ((p2.y - p1.y) / 2)
  }
}