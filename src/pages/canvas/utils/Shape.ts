import {RectType} from "../type";
import {clear, renderRoundRect} from "../utils";

export class Shape {
  private listenerMap: Map<string, any>;

  constructor(props: any) {
    this.listenerMap = new Map()
  }

  // on(eventName: string, listener: Function) {
  //   if (this.listenerMap.has(eventName)) {
  //     this.listenerMap.get(eventName).push(listener)
  //   } else {
  //     this.listenerMap.set(eventName, [listener])
  //   }
  // }
  //
  // emit(eventName: string, event: any) {
  //   if (event == null || event.type == null) {
  //     return;
  //   }
  //   const listeners = this.listenerMap.get(eventName)
  //   if (!listeners) return
  //   for (let index = 0; index < listeners.length; index++) {
  //     const handler = listeners[index];
  //     handler(event)
  //   }
  // }

  hover(ctx: any, type: RectType) {
    if (type === RectType.HOVER) {
      // console.log('hover')
      ctx.strokeStyle = 'rgb(139,80,255)'
      ctx.stroke()
    }
  }

  selected(ctx: any, config: any) {
    if (config.selected) {
      // console.log('selected')
      let {
        x, y, w, h, radius,
        fillColor, borderColor, rotate,
        type, flipVertical, flipHorizontal, children,
      } = config
      ctx.strokeStyle = 'rgb(139,80,255)'

      if (radius) {
        renderRoundRect({x, y, w, h}, radius, ctx)
      }
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y);
      ctx.closePath()
      ctx.stroke()
      let d = 4
      clear({
        x: x - d,
        y: y - d,
        w: 2 * d,
        h: 2 * d
      }, ctx)
      clear({
        x: x + w - d,
        y: y - d,
        w: 2 * d,
        h: 2 * d
      }, ctx)
      clear({
        x: x + w - d,
        y: y + h - d,
        w: 2 * d,
        h: 2 * d
      }, ctx)
      clear({
        x: x - d,
        y: y + h - d,
        w: 2 * d,
        h: 2 * d
      }, ctx)

      let r = 3
      let lineWidth = 1.5
      renderRoundRect({
        x: x - d,
        y: y - d,
        w: 2 * d,
        h: 2 * d,
        lineWidth
      }, r, ctx)
      renderRoundRect({
        x: x + w - d,
        y: y - d,
        w: 2 * d,
        h: 2 * d,
        lineWidth
      }, r, ctx)
      renderRoundRect({
        x: x + w - d,
        y: y + h - d,
        w: 2 * d,
        h: 2 * d,
        lineWidth
      }, r, ctx)
      renderRoundRect({
        x: x - d,
        y: y + h - d,
        w: 2 * d,
        h: 2 * d,
        lineWidth
      }, r, ctx)
    }
  }


  preDraw() {

  }
}