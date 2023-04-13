import {BaseShape} from "./BaseShape";
import {BaseEvent2, LineShape, MouseOptionType, P, ShapeStatus} from "../types/type";
import draw from "../utils/draw";
import CanvasUtil2 from "../engine/CanvasUtil2";
import {BaseConfig, Rect} from "../config/BaseConfig";
import helper from "../utils/helper"
import {Colors} from "../utils/constant"
import {cloneDeep} from "lodash";

export class BoxSelection extends BaseShape {

  // constructor(children: BaseShape[]) {
  // this.children = children
  // this.calcLayout()
  // this.render()
  // }

  checkChildren(layout: Rect, cu: CanvasUtil2) {
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

    this.children.map((currentValue) => {
      const {center} = currentValue.conf
      currentValue.conf.relativeCenter = {
        x: center.x - this.conf.layout.x,
        y: center.y - this.conf.layout.y,
      }
    })

    this.conf = helper.calcConf(this.conf)
  }

  setChildren(children: BaseShape[]) {
    if (this.children.length !== children.length) {
      this.children = children
      this.calcLayout()
    }
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
    return helper.isInBox(mousePoint, this.conf.box)
  }

  isInShapeOnSelect(p: P, cu: CanvasUtil2): boolean {
    return false;
  }

  beforeEvent(event: BaseEvent2): boolean {
    return false;
  }

  onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false;
  }

  onMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false;
  }

  onMouseDowned(event: BaseEvent2, parents: BaseShape[]): boolean {
    console.log('onMouseDowned')

    return false;
  }

  onMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean {
    return false;
  }

  onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
    console.log(this.mouseDown)
    console.log(this.enterType)
    if (!this.moved && this.enterType === MouseOptionType.None) {
      let cu = CanvasUtil2.getInstance()
      cu.boxSelection = undefined
      cu.render()
    }
    return false;
  }

}