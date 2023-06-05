import {P} from "../lib/designer/types/type"
import {Rect} from "../lib/designer/config/BaseConfig"

export {}

declare global {
  interface CanvasRenderingContext2D {
    //三次贝塞尔曲线
    bezierCurveTo2(cp1: P, cp2: P, end: P): void

    //二次贝塞尔曲线
    quadraticCurveTo2(cp1: P, end: P): void

    moveTo2(cp1: P): void

    lineTo2(cp1: P): void

    translate2(p: P): void

    rect2(p: Rect): void

    fillRect2(p: Rect): void

    strokeRect2(p: Rect): void
  }

  interface Path2D {
    //三次贝塞尔曲线
    bezierCurveTo2(cp1: P, cp2: P, end: P): void

    //二次贝塞尔曲线
    quadraticCurveTo2(cp1: P, end: P): void

    moveTo2(cp1: P): void

    lineTo2(cp1: P): void

    translate2(p: P): void

    rect2(p: Rect): void
  }

  interface Math {
    decimal(val: number): number

    isInt(val: number): boolean
  }

  interface Number {
    toFixed2(digits: number): number
  }

  interface Console {
    d(v: any): void
  }
}

