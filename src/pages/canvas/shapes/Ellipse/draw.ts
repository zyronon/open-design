import {jiaodu2hudu} from "../../../../utils"
import {ShapeType} from "../../utils/type"
import draw from "../../utils/draw"

export function drawSelectedHover(ctx: CanvasRenderingContext2D, config: any) {
  let {
    x, y, w, h, radius,
    fillColor, borderColor, rotate,
    type, flipVertical, flipHorizontal, children,
  } = config
  ctx.strokeStyle = 'rgb(139,80,255)'

  let d = 4
  let radius2 = 200
  let min = Math.min(w, h)
  // debugger
  let maxRadius = min / 2
  // let hypotenuse = Math.sqrt(Math.pow(maxRadius, 2) + Math.pow(maxRadius, 2))
  let hypotenuse = Math.hypot(maxRadius, maxRadius)

  let radiusHyp = hypotenuse / maxRadius * radius2
  let cos = Math.cos(jiaodu2hudu(45))
  let hey = cos * radiusHyp
  // console.log(hey)


  d = 20
  d = radius
  let r2 = 5
  let t = config
  let endTop = {
    x: t.x + Math.min(t.w, t.h) / 2,
    y: t.y + Math.min(t.w, t.h) / 2,
  }
  let endBottom = {
    x: t.x + Math.min(t.w, t.h) / 2,
    y: t.y + t.h - Math.min(t.w, t.h) / 2,
  }
  let topLeft = {
    x: t.x + d,
    y: t.y + d,
  }
  let topRight = {
    x: t.x + t.w - d,
    y: t.y + d,
  }
  let bottomLeft = {
    x: t.x + d,
    y: t.y + t.h - d,
  }
  let bottomRight = {
    x: t.x + t.w - d,
    y: t.y + t.h - d,
  }
  ctx.save()
  // let nv = currentMat
  // ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13]);
  // renderRound(endTop, r, ctx, ShapeType.SELECT)
  // renderRound(endBottom, r, ctx, ShapeType.SELECT)

  draw.renderRound(topLeft, r2, ctx, ShapeType.SELECT)
  draw.renderRound(topRight, r2, ctx, ShapeType.SELECT)
  draw.renderRound(bottomLeft, r2, ctx, ShapeType.SELECT)
  draw.renderRound(bottomRight, r2, ctx, ShapeType.SELECT)
  ctx.restore()
}
