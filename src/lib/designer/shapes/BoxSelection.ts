import {BaseShape} from "./BaseShape";
import {BaseEvent2, LineShape, P} from "../types/type";
import draw from "../utils/draw";
import CanvasUtil2 from "../engine/CanvasUtil2";
import {BaseConfig, Rect} from "../config/BaseConfig";

export class BoxSelection extends BaseShape {

  constructor(children: BaseShape[]) {
    // this.children = children
    // this.calcLayout()
    // this.render()
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