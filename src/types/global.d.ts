import {P, P2} from "../lib/designer/utils/type"
import {cloneDeep} from "lodash"
import {Rect} from "../lib/designer/config/BaseConfig"

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

    rect2(p: Rect): void
  }

  interface Path2D {
    //三次贝塞尔曲线
    bezierCurveTo2(cp1: P, cp2: P, end: P): void

    //二次贝塞尔曲线
    quadraticCurveTo2(cp1: P | P2, end: P): void

    moveTo2(cp1: P | P2): void

    lineTo2(cp1: P | P2): void

    translate2(p: P): void

    rect2(p: Rect): void
  }

  interface Math {
    decimal(val: number): number
  }

  interface Number {
    toFixed2(digits?: number): number
  }

  interface Console {
    d(v: any): void
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
  },
  rect2: function (p) {
    this.rect(p.x, p.y, p.w, p.h)
  }
}

for (const key in Context2D) {
  CanvasRenderingContext2D.prototype[key] = Context2D[key]
  Path2D.prototype[key] = Context2D[key]
}

Math.decimal = (num: number) => {
  return num - Math.trunc(num)
}
Number.prototype.toFixed2 = function (digits? = 2) {
  return Number(this.toFixed(digits))
}

console.d = function (v: any) {
  console.log(cloneDeep(v))
}