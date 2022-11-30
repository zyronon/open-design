import {IState, P, P2, ShapeType} from "./type"
import {BaseConfig} from "../config/BaseConfig"
import {Colors} from "./constant"
import {jiaodu2hudu} from "../../../utils"

export default {
  clearAll(state: IState) {
    this.clear({
      x: 0,
      y: 0,
      w: state.canvas.width,
      h: state.canvas.height
    }, state.ctx)
    // this.state.ctx.fillStyle = 'black'
    // this.state.ctx.fillRect(0, 0, this.state.canvas.width, this.state.canvas.height)
  },
  clear(x: any, ctx: any) {
    ctx.clearRect(x.x, x.y, x.w, x.h)
  },
  selected(ctx: CanvasRenderingContext2D, config: any) {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate,
      type, flipVertical, flipHorizontal, children,
    } = config
    ctx.strokeStyle = 'rgb(139,80,255)'

    if (radius) {
      this.renderRoundRect({x, y, w, h}, radius, ctx)
    }
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y)
    ctx.lineTo(x + w, y + h)
    ctx.lineTo(x, y + h)
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.stroke()
    let d = 4
    this.clear({
      x: x - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)
    this.clear({
      x: x + w - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)
    this.clear({
      x: x + w - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)
    this.clear({
      x: x - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)

    let r = 3
    let lineWidth = 1.5
    this.renderRoundRect({
      x: x - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
    this.renderRoundRect({
      x: x + w - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
    this.renderRoundRect({
      x: x + w - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
    this.renderRoundRect({
      x: x - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
  },
  edit(ctx: CanvasRenderingContext2D, config: any) {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate,
      type, flipVertical, flipHorizontal, children,
    } = config
    ctx.strokeStyle = 'rgb(139,80,255)'

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y)
    ctx.lineTo(x + w, y + h)
    ctx.lineTo(x, y + h)
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.stroke()
    let d = 4
    this.clear({
      x: x - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)
    this.clear({
      x: x + w - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)
    this.clear({
      x: x + w - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)
    this.clear({
      x: x - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d
    }, ctx)

    let r = 3
    let lineWidth = 1.5
    this.renderRoundRect({
      x: x - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
    this.renderRoundRect({
      x: x + w - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
    this.renderRoundRect({
      x: x + w - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)
    this.renderRoundRect({
      x: x - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r, ctx)


    d = 40
    let r2 = 5
    let t = config
    let topLeft = {
      x: t.x + d,
      y: t.y + d,
    }
    this.renderRound(topLeft, r2, ctx, ShapeType.SELECT)
  },
  hover(ctx: CanvasRenderingContext2D, config: any) {
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
      this.renderRoundRect(hover, radius, ctx)
    } else {
      ctx.beginPath()
      ctx.moveTo(hover.x, hover.y)
      ctx.lineTo(hover.x + hover.w, hover.y)
      ctx.lineTo(hover.x + hover.w, hover.y + hover.h)
      ctx.lineTo(hover.x, hover.y + hover.h)
      ctx.lineTo(hover.x, hover.y)
      ctx.closePath()
      ctx.strokeStyle = borderColor
      ctx.stroke()
    }
    ctx.strokeStyle = 'rgb(139,80,255)'
    ctx.stroke()
  },
  calcPosition2(
    ctx: CanvasRenderingContext2D,
    config: any,
    original: any,
    status: any,
    parent?: BaseConfig) {
    const {isHover, isSelect, enterL, enterLT} = status
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
      selected,
      rx, ry
    }
      = config
    if (parent) {
      x = rx + parent.x
      y = ry + parent.y
    }
// console.log('type,', type)
    let oldCenter: P
    let currentCenter: P = {
      x: x + (w / 2),
      y: y + (h / 2)
    }

    if (enterLT || enterL) {
      let s = original
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

    let tranX = 0
    let tranY = 0
    let scaleX = 1
    let scaleY = 1
    if (rotate || flipHorizontal || flipVertical) {
      tranX = x + w / 2
      tranY = y + h / 2
      x = -w / 2
      y = -h / 2
    }

    if (flipHorizontal) {
      scaleX = -1
      // tranX = -tranX
      //如果在翻转情况下，拉伸要将tranX加上两个中心点偏移量
      if ((enterLT || enterL)) {
        // console.log('tranX1', tranX)
        let d = oldCenter!.x - currentCenter!.x
        tranX += d * 2
        // console.log('tranX2', tranX)
      }
    }
    if (flipVertical) {
      // console.log('flipVertical', flipVertical)
      scaleY = -1
      if ((enterLT || enterL)) {
        // console.log('tranX1', tranX)
        let d = oldCenter!.y - currentCenter!.y
        tranY += d * 2
        // console.log('tranX2', tranX)
      }
      // tranY = -tranY
    }

    // if (true) {
    if (false) {
      console.log('x, y', x, y)
      console.log('tranX, tranY', tranX, tranY)
      console.log('tranX, tranY', scaleX, scaleY)
      console.log('rotate', rotate)
    }

    ctx.translate(tranX, tranY)
    ctx.scale(scaleX, scaleY)
    ctx.rotate(rotate * Math.PI / 180)
    return {x, y}
  },

  /** @desc 修改位置
   * canvas默认起点，在左上角
   * 翻转、旋转后，需要把起始点设置为图形的正中心，把x,y设置为图形的左上角
   * */
  calcPosition(
    ctx: CanvasRenderingContext2D,
    config: BaseConfig,
    original: any,
    status: any,
    parent?: BaseConfig) {
    const {isHover, isSelect, enterL, enterLT} = status
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
      center,
      topLeft,
      rx, ry
    }
      = config
    if (parent) {
      x += parent.x
      y += parent.y
      // center.x += parent.x
      // center.y += parent.y
    }
// console.log('type,', type)
    ctx.lineWidth = lineWidth
    ctx.fillStyle = fillColor
    ctx.strokeStyle = borderColor
    if (flipHorizontal || flipVertical) {
      /*
      * 渲染翻转后的图形，把canvas的起点移到中心点（要保证图形中心点的正确）
      * 返回x为-w/2，y同理 ，直接从左上角开始渲染就行了
      * */
      let scaleX = 1
      let scaleY = 1
      if (flipHorizontal) {
        scaleX = -1
      }
      if (flipVertical) {
        scaleY = -1
      }

      ctx.translate(center.x, center.y)
      if (flipHorizontal && flipVertical) {
        ctx.rotate((180 + rotate) * Math.PI / 180)
      } else {
        if (flipHorizontal) {
          ctx.rotate((rotate - 180) * Math.PI / 180)
        } else {
          ctx.rotate(rotate * Math.PI / 180)
        }
      }
      ctx.scale(scaleX, scaleY)
      return {x: -w / 2, y: -h / 2}
    } else {
      ctx.translate(x, y)
      ctx.rotate(rotate * Math.PI / 180)
      return {x: 0, y: 0}
    }
  },

  drawCp(ctx: CanvasRenderingContext2D, rect: any, center: P2) {
    let d = 3
    let {x, y, w = 2 * d, h = 2 * d, lineWidth = 1} = rect
    let ow = w / 2

    ctx.beginPath()
    ctx.moveTo2(rect)
    ctx.lineTo2(center)
    ctx.strokeStyle = Colors.Line2
    ctx.stroke()

    ctx.save()
    ctx.lineWidth = lineWidth
    ctx.fillStyle = Colors.White
    ctx.strokeStyle = Colors.Primary
    ctx.translate(x, y)
    ctx.rotate(jiaodu2hudu(45))
    ctx.beginPath()
    ctx.rect(-ow, -ow, w, h)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  },
  drawRound(ctx: any, rect: any, r: number = 4) {
    let d = 4
    let {x, y, w = 2 * d, h = 2 * d, lineWidth = 1.5} = rect
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.fillStyle = Colors.White
    ctx.strokeStyle = Colors.Primary
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  },
  renderRound(rect: any, r: number, ctx: any, type: ShapeType = ShapeType.RECTANGLE) {
    let {x, y} = rect
    ctx.save()
    ctx.lineWidth = 1.5
    if (type === ShapeType.RECTANGLE) {
      ctx.fillStyle = Colors.Primary
    } else {
      ctx.strokeStyle = Colors.Primary
    }
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    if (type === ShapeType.RECTANGLE) {
      ctx.fill()
    } else {
      ctx.stroke()
    }
    ctx.restore()
  },
  renderRoundRect(rect: any, r: number, ctx: any,) {
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
  },
  drawRoundRect(ctx: CanvasRenderingContext2D, rect: any, r: number = 2, d: number = 4) {
    let {x, y, w = 2 * d, h = 2 * d, lineWidth = 2} = rect
    let ow = w / 2
    let oh = h / 2
    ctx.save()
    ctx.lineWidth = lineWidth
    ctx.translate(x, y)
    ctx.beginPath()
    ctx.moveTo(0, -oh)
    ctx.arcTo(ow, -oh, ow, oh, r)
    ctx.arcTo(ow, oh, -ow, oh, r)
    ctx.arcTo(-ow, oh, -ow, -oh, r)
    ctx.arcTo(-ow, -oh, 0, -oh, r)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
  }
}