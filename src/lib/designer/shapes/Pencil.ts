// import {BaseShape} from "./BaseShape"
// import CanvasUtil from "../CanvasUtil"
// import {BaseEvent2, P} from "../utils/type"
// import {BaseConfig} from "../config/BaseConfig"
//
// export class Pencil extends BaseShape {
//
//   childDbClick(event: BaseEvent2, p: BaseShape[]): boolean {
//     return false
//   }
//
//   childMouseDown() {
//     return false
//   }
//
//   childMouseMove() {
//     return false
//   }
//
//   childMouseUp() {
//     return false
//   }
//
//   beforeShapeIsIn() {
//     return false
//   }
//
//   isInOnSelect(p: P, cu: CanvasUtil): boolean {
//     return false
//   }
//
//   isHoverIn(p: P, cu: CanvasUtil): boolean {
//     return super.isInBox(p)
//   }
//
//   get _config(): any {
//     return this.conf
//   }
//
//   set _config(val) {
//     this.conf = val
//   }
//
//   render(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig): any {
//     let {
//       w, h, radius,
//       points,
//       borderColor
//     } = this._config
//     const {x, y} = p
//     if (points?.length) {
//       ctx.strokeStyle = borderColor
//       // ctx.lineCap = "round";
//       ctx.moveTo(points[0]?.x, points[0]?.y)
//       points.map((item: any) => {
//         ctx.lineTo(item.x, item.y)
//       })
//       ctx.stroke()
//     }
//   }
//
//   renderHover(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): void {
//   }
//
//   renderSelected(ctx: CanvasRenderingContext2D, xy: P, parent?: BaseConfig): void {
//   }
//
//   renderEdit(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig): void {
//   }
//
//   renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
//   }
//
// }