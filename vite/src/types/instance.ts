import {cloneDeep} from "lodash"

// @ts-ignore
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
  },
  fillRect2: function (p) {
    this.fillRect(p.x, p.y, p.w, p.h)
  },
  strokeRect2: function (p) {
    this.strokeRect(p.x, p.y, p.w, p.h)
  }
}
for (const key in Context2D) {
  CanvasRenderingContext2D.prototype[key] = Context2D[key]
  Path2D.prototype[key] = Context2D[key]
}

//获取小数
Math.decimal = (num: number) => {
  return num - Math.trunc(num)
}
//是否是整数
Math.isInt = (num: number) => {
  return Math.trunc(num) === num
}

Number.prototype.toFixed2 = function (digits: number = 2) {
  return Number(this.toFixed(digits))
}

console.d = function (v: any) {
  console.log(cloneDeep(v))
}