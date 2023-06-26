function arcToBezier(e, t, n, 开始角度, 结束角度, 应该是反转 = false) {
  if (应该是反转) {
    const e = 开始角度;
    开始角度 = 结束角度;
    结束角度 = e;
  }
  if (结束角度 < 开始角度) {
    结束角度 += 2 * Math.PI;
  }
  const r = t + Math.cos(开始角度) * e
  let s = n + Math.sin(开始角度) * e
  let l = t + Math.cos(结束角度) * e
  let c = n + Math.sin(结束角度) * e
  let d = 结束角度 - 开始角度
  let u = 4 * Math.tan(d / 4) / 3
  let h = r - u * (s - n)
  let p = s + u * (r - t)
  let f = l + u * (c - n)
  let m = c - u * (l - t);
  return 应该是反转 ? `C ${f} ${m} ${h} ${p} ${r} ${s}` : `C ${h} ${p} ${f} ${m} ${l} ${c}`
}

function arcToBezier2(radius, centerX, centerY, startAngle, endAngle, reverse = false) {
  if (reverse) {
    const e = startAngle;
    startAngle = endAngle;
    endAngle = e;
  }
  if (endAngle < startAngle) {
    endAngle += 2 * Math.PI;
  }
  const r = centerX + Math.cos(startAngle) * radius
  let s = centerY + Math.sin(startAngle) * radius
  let l = centerX + Math.cos(endAngle) * radius
  let c = centerY + Math.sin(endAngle) * radius
  let d = endAngle - startAngle
  let u = 4 * Math.tan(d / 4) / 3
  let h = r - u * (s - centerY)
  let p = s + u * (r - centerX)
  let f = l + u * (c - centerY)
  let m = c - u * (l - centerX);
  return reverse ? `C ${f} ${m} ${h} ${p} ${r} ${s}` : `C ${h} ${p} ${f} ${m} ${l} ${c}`
}

function genPath(e, t) {
  let cornerRadius = [
    30, 30, 30, 30
  ]
  let n, i, a, r;
  let {x: X, y: Y, width: Width, height: Height} = e;
  // const Stroke12 = this.strokeWeight / 2;
  // if (t && this.strokeAlign === o["H"].INSIDE || t && this.strokeAlign === o["H"].OUTSIDE) {
  //   X += Stroke12
  //   Y += Stroke12
  //   Width -= this.strokeWeight
  //   Height -= this.strokeWeight
  // }
  const 最小边的一半 = Width < Height ? Width / 2 : Height / 2
  let 最小圆角0 = Math.min(null !== (n = cornerRadius[0]) && void 0 !== n ? n : 0, 最小边的一半)
  let 最小圆角1 = Math.min(null !== (i = cornerRadius[1]) && void 0 !== i ? i : 0, 最小边的一半)
  let 最小圆角2 = Math.min(null !== (a = cornerRadius[2]) && void 0 !== a ? a : 0, 最小边的一半)
  let 最小圆角3 = Math.min(null !== (r = cornerRadius[3]) && void 0 !== r ? r : 0, 最小边的一半);
  let y = {
    x: X, y: Y + 最小圆角0
  }
  let b = `M ${y.x} ${y.y}`;
  //M0 250
  b += arcToBezier(最小圆角0, X + 最小圆角0, Y + 最小圆角0, -Math.PI, -Math.PI / 2)
  y = {
    x: X + Width - 最小圆角1, y: Y
  }
  b += `L ${y.x} ${y.y}`;
  const v = X + Width, w = Y + Height;
  b += arcToBezier(最小圆角1, v - 最小圆角1, Y + 最小圆角1, -Math.PI / 2, 0)
  y = {
    x: X + Width, y: Y + Height - 最小圆角2
  }
  b += `L ${y.x} ${y.y}`
  b += arcToBezier(最小圆角2, v - 最小圆角2, w - 最小圆角2, 0, Math.PI / 2)
  y = {
    x: X + 最小圆角3, y: Y + Height
  }
  b += `L ${y.x} ${y.y}`
  b += arcToBezier(最小圆角3, X + 最小圆角3, w - 最小圆角3, Math.PI / 2, Math.PI)
  b += "Z"
  return {
    type: "path", props: {
      d: b
    }
  }
}

//猜测应该是计算指定长度的点的
function calLen(e, t, n) {
  if (0 === n)
    return e;
  if (1 === n)
    return t;
  const i = e.x + (t.x - e.x) * n
    , o = e.y + (t.y - e.y) * n;
  return {
    x: i,
    y: o
  }
}

let s = genPath({
  x: 0,
  y: 0,
  width: 300,
  height: 500
})

console.log(s);