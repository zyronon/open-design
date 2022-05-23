//获取斜边长度
//给一个圆心点和其他点
export function getHypotenuse(one: number[], two: number[]) {
  let [oneX, oneY] = one
  let [twoX, twoY] = two
  let dx = twoX - oneX
  let dy = twoY - oneY
  return Math.sqrt(dx * dx + dy * dy)
}

function hudu2juedu(v: number) {
  return v * 180 / Math.PI
}

function jiaodu2hudu(v: number) {
  return (v * Math.PI) / 180
}

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