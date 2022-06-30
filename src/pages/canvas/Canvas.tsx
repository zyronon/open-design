import React, {MouseEvent, RefObject} from "react";
import './index.scss'
import {clone} from 'lodash'
import getCenterPoint, {getAngle, getHypotenuse2, getRotatedPoint} from "../../utils";
import Input from "../../components/Input";

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
  hoverLeft: boolean,
  enterLeft: boolean,
  hoverLT: boolean,
  enterLT: boolean,
  hoverLTR: boolean,//左上角 旋转
  enterLTR: boolean,
  selectBox?: Box,
  startX: number,
  startY: number,
  offsetX: number,
  offsetY: number,
  sPoint: { x: number, y: number },
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
      w: 150,
      h: 150,
      rotate: 25,
      lineWidth: 2,
      type: BoxType.LINE,
      color: 'gray',
      children: []
    }
    let oneBox3 = {
      x: 226,
      y: 226,
      w: 150,
      h: 150,
      rotate: 0,
      lineWidth: 2,
      type: BoxType.LINE,
      color: 'gray',
      children: []
    }
    let oneBox2 = {
      x: 0,
      y: 250,
      w: 450,
      h: 1,
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
        this.getPath(oneBox2),
        // this.getPath(oneBox3),
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


  onMouseDown1 = (e: any) => {
    if (e.button !== 0) return;
    let {selectBox, boxList, canvasRect, hoverLeft, hoverLT, hoverLTR} = this.state
    // console.log('selectBox', selectBox)
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    let old = clone(boxList)
    let select
    if (selectBox) {
      // console.log('hoverLeft', hoverLeft)
      console.log('hoverLT', hoverLT)
      // console.log('hoverLTR', hoverLTR)
      if (hoverLT) {
        let rect = selectBox


        const center = {
          x: rect.x + (rect.w / 2),
          y: rect.y + (rect.h / 2)
        }
        let a = getRotatedPoint({x: rect.x, y: rect.y}, center, rect.rotate)
        console.log('a', a)
        const sPoint = {
          x: center.x + Math.abs(a.x - center.x) * (a.x < center.x ? 1 : -1),
          y: center.y + Math.abs(a.y - center.y) * (a.y < center.y ? 1 : -1)
        }
        this.setState({sPoint})
      }

      if (hoverLeft || hoverLT) {
        this.setState({
          startX: x,
          startY: y,
          enterLeft: hoverLeft,
          enterLT: hoverLT,
          offsetX: x - selectBox.x,
          offsetY: y - selectBox.y
        })
        return
      }
      if (hoverLTR) {
        this.setState({
          startX: selectBox.x,
          startY: selectBox.y,
          enterLTR: true,
          offsetX: x - selectBox.x,
          offsetY: y - selectBox.y
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
      enterLeft: false,
      enterLT: false,
      enterLTR: false,
      hoverLeft: false,
      hoverLT: false,
      hoverLTR: false
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
      isIn = true
    } else {
      this.draw2()
      isIn = false
    }

    if (isSelect) {
      let edge = 10
      let angle = 7
      let rotate = 27
      if ((box.leftX! - edge < x && x < box.leftX! + edge) &&
        (box.topY! + edge < y && y < box.bottomY! - edge)
      ) {
        // this.setState({hoverLeft: true})
        // this.body.style.cursor = "col-resize"
      } else if ((box.leftX! - angle < x && x < box.leftX! + angle) &&
        (box.topY! - angle < y && y < box.topY! + angle)
      ) {
        this.setState({hoverLT: true})
        this.body.style.cursor = "nwse-resize"
      } else if ((box.leftX! - rotate < x && x < box.leftX! - angle) &&
        (box.topY! - rotate < y && y < box.topY! - angle)
      ) {
        // this.setState({hoverLTR: true})
        // this.body.style.cursor = "pointer"
      } else {
        this.setState({
          hoverLT: false,
          hoverLeft: false,
          hoverLTR: false,
        })
        // console.log(2)
        this.body.style.cursor = "default"
      }
    }
    return isIn
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

  m = (e: MouseEvent) => {
    let {
      canvasRect,
      enter,
      offsetX,
      offsetY,
      enterLeft,
      enterLT,
      enterLTR,
      selectBox,
      startX,
      startY,
      boxList,
      sPoint
    } = this.state
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    //旋转状态下，参考
    //https://github.com/shenhudong/snapping-demo/wiki/corner-handle
    //https://segmentfault.com/a/1190000016152833
    if (enterLT) {
      // console.log('enterLT', offsetY)
      if (!selectBox) return;

      let old = clone(boxList)
      let rIndex = old.findIndex(v => v.id === selectBox?.id)
      if (rIndex !== -1) {
        let now = old[rIndex]
        let s = selectBox

        let currentPosition = {x: x, y: y}
        let newCenterPoint = getCenterPoint(currentPosition, sPoint)
        let newTopLeftPoint = getRotatedPoint(currentPosition, newCenterPoint, -s.rotate)
        let newBottomRightPoint = getRotatedPoint(sPoint, newCenterPoint, -s.rotate)

        let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
        let newHeight = newBottomRightPoint.y - newTopLeftPoint.y

        now.x = newTopLeftPoint.x
        now.y = newTopLeftPoint.y
        now.w = newWidth
        now.h = newHeight

        now = this.getPath(now)
      }
      this.setState({boxList: old}, this.draw2)
      return;
    }
    //不旋转情况下能伸缩的
    // if (enterLT) {
    //   console.log('enterLT')
    //   if (!selectBox) return;
    //
    //   let dx = x - startX
    //   let dy = y - startY
    //   let old = clone(boxList)
    //   let rIndex = old.findIndex(v => v.id === selectBox?.id)
    //   if (rIndex !== -1) {
    //     let now = old[rIndex]
    //     now.x = x - offsetX
    //     now.y = y
    //     now.w = selectBox.w - (x - startX)
    //     now.h = selectBox.h - (y - startY)
    //     now = this.getPath(now)
    //   }
    //   this.setState({boxList: old}, this.draw2)
    //   return;
    // }
    if (enterLTR) {
      console.log('enterLTR')
      if (!selectBox) return;

      // console.log('x-------', x, '          y--------', y)
      let a = getAngle([selectBox.x + selectBox.w / 2, selectBox.y + selectBox.h / 2],
        [startX, startY],
        [x, y]
      )
      console.log('getAngle', a)
      // return;

      let old = clone(boxList)
      let rIndex = old.findIndex(v => v.id === selectBox?.id)
      if (rIndex !== -1) {
        let now = old[rIndex]
        now.rotate = a
      }

      this.setState({boxList: old}, this.draw2)
      return;
    }
    if (enterLeft) {
      console.log('enterLeft')
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
    return <div className={'design'}>
      <div className="header">

      </div>
      <div className="content">
        <div className="left">

        </div>
        <div className="wrapper">
          <div className="tool-bar">

          </div>
          <canvas
            onMouseMove={this.m}
            onMouseDown={this.onMouseDown1}
            onMouseUp={this.onMouseUp1}
            id="canvas" ref={this.canvasRef} width={450} height={500}/>
        </div>
        <div className="right">
          <div className="config-wrapper">
            <div className="base-info">
              <div className="row">
                <Input></Input>
                <Input></Input>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='components'>
        <div className="component" onClick={() => location.reload()}>
          矩形
        </div>

      </div>

    </div>
  }
}

export default Canvas