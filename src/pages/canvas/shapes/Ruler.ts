import {BaseShape} from "./BaseShape"
import {BaseEvent2, P, ShapeType} from "../utils/type"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseConfig} from "../config/BaseConfig"
import {RulerLine} from "./RulerLine"

export class Ruler extends BaseShape {
  beforeShapeIsIn(): boolean {
    return false
  }

  childDbClick(event: BaseEvent2, p: BaseShape[]): boolean {
    return false
  }

  childMouseDown(event: BaseEvent2, p: BaseShape[]): boolean {
    this.enter = true
    return true
  }

  childMouseMove(mousePoint: P): boolean {
    if (this.enter) {
      let cu = CanvasUtil2.getInstance()
      if (cu.newShape) {
        cu.newShape.conf.y = mousePoint.y
        cu.render()
      } else {
        cu.newShape = new RulerLine({
          conf: {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 20,
            "rotate": 0,
            "lineWidth": 2,
            "type": ShapeType.RULER_LINE,
            "radius": 0,
            "children": [],
            "borderColor": "rgb(216,216,216)",
            "fillColor": "red"
          } as any,
          parent: undefined, ctx: cu.ctx
        },)
        cu.children.push(cu.newShape)
      }
      return true
    }
    return true
  }

  childMouseUp(): boolean {
    let cu = CanvasUtil2.getInstance()
    cu.newShape = undefined
    return false
  }

  isHoverIn(mousePoint: P, cu: CanvasUtil2): boolean {
    const {x, y} = mousePoint
    let r = 0 < x && x < cu.canvasRect.width
      && 0 < y && y < 20
    if (r) {
      document.body.style.cursor = 'row-resize'
    } else {
      document.body.style.cursor = 'default'
    }
    return r
  }

  isInOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  render(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
    let cu = CanvasUtil2.getInstance()
    ctx.rect(0, 0, cu.canvasRect.width, 20)
    ctx.fill()
  }

  renderEdit(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
  }

  renderHover(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
  }

  renderSelected(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}