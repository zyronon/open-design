import {IState, P, P2, ShapeType} from "./type"
import {BaseConfig, Rect} from "../config/BaseConfig"
import {Colors, defaultConfig} from "./constant"
import {jiaodu2hudu} from "../../../utils"
import {BaseShape} from "../shapes/BaseShape"
import CanvasUtil2 from "../engine/CanvasUtil2"

export default {
  /** @desc 计算位置
   * canvas默认起点，在左上角
   * 翻转、旋转后，需要把起始点设置为图形的正中心，把x,y设置为图形的左上角
   * */
  calcPosition(
    ctx: CanvasRenderingContext2D,
    conf: BaseConfig,
  ) {
    let {
      layout: {x, y, w, h,},
      fillColor, borderColor, lineWidth,
      flipVertical, flipHorizontal,
      center,
      realRotation
    }
      = conf
    ctx.lineWidth = lineWidth
    ctx.fillStyle = fillColor
    ctx.strokeStyle = borderColor
    /*
     * 渲染翻转后的图形，把canvas的起点移到中心点（要保证图形中心点的正确）
     * 返回x为-w/2，y同理 ，直接从左上角开始渲染就行了
     * */
    let scaleX = 1
    let scaleY = 1
    if (flipHorizontal) scaleX = -1
    if (flipVertical) scaleY = -1

    ctx.translate2(center)
    ctx.rotate(realRotation * Math.PI / 180)
    ctx.scale(scaleX, scaleY)
    return {x: -w / 2, y: -h / 2}
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
      fillColor, borderColor, rotation, lineWidth,
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
    if (rotation || flipHorizontal || flipVertical) {
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
      console.log('rotation', rotation)
    }

    ctx.translate(tranX, tranY)
    ctx.scale(scaleX, scaleY)
    ctx.rotate(rotation * Math.PI / 180)
    return {x, y}
  },
  clear(rect: Rect, ctx: any) {
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h)
  },
  selected(ctx: CanvasRenderingContext2D, layout: any) {
    let {x, y, w, h,} = layout
    ctx.strokeStyle = defaultConfig.strokeStyle

    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.closePath()
    ctx.stroke()

    let cu = CanvasUtil2.getInstance()
    let d = 4 / cu.handScale
    let r = 2 / cu.handScale
    ctx.fillStyle = Colors.White
    this.roundRect(ctx, {
      x: x - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d,
    }, r,)
    this.roundRect(ctx, {
      x: x + w - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d,
    }, r,)
    this.roundRect(ctx, {
      x: x + w - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d,
    }, r,)
    this.roundRect(ctx, {
      x: x - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d,
    }, r,)
  },
  edit(ctx: CanvasRenderingContext2D, config: any) {
    let {
      layout: {x, y, w, h,},
    } = config
    ctx.strokeStyle = defaultConfig.strokeStyle

    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.closePath()
    ctx.stroke()
    let cu = CanvasUtil2.getInstance()
    let d = 4 / cu.handScale
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
    this.roundRect(ctx, {
      x: x - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r,)
    this.roundRect(ctx, {
      x: x + w - d,
      y: y - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r,)
    this.roundRect(ctx, {
      x: x + w - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r,)
    this.roundRect(ctx, {
      x: x - d,
      y: y + h - d,
      w: 2 * d,
      h: 2 * d,
      lineWidth
    }, r,)


    d = 40
    let r2 = 5
    let t = config
    let topLeft = {
      x: t.x + d,
      y: t.y + d,
    }
    // this.round(topLeft, r2, ctx, ShapeType.SELECT)
  },
  controlPoint(ctx: CanvasRenderingContext2D, rect: any, center: P2) {
    let handScale = CanvasUtil2.getInstance().handScale
    let d = 3 / handScale
    let {x, y, w = 2 * d, h = 2 * d, lineWidth = 1} = rect
    let ow = w / 2

    ctx.beginPath()
    ctx.moveTo2(rect)
    ctx.lineTo2(center)
    ctx.strokeStyle = Colors.Line2
    ctx.stroke()

    ctx.save()
    ctx.lineWidth = lineWidth / handScale
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
    let cu = CanvasUtil2.getInstance()
    let {x, y} = rect
    ctx.save()
    ctx.lineWidth = defaultConfig.lineWidth / cu.handScale
    ctx.fillStyle = Colors.White
    ctx.strokeStyle = defaultConfig.strokeStyle
    ctx.beginPath()
    ctx.arc(x, y, r / cu.handScale, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  },
  round(ctx: any, rect: any, r: number,) {
    let {x, y} = rect
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  },
  round2(ctx: any, rect: any, r: number,) {
    let {x, y} = rect
    ctx.beginPath()
    ctx.strokeStyle = defaultConfig.strokeStyle
    ctx.fillStyle = Colors.White
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, r / 2.5, 0, 2 * Math.PI)
    ctx.fillStyle = defaultConfig.strokeStyle
    ctx.fill()
    ctx.closePath()
  },
  roundRect(ctx: any, rect: any, r: number,) {
    let {x, y, w, h} = rect
    let w2 = w / 2, h2 = h / 2
    ctx.beginPath()
    ctx.moveTo(x + w2, y)
    ctx.arcTo(x + w, y, x + w, y + h2, r)
    ctx.arcTo(x + w, y + h, x + w2, y + h, r)
    ctx.arcTo(x, y + h, x, y + h2, r)
    ctx.arcTo(x, y, x + w2, y, r)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  },
}