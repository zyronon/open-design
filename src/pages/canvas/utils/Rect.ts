import {Shape} from "./Shape";
import {BaseEvent, RectType} from "../type";
import {clear, getPath, renderCanvas, renderRoundRect} from "../utils";
import {Canvas} from "./Canvas";
import {clone} from "lodash";

export class Rect2 extends Shape {
  private config: any
  isEnter: boolean = false
  startX: number = 0
  startY: number = 0

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

  event(e: BaseEvent, coordinate: any, type: any,) {
    if (e.capture) return
    if (this.isIn(coordinate.x, coordinate.y)) {
      // console.log('捕获', this.config.name)
      this.emit(e, coordinate, type,)
      e.stopPropagation()
      let {
        children, capture
      } = this.config
      if (children) {
        children.map((child: any) => child.event(e, coordinate, type,))
      }
      // console.log('冒泡', this.config.name)
    } else {
      // this.config.selected = false
      let instance = Canvas.getInstance()
      instance.hoverShape = null
      instance.draw()
    }
  }

  emit(event: any, coordinate: any, eventName: any,) {
    // @ts-ignore
    this[eventName]?.(event, coordinate)
  }

  mousedown(e: BaseEvent, coordinate: any,) {
    console.log('mousedown', this.isEnter)
    if (this.isEnter) return;
    this.startX = coordinate.x
    this.startY = coordinate.y
    this.isEnter = true
    if (this.config.selected) return
    e.stopPropagation()
    console.log('click', this.config.name)
    let instance = Canvas.getInstance();
    instance.selectedShape = this
    this.config.selected = true
    instance.draw()
  }

  mouseup(e: BaseEvent) {
    console.log('mouseup')
    this.isEnter = false
  }

  mousemove(e: BaseEvent, coordinate: any) {
    console.log('mousemove', this.isEnter)
    if (this.isEnter) {
      let {x, y} = coordinate
      let handScale = 1
      console.log('enter')
      let dx = (x - this.startX) / handScale
      let dy = (y - this.startY) / handScale
      this.config.x = this.config.x + dx
      this.config.y = this.config.y + dy
      this.config = getPath(this.config)
      let instance = Canvas.getInstance();
      // instance.hoverShape = this
      instance.draw()
    }

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

  }

  dblclick() {
    this.config.capture = !this.config.capture
  }
}