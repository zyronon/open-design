import {BaseShape} from "./BaseShape";
import {BaseEvent2, LineShape, P, ShapeStatus} from "../types/type";
import draw from "../utils/draw";
import CanvasUtil2 from "../engine/CanvasUtil2";
import {BaseConfig, Rect} from "../config/BaseConfig";
import helper from "../utils/helper"
import {Colors} from "../utils/constant"

export class BoxSelection extends BaseShape {

  // constructor(children: BaseShape[]) {
  // this.children = children
  // this.calcLayout()
  // this.render()
  // }

  checkChildren(startPoint: P, endPoint: P, cu: CanvasUtil2) {
    let {x, y} = startPoint
    let w = endPoint.x - x
    let h = endPoint.y - y
    let layout = {
      x,
      y,
      w,
      h,
      leftX: x,
      rightX: x + w,
      topY: y,
      bottomY: y + h,
    }
    let selectionShapes: BaseShape[] = []
    cu.children.map(shape => {
      if (helper.isInBox(shape.conf.absolute, layout)) {
        selectionShapes.push(shape)
        shape.status = ShapeStatus.Hover
      }
    })
    if (selectionShapes.length === 1) {
      selectionShapes[0].status = ShapeStatus.Select
    }
    this.setChildren(selectionShapes)

    console.log('render')
    cu.render()
    cu.ctx.strokeStyle = Colors.Primary
    cu.ctx.fillStyle = Colors.Select
    cu.ctx.fillRect2(layout)
    cu.ctx.strokeRect2(layout)
  }

  calcLayout() {
    let maxX: number, minX: number, maxY: number, minY: number
    maxX = maxY = 0
    minX = minY = Infinity
    this.children.map((currentValue) => {
      let {leftX, rightX, topY, bottomY} = currentValue.conf.box
      if (rightX > maxX) maxX = rightX
      if (leftX < minX) minX = leftX
      if (bottomY > maxY) maxY = bottomY
      if (topY < minY) minY = topY
    })
    let newWidth = maxX - minX
    let newHeight = maxY - minY
    let newCenter = {
      x: minX + newWidth / 2,
      y: minY + newHeight / 2,
    }
    this.conf.center = newCenter
    this.conf.layout = {
      x: minX,
      y: minY,
      w: newWidth,
      h: newHeight
    }
  }

  setChildren(children: BaseShape[]) {
    if (this.children.length !== children.length) {
      this.children = children
      this.calcLayout()
    }
  }

  beforeEvent(event: BaseEvent2): boolean {
    return false;
  }

  beforeIsInShape(): boolean {
    return false;
  }

  drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
  }

  drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
  }

  drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
  }

  drawSelectedHover(ctx: CanvasRenderingContext2D, newLayout: Rect): void {
  }

  drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig): any {
    draw.selected(ctx, newLayout)
  }

  getCustomPoint(): LineShape[] {
    return [];
  }

  isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
    return false;
  }

  isInShapeOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false;
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false;
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false;
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false;
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false;
  }
}