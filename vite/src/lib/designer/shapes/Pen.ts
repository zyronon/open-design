// import {BaseShape} from "./BaseShape"
// import CanvasUtil2 from "../engine/CanvasUtil2"
// import {BaseEvent2, P, ShapeStatus, ShapeType} from "../utils/type"
// import {BaseConfig, LineShape, Rect} from "../config/BaseConfig"
// import helper from "../utils/helper"
// import {Colors, defaultConfig} from "../utils/constant"
// import draw from "../utils/draw"
// import {ParentShape} from "./core/ParentShape";
//
// export class Pen extends ParentShape {
//   mouseDown: boolean = false
//
//   get _config(): BaseConfig {
//     return this.conf
//   }
//
//   set _config(val) {
//     this.conf = val
//   }
//
//   beforeEvent(event: BaseEvent2): boolean {
//     if (this.status === ShapeStatus.Edit) {
//       event.stopPropagation()
//       super.emit(event, [])
//       return true
//     }
//     return false
//   }
//
//   beforeIsInShape(): boolean {
//     return false
//   }
//
//   drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig): any {
//     if (this.status === ShapeStatus.Edit) return
//     let {
//       fillColor, lineWidth,
//     } = this.conf
//
//     ctx.lineWidth = lineWidth ?? defaultConfig.lineWidth
//     ctx.lineCap = "round"
//     ctx.fillStyle = fillColor
//     let pathList = super.getCustomShapePath()
//     pathList.map(path => {
//       ctx.stroke(path)
//     })
//   }
//
//   drawHover(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
//     ctx.strokeStyle = defaultConfig.strokeStyle
//     let pathList = super.getCustomShapePath()
//     pathList.map(path => {
//       ctx.stroke(path)
//     })
//   }
//
//   drawSelected(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
//     draw.selected(ctx, newLayout)
//   }
//
//   drawSelectedHover(ctx: CanvasRenderingContext2D, newLayout: Rect): void {
//   }
//
//   drawEdit(ctx: CanvasRenderingContext2D, newLayout: Rect): any {
//     // this.log('drawEdit')
//     let {
//       fillColor,
//       center
//     } = this.conf
//
//     ctx.save()
//
//     ctx.strokeStyle = Colors.Line2
//     ctx.fillStyle = fillColor
//
//     let pathList = super.getCustomShapePath()
//     pathList.map(path => {
//       ctx.stroke(path)
//     })
//
//     let bezierCps = this._config.lineShapes
//     bezierCps.map(line => {
//       line.points.map((currentPoint) => {
//         if (currentPoint.cp1.use) draw.controlPoint(ctx, currentPoint.cp1, currentPoint.center)
//         if (currentPoint.cp2.use) draw.controlPoint(ctx, currentPoint.cp2, currentPoint.center)
//         draw.drawRound(ctx, currentPoint.center)
//       })
//     })
//     ctx.restore()
//   }
//
//   isInShape(mousePoint: P, cu: CanvasUtil2): boolean {
//     return helper.isInBox(mousePoint, this.conf.box)
//   }
//
//   isInShapeOnSelect(p: P, cu: CanvasUtil2): boolean {
//     return false
//   }
//
//   onDbClick(event: BaseEvent2, parents: BaseShape[]): boolean {
//     console.log('pen-onDbClick')
//     let cu = CanvasUtil2.getInstance()
//     if (this.status === ShapeStatus.Edit) {
//       this.status = ShapeStatus.Select
//       cu.editShape = undefined
//       cu.selectedShape = this
//       cu.mode = ShapeType.SELECT
//     } else {
//       this.status = ShapeStatus.Edit
//       cu.editShape = this
//       cu.mode = ShapeType.EDIT
//     }
//     return false
//   }
//
//   onMouseDown(event: BaseEvent2, parents: BaseShape[]): boolean {
//     console.log('pen-onMouseDown')
//     return false
//   }
//
//   onMouseMove(event: BaseEvent2, parents: BaseShape[]): boolean {
//     // console.log('pen-onMouseMove')
//     return false
//   }
//
//   onMouseUp(event: BaseEvent2, parents: BaseShape[]): boolean {
//     console.log('pen-onMouseUp')
//     this.mouseDown = false
//     return false
//   }
//
//   getCustomPoint(): LineShape[] {
//     return []
//   }
// }