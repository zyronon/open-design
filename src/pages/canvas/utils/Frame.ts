import {Shape} from "./Shape";
import {BaseEvent, EventType, ShapeType, TextAlign} from "../type";
import {clear, getPath, renderCanvas, renderRoundRect} from "../utils";
import {Canvas} from "./Canvas";
import {clone, cloneDeep} from "lodash";
import {Rect2} from "./Rect";

export class Frame extends Shape {
  handDown: boolean = false
  startX: number = 0
  startY: number = 0
  original: any = null
  lastClickTime: number = 0

  constructor(props: any) {
    super(props);
    this.config.children = this.config.children.map((child: any) => {
      return new Frame(child)
    })
  }

  draw(ctx: CanvasRenderingContext2D, p?: any): void {
    // console.log('draw', this.config.name)
    ctx.save()
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

    this.hoverAndSelect(ctx, {...this.config, x, y})
    ctx.restore()

    // ctx.save()
    // let rect = this.config
    // ctx.fillStyle = 'gray'
    // ctx.font = `${rect.fontWeight} ${rect.fontSize}rem "${rect.fontFamily}", sans-serif`;
    // ctx.textBaseline = 'top'
    // ctx.fillText(rect.name, x, y - 18);
    // ctx.restore()

    this.config.abX = x
    this.config.abY = y
    if (children) {
      children.map((v: any) => v.draw(ctx, this.config))
    }
  }

  isInName(x: number, y: number,): boolean {
    return false
    let rect = this.config
    if (rect.leftX < x && x < (rect.leftX + 30)
      && (rect.topY - 20) < y && y < rect.topY
    ) {
      return true
    }
    return false
  }

  isIn(x: number, y: number,): boolean {
    let rect = this.config
    // console.log('isIn-rect.leftX', rect.leftX)
    if (rect.leftX < x && x < rect.rightX
      && rect.topY < y && y < rect.bottomY
    ) {
      return true
    }
    return this.isInName(x, y)
  }

  event(event: any, parent?: any, cb?: Function) {
    let {e, coordinate, type} = event
    console.log('event', this.config.name, `type：${type}`,)
    if (e.capture) return

    if (this.handDown) {
      return this.emit(event, parent)
    }
    let instance = Canvas.getInstance()

    if (this.isIn(coordinate.x, coordinate.y)) {
      if (instance.inShape) {
        console.log('instance.inShape', instance.inShape.config.name,instance.inShape !== this)
        if (instance.inShape !== this) {
          instance.inShape.isHover = false
          instance.draw()
        }
      }
      instance.inShape = this
      cb?.()
      // console.log('捕获', this.config.name)
      if (!this.isCapture) {
        let {children} = this.config
        if (children) {
          children.map((child: any) => child.event(event, this.config))
        }
      }

      if (e.capture) return
      this.emit(event, parent)
      if (this.isSelect || this.isHover) {
        event.e.stopPropagation()
      }
      // console.log('冒泡', this.config.name)
    } else {
      if (instance.inShape === this) {
        instance.inShape = null
      }
      // console.log('isIn', this.isHover)
      instance.hoverShape = null
      instance.draw()
      this.isHover = false
    }
  }

  mousedown(event: any, p: any) {
    let {e, coordinate, type} = event
    let instance = Canvas.getInstance()

    if (Date.now() - this.lastClickTime < 300) {
      console.log('dblclick')
      // instance.selectedShape = null
      // this.config.selected = false
      // instance.draw()
      // this.isSelect = false
      this.isCapture = false
      let {
        children, capture
      } = this.config
      if (children) {
        children.map((child: any) => child.event(event, this.config, () => {
          instance.childIsIn = true
        }))
        if (!instance.childIsIn) {
          instance.childIsIn = false
          this.isCapture = true
        }else {
          console.log('选中了')
        }
      }
      return;
    }

    this.lastClickTime = Date.now()
    console.log('mousedown', this.config.name, this.handDown, this.isSelect)

    this.handDown = true
    this.startX = coordinate.x
    this.startY = coordinate.y
    this.original = cloneDeep(this.config)

    if (this.isSelect) return

    if (instance.selectedShape) {
      instance.selectedShape.isSelect = false
      instance.draw()
    }
    instance.selectedShape = this
    this.isSelect = true
    this.isCapture = true
    // if (instance.hoverShape) {
    // instance.hoverShape.isHover = false
    // instance.hoverShape = null
    // instance.draw()
    // }

    this.isHover = false
    this.draw(instance.ctx, p)
  }

  mouseup(event: any, p: any) {
    console.log('mouseup', this.config.name,)
    this.handDown = false
    // this.isCapture = true
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

    let instance = Canvas.getInstance();
    // console.log('mousemove', this.config.name, `isHover：${this.isHover}`, `instance.hoverShape：${instance.hoverShape}`)

    // if (instance.hoverShape) {
    //   instance.hoverShape.isHover = false
    //   instance.hoverShape = null
    //   instance.draw()
    // }
    if (this.isSelect) return
    if (this.isHover) {
      // console.log('mousemove-this.isHover')
      // instance.hoverShape = this
      return
    }
    this.isHover = true
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