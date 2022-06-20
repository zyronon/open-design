import React, {MouseEvent, RefObject} from "react";
import './index.scss'
import {clone} from 'lodash'
import {getAngle, getHypotenuse} from "../../utils";

enum BoxType {
  LINE = 0,
  FILL = 1,
  WRAPPER = 2,
  SELECT = 3
}

interface Box {
  id?: number,
  x: number,
  y: number,
  w: number,
  h: number,
  rotate: number,
  lineWidth: number,
  type: BoxType,
  color: string,
  leftX?: number,
  topY?: number,
  rightX?: number,
  bottomY?: number,
  children: Box[]
}

type IState = {
  boxList: Box[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  canvasRect: DOMRect,
  enter: boolean,
  enterLeft: boolean,
  hoverLeft: boolean,
  hoverLT: boolean,
  enterLT: boolean,
  selectBox?: Box,
  startX: number,
  startY: number,
  offsetX: number,
}

class Canvas extends React.Component<any, IState> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef()
  // @ts-ignore
  body: HTMLElement = document.querySelector("body")

  readonly state = {} as IState

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    let canvas: HTMLCanvasElement = this.canvasRef.current!
    let canvasRect = canvas.getBoundingClientRect()
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let width = canvas.width, height = canvas.height;
    if (window.devicePixelRatio) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.height = height * window.devicePixelRatio;
      canvas.width = width * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    let allLine = {
      x: 0,
      y: 0,
      w: canvas.width,
      h: canvas.height,
      rotate: 0,
      lineWidth: 1,
      type: BoxType.LINE,
      color: 'black',
      children: []
    }
    let oneBox = {
      x: 150,
      y: 150,
      w: 50,
      h: 150,
      rotate: 0,
      lineWidth: 2,
      type: BoxType.LINE,
      color: 'gray',
      children: []
    }
    let oneBoxLineRotate = {
      // id: Date.now(),
      id: 'oneBoxLine',
      x: 80,
      y: 20,
      w: 50,
      h: 150,
      rotate: 70,
      lineWidth: 2,
      type: BoxType.LINE,
      color: 'gray',
      children: []
    }
    let towBox = {
      x: 50,
      y: 50,
      w: 150,
      h: 150,
      rotate: 0,
      lineWidth: 1,
      type: BoxType.FILL,
      color: 'gray',
      children: []
    }
    let a = 0
    let threeBox = {
      id: 'threeBox',
      x: 350 + a,
      y: 50 + a,
      w: 50,
      h: 200,
      rotate: 0,
      lineWidth: 1,
      type: BoxType.FILL,
      color: 'gray',
      children: []
    }
    let selectBox = {
      x: 50,
      y: 50,
      w: 50,
      h: 100,
      rotate: 0,
      lineWidth: 2,
      type: BoxType.SELECT,
      color: 'gray',
      children: []
    }

    this.setState({
      canvas,
      ctx,
      canvasRect,
      boxList: [
        this.getPath(oneBox),
        // this.getPath(threeBox),
      ]
    }, this.draw2)
  }

  draw2() {
    this.clearAll()
    this.state.ctx.save()
    // ctx.translate(0.5, 0.5);
    this.state.ctx.lineCap = 'square'
    this.state.boxList.map(v => {
      // console.log(v)
      this.renderCanvas(v)
    })
    this.state.ctx.restore()
  }

  renderCanvas(box: Box, parent?: Box) {
    let {ctx} = this.state
    ctx.save()
    let {x, y, w, h, color, rotate, lineWidth, type} = box
    if (parent) {
      x = parent.x
      y = parent.y
      w = parent.w
      h = parent.h
      rotate = parent.rotate

      let outside = .5
      x = x - outside
      y = y - outside
      w = w + 2 * outside
      h = h + 2 * outside
    }

    ctx.lineWidth = lineWidth
    if (rotate) {
      let p1 = {x, y}
      let p2 = {x: x + w, y}
      let p3 = {x: x + w, y: y + h}
      let p4 = {x, y: y + h}
      let c = {cx: x + w / 2, cy: y + h / 2}
      ctx.translate(x + w / 2, y + h / 2)
      ctx.rotate(rotate * Math.PI / 180)
      x = -w / 2
      y = -h / 2
      // console.log(rotate2(p1, c, -rotate))
      // console.log(rotate2(p2, c, -rotate))
      // console.log(rotate2(p3, c, -rotate))
      // console.log(rotate2(p4, c, -rotate))
    }
    // ctx.strokeRect(x, y, w, h)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath()

    switch (type) {
      case BoxType.FILL:
        ctx.fillStyle = color
        ctx.fill()
        break
      case BoxType.LINE:
        ctx.strokeStyle = color
        ctx.stroke()
        break
      case BoxType.WRAPPER:
        ctx.strokeStyle = 'rgb(139,80,255)'
        ctx.stroke()
        break
      case BoxType.SELECT:
        // console.log('select')

        // rotate = parent!.rotate
        // // lineWidth = parent!.lineWidth

        ctx.strokeStyle = 'rgb(139,80,255)'
        ctx.stroke()
        let d = 4
        this.clear({
          x: x - d,
          y: y - d,
          w: 2 * d,
          h: 2 * d
        })
        this.clear({
          x: x + w - d,
          y: y - d,
          w: 2 * d,
          h: 2 * d
        })
        this.clear({
          x: x + w - d,
          y: y + h - d,
          w: 2 * d,
          h: 2 * d
        })
        this.clear({
          x: x - d,
          y: y + h - d,
          w: 2 * d,
          h: 2 * d
        })

        let r = 3
        let lineWidth = 1.5
        this.renderRoundRect({
          x: x - d,
          y: y - d,
          w: 2 * d,
          h: 2 * d,
          lineWidth
        }, r)
        this.renderRoundRect({
          x: x + w - d,
          y: y - d,
          w: 2 * d,
          h: 2 * d,
          lineWidth
        }, r)
        this.renderRoundRect({
          x: x + w - d,
          y: y + h - d,
          w: 2 * d,
          h: 2 * d,
          lineWidth
        }, r)
        this.renderRoundRect({
          x: x - d,
          y: y + h - d,
          w: 2 * d,
          h: 2 * d,
          lineWidth
        }, r)
        break
    }

    ctx.restore()
    if (box.children) {
      box.children.map(v => this.renderCanvas(v, box))
    }
  }

  renderRoundRect(rect: any, r: number) {
    let {ctx} = this.state
    ctx.lineWidth = rect.lineWidth
    let {x, y, w, h} = rect
    ctx.beginPath()
    ctx.moveTo(x + w / 2, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w / 2, y, r)
    ctx.closePath()
    ctx.stroke()
  }

  clearAll() {
    this.clear(0, 0, this.state.canvas.width, this.state.canvas.height)
  }

  clear(x: number | any, y?: number, w?: number, h?: number) {
    if (typeof x === 'object') {
      this.state.ctx.clearRect(x.x, x.y, x.w, x.h)
    } else {
      this.state.ctx.clearRect(x, y!, w!, h!)
    }
  }

  getPath(box: Box) {
    box.leftX = box.x
    box.rightX = box.leftX + box.w
    box.topY = box.y
    box.bottomY = box.topY + box.h
    if (!box.id) {
      box.id = Date.now()
    }
    return box
  }

  //旋转鼠标坐标，
  rotate33(p1: any, c: any, angle: number) {
    let {x, y} = p1
    let {cx, cy} = c
    let radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
    return [nx, ny];
  }

  onMouseDown1 = (e: any) => {
    if (e.button !== 0) return;
    let {selectBox, boxList, canvasRect, hoverLeft, hoverLT: hoverLT} = this.state
    // console.log('selectBox', selectBox)
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    let old = clone(boxList)
    let select
    if (selectBox) {
      if (hoverLeft) {
        this.setState({
          startX: x,
          startY: y,
          enterLeft: true,
          offsetX: x - selectBox.x
        })
        return
      }
      if (hoverLT) {
        this.setState({
          startX: x,
          startY: y,
          enterLT: true,
          offsetX: x - selectBox.x
        })
        return
      }
      let r = this.isPointInPath(x, y, selectBox)
      if (!r) {
        let rIndex = old.findIndex(o => o.id === selectBox!.id)
        if (rIndex !== -1) {
          let selectIndex = old[rIndex].children.findIndex(w => w.type === BoxType.SELECT)
          if (selectIndex !== -1) {
            old[rIndex].children.splice(selectIndex, 1)
          }
        }
      } else {
        select = selectBox
      }
    } else {
      for (let i = 0; i < boxList.length; i++) {
        let b = boxList[i]
        let r = this.isPointInPath(x, y, b)
        console.log('in', r)
        if (r) {
          let now = old[i]
          let t = clone(now)
          t.id = Date.now()
          t.lineWidth = 2
          t.type = BoxType.SELECT
          t.children = []
          let cIndex = now.children.findIndex(v => v.type === BoxType.SELECT)
          // console.log(cIndex)
          if (cIndex !== -1) {
            now.children[cIndex] = t
          } else {
            now.children.push(t)
          }
          select = now
          break
        } else {
          let selectIndex = old[i].children.findIndex(w => w.type === BoxType.SELECT)
          if (selectIndex !== -1) {
            old[i].children.splice(selectIndex, 1)
          }
        }
      }
    }
    this.setState({
      boxList: old,
      selectBox: clone(select),
      startX: x,
      enter: true,
      startY: y,
    }, this.draw2)
    // console.log('onMouseDown')
  }

  onMouseUp1 = (e: any) => {
    let {hoverLeft, selectBox, boxList} = this.state
    if (selectBox) {
      let rIndex = boxList.findIndex(v => v.id === selectBox?.id)
      if (rIndex !== -1) {
        this.setState({selectBox: clone(boxList[rIndex])})
      }
    }
    this.setState({
      enter: false,
      hoverLeft: false,
      hoverLT: false,
      enterLeft: false,
      enterLT: false
    })
    this.body.style.cursor = "default"
    // console.log('onMouseUp')
  }

  isPointInPath(x: number, y: number, box: Box) {
    let {canvas} = this.state
    // console.log('box.x', box.x, 'box.y', box.y)
    if (box.rotate !== 0) {
      let {w, h, rotate} = box
      let p1 = {x, y}
      let c = {cx: box.x + w / 2, cy: box.y + h / 2}
      let s = this.rotate33(p1, c, -rotate)
      x = s[0]
      y = s[1]
      // console.log(s)
      // let r = isPointInRect([x, y], box.ract)
      // console.log(r)
    }


    let isIn = false
    let isSelect = box.children.find(v => v.type === BoxType.SELECT)
    //判断是否在矩形里面
    if (box.leftX! < x && x < box.rightX! && box.topY! < y && y < box.bottomY!) {
      if (!isSelect) {
        // console.log('在里面')
        //这里要加一个判断，如果有一个在里面了，后面就不需要再去判断了，
        // 否则后面判断时会走到else逻辑里面，给清除掉
        let d = .5
        let t = clone(box)
        t.id = Date.now()
        t.lineWidth = 2
        t.x = t.x - d
        t.y = t.y - d
        t.w = t.w + 2 * d
        t.h = t.h + 2 * d
        // console.log(t)
        t.type = BoxType.WRAPPER
        this.renderCanvas(t)
      }
      // this.setState({selectBox: clone(box)})
      // canvas.addEventListener('mousedown', this.onMouseDown1)
      // canvas.addEventListener('mouseup', this.onMouseUp1)
      // console.log('1')
      // body.style.cursor = "ne-resize"
      // body.style.cursor = "pointer"
      // body.style.cursor = "move"
      isIn = true
      // console.log('在里面')
    } else {
      // console.log('不在里面')
      // this.setState({selectBox: undefined})
      // canvas.removeEventListener('mousedown', this.onMouseDown1)
      // canvas.removeEventListener('mouseup', this.onMouseUp1)
      // console.log('2')
      // this.body.style.cursor = "default"
      this.draw2()
      isIn = false
    }

    if (isSelect) {
      let dis = 10
      if ((box.leftX! - dis < x && x < box.leftX! + dis) &&
        (box.topY! + dis < y && y < box.bottomY! - dis)
      ) {
        this.setState({hoverLeft: true})
        // console.log('1')
        this.body.style.cursor = "col-resize"
      } else {
        this.setState({hoverLeft: false})
        // console.log(2)
        this.body.style.cursor = "default"
      }
      if ((box.leftX! - dis < x && x < box.leftX! + dis) &&
        (box.topY! - dis < y && y < box.topY! + dis)
      ) {
        this.setState({hoverLT: true})
        // console.log('1')
        this.body.style.cursor = "nwse-resize"
      } else {
        this.setState({hoverLT: false})
        // console.log(2)
        this.body.style.cursor = "default"
      }
    }
    return isIn
  }

  m = (e: MouseEvent) => {
    let {canvasRect, enter, offsetX, enterLeft, enterLT, selectBox, startX, startY, boxList} = this.state
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    if (enterLT) {
      console.log('enterLT', offsetX)
      if (!selectBox) return;

      // console.log('x-------', x, '          y--------', y)
      let a = getAngle([selectBox.x + selectBox.w / 2, selectBox.y + selectBox.h / 2],
        [startX, startY],
        [x, y]
      )

      let dx = x - startX
      let dy = y - startY
      let old = clone(boxList)
      let rIndex = old.findIndex(v => v.id === selectBox?.id)
      if (rIndex !== -1) {
        let now = old[rIndex]
        now.x = x - offsetX
        // one.y = one.y
        now.w = selectBox.w - (x - startX)
        now = this.getPath(now)
        let d = 2
        //一参：原点
        //二参：矩形中心点
        //结果：原点到矩形中心点的距离
        let hypotenuse = getHypotenuse([now.x - d, now.y - d],
          [now.x - d + (now.w + 2 * d) / 2, now.y - d + (now.h + 2 * d) / 2,])
        // ctx.arc(0, 0, hypotenuse + 4, 0, 2 * Math.PI);

        // ctx.rotate((a * Math.PI) / 180);
        // renderBox2(-one.w / 2, -one.h / 2, one.w, one.h, 'black')
        // renderLine2(-one.w / 2 - d, -one.h / 2 - d, one.w + 2 * d, one.h + 2 * d, 'rgb(139,80,255)')
        // ctx.restore()
      }

      this.setState({boxList: old}, this.draw2)
      return;
    }
    if (enterLeft) {
      console.log('enterLeft', offsetX)
      if (!selectBox) return;

      let dx = x - startX
      let dy = y - startY
      let old = clone(boxList)
      let rIndex = old.findIndex(v => v.id === selectBox?.id)
      if (rIndex !== -1) {
        let now = old[rIndex]
        now.x = x - offsetX
        // one.y = one.y
        now.w = selectBox.w - (x - startX)
        now = this.getPath(now)
      }
      this.setState({boxList: old}, this.draw2)
      return;
    }
    if (enter) {
      if (!selectBox?.id) return
      // console.log('startX')
      // console.log('按下了')
      let dx = x - startX
      let dy = y - startY
      let old = clone(boxList)
      let rIndex = old.findIndex(v => v.id === selectBox?.id)
      if (rIndex !== -1) {
        let now = old[rIndex]
        now.x = selectBox.x + dx
        now.y = selectBox.y + dy
        now = this.getPath(now)
      }
      this.setState({boxList: old}, this.draw2)
      return
    }
    // return console.log(x, y)
    // isPointInPath(x, y, blocks[0])
    for (let i = 0; i < boxList.length; i++) {
      let b = boxList[i]
      let r = this.isPointInPath(x, y, b)
      if (r) break
    }
  }

  render() {
    return <div>
      <div className='components'>
        <div className="component" onClick={() => location.reload()}>
          矩形
        </div>

      </div>
      <canvas
        onMouseMove={this.m}
        onMouseDown={this.onMouseDown1}
        onMouseUp={this.onMouseUp1}
        id="canvas" ref={this.canvasRef} width={450} height={500}/>
    </div>
  }
}

export default Canvas