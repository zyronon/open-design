import {Shape} from "./Shape";
import {BaseEvent, RectType} from "../type";
import {clear, getPath, renderCanvas, renderRoundRect} from "../utils";
import {Canvas} from "./Canvas";
import {clone} from "lodash";

export class Rect2 extends Shape {
  private config: any

  constructor(props: any) {
    super(props);
    this.config = getPath(props)
    this.config.children = this.config.children.map((child: any) => {
      return new Rect2(child)
    })
  }

  draw(ctx: CanvasRenderingContext2D, t?: any): void {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
      selected
    }
      = t || this.config

    // console.log('type,', type)
    let oldCenter: { x: number; y: number; }
    let currentCenter: { x: number; y: number; } = {
      x: x + (w / 2),
      y: y + (h / 2)
    }
    ctx.save()

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

    if (radius) {
      renderRoundRect({x, y, w, h}, radius, ctx)
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
    this.hover(ctx, type)
    this.selected(ctx, this.config)

    ctx.restore()

    if (children) {
      children.map((v: any) => v.draw(ctx))
    }
  }


  isIn(x: number, y: number,): boolean {
    let rect = this.config
    if (rect.leftX! < x && x < rect.rightX! && rect.topY! < y && y < rect.bottomY!) {
      return true
    }
    return false
  }

  event(location: any, type: any, e: BaseEvent) {
    if (e.capture) return
    if (this.isIn(location.x, location.y)) {
      // console.log('捕获', this.config.name)
      this.emit(type, e)
      e.stopPropagation()
      let {
        children, capture
      } = this.config
      if (children) {
        children.map((child: any) => child.event(location, type, e))
      }
      // console.log('冒泡', this.config.name)
    } else {
      // this.config.selected = false
      let instance = Canvas.getInstance()
      instance.hoverShape = null
      instance.draw()
    }
  }

  emit(eventName: any, event: any) {
    // @ts-ignore
    this[eventName]?.(event)
  }

  mousemove(e: BaseEvent) {
    if (this.config.selected) return
    let instance = Canvas.getInstance();
    instance.hoverShape = this
    let ctx = instance.ctx
    ctx.save()
    // let nv = currentMat
    // ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13]);

    let d = .5
    let t = clone(this.config)
    t.id = Date.now()
    t.lineWidth = 2
    t.x = t.x - d
    t.y = t.y - d
    t.w = t.w + 2 * d
    t.h = t.h + 2 * d
    // console.log(t)
    t.type = RectType.HOVER
    // renderCanvas(t, this.state)
    this.draw(ctx, t)
    ctx.restore()
    // console.log('mousemove', this.config.name, ctx)
  }

  click(e: BaseEvent) {
    e.stopPropagation()
    console.log('click', this.config.name)
    let instance = Canvas.getInstance();
    instance.selectedShape = this
    this.config.selected = true
    instance.draw()
  }

  dblclick() {
    this.config.capture = !this.config.capture
  }
}