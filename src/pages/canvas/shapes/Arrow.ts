import {BaseShape} from "./BaseShape"
import CanvasUtil2 from "../CanvasUtil2"
import {P, TextAlign, TextConfig} from "../type"
import {RectType} from "../../canvas-old/type"
import {renderRound} from "../../canvas-old/utils"
import {cloneDeep} from "lodash"

export class Arrow extends BaseShape {
  isIn(p: P, cu: CanvasUtil2): boolean {
    return super.isInBox(p)
  }

  get _config(): any {
    return this.config
  }

  set _config(val) {
    this.config = val
  }

  render(ctx: CanvasRenderingContext2D, p: P, parent?: any): any {
    let {
      w, h, radius,
      points,
      borderColor
    } = this._config
    const {x, y} = p
    if (points.length) {
      ctx.strokeStyle = borderColor
      ctx.lineCap = "round"
      let d = 40
      let start = points[0]
      if (points.length === 2) {
        let end = points[1]
        let dx = end.x - start.x
        let dy = end.y - start.y
        let degree = Math.atan(Math.abs(dy) / Math.abs(dx)) / Math.PI * 180
        // console.log('degree1', degree)
        //以终点为坐标原点。判断起点坐标在第几象限，进行相应的加减角度
        /*第一象限*/
        if (end.x < start.x && end.y > start.y) degree = 90 - degree
        /*第二象限*/
        else if (end.x > start.x && end.y > start.y) degree = degree - 90
        /*第三象限*/
        else if (end.x > start.x && end.y < start.y) degree = 270 - degree
        /*第四象限*/
        else if (end.x < start.x && end.y < start.y) degree = degree - 270
        //水平或垂直的特殊情况
        if (dx === 0) {
          if (end.y > start.y) {
            degree = 0
          } else {
            degree = 180
          }
        }
        if (dy === 0) {
          if (end.x < start.x) {
            degree = 90
          } else {
            degree = 270
          }
        }
        // console.log('degree2', degree)
        ctx.save()
        ctx.translate(start.x, start.y)
        ctx.rotate((degree) * Math.PI / 180)
        ctx.beginPath()
        /*
        * 箭头起点Y坐标
        * 三角箭头，Y坐标是0
        * 圆或者方形，Y坐标是长宽的一半
        * */
        let arrowStartY = 0
        ctx.moveTo(0, arrowStartY)
        ctx.lineTo(d, d)
        ctx.lineTo(-d, d)
        ctx.lineTo(0, arrowStartY)
        ctx.closePath()
        ctx.strokeStyle = borderColor
        ctx.stroke()
        ctx.restore()
      }
      ctx.moveTo(start.x, start.y)

      points.map((item: any, index: number, arr: any[]) => {
        ctx.beginPath()
        ctx.moveTo(item.x, item.y)
        if (index !== arr.length - 1) {
          ctx.lineTo(arr[index + 1].x, arr[index + 1].y)
          ctx.stroke()
        }
      })
    }
  }

  renderSelectedHover(ctx: CanvasRenderingContext2D, conf: any): void {
  }

}