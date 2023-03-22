// import {BaseShape} from "./BaseShape"
// import {BaseEvent2, P} from "../utils/type"
// import CanvasUtil2 from "../CanvasUtil2"
// import {EllipseConfig} from "../config/EllipseConfig"
// import {BaseConfig} from "../config/BaseConfig"
//
// export class Polygon extends BaseShape {
//
//   childDbClick(event: BaseEvent2, p: BaseShape[]): boolean {
//     return false
//   }
//   childMouseDown() {
//     return false
//   }
//   childMouseMove() {
//     return false
//   }
//   childMouseUp() {
//     return false
//   }
//
//   beforeShapeIsIn() {
//     return false
//   }
//   isInOnSelect(p: P, cu: CanvasUtil2): boolean {
//     return false
//   }
//
//   isHoverIn(p: P, cu: CanvasUtil2): boolean {
//     return super.isInBox(p)
//   }
//
//   get _config() {
//     return this.conf
//   }
//
//   set _config(val) {
//     this.conf = val
//   }
//
//   render(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig) {
//     let {
//       w, h, radius,
//       fillColor, borderColor, rotation, lineWidth,
//       type, flipVertical, flipHorizontal, children,
//     } = this._config
//     const {x, y} = p
//     ctx.save()
//     let outA = w / 2
//     let outB = h / 2
//     let x1, x2, y1, y2
//     ctx.translate(x + w / 2, y + h / 2)
//
//     ctx.beginPath()
//     for (let i = 0; i < 3; i++) {
//       x1 = outA * Math.cos((30 + i * 120) / 180 * Math.PI)
//       y1 = outB * Math.sin((30 + i * 120) / 180 * Math.PI)
//       ctx.lineTo(x1, y1)
//     }
//     ctx.closePath()
//     ctx.fillStyle = fillColor
//     ctx.fill()
//     ctx.strokeStyle = borderColor
//     ctx.stroke()
//     ctx.restore()
//   }
//   renderHover(ctx: CanvasRenderingContext2D,xy: P, parent?: BaseConfig): void {}
//   renderSelected(ctx: CanvasRenderingContext2D,xy: P, parent?: BaseConfig): void {}
//   renderEdit(ctx: CanvasRenderingContext2D, p: P, parent?: BaseConfig): void {
//   }
//   renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
//   }
//
// }