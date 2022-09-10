import { IState, Shape, ShapeType, TextAlign } from "./type";
import { store } from "./store";
// @ts-ignore
import { v4 as uuid } from 'uuid';
import { Colors } from "./constant";

export function renderCanvas(
  rect: Shape,
  state: IState,
  parent?: Shape,
) {
  let {
    ctx, enterLT, enterRT, selectRect, activeHand, enter, offsetX, offsetY,
    handMove, handScale,
    currentPoint,
    isEdit
  } = state
  // console.log('renderCanvas', enterLT)
  ctx.save()
  let {
    x, y, w, h, radius,
    fillColor, borderColor, rotate, lineWidth,
    type, flipVertical, flipHorizontal,
  }
    = parent ? parent : rect
  if (parent) {
    type = rect.type

    let outside = .5
    x = x - outside
    y = y - outside
    w = w + 2 * outside
    h = h + 2 * outside
  }

  let oldCenter: { x: number; y: number; }
  let currentCenter: { x: number; y: number; } = {
    x: x + (w / 2),
    y: y + (h / 2)
  }
  let isMe = selectRect?.id === (parent ? parent.id : rect.id)
  if ((enterLT || enterRT) && isMe) {
    let s = selectRect!
    oldCenter = {
      x: s.x + (s.w / 2),
      y: s.y + (s.h / 2)
    }
    // console.log('oldCenter', oldCenter)
    // console.log('newCenter', newCenter)
  }

  ctx.lineWidth = lineWidth
  ctx.fillStyle = fillColor
  ctx.strokeStyle = borderColor
  // let tranX = 0
  // let tranY = 0
  let tranX = 0
  let tranY = 0
  let scaleX = 1
  let scaleY = 1
  if (rotate || flipHorizontal) {
    tranX = x + w / 2
    tranY = y + h / 2
    x = -w / 2
    y = -h / 2
  }

  if (flipHorizontal) {
    scaleX = -1
    // tranX = -tranX
    //如果在翻转情况下，自由拉伸要将tranX减去两个中心点偏移量
    if ((enterRT || enterLT) && isMe) {
      // console.log('tranX1', tranX)
      let d = oldCenter!.x - currentCenter!.x
      tranX += d * 2
      // console.log('tranX2', tranX)
    }
  }
  if (flipVertical) {
    // console.log('flipVertical', flipVertical)
    scaleY = -1
    // tranY = -tranY
  }

  ctx.translate(tranX, tranY)
  ctx.scale(scaleX, scaleY)
  ctx.rotate(rotate * Math.PI / 180)

  // ctx.strokeRect(x, y, w, h)
  if (
    type === ShapeType.RECT
    || type === ShapeType.HOVER
    || type === ShapeType.SELECT
  ) {
    if (radius && type !== ShapeType.SELECT) {
      renderRoundRect({ x, y, w, h }, radius, ctx)
    } else {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y);
      ctx.closePath()
    }
  }

  switch (type) {
    case ShapeType.ROUND:
      let a = w / 2, b = h / 2
      let ox = 0.5 * a,
        oy = .6 * b;

      ctx.save();
      ctx.translate(x + a, y + b);
      ctx.beginPath();
      ctx.moveTo(0, b);
      ctx.bezierCurveTo(ox, b, a, oy, a, 0);
      ctx.bezierCurveTo(a, -oy, ox, -b, 0, -b);
      ctx.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
      ctx.bezierCurveTo(-a, oy, -ox, b, 0, b);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      break
    case ShapeType.STAR:
      ctx.save();
      let outA = w / 2;
      let outB = h / 2;
      let innerA = outA / 2.6;
      let innerB = outB / 2.6;
      let x1, x2, y1, y2;
      ctx.translate(x + w / 2, y + h / 2);

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        x1 = outA * Math.cos((54 + i * 72) / 180 * Math.PI);
        y1 = outB * Math.sin((54 + i * 72) / 180 * Math.PI);
        x2 = innerA * Math.cos((18 + i * 72) / 180 * Math.PI);
        y2 = innerB * Math.sin((18 + i * 72) / 180 * Math.PI);
        //内圆
        ctx.lineTo(x2, y2);
        //外圆
        ctx.lineTo(x1, y1);
      }
      ctx.closePath();

      ctx.stroke();
      ctx.restore();

      break
    case ShapeType.POLYGON: {
      ctx.save();
      let outA = w / 2;
      let outB = h / 2;
      let x1, x2, y1, y2;
      ctx.translate(x + w / 2, y + h / 2);

      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        x1 = outA * Math.cos((30 + i * 120) / 180 * Math.PI);
        y1 = outB * Math.sin((30 + i * 120) / 180 * Math.PI);
        ctx.lineTo(x1, y1);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      break
    }
    case ShapeType.TEXT:
      // ctx.fillStyle = 'white'
      ctx.font = `${rect.fontWeight} ${rect.fontSize}rem "${rect.fontFamily}", sans-serif`;
      ctx.textBaseline = 'top'
      // ctx.textAlign = rect.textAlign

      // console.log('render', rect.texts)
      rect.brokenTexts?.map((text, index) => {
        let lX = x
        if (rect.textAlign === TextAlign.CENTER) {
          let m = ctx.measureText(text)
          lX = x + rect.w / 2 - m.width / 2
        }
        if (rect.textAlign === TextAlign.RIGHT) {
          let m = ctx.measureText(text)
          lX = x + rect.w - m.width
        }
        text && ctx.fillText(text, lX, y + (index * rect.textLineHeight));
      })
      break
    case ShapeType.RECT:
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.strokeStyle = borderColor
      ctx.stroke()
      break
    case ShapeType.IMG:
      let currentImg = store.images.get(rect.id)
      if (currentImg) {
        ctx.drawImage(currentImg, x, y, w, h);
      } else {
        let img = new Image();
        img.onload = () => {
          store.images.set(rect.id, img)
          ctx.drawImage(img, x, y, w, h);
        }
        img.src = new URL(rect.img, import.meta.url).href
      }

      // ctx.fillStyle = fillColor
      // ctx.fill()
      // ctx.strokeStyle = borderColor
      // ctx.stroke()
      break
    case ShapeType.HOVER:
      ctx.strokeStyle = 'rgb(139,80,255)'
      ctx.stroke()
      break
    case ShapeType.PENCIL:
      if (rect.points?.length) {
        ctx.strokeStyle = rect.borderColor
        // ctx.lineCap = "round";
        ctx.moveTo(rect.points[0]?.x, rect.points[0]?.y)
        rect.points.map((item: any) => {
          ctx.lineTo(item.x, item.y)
        })
        ctx.stroke()
      }
      break
    case ShapeType.PEN:
      if (rect.points?.length) {
        ctx.strokeStyle = rect.borderColor
        ctx.lineCap = "round";
        ctx.moveTo(rect.points[0]?.x, rect.points[0]?.y)
        rect.points.map((item: any, index: number, arr: any[]) => {
          if (isEdit && isMe) {
            renderRound({
                x: item.x,
                y: item.y,
                w: rect.w,
                h: rect.h,
              }, 4, ctx,
              index !== arr.length - 1 ? undefined : ShapeType.RECT)
          }
          ctx.beginPath()
          ctx.moveTo(item.x, item.y)
          if (index !== arr.length - 1) {
            ctx.lineTo(arr[index + 1].x, arr[index + 1].y)
            ctx.stroke()
          }
        })
      }
      break
    case ShapeType.SELECT: {
      // console.log('select')

      ctx.strokeStyle = 'rgb(139,80,255)'
      ctx.stroke()
      let d = 4
      clear({
        x: x - d,
        y: y - d,
        w: 2 * d,
        h: 2 * d
      }, ctx)
      clear({
        x: x + w - d,
        y: y - d,
        w: 2 * d,
        h: 2 * d
      }, ctx)
      clear({
        x: x + w - d,
        y: y + h - d,
        w: 2 * d,
        h: 2 * d
      }, ctx)
      clear({
        x: x - d,
        y: y + h - d,
        w: 2 * d,
        h: 2 * d
      }, ctx)

      let r = 3
      let lineWidth = 1.5
      renderRoundRect({
        x: x - d,
        y: y - d,
        w: 2 * d,
        h: 2 * d,
        lineWidth
      }, r, ctx)
      renderRoundRect({
        x: x + w - d,
        y: y - d,
        w: 2 * d,
        h: 2 * d,
        lineWidth
      }, r, ctx)
      renderRoundRect({
        x: x + w - d,
        y: y + h - d,
        w: 2 * d,
        h: 2 * d,
        lineWidth
      }, r, ctx)
      renderRoundRect({
        x: x - d,
        y: y + h - d,
        w: 2 * d,
        h: 2 * d,
        lineWidth
      }, r, ctx)
    }
      break
  }

  ctx.restore()
  if (rect.children) {
    rect.children.map(v => renderCanvas(v, state, rect))
  }
}

export function renderRoundRect(rect: any, r: number, ctx: any,) {
  ctx.lineWidth = rect.lineWidth
  let { x, y, w, h } = rect
  ctx.beginPath()
  ctx.moveTo(x + w / 2, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w / 2, y, r)
  ctx.closePath()
  ctx.stroke()
}

export function renderRound(rect: any, r: number, ctx: any, type: ShapeType = ShapeType.RECT) {
  let { x, y } = rect
  ctx.save()
  ctx.lineWidth = 2
  if (type === ShapeType.RECT) {
    ctx.fillStyle = Colors.primary
  } else {
    ctx.strokeStyle = Colors.primary
  }
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  if (type === ShapeType.RECT) {
    ctx.fill()
  } else {
    ctx.stroke()
  }
  ctx.restore()
}

export function clearAll(state: IState) {
  clear({
    x: 0,
    y: 0,
    w: state.canvas.width,
    h: state.canvas.height
  }, state.ctx)
  // this.state.ctx.fillStyle = 'black'
  // this.state.ctx.fillRect(0, 0, this.state.canvas.width, this.state.canvas.height)
}

export function clear(x: any, ctx: any) {
  ctx.clearRect(x.x, x.y, x.w, x.h)
}

export function getPath(rect: any) {
  rect.leftX = rect.abX
  rect.rightX = rect.leftX + rect.w
  rect.topY = rect.abY
  rect.bottomY = rect.topY + rect.h
  if (!rect.id) {
    rect.id = uuid()
  }
  return rect
}

export function calcPosition(ctx: CanvasRenderingContext2D, config: any, parent?: any) {
  let {
    x, y, w, h, radius,
    fillColor, borderColor, rotate, lineWidth,
    type, flipVertical, flipHorizontal, children,
    selected
  }
    = config
  if (parent) {
    x = config.abX = x + parent.abX
    y = config.abY = y + parent.abY
  } else {
    x = config.abX
    y = config.abY
  }
// console.log('type,', type)
  let oldCenter: { x: number; y: number; }
  let currentCenter: { x: number; y: number; } = {
    x: x + (w / 2),
    y: y + (h / 2)
  }

  ctx.lineWidth = lineWidth
  ctx.fillStyle = fillColor
  ctx.strokeStyle = borderColor

  let tranX = 0
  let tranY = 0
  let scaleX = 1
  let scaleY = 1
  if (rotate || flipHorizontal) {
    tranX = x + w / 2
    tranY = y + h / 2
    x = -w / 2
    y = -h / 2
  }

  ctx.translate(tranX, tranY)
  ctx.scale(scaleX, scaleY)
  ctx.rotate(rotate * Math.PI / 180)
  return { x, y }
}

export function hover(ctx: CanvasRenderingContext2D, config: any) {
  let {
    x, y, w, h, radius,
    fillColor, borderColor, rotate,
    type, flipVertical, flipHorizontal, children,
  } = config
  let d = .5
  let hover: any = {}
  hover.lineWidth = 2
  hover.x = x - d
  hover.y = y - d
  hover.w = w + 2 * d
  hover.h = h + 2 * d
  if (radius) {
    renderRoundRect(hover, radius, ctx)
  } else {
    ctx.beginPath()
    ctx.moveTo(hover.x, hover.y)
    ctx.lineTo(hover.x + hover.w, hover.y);
    ctx.lineTo(hover.x + hover.w, hover.y + hover.h);
    ctx.lineTo(hover.x, hover.y + hover.h);
    ctx.lineTo(hover.x, hover.y);
    ctx.closePath()
    ctx.strokeStyle = borderColor
    ctx.stroke()
  }
  ctx.strokeStyle = 'rgb(139,80,255)'
  ctx.stroke()
}

export function selected(ctx: CanvasRenderingContext2D, config: any) {
  let {
    x, y, w, h, radius,
    fillColor, borderColor, rotate,
    type, flipVertical, flipHorizontal, children,
  } = config
  ctx.strokeStyle = 'rgb(139,80,255)'

  if (radius) {
    renderRoundRect({ x, y, w, h }, radius, ctx)
  }
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y);
  ctx.closePath()
  ctx.stroke()
  let d = 4
  clear({
    x: x - d,
    y: y - d,
    w: 2 * d,
    h: 2 * d
  }, ctx)
  clear({
    x: x + w - d,
    y: y - d,
    w: 2 * d,
    h: 2 * d
  }, ctx)
  clear({
    x: x + w - d,
    y: y + h - d,
    w: 2 * d,
    h: 2 * d
  }, ctx)
  clear({
    x: x - d,
    y: y + h - d,
    w: 2 * d,
    h: 2 * d
  }, ctx)

  let r = 3
  let lineWidth = 1.5
  renderRoundRect({
    x: x - d,
    y: y - d,
    w: 2 * d,
    h: 2 * d,
    lineWidth
  }, r, ctx)
  renderRoundRect({
    x: x + w - d,
    y: y - d,
    w: 2 * d,
    h: 2 * d,
    lineWidth
  }, r, ctx)
  renderRoundRect({
    x: x + w - d,
    y: y + h - d,
    w: 2 * d,
    h: 2 * d,
    lineWidth
  }, r, ctx)
  renderRoundRect({
    x: x - d,
    y: y + h - d,
    w: 2 * d,
    h: 2 * d,
    lineWidth
  }, r, ctx)
}

export function draw(
  ctx: CanvasRenderingContext2D,
  config: any,
  status?: {
    isHover?: boolean,
    isSelect?: boolean
  },
  parent?: any
) {
  ctx.save()
  const { isHover = false, isSelect = false } = status || {}
  let { x, y } = calcPosition(ctx, config, parent)
  let {
    w, h, radius,
    fillColor, borderColor, rotate, lineWidth,
    type, flipVertical, flipHorizontal, children,
  } = config

  if (radius) {
    renderRoundRect({ x, y, w, h }, radius, ctx)
  } else {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath()
    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.strokeStyle = borderColor
    ctx.stroke()
  }

  if (isHover) {
    hover(ctx, { ...config, x, y })
  }
  if (isSelect) {
    selected(ctx, { ...config, x, y })
  }

  ctx.restore()

  // ctx.save()
  // let rect = this.config
  // ctx.fillStyle = 'gray'
  // ctx.font = `${rect.fontWeight} ${rect.fontSize}rem "${rect.fontFamily}", sans-serif`;
  // ctx.textBaseline = 'top'
  // ctx.fillText(rect.name, x, y - 18);
  // ctx.restore()

  config.abX = x
  config.abY = y
  config = getPath(config)
}