import {Shape} from "./Shape";
import {BaseEvent, EventType, ShapeType, TextAlign} from "../type";
import {clear, getPath, renderCanvas, renderRoundRect} from "../utils";
import {Canvas} from "./Canvas";
import {clone, cloneDeep} from "lodash";
import {Rect2} from "./Rect";

export class Frame extends Shape {
  handDown: boolean = false
  capture: boolean = true
  startX: number = 0
  startY: number = 0
  original: any = null
  lastClickTime: number = 0

  constructor(props: any) {
    super(props);
    this.config.children = this.config.children.map((child: any) => {
      return new Rect2(child)
    })
  }

  draw(ctx: CanvasRenderingContext2D, p?: any): void {
    // console.log('draw')
    let {x, y} = this.calcPosition(ctx, p)
    let {
      w, h, radius,
      fillColor, borderColor, rotate, lineWidth,
      type, flipVertical, flipHorizontal, children,
      selected
    } = this.config

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

    this.hover(ctx, {...this.config, x, y})
    this.selected(ctx, {...this.config, x, y})

    ctx.restore()
    ctx.save()
    let rect = this.config
    ctx.fillStyle = 'gray'
    ctx.font = `${rect.fontWeight} ${rect.fontSize}rem "${rect.fontFamily}", sans-serif`;
    ctx.textBaseline = 'top'
    ctx.fillText(rect.name, x, y - 16);
    ctx.restore()

    this.config.abX = x
    this.config.abY = y
    if (children) {
      children.map((v: any) => v.draw(ctx, this.config))
    }
  }

  isIn(x: number, y: number,): boolean {
    let rect = this.config
    // console.log('isIn-rect.leftX', rect.leftX)
    if (rect.leftX < x && x < rect.rightX
      && rect.topY < y && y < rect.bottomY
    ) {
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
      // event.e.stopPropagation()
      // }
      if (!this.capture) {
        let {
          children, capture
        } = this.config
        if (children) {
          children.map((child: any) => child.event(event, this.config))
        }
      }
      event.e.stopPropagation()
      // console.log('冒泡', this.config.name)
    } else {
      console.log('isIn', this.config.hovered)
      let instance = Canvas.getInstance()
      instance.hoverShape = null
      instance.draw()
      this.config.hovered = false
    }
  }

  emit(event: any, p: any) {
    let {e, coordinate, type} = event
    // @ts-ignore
    this[type]?.(event, p)
  }

  mousedown(event: any, p: any) {
    let {e, coordinate, type} = event
    this.config.hovered = false

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
    this.draw(instance.ctx, p)
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

    console.log('mousemove', this.config.hovered)

    if (this.config.selected) return
    if (this.config.hovered) return
    this.config.hovered = true
    let instance = Canvas.getInstance();
    instance.hoverShape = this
    let ctx = instance.ctx
    ctx.save()
    // let nv = currentMat
    // ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13]);
    this.draw(ctx)
    ctx.restore()
    // console.log('mousemove', this.config.name, ctx)
  }

}