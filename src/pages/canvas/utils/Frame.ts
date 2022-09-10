import { Shape } from "./Shape";
import { draw, getPath } from "../utils";
import { CanvasUtil } from "./CanvasUtil";
import { cloneDeep } from "lodash";

class Frame extends Shape {

  constructor(props: any) {
    super(props);
    this.children = this.config.children.map((child: any) => {
      return new Frame(child)
    })
  }

  render(ctx: CanvasRenderingContext2D, parent?: any): void {
    draw(ctx, this.config, {
      isHover: this.isHover,
      isSelect: this.isSelect
    }, parent)
    if (this.children) {
      this.children.map((item: any) => item.render(ctx, this.config))
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
    let { e, coordinate, type } = event
    // console.log('event', this.config.name, `type：${type}`,)
    if (e.capture) return

    //mouseup事件，会直接走到这里
    //这里需要禁止传播，不然canvas的onMouseUp会触发
    if (this.isMouseDown) {
      event.e.stopPropagation()
      return this.emit(event, parent)
    }

    let cu = CanvasUtil.getInstance()
    if (this.isIn(coordinate.x, coordinate.y)) {
      cb?.()
      // console.log('捕获', this.config.name)
      if (!this.isCapture || !cu.isDesign()) {
        this.children.map((child: any) => child.event(event, this.config))
      }

      //如果已经选中了，那就不要再加hover效果了
      if (!this.isSelect){
        this.isHover = true
      }
      cu.setInShape(this)

      if (e.capture) return
      this.emit(event, parent)
      if (this.isSelect || this.isHover) {
        event.e.stopPropagation()
      }
      // console.log('冒泡', this.config.name)
    } else {
      this.isHover = false
      if (cu.inShape === this){
        cu.inShape = null
        cu.render()
      }
      // cu.setInShape(null)
      this.children.map((child: any) => child.event(event, this.config))
    }
  }

  mousedown(event: any, p: any) {
    let { e, coordinate, type } = event
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
      this.children.map((child: any) => child.event(event, this.config, () => {
        cu.childIsIn = true
      }))
      if (!cu.childIsIn) {
        cu.childIsIn = false
        this.isCapture = true
      } else {
        // console.log('选中了')
      }
      return;
    }

    this.lastClickTime = Date.now()
    // console.log('mousedown', this.config.name, this.isMouseDown, this.isSelect)

    this.isMouseDown = true
    this.startX = coordinate.x
    this.startY = coordinate.y
    this.original = cloneDeep(this.config)
    if (this.isSelect) return

    this.isHover = false
    if (cu.selectedShape) {
      cu.selectedShape.isSelect = false
      // cu.selectedShape.isCapture = true
      cu.render()
    }
    cu.selectedShape = this
    this.isSelect = true
    // this.isCapture = true
    this.render(cu.ctx, p)
  }

  mouseup(event: any, p: any) {
    // console.log('mouseup', this.config.name,)
    this.isMouseDown = false
    // this.isCapture = true
  }

  mousemove(event: any, p: any) {
    let { e, coordinate, type } = event

    // console.log('mousemove', [this.handDown,])
    let cu = CanvasUtil.getInstance();
    if (!cu.isDesign()) {
      return;
    }

    if (this.isMouseDown) {
      // console.log('enter')
      let { x, y } = coordinate
      let handScale = 1
      let dx = (x - this.startX) / handScale
      let dy = (y - this.startY) / handScale
      this.config.x = this.original.x + dx
      this.config.y = this.original.y + dy
      this.config = getPath(this.config)
      // cu.hoverShape = this
      cu.render()
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
    let ctx = cu.ctx
    ctx.save()
    // let nv = currentMat
    // ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13]);
    this.render(ctx)
    ctx.restore()
    // console.log('mousemove', this.config.name, ctx)
  }

}

export default Frame
