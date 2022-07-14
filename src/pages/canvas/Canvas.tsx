import React, { MouseEvent, RefObject } from "react";
import './index.scss'
import { clone, debounce, throttle } from 'lodash'
import getCenterPoint, { getAngle, getHypotenuse2, getRotatedPoint } from "../../utils";
import BaseInput from "../../components/BaseInput";
import { Down, FiveFive, FullScreen, Unlock } from "@icon-park/react";
import BaseIcon from "../../components/BaseIcon";
import { Col, Row } from "antd";
import BaseButton from "../../components/BaseButton";
import FlipIcon from "../../assets/icon/FlipIcon";
import RotateIcon from "../../assets/icon/RotateIcon";
import AngleIcon from "../../assets/icon/AngleIcon";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { withRouter } from "../../components/WithRouter";
import cx from "classnames";
import { mat4 } from 'gl-matrix'

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
  children: Box[],
  flipVertical?: boolean,
  flipHorizontal?: boolean,
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
  hoverRT: boolean,
  enterRT: boolean,
  hoverLTR: boolean,//左上角 旋转
  enterLTR: boolean,
  selectBox?: Box,
  startX: number,
  startY: number,
  offsetX: number,
  offsetY: number,
  handMove: {
    x: number,
    y: number,
  },
  oldHandMove: {
    x: number,
    y: number,
  },
  currentPoint: {
    x: number,
    y: number,
  },
  handScale: number,
  oldHandScale: number,
  sPoint: { x: number, y: number },
  activeHand: boolean,
  fpsTimer: any,
  fps: number,
  currentMat: any
}

const out = new Float32Array([
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
]);

class Canvas extends React.Component<any, IState> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef()
  // @ts-ignore
  body: HTMLElement = document.querySelector("body")

  state = {
    currentPoint: { x: 0, y: 0, },
    handMove: { x: 0, y: 0, },
    oldHandMove: { x: 0, y: 0, },
    handScale: 1,
    activeHand: false,
    currentMat: new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  } as IState

  constructor(props: any) {
    super(props);
    // console.log(this.props)
  }

  componentDidMount() {
    // console.log('componentDidMount', this.state.fpsTimer)
    let canvas: HTMLCanvasElement = this.canvasRef.current!
    let canvasRect = canvas.getBoundingClientRect()
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let { width, height } = canvasRect
    if (window.devicePixelRatio) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.height = height * window.devicePixelRatio;
      canvas.width = width * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    this.setState({
      canvas,
      ctx,
      canvasRect
    }, this.init)
    this.getFps()
  }

  getFps() {
    let lastTime = performance.now()
    let frame = 0
    let lastFameTime = performance.now()
    const loop = () => {
      let now = performance.now()
      let fs = (now - lastFameTime)
      lastFameTime = now
      let fps = Math.round(1000 / fs)
      frame++
      if (now > 1000 + lastTime) {
        fps = Math.round((frame * 1000) / (now - lastTime))
        this.setState({ fps })
        frame = 0
        lastTime = now
      }
      let time = window.requestAnimationFrame(loop)
      this.setState({ fpsTimer: time })
    }
    loop()
  }

  componentWillUnmount() {
    // console.log('componentWillUnmount')
    cancelAnimationFrame(this.state.fpsTimer)
  }

  init() {
    let allLine = {
      id: 'allLine',
      x: 0,
      y: 0,
      w: this.state.canvas.width,
      h: this.state.canvas.height,
      rotate: 0,
      lineWidth: 1,
      type: BoxType.LINE,
      color: 'black',
      children: []
    }
    let oneBox = {
      name: 'oneBox',
      x: 50,
      y: 50,
      w: 350,
      h: 100,
      rotate: 5,
      lineWidth: 2,
      flipHorizontal: true,
      type: BoxType.LINE,
      color: 'gray',
      children: []
    }
    let oneBox3 = {
      id: 'Date.now()',
      name: 'oneBox3',
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
      selectBox: undefined,
      currentPoint: { x: 0, y: 0, },
      handMove: { x: -174.03750610351562, y: -174.03750610351562, },
      oldHandMove: { x: 0, y: 0, },
      handScale: 1.4641001224517822,
      activeHand: false,
      currentMat: new Float32Array([
        1.4641001224517822, 0, 0, 0,
        0, 1.4641001224517822, 0, 0,
        0, 0, 1, 0,
        -174.03750610351562, -174.03750610351562, 0, 1
      ]),
      boxList: [
        // this.getPath(oneBox),
        // this.getPath(oneBox2),
        // this.getPath(allLine),
        this.getPath(oneBox3),
        // this.getPath(threeBox),
      ]
    }, this.draw2)
  }

  draw2() {
    this.clearAll()
    const { ctx, currentMat, handMove } = this.state
    ctx.save()
    if (currentMat) {
      // console.log('平移：', currentMat[12], currentMat[13])
      // console.log('缩放：', currentMat[0], currentMat[5])
      let nv = currentMat
      // console.log(nv)
      ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13]);
      // ctx.translate(currentMat[12], currentMat[13])
      // ctx.scale(currentMat[0], currentMat[5])
    }
    // ctx.translate(handMove.x, handMove.y)

    this.state.ctx.lineCap = 'square'
    // console.log('this.state.boxList', this.state.boxList)
    this.state.boxList.map(v => {
      // console.log(v)
      this.renderCanvas(v)
    })
    ctx.restore()
  }

  renderCanvas(box: Box, parent?: Box) {
    let {
      ctx, enterLT, selectBox, activeHand, enter, offsetX, offsetY,
      handMove, handScale,
      currentPoint
    } = this.state
    // console.log('renderCanvas', enterLT)
    ctx.save()
    let { x, y, w, h, color, rotate, lineWidth, type, flipVertical, flipHorizontal }
      = parent ? parent : box
    if (parent) {
      type = box.type

      let outside = .5
      x = x - outside
      y = y - outside
      w = w + 2 * outside
      h = h + 2 * outside
    }

    let oldCenter: { x: number; y: number; }
    let newCenter: { x: number; y: number; }
    if (enterLT && selectBox) {
      let s = selectBox
      oldCenter = {
        x: s.x + (s.w / 2),
        y: s.y + (s.h / 2)
      }
      newCenter = {
        x: x + (w / 2),
        y: y + (h / 2)
      }
      // console.log('oldCenter', oldCenter)
      // console.log('newCenter', newCenter)
    }

    ctx.lineWidth = lineWidth
    // let tranX = 0
    // let tranY = 0
    let tranX = 0
    let tranY = 0
    let scaleX = 1
    let scaleY = 1
    if (rotate) {
      tranX = x + w / 2
      tranY = y + h / 2
      x = -w / 2
      y = -h / 2
    }

    ctx.translate(tranX, tranY)
    ctx.scale(scaleX, scaleY)
    ctx.rotate(rotate * Math.PI / 180)

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
    let { ctx } = this.state
    ctx.lineWidth = rect.lineWidth
    let { x, y, w, h } = rect
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

  flip(type: number) {
    const { selectBox, boxList } = this.state
    if (selectBox?.id) {
      let rIndex = boxList.findIndex(v => v.id === selectBox.id)
      if (rIndex !== -1) {
        if (type === 0) {
          boxList[rIndex].flipHorizontal = !boxList[rIndex].flipHorizontal
        } else {
          boxList[rIndex].flipVertical = !boxList[rIndex].flipVertical
        }
        this.setState({ boxList: clone(boxList), selectBox: clone(boxList[rIndex]) }, this.draw2)
      }
    }
  }

  onMouseDown = (e: any) => {
    if (e.button !== 0) return;
    let {
      selectBox, boxList, canvasRect,
      hoverLeft, hoverLT, hoverRT, hoverLTR, activeHand,
      handMove,
    } = this.state
    // console.log('selectBox', selectBox)
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    if (activeHand) {
      this.setState({
        startX: x,
        startY: y,
        enter: true,
        oldHandMove: clone(handMove)
      })
      return;
    }

    let old = clone(boxList)
    let select
    if (selectBox) {
      // console.log('hoverLeft', hoverLeft)
      // console.log('hoverLT', hoverLT)
      // console.log('hoverRT', hoverRT)
      // console.log('hoverLTR', hoverLTR)
      let rect = selectBox

      if (hoverLT) {

        const center = {
          x: rect.x + (rect.w / 2),
          y: rect.y + (rect.h / 2)
        }
        //不是当前点击位置，当前点击位置算对角会有偏差
        let rectLT = getRotatedPoint({ x: rect.x, y: rect.y }, center, rect.rotate)
        console.log('rect', clone(rect))
        console.log('rectLT', clone(rectLT))
        if (rect.flipHorizontal) {
          // rectLT.x = center.x + Math.abs(rectLT.x - center.x) * (rectLT.x < center.x ? 1 : -1)
        }
        if (rect.flipVertical) {
          rectLT.y = center.y + Math.abs(rectLT.y - center.y) * (rectLT.y < center.y ? 1 : -1)
        }
        console.log('rectLT', rectLT)

        const sPoint = {
          x: center.x + Math.abs(rectLT.x - center.x) * (rectLT.x < center.x ? 1 : -1),
          y: center.y + Math.abs(rectLT.y - center.y) * (rectLT.y < center.y ? 1 : -1)
        }
        console.log('sPoint', sPoint)
        this.setState({ sPoint })
      }

      if (hoverRT) {
        const center = {
          x: rect.x + (rect.w / 2),
          y: rect.y + (rect.h / 2)
        }
        //不是当前点击位置，当前点击位置算对角会有偏差
        let rectRT = getRotatedPoint({ x: rect.rightX, y: rect.topY }, center, rect.rotate)
        console.log('rect', clone(rect))
        console.log('rectRT', clone(rectRT))
        if (rect.flipHorizontal) {
          // rectRT.x = center.x + Math.abs(rectRT.x - center.x) * (rectRT.x < center.x ? 1 : -1)
        }
        if (rect.flipVertical) {
          rectRT.y = center.y + Math.abs(rectRT.y - center.y) * (rectRT.y < center.y ? 1 : -1)
        }
        console.log('rectRT', rectRT)

        const sPoint = {
          x: center.x + Math.abs(rectRT.x - center.x) * (rectRT.x < center.x ? 1 : -1),
          y: center.y + Math.abs(rectRT.y - center.y) * (rectRT.y < center.y ? 1 : -1)
        }
        console.log('sPoint', sPoint)
        this.setState({ sPoint })
      }

      if (hoverLeft || hoverLT || hoverRT) {
        this.setState({
          startX: x,
          startY: y,
          enterLeft: hoverLeft,
          enterLT: hoverLT,
          enterRT: hoverRT,
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
      // console.log('selectBox-in', r)
      if (!r) {
        let rIndex = old.findIndex(o => o.id === selectBox!.id)
        // console.log('rIndex', rIndex)
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
        // console.log('in', r)
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
          // console.log('select', select)
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

  onMouseUp = (e: any) => {
    let { hoverLeft, selectBox, boxList, canvasRect, enterLT, startX, startY } = this.state
    if (selectBox) {
      let old = clone(boxList)
      let rIndex = boxList.findIndex(v => v.id === selectBox?.id)
      if (rIndex !== -1) {
        let current = old[rIndex]
        let x = e.clientX - canvasRect.left
        let y = e.clientY - canvasRect.top
        let currentPosition = { x: x, y: y }
        let center = {
          x: current.x + (current.w / 2),
          y: current.y + (current.h / 2)
        }
        //算出视觉上，当前鼠标点水平翻转之后的坐标
        currentPosition.x -= current.w
        // currentPosition.y -= current.h
        if (current.flipHorizontal && enterLT) {
          let s = selectBox
          let oldCenter = {
            x: s.x + (s.w / 2),
            y: s.y + (s.h / 2)
          }
          let oldPoint = { x: selectBox.x, y: selectBox.y }
          let flipHorizontalOldPoint = getRotatedPoint(oldPoint, oldCenter, current.rotate)
          flipHorizontalOldPoint.x = oldCenter.x + Math.abs(flipHorizontalOldPoint.x - oldCenter.x) * (flipHorizontalOldPoint.x < oldCenter.x ? 1 : -1)

          // console.log('startX', startX)
          // console.log('flipHorizontalOldPoint.x', flipHorizontalOldPoint.x)
          //这里把rect的x坐标，加上偏移量，因为draw的时候临时平移了中心点，不重新设定x坐标，会回弹
          //不能直接用x-startX，因为startX是鼠标点击位置，会有一丁点偏移，导致rect重绘时小抖动
          //取rect的x,y，然后旋转，再翻转，得到startX。
          old[rIndex].x = old[rIndex].x + (x - flipHorizontalOldPoint.x)
          old[rIndex] = this.getPath(old[rIndex])
          // old[rIndex].y = old[rIndex].y + (y - startY)
        }
        this.setState({ selectBox: clone(boxList[rIndex]), boxList: old })
      }
    }
    this.setState({
      enter: false,
      enterLeft: false,
      enterLT: false,
      enterLTR: false,
      enterRT: false,
      hoverLeft: false,
      hoverLT: false,
      hoverRT: false,
      hoverLTR: false
    })
    this.body.style.cursor = "default"
    // console.log('onMouseUp')
  }

  isPointInPath(x: number, y: number, rect: Box) {
    const { handMove } = this.state
    const { x: handX, y: handY } = handMove
    console.log('old', x, y)
    //减去画布平移的距离
    x -= handX
    y -= handY
    console.log('new ', x, y)
    console.log('rect.leftX',rect.leftX)
    // console.log('rect.x', rect.x, 'rect.y', rect.y)
    if (rect.rotate !== 0) {
      let { w, h, rotate, flipHorizontal, flipVertical } = rect
      const center = {
        x: rect.x + (rect.w / 2),
        y: rect.y + (rect.h / 2)
      }
      if (flipHorizontal) {
        x = center.x + Math.abs(x - center.x) * (x < center.x ? 1 : -1)
      }
      if (flipVertical) {
        y = center.y + Math.abs(y - center.y) * (y < center.y ? 1 : -1)
      }
      let p1 = { x, y }
      let c2 = { x: rect.x + w / 2, y: rect.y + h / 2 }
      let s2 = getRotatedPoint(p1, c2, -rotate)
      x = s2.x
      y = s2.y
    }

    let isIn = false
    let isSelect = rect.children.find(v => v.type === BoxType.SELECT)
    //判断是否在矩形里面
    if (rect.leftX! < x && x < rect.rightX! && rect.topY! < y && y < rect.bottomY!) {
      if (!isSelect) {
        // console.log('在里面')
        //这里要加一个判断，如果有一个在里面了，后面就不需要再去判断了，
        // 否则后面判断时会走到else逻辑里面，给清除掉
        let d = .5
        let t = clone(rect)
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
      if ((rect.leftX! - edge < x && x < rect.leftX! + edge) &&
        (rect.topY! + edge < y && y < rect.bottomY! - edge)
      ) {
        // this.setState({hoverLeft: true})
        // this.body.style.cursor = "col-resize"
      } else if ((rect.leftX! - angle < x && x < rect.leftX! + angle) &&
        (rect.topY! - angle < y && y < rect.topY! + angle)
      ) {
        this.setState({ hoverLT: true })
        this.body.style.cursor = "nwse-resize"
      } else if ((rect.leftX! - rotate < x && x < rect.leftX! - angle) &&
        (rect.topY! - rotate < y && y < rect.topY! - angle)
      ) {
        // this.setState({hoverLTR: true})
        // this.body.style.cursor = "pointer"
      } else if ((rect.rightX! - angle < x && x < rect.rightX! + angle) &&
        (rect.topY! - angle < y && y < rect.topY! + angle)
      ) {
        this.setState({ hoverRT: true })
        this.body.style.cursor = "nwse-resize"
      } else {
        this.setState({
          hoverLT: false,
          hoverLeft: false,
          hoverLTR: false,
          hoverRT: false,
        })
        // console.log(2)
        this.body.style.cursor = "default"
      }
    }
    return isIn
  }

  onMouseMove = (e: MouseEvent) => {
    // console.log('onMouseMove')
    let {
      canvasRect,
      enter,
      offsetX,
      offsetY,
      enterLeft,
      enterLT,
      enterRT,
      enterLTR,
      selectBox,
      startX,
      startY,
      boxList,
      sPoint,
      activeHand,
      handMove,
      oldHandMove,
      currentMat
    } = this.state
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    if (activeHand && enter) {
      const transform = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        // x - startX, y - startY, 0, 1,
        //因为transform是连续的，所以用当前偏移量，而不是从x-startX
        e.movementX, e.movementY, 0, 1,
      ]);
      const newCurrentMat = mat4.multiply(out, transform, currentMat);
      // console.log(newCurrentMat)
      this.setState({
        currentMat: newCurrentMat,
        handMove: {
          x: newCurrentMat[12],
          y: newCurrentMat[13],
        }
      }, this.draw2)
      return;
    }

    //旋转状态下，参考
    //https://github.com/shenhudong/snapping-demo/wiki/corner-handle
    //https://segmentfault.com/a/1190000016152833
    if (enterLT) {
      console.log('enterLT')
      if (!selectBox) return;

      let old = clone(boxList)
      let rIndex = old.findIndex(v => v.id === selectBox?.id)
      if (rIndex !== -1) {
        let rect = old[rIndex]
        let s = selectBox

        let currentPosition = { x: x, y: y }
        const center = {
          x: s.x + (s.w / 2),
          y: s.y + (s.h / 2)
        }
        //水平翻转，那么要把当前的x坐标一下翻转
        //同时，draw的时候，需要把新rect的中心点和平移（选中时rect的中心点）的2倍
        if (rect.flipHorizontal) {
          currentPosition.x = center.x + Math.abs(currentPosition.x - center.x) * (currentPosition.x < center.x ? 1 : -1)
          // console.log('currentPosition', currentPosition)
        }

        let newCenterPoint = getCenterPoint(currentPosition, sPoint)
        let newTopLeftPoint = getRotatedPoint(currentPosition, newCenterPoint, -s.rotate)
        let newBottomRightPoint = getRotatedPoint(sPoint, newCenterPoint, -s.rotate)

        let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
        let newHeight = newBottomRightPoint.y - newTopLeftPoint.y

        rect.x = newTopLeftPoint.x
        rect.y = newTopLeftPoint.y
        rect.w = newWidth
        rect.h = newHeight
        // console.log(rect)

        rect = this.getPath(rect)
      }
      this.setState({ boxList: old }, this.draw2)
      return;
    }

    if (enterRT) {
      console.log('enterRT')
      if (!selectBox) return;

      let old = clone(boxList)
      let rIndex = old.findIndex(v => v.id === selectBox?.id)
      if (rIndex !== -1) {
        let rect = old[rIndex]
        let s = selectBox

        let currentPosition = { x: x, y: y }
        let newCenterPoint = getCenterPoint(currentPosition, sPoint)
        let newTopRightPoint = getRotatedPoint(currentPosition, newCenterPoint, -s.rotate)
        let newBottomLeftPoint = getRotatedPoint(sPoint, newCenterPoint, -s.rotate)

        let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
        let newHeight = newBottomLeftPoint.y - newTopRightPoint.y

        rect.x = newBottomLeftPoint.x
        rect.y = newTopRightPoint.y
        rect.w = newWidth
        rect.h = newHeight
        // console.log(rect)

        rect = this.getPath(rect)
      }
      this.setState({ boxList: old }, this.draw2)
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

      this.setState({ boxList: old }, this.draw2)
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
      this.setState({ boxList: old }, this.draw2)
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
      this.setState({ boxList: old }, this.draw2)
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

  onMouseMoveThrottle = throttle(this.onMouseMove, 0)
  onMouseMoveWrapper = (e: MouseEvent) => {
    this.onMouseMoveThrottle(e)
  }

  onWheel = (e: any) => {
    let { clientX, clientY, deltaY } = e;
    let { canvasRect, currentMat } = this.state

    let x = clientX - canvasRect.left
    let y = clientY - canvasRect.top

    const zoom = 1 + (deltaY < 0 ? 0.1 : -0.1);
    //因为transform是连续变换，每次都是放大0.1倍，所以要让x和y变成0.1倍。这样缩放和平移是对等的
    //QA：其实要平移的值，也可以直接用x，y剩以当前的总倍数，比如放在1.7倍，那么x*0.7，就是要平移的x坐标
    //但是下次再缩放时，要加或减去上次平移的xy坐标
    x = x * (1 - zoom);
    y = y * (1 - zoom);
    const transform = new Float32Array([
      zoom, 0, 0, 0,
      0, zoom, 0, 0,
      0, 0, 1, 0,
      x, y, 0, 1,
    ]);
    const newCurrentMat = mat4.multiply(out, transform, currentMat);
    this.setState({
      currentMat: newCurrentMat,
      handScale: newCurrentMat[0],
      handMove: {
        x: newCurrentMat[12],
        y: newCurrentMat[13],
      }
    }, this.draw2)
  }

  render() {
    const { activeHand } = this.state
    return <div className={'design'}>
      <div className="header">
        <div className={'fps'}>
          FPS:{this.state.fps}
        </div>
      </div>
      <div className="content">
        <div className="left">
          <div className='components'>
            {/*<div className="component" onClick={() => location.reload()}>*/}
            <div className="component" onClick={() => this.init()}>
              刷新
            </div>
            <div className="component" onClick={() => this.props.navigate('/test')}>
              去test
            </div>
          </div>
        </div>
        <div className="canvas-wrapper">
          <div className="tool-bar">
            <div className={cx('tool', activeHand && 'active')}
                 onClick={() => this.setState({ activeHand: !activeHand })}>
              <FiveFive theme="outline" size="20" fill="#ffffff"/>
            </div>
            <div className="tool">
              <FiveFive theme="outline" size="20" fill="#ffffff"/>
              <Down theme="outline" size="14" fill="#ffffff" className='arrow'/>
            </div>
          </div>
          <div id="canvasArea">
            <canvas
              onMouseMove={this.onMouseMoveWrapper}
              onMouseDown={this.onMouseDown}
              onMouseUp={this.onMouseUp}
              onWheel={this.onWheel}
              id="canvas" ref={this.canvasRef}/>
          </div>
        </div>
        <div className="right">
          <div className="config-wrapper">
            <div className="base-info">
              <div className="row">
                <div className="col">
                  <BaseInput prefix={<span className={'gray'}>X</span>}/>
                </div>
                <div className="col">
                  <BaseInput prefix={<span className={'gray'}>Y</span>}/>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <BaseInput prefix={<span className={'gray'}>W</span>}/>
                </div>
                <div className="col">
                  <BaseInput prefix={<span className={'gray'}>H</span>}/>
                </div>
                <div className="col">
                  <BaseIcon active={false}>
                    <Unlock theme="outline" size="16" fill="#929596"/>
                  </BaseIcon>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <BaseInput prefix={<RotateIcon style={{ fontSize: "16rem" }}/>}/>
                </div>
                <div className="col">
                  <BaseButton onClick={() => this.flip(0)}>
                    <FlipIcon style={{ fontSize: "16rem", 'transform': 'rotate(-90deg)' }}/>
                  </BaseButton>
                  <BaseButton onClick={() => this.flip(1)}>
                    <FlipIcon style={{ fontSize: "16rem", 'transform': 'rotate(0deg)' }}/>
                  </BaseButton>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <BaseInput prefix={<AngleIcon style={{ fontSize: "16rem" }}/>}/>
                </div>
                <div className="col">
                </div>
                <div className="col">
                  <BaseIcon active={false}>
                    <FullScreen theme="outline" size="16" fill="#929596"/>
                  </BaseIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

export default withRouter(Canvas)