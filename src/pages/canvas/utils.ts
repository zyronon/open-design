import {IState, Rect, RectType, TextAlign} from "./type";
import {store} from "./store";
// @ts-ignore
import {v4 as uuid} from 'uuid';

export function renderCanvas(
  rect: Rect,
  state: IState,
  parent?: Rect,
) {
  let {
    ctx, enterLT, enterRT, selectRect, activeHand, enter, offsetX, offsetY,
    handMove, handScale,
    currentPoint
  } = state
  // console.log('renderCanvas', enterLT)
  ctx.save()
  let {
    x, y, w, h, radius,
    fillColor, borderColor, rotate, lineWidth, type, flipVertical, flipHorizontal
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
  let newCenter: { x: number; y: number; }
  let isMe = selectRect?.id === (parent ? parent.id : rect.id)
  if ((enterLT || enterRT) && isMe) {
    let s = selectRect!
    oldCenter = {
      x: s.x + (s.w / 2),
      y: s.y + (s.h / 2)
    }
    newCenter = {
      x: x + (w / 2),
      y: y + (h / 2)
    }
    // console.log('oldCenter', oldCenter)
    // console.log('newCenter', newCenter)
  }

  ctx.lineWidth = lineWidth
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
      let d = oldCenter!.x - newCenter!.x
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
  if (type !== RectType.TEXT) {
    if (radius && type !== RectType.SELECT) {
      renderRoundRect({x, y, w, h}, radius, ctx)
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
    case RectType.TEXT:
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
    case RectType.FILL:
      ctx.fillStyle = fillColor
      ctx.fill()
      break
    case RectType.LINE:
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.strokeStyle = borderColor
      ctx.stroke()
      break
    case RectType.IMG:
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
    case RectType.HOVER:
      ctx.strokeStyle = 'rgb(139,80,255)'
      ctx.stroke()
      break
    case RectType.PENCIL:
      ctx.lineWidth = 4
      ctx.strokeStyle = 'gray'
      ctx.moveTo(x, y)
      rect.points.map((item: any) => {
        ctx.lineTo(item.x, item.y)
      })
      ctx.stroke()
      break
    case RectType.SELECT:
      // console.log('select')

      // rotate = parent!.rotate
      // // lineWidth = parent!.lineWidth

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
      break
  }

  ctx.restore()
  if (rect.children) {
    rect.children.map(v => renderCanvas(v, state, rect))
  }
}

export function renderRoundRect(rect: any, r: number, ctx: any) {
  ctx.lineWidth = rect.lineWidth
  let {x, y, w, h} = rect
  ctx.beginPath()
  ctx.moveTo(x + w / 2, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w / 2, y, r)
  ctx.closePath()
  ctx.stroke()
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

export function getPath(rect: Rect) {
  rect.leftX = rect.x
  rect.rightX = rect.leftX + rect.w
  rect.topY = rect.y
  rect.bottomY = rect.topY + rect.h
  if (!rect.id) {
    rect.id = uuid()
  }
  return rect
}