import {P, P2} from "../pages/canvas/utils/type"

export {}

declare global {
  interface CanvasRenderingContext2D {
    //三次贝塞尔曲线
    bezierCurveTo2(cp1: P, cp2: P, end: P): void

    //二次贝塞尔曲线
    quadraticCurveTo2(cp1: P | P2, end: P): void

    moveTo2(cp1: P | P2): void

    lineTo2(cp1: P | P2): void

    translate2(p: P): void
  }

  interface Math {
    decimal(val: number): number
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
  },
  translate2: function (p) {
    this.translate(p.x, p.y)
  }
}

for (const key in Context2D) {
  CanvasRenderingContext2D.prototype[key] = Context2D[key]
}

Math.decimal = (num: number) => {
  return num - Math.trunc(num)
}
