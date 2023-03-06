import {BaseShape} from "./BaseShape"
import {BaseEvent2, P, ShapeType} from "../utils/type"
import CanvasUtil2 from "../CanvasUtil2"
import {BaseConfig} from "../config/BaseConfig"
import {RulerLine} from "./RulerLine"
import helper from "../utils/helper"

export class Ruler extends BaseShape {
  beforeIsInShape(): boolean {
    return false
  }

  dbClickChild(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false
  }

  mouseDownChild(event: BaseEvent2, parents: BaseShape[]): boolean {
    this.enter = true
    return true
  }

  mouseMoveChild(event: BaseEvent2, parents: BaseShape[]): boolean {
    if (this.enter) {
      let cu = CanvasUtil2.getInstance()
      if (cu.newShape) {
        if (this.isHorizontal()) {
          cu.newShape.conf.y = event.point.y
          cu.newShape.conf.absolute.y = event.point.y
        } else {
          cu.newShape.conf.x = event.point.x
          cu.newShape.conf.absolute.x = event.point.x
        }
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
            "fillColor": "red",
            data: {
              direction: this.conf.data?.direction
            }
          } as any,
          parent: undefined
        },)
        cu.children.push(cu.newShape)
      }
      return true
    }
    return true
  }

  mouseUpChild(event: BaseEvent2, parents: BaseShape[]): boolean {
    let cu = CanvasUtil2.getInstance()
    cu.newShape = undefined
    return false
  }

  isHorizontal(): boolean {
    return this.conf.data?.direction === 'horizontal'
  }

  isInShapeChild(mousePoint: P, cu: CanvasUtil2): boolean {
    const {x, y} = mousePoint
    let r
    if (this.isHorizontal()) {
      r = 0 < x && x < cu.canvasRect.width
        && 0 < y && y < 20
      if (r) {
        document.body.style.cursor = 'row-resize'
      } else {
        document.body.style.cursor = 'default'
      }
    } else {
      r = 0 < x && x < 20
        && 0 < y && y < cu.canvasRect.height
      if (r) {
        document.body.style.cursor = 'col-resize'
      } else {
        document.body.style.cursor = 'default'
      }
    }
    return r
  }

  isInShapeOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false
  }

  drawShape(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
    let cu = CanvasUtil2.getInstance()
    if (this.isHorizontal()) {
      ctx.rect(0, 0, cu.canvasRect.width, 20)
    } else {
      ctx.rect(0, 0, 20, cu.canvasRect.height)
    }
    ctx.fill()
  }

  drawEdit(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
  }

  drawHover(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
  }

  drawSelected(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): any {
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}