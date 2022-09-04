import { clear, getPath, renderRoundRect } from "../utils";

export class Shape {
  protected config: any
  protected children: Shape[] = []
  protected isHover: boolean = false
  protected isSelect: boolean = false
  protected isCapture: boolean = true
  handDown: boolean = false
  startX: number = 0
  startY: number = 0
  original: any = null
  lastClickTime: number = 0

  constructor(props: any) {
    this.config = getPath(props)
  }


  emit(event: any, p: any) {
    let { e, coordinate, type } = event
    // @ts-ignore
    this[type]?.(event, p)
  }

  hover(ctx: any, config: any) {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate,
      type, flipVertical, flipHorizontal, children,
    } = config
    if (this.isHover) {
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
  }

  selected(ctx: any, config: any) {
    if (this.isSelect) {
      // console.log('selected')
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
  }

  calcPosition(ctx: CanvasRenderingContext2D, p?: any) {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
      selected
    }
      = this.config
    if (p) {
      x = this.config.abX = x + p.abX
      y = this.config.abY = y + p.abY
    } else {
      x = this.config.abX
      y = this.config.abY
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

  hoverAndSelect(ctx: CanvasRenderingContext2D, config: any) {
    this.hover(ctx, config)
    this.selected(ctx, config)
  }

  static calcPosition(ctx: CanvasRenderingContext2D, config: any, parent?: any) {
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

  static hover(ctx: CanvasRenderingContext2D, config: any) {
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

  static selected(ctx: CanvasRenderingContext2D, config: any) {
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

}