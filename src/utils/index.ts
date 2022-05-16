//获取斜边长度
export function getHypotenuse(one: number[], two: number[]) {
  let [oneX, oneY] = one
  let [twoX, twoY] = two
  let dx = twoX - oneX
  let dy = twoY - oneY
  return Math.sqrt(dx * dx + dy * dy)
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