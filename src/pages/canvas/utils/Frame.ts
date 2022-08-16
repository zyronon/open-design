import {Shape} from "./Shape";
import {ShapeType} from "../type";
import {getPath, renderRoundRect} from "../utils";
import {CanvasUtil} from "./CanvasUtil";
import {cloneDeep} from "lodash";

export class Frame extends Shape {

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
    this.config = getPath(this.config)
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
    // console.log('event', this.config.name, `type：${type}`,)
    if (e.capture) return

    if (this.handDown) {
      return this.emit(event, parent)
    }
    let cu = CanvasUtil.getInstance()

    if (this.isIn(coordinate.x, coordinate.y)) {
      if (cu.inShape) {
        // console.log('cu.inShape', cu.inShape.config.name, cu.inShape !== this)
        if (cu.inShape !== this) {
          cu.inShape.isHover = false
          cu.draw()
        }
      }
      cu.inShape = this
      cb?.()
      // console.log('捕获', this.config.name)
      if (!this.isCapture || !cu.isDesign()) {
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
      if (cu.inShape === this) {
        cu.inShape = null
      }
      // console.log('isIn', this.isHover)
      cu.hoverShape = null
      cu.draw()
      this.isHover = false
    }
  }

  mousedown(event: any, p: any) {
    let {e, coordinate, type} = event
    let cu = CanvasUtil.getInstance()
    if (!cu.isDesign()) {
      cu.startX = coordinate.x
      cu.startY = coordinate.y
      return;
    }

    if (Date.now() - this.lastClickTime < 300) {
      console.log('dblclick')
      // cu.selectedShape = null
      // this.config.selected = false
      // cu.draw()
      // this.isSelect = false
      this.isCapture = false
      let {
        children, capture
      } = this.config
      if (children) {
        children.map((child: any) => child.event(event, this.config, () => {
          cu.childIsIn = true
        }))
        if (!cu.childIsIn) {
          cu.childIsIn = false
          this.isCapture = true
        } else {
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

    if (cu.selectedShape) {
      cu.selectedShape.isSelect = false
      // cu.selectedShape.isCapture = true
      cu.draw()
    }
    cu.selectedShape = this
    this.isSelect = true
    // this.isCapture = true
    this.isHover = false
    this.draw(cu.ctx, p)
  }

  mouseup(event: any, p: any) {
    console.log('mouseup', this.config.name,)
    this.handDown = false
    // this.isCapture = true
  }

  mousemove(event: any, p: any) {
    let {e, coordinate, type} = event

    // console.log('mousemove', [this.handDown,])
    let cu = CanvasUtil.getInstance();
    if (!cu.isDesign()) {
      return;
    }

    if (this.handDown) {
      // console.log('enter')
      let {x, y} = coordinate
      let handScale = 1
      let dx = (x - this.startX) / handScale
      let dy = (y - this.startY) / handScale
      this.config.x = this.original.x + dx
      this.config.y = this.original.y + dy
      this.config = getPath(this.config)
      // cu.hoverShape = this
      cu.draw()
      return;
    }

    // console.log('mousemove', this.config.name, `isHover：${this.isHover}`, `cu.hoverShape：${cu.hoverShape}`)

    // if (cu.hoverShape) {
    //   cu.hoverShape.isHover = false
    //   cu.hoverShape = null
    //   cu.draw()
    // }
    if (this.isSelect) return
    if (this.isHover) {
      // console.log('mousemove-this.isHover')
      // cu.hoverShape = this
      return
    }
    this.isHover = true
    cu.hoverShape = this
    let ctx = cu.ctx
    ctx.save()
    // let nv = currentMat
    // ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13]);
    this.draw(ctx)
    ctx.restore()
    // console.log('mousemove', this.config.name, ctx)
  }

}