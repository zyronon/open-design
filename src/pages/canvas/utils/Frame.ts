import { Shape } from "./Shape";
import { draw, getPath } from "../utils";
import { CanvasUtil } from "./CanvasUtil";
import { cloneDeep } from "lodash";

class Frame extends Shape {
  hoverL: boolean = false
  enterL: boolean = false
  hoverLT: boolean = false
  enterLT: boolean = false
  startX: number = -1
  startY: number = -1

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
    if (this.enterL || this.enterLT) return true

    if (this.isSelect) {
      let edge = 10
      let angle = 7
      let rotate = 27
      if ((rect.leftX! - edge < x && x < rect.leftX! + edge) &&
        (rect.topY! + edge < y && y < rect.bottomY! - edge)
      ) {
        console.log('hoverLeft')
        document.body.style.cursor = "col-resize"
        this.hoverL = true

        this.hoverLT = false
        return true
      } else if ((rect.leftX! - angle < x && x < rect.leftX! + angle) &&
        (rect.topY! - angle < y && y < rect.topY! + angle)
      ) {
        console.log('1', rect.flipHorizontal)
        this.hoverLT = true

        this.hoverL = false
        document.body.style.cursor = "nwse-resize"
        return true
      }
    }
    if (rect.leftX < x && x < rect.rightX
      && rect.topY < y && y < rect.bottomY
    ) {
      document.body.style.cursor = "default"
      this.hoverL = false
      this.hoverLT = false
      return true
    }
    return this.isInName(x, y)
  }

  event(event: any, parent?: Shape[], cb?: Function) {
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
        this.children.map((child: any) => child.event(event, parent?.concat([this])))
      }

      if (e.capture) return

      //如果已经选中了，那就不要再加hover效果了
      if (!this.isSelect) {
        this.isHover = true
      }

      //设置当前的inShape为自己，这位的位置很重要，当前的inShape是唯一的
      //如果放在e.capture前面，那么会被子组件给覆盖。所以放在e.capture后面
      //子组件isSelect或者isHover之后会stopPropagation，那么父组件就不会往
      //下执行了
      cu.setInShape(this, parent)

      this.emit(event, parent)
      if (this.isSelect || this.isHover) {
        event.e.stopPropagation()
      }
      // console.log('冒泡', this.config.name)
    } else {
      document.body.style.cursor = "default"
      this.isHover = false
      cu.setInShapeNull(this)
      this.children.map((child: any) => child.event(event, parent?.concat([this]), cb))
    }
  }

  mousedown(event: any, p: Shape[] = []) {
    // console.log('mousedown', p)
    let { e, coordinate, type } = event
    let { x, y } = coordinate

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
      this.children.map((child: any) => child.event(event, p?.concat([this]), () => {
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

    this.original = cloneDeep(this.config)

    if (this.hoverL || this.hoverLT) {
      cu.startX = x
      cu.startY = y
      cu.offsetX = x - this.config.x
      cu.offsetY = y - this.config.y
      this.enterL = this.hoverL
      this.enterLT = this.hoverLT
      return;
    }

    this.lastClickTime = Date.now()
    // console.log('mousedown', this.config.name, this.isMouseDown, this.isSelect)

    this.isMouseDown = true
    this.startX = x
    this.startY = y
    if (this.isSelect) return

    this.isSelect = true
    this.isCapture = true
    this.isHover = false
    if (cu.selectedShape && cu.selectedShape !== this) {
      cu.selectedShape.isSelect = false
    }
    cu.selectedShapeParent.map((shape: Shape) => shape.isCapture = true)
    cu.selectedShapeParent = p
    cu.selectedShapeParent.map((shape: Shape) => shape.isCapture = false)
    cu.selectedShape = this
    cu.render()
  }

  mouseup(event: any, p: any) {
    // console.log('mouseup', this.config.name,)
    this.isMouseDown = false
    this.enterL = false
    this.enterLT = false
    // this.isCapture = true
  }

  mousemove(event: any, p: any) {
    let { e, coordinate, type } = event
    // console.log('mousemove', this.config.name, `isHover：${this.isHover}`)
    let { x, y } = coordinate

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

    if (this.enterL) {
      this.config.x = x - cu.offsetX
      // one.y = one.y
      this.config.w = this.original.w - (x - cu.startX)
      this.config = getPath(this.config)
      cu.render()
      return;
    }
  }
}

export default Frame
