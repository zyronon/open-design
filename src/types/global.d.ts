import {BezierPoint, P2} from "../pages/canvas/type";

export {};

export interface Point {
  x: number,
  y: number,
}

declare global {
  interface CanvasRenderingContext2D {
    //三次贝塞尔曲线
    bezierCurveTo2(cp1: Point, cp2: Point, end: Point): void

    //二次贝塞尔曲线
    quadraticCurveTo2(cp1: Point | P2, end: Point): void

    moveTo2(cp1: Point | P2): void

    lineTo2(cp1: Point | P2): void
  }
}

let Context2D: CanvasRenderingContext2D = {
  bezierCurveTo2: function (cp1, cp2, end) {
    this.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)
  },
  quadraticCurveTo2: function (cp1, end) {
    this.quadraticCurveTo(cp1.x, cp1.y, end.x, end.y)
  },
  moveTo2: function (cp1) {
    this.moveTo(cp1.x, cp1.y)
  },
  lineTo2: function (cp1) {
    this.lineTo(cp1.x, cp1.y)
  }
}

for (const key in Context2D) {
  CanvasRenderingContext2D.prototype[key] = Context2D[key]
}
// CanvasRenderingContext2D.prototype.bezierCurveTo2 =
//   function (cp1, cp2, end) {
//     this.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)
//   }

// CanvasRenderingContext2D.prototype.quadraticCurveTo2 =
//   function (cp1, end) {
//     this.quadraticCurveTo(cp1.x, cp1.y, end.x, end.y)
//   }

