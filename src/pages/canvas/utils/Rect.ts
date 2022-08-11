import {Shape} from "./Shape";
import {BaseEvent, EventType, RectType} from "../type";
import {clear, getPath, renderCanvas, renderRoundRect} from "../utils";
import {Canvas} from "./Canvas";
import {clone, cloneDeep} from "lodash";

export class Rect2 extends Shape {
  private config: any
  handDown: boolean = false
  startX: number = 0
  startY: number = 0
  original: any = null
  lastClickTime: number = 0

  constructor(props: any) {
    super(props);
    this.config = getPath(props)
    this.config.children = this.config.children.map((child: any) => {
      return new Rect2(child)
    })
  }

  draw(ctx: CanvasRenderingContext2D, t?: any, p?: any): void {
    let {
      x, y, w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
      selected
    }
      = t || this.config
    if (p) {
      x = this.config.abX = x + p.abX
      y = this.config.abY = y + p.abY
    }

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
    this.selected(ctx, {...this.config, x, y})

    ctx.restore()

    this.config.abX = x
    this.config.abY = y
    if (children) {
      children.map((v: any) => v.draw(ctx, null, this.config))
    }
  }

  isIn(x: number, y: number,): boolean {
    let rect = this.config
    // console.log('isIn-rect.leftX', rect.leftX)
    if (rect.leftX! < x && x < rect.rightX! && rect.topY! < y && y < rect.bottomY!) {
      return true
    }
    return false
  }

  event(event: any, parent?: any) {
    let {e, coordinate, type} = event
    if (e.capture) return
    if (this.handDown) {
      return this.emit(event, parent)
    }

    if (this.isIn(coordinate.x, coordinate.y)) {
      // console.log('捕获', this.config.name)
      this.emit(event, parent)
      let instance = Canvas.getInstance()

      // if (instance.selectedShape && instance.selectedShape.config.id !== this.config.id) {
      // } else {
      event.e.stopPropagation()
      // }
      let {
        children, capture
      } = this.config
      if (children) {
        children.map((child: any) => child.event(event, this.config))
      }
      // console.log('冒泡', this.config.name)
    } else {
      let instance = Canvas.getInstance()
      instance.hoverShape = null
      instance.draw()
    }
  }

  emit(event: any, p: any) {
    let {e, coordinate, type} = event
    // @ts-ignore
    this[type]?.(event, p)
  }

  mousedown(event: any, p: any) {
    let {e, coordinate, type} = event

    let instance = Canvas.getInstance();
    if (Date.now() - this.lastClickTime < 300) {
      console.log('dblclick')
      // instance.selectedShape = null
      // this.config.selected = false
      // instance.draw()
      let {
        children, capture
      } = this.config
      if (children) {
        children.map((child: any) => child.event(event, this.config))
      }
      return;
    }
    this.lastClickTime = Date.now()

    console.log('mousedown', this.config.name, this.handDown, this.config.selected)
    this.startX = coordinate.x
    this.startY = coordinate.y
    this.original = cloneDeep(this.config)
    this.handDown = true

    if (this.config.selected) return
    if (instance.selectedShape) {
      instance.selectedShape.config.selected = false
      instance.draw()
    }
    instance.selectedShape = this
    this.config.selected = true
    console.log('p', p)
    this.draw(instance.ctx, null, p)
  }

  mouseup(event: any, p: any) {
    console.log('mouseup', this.config.name,)
    this.handDown = false
  }

  mousemove(event: any, p: any) {
    let {e, coordinate, type} = event

    // console.log('mousemove', [this.isEnter, this.config.selected])
    if (this.handDown) {
      // console.log('enter')
      let {x, y} = coordinate
      let handScale = 1
      let dx = (x - this.startX) / handScale
      let dy = (y - this.startY) / handScale
      this.config.x = this.original.x + dx
      this.config.y = this.original.y + dy
      this.config = getPath(this.config)
      let instance = Canvas.getInstance();
      // instance.hoverShape = this
      instance.draw()
      return;
    }

    if (this.config.selected) return
    let instance = Canvas.getInstance();
    // if (instance.hoverShape) {
    //   instance.hoverShape = false
    //   instance.draw()
    // }
    instance.hoverShape = this
    let ctx = instance.ctx
    ctx.save()
    // let nv = currentMat
    // ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13]);

    let d = .5
    let t = cloneDeep(this.config)
    t.id = Date.now()
    t.lineWidth = 2
    t.x = t.x - d
    t.y = t.y - d
    t.w = t.w + 2 * d
    t.h = t.h + 2 * d
    // console.log(t)
    t.type = RectType.HOVER
    t.children = []
    // renderCanvas(t, this.state)
    this.draw(ctx, t)
    ctx.restore()
    // console.log('mousemove', this.config.name, ctx)
  }

}