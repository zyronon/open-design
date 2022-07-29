import React, { MouseEvent, RefObject } from "react";
import './index.scss'
import { assign, clone, cloneDeep, throttle } from 'lodash'
import getCenterPoint, { getAngle, getRotatedPoint } from "../../utils";
import BaseInput from "../../components/BaseInput";
import {
  AlignTextLeft,
  AutoHeightOne,
  AutoLineWidth,
  AutoWidthOne,
  Down,
  FullScreen,
  More,
  PreviewClose,
  RowHeight,
  Square,
  Unlock,
} from "@icon-park/react";
import BaseIcon from "../../components/BaseIcon";
import BaseButton from "../../components/BaseButton";
import FlipIcon from "../../assets/icon/FlipIcon";
import RotateIcon from "../../assets/icon/RotateIcon";
import AngleIcon from "../../assets/icon/AngleIcon";
import { withRouter } from "../../components/WithRouter";
import cx from "classnames";
import { mat4 } from 'gl-matrix'
import Fps from "../../components/Fps";
import { BaseOption, BaseSelect } from "../../components/BaseSelect";
import { Colors, fontFamilies, fontSize, fontWeight, rects } from "./constant";
import { FontFamily, FontWeight, IState, Rect, RectColorType, RectType, TextAlign, TextMode } from "./type";
import { BaseRadio, BaseRadioGroup } from "../../components/BaseRadio";
import BaseSlotButton from "../../components/BaseSlotButton";
import BasePicker from "../../components/BasePicker"
import Icon from '@icon-park/react/es/all';
import { clearRect, pushRect, removeRect, store } from "./store";
import { clearAll, getPath, renderCanvas, renderRound } from "./utils";

const images = new Map()

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
    oldHandMove: { x: 0, y: 0, },
    activeHand: false,
    handMove: { x: 0, y: 0, },
    handScale: 1,
    currentMat: new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]),
    showPicker: false,
    rectColor: null,
    rectColorType: null,
  } as IState


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
  }

  componentWillUnmount() {
    // console.log('componentWillUnmount')
  }

  init() {
    clearRect()
    rects.map((rect: any) => {
      pushRect(getPath(rect))
    })
    this.setState({
      selectRect: undefined,
      currentPoint: { x: 0, y: 0, },
      oldHandMove: { x: 0, y: 0, },
      activeHand: false,
      // handMove: { x: -174.03750610351562, y: -174.03750610351562, },
      // handScale: 1.4641001224517822,
      // currentMat: new Float32Array([
      //   1.4641001224517822, 0, 0, 0,
      //   0, 1.4641001224517822, 0, 0,
      //   0, 0, 1, 0,
      //   -174.03750610351562, -174.03750610351562, 0, 1
      // ]),
      handMove: { x: 0, y: 0, },
      handScale: 1,
      currentMat: new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]),
      showPicker: false,
      usePencil: true,
      enterPencil: false,
      usePen: false,
      enterPen: false,
      isEdit: false,
      rectColor: null,
      rectColorType: null,
      rectList: []
    }, this.draw)
  }

  draw() {
    // console.log('draw')
    clearAll(this.state)
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
    store.rectList.map((v: Rect) => {
      // console.log(v)
      renderCanvas(v, this.state)
    })
    ctx.restore()
  }

  flip(type: number) {
    const { selectRect, rectList } = this.state
    if (selectRect?.id) {
      let rIndex = rectList.findIndex(v => v.id === selectRect.id)
      if (rIndex !== -1) {
        if (type === 0) {
          rectList[rIndex].flipHorizontal = !rectList[rIndex].flipHorizontal
        } else {
          rectList[rIndex].flipVertical = !rectList[rIndex].flipVertical
        }
        this.setState({ rectList: clone(rectList), selectRect: clone(rectList[rIndex]) }, this.draw)
      }
    }
  }

  changeSelect = (val: any) => {
    const { rectList, selectRect } = this.state
    let old = cloneDeep(rectList)
    let rIndex = old.findIndex(item => item.id === selectRect?.id)
    if (rIndex > -1) {
      assign(old[rIndex], val)
      old[rIndex] = getPath(old[rIndex])
      this.setState({ rectList: old }, this.draw)
    }
  }

  getSelect = () => {
    const { selectRect } = this.state
    let rIndex = store.rectList?.findIndex(item => item.id === selectRect?.id)
    if (rIndex > -1) return store.rectList[rIndex]
    return {}
  }

  onDbClick = (e: any) => {
    let {
      selectRect, rectList, canvasRect, ctx
    } = this.state
    let x = e.clientX
    let y = e.clientY
    console.log('e', x, y)
    console.log('onDoubleClick', selectRect)

    if (selectRect?.type === RectType.TEXT) {
      ctx.save()
      let current = this.getSelect()
      let input = document.createElement('textarea')
      input.id = 'text-input'
      input.classList.add('canvas-text-input')
      input.style.top = selectRect.y + canvasRect.top + 150 + 'px'
      input.style.left = selectRect.x + canvasRect.left + 'px'
      input.style.fontSize = '20rem'
      // @ts-ignore
      input.value = current.texts!.join('\n')
      document.body.append(input)
      input.focus()
      input.oninput = (val: any) => {
        let newValue = val.target.value
        console.log('newValue', newValue)
        let texts = newValue.split('\n')
        this.calcText(texts)
      }
      ctx.restore()
    }

    this.setState({
      enter: false,
    })
  }

  onMouseDown = (e: any) => {
    let textInput = document.querySelector('#text-input')
    if (textInput) {
      textInput.remove()
    }
    if (e.button !== 0) return;
    let {
      selectRect, rectList, canvasRect,
      hoverLeft, hoverLT, hoverRT, hoverLTR, activeHand,
      handMove, usePencil, usePen, isEdit,
      ctx
    } = this.state
    // console.log('selectBox', selectBox)
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    if (activeHand || usePencil || usePen) {
      this.setState({
        startX: x,
        startY: y,
        enter: true,
        oldHandMove: clone(handMove)
      })
      if (usePencil) {
        ctx.moveTo(x, y)
        let newPencil: Rect = {
          borderColor: Colors.line,
          fillColor: "black",
          fontSize: 0,
          texts: [],
          x: 326,
          y: 326,
          w: 150,
          h: 150,
          rotate: 0,
          lineWidth: 2,
          type: RectType.PENCIL,
          radius: 0,
          points: [{ x, y }],
          children: [],
          name: 'PENCIL',
        }
        newPencil = getPath(newPencil)
        pushRect(newPencil)
        this.setState({
          enterPencil: true,
          selectRect: newPencil
        })
      }
      if (usePen) {
        ctx.moveTo(x, y)
        if (isEdit) {
          let select = this.getSelect()
          select.points.push({ x, y })
          this.draw()
        } else {
          let newPen: Rect = {
            borderColor: Colors.line,
            fillColor: "black",
            fontSize: 0,
            texts: [],
            x: 326,
            y: 326,
            w: 150,
            h: 150,
            rotate: 0,
            lineWidth: 2,
            type: RectType.PEN,
            radius: 0,
            points: [{ x, y }],
            children: [],
            name: 'PEN',
          }
          newPen = getPath(newPen)
          pushRect(newPen)
          this.setState({
            enterPen: true,
            isEdit: true,
            selectRect: newPen
          }, this.draw)
        }
      }
      return;
    }

    let old = clone(rectList)
    let select
    if (selectRect) {
      // console.log('hoverLeft', hoverLeft)
      // console.log('hoverLT', hoverLT)
      // console.log('hoverRT', hoverRT)
      // console.log('hoverLTR', hoverLTR)
      let rect = selectRect

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
          offsetX: x - selectRect.x,
          offsetY: y - selectRect.y
        })
        return
      }
      if (hoverLTR) {
        this.setState({
          startX: selectRect.x,
          startY: selectRect.y,
          enterLTR: true,
          offsetX: x - selectRect.x,
          offsetY: y - selectRect.y
        })
        return
      }
      let r = this.isPointInPath(x, y, selectRect)
      // console.log('selectBox-in', r)
      if (!r) {
        let rIndex = old.findIndex(o => o.id === selectRect!.id)
        // console.log('rIndex', rIndex)
        if (rIndex !== -1) {
          let selectIndex = old[rIndex].children.findIndex(w => w.type === RectType.SELECT)
          if (selectIndex !== -1) {
            old[rIndex].children.splice(selectIndex, 1)
          }
        }
      } else {
        select = selectRect
      }
    } else {
      for (let i = 0; i < rectList.length; i++) {
        let b = rectList[i]
        let r = this.isPointInPath(x, y, b)
        // console.log('in', r)
        if (r) {
          let now = old[i]
          let t = clone(now)
          t.id = Date.now()
          t.lineWidth = 2
          t.type = RectType.SELECT
          t.children = []
          let cIndex = now.children.findIndex(v => v.type === RectType.SELECT)
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
          let selectIndex = old[i].children.findIndex(w => w.type === RectType.SELECT)
          if (selectIndex !== -1) {
            old[i].children.splice(selectIndex, 1)
          }
        }
      }
    }
    this.setState({
      rectList: old,
      selectRect: clone(select),
      startX: x,
      enter: true,
      startY: y,
    }, this.draw)
    console.log('onMouseDown')
  }

  onMouseUp = (e: any) => {
    let {
      hoverLeft,
      selectRect,
      rectList,
      canvasRect,
      enterLT,
      enterRT,
      startX,
      startY,
      handMove,
      handScale,
      usePencil,
      ctx
    } = this.state
    if (selectRect) {
      let old = clone(rectList)
      let rIndex = rectList.findIndex(v => v.id === selectRect?.id)
      if (rIndex !== -1) {
        let current = old[rIndex]
        let x = e.clientX - canvasRect.left
        let y = e.clientY - canvasRect.top
        let center = {
          x: current.x + (current.w / 2),
          y: current.y + (current.h / 2)
        }
        if (current.flipHorizontal && (enterLT || enterRT)) {
          let s = selectRect
          let oldCenter = {
            x: s.x + (s.w / 2),
            y: s.y + (s.h / 2)
          }
          //这里把rect的x坐标，加上偏移量，因为draw的时候临时平移了中心点，不重新设定x坐标，会回弹
          //不能直接用x-startX，因为startX是鼠标点击位置，会有一丁点偏移，导致rect重绘时小抖动
          let d = oldCenter!.x - center!.x
          old[rIndex].x += d * 2
        }
        old[rIndex] = getPath(old[rIndex])

        this.setState({ selectRect: clone(rectList[rIndex]), rectList: old })
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
      hoverLTR: false,
      enterPencil: false,
    })

    if (e.button === 2) {
      let select: Rect = this.getSelect()
      if ((select.type === RectType.PEN || select.type === RectType.PENCIL)
        && select.points.length <= 1
      ) {
        removeRect(select)
      }
      this.setState({ isEdit: false, enterPen: false }, this.draw)
    }
    ctx.restore()
    this.body.style.cursor = "default"
    console.log('onMouseUp')
  }

  isPointInPath(x: number, y: number, rect: Rect) {
    const { handMove, handScale, ctx, currentMat } = this.state
    const { x: handX, y: handY } = handMove
    //减去画布平移的距离
    // y = y / handScale - handY / handScale
    x = (x - handX) / handScale//上面的简写
    y = (y - handY) / handScale
    if (rect.rotate !== 0 || rect.flipHorizontal) {
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
    let selectBox = rect.children.find(v => v.type === RectType.SELECT)
    //判断是否在矩形里面
    if (rect.leftX! < x && x < rect.rightX! && rect.topY! < y && y < rect.bottomY!) {
      if (!selectBox) {
        // console.log('在里面')
        //这里要加一个判断，如果有一个在里面了，后面就不需要再去判断了，
        // 否则后面判断时会走到else逻辑里面，给清除掉
        ctx.save()
        let nv = currentMat
        ctx.transform(nv[0], nv[4], nv[1], nv[5], nv[12], nv[13]);

        let d = .5
        let t = clone(rect)
        t.id = Date.now()
        t.lineWidth = 2
        t.x = t.x - d
        t.y = t.y - d
        t.w = t.w + 2 * d
        t.h = t.h + 2 * d
        // console.log(t)
        t.type = RectType.HOVER
        renderCanvas(t, this.state)
        ctx.restore()
      }
      isIn = true
    } else {
      this.draw()
      isIn = false
    }

    if (selectBox) {
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
        console.log('1', rect.flipHorizontal)
        this.setState({ hoverLT: true })

        this.body.style.cursor = "nwse-resize"
      } else if ((rect.leftX! - rotate < x && x < rect.leftX! - angle) &&
        (rect.topY! - rotate < y && y < rect.topY! - angle)
      ) {
        this.setState({ hoverLTR: true })
        this.body.style.cursor = "pointer"
      } else if ((rect.rightX! - angle < x && x < rect.rightX! + angle) &&
        (rect.topY! - angle < y && y < rect.topY! + angle)
      ) {
        console.log('3', rect.flipHorizontal)
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
      selectRect,
      canvasRect,
      enter,
      offsetX,
      offsetY,
      enterLeft,
      enterLT,
      enterRT,
      enterLTR,
      startX,
      startY,
      sPoint,
      activeHand,
      handMove,
      oldHandMove,
      currentMat,
      handScale,
      ctx,
      usePencil,
      enterPencil,
      enterPen,
      isEdit
    } = this.state
    let x = e.clientX - canvasRect.left
    let y = e.clientY - canvasRect.top

    let rectList = store.rectList

    if (isEdit) {
      if (enterPen) {
        this.draw()
        let select = this.getSelect()
        ctx.save()
        // ctx.beginPath()
        // ctx.moveTo(x, y)
        ctx.lineWidth = select.lineWidth
        ctx.strokeStyle = Colors.primary
        ctx.lineTo(x, y)
        ctx.stroke()
        renderRound({
          x: x,
          y: y,
        }, 4, ctx)
        ctx.restore()
      }
      return;
    }

    if (enterPencil) {
      let select = this.getSelect()
      ctx.lineWidth = select.lineWidth
      ctx.strokeStyle = select.borderColor
      ctx.lineTo(x, y)
      ctx.stroke()
      select.points.push({ x, y })
      // console.log('enterPencil')
      return
    }

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
      }, this.draw)
      return;
    }

    //旋转状态下，参考
    //https://github.com/shenhudong/snapping-demo/wiki/corner-handle
    //https://segmentfault.com/a/1190000016152833
    if (enterLT) {
      console.log('enterLT')
      if (!selectRect) return;

      let old = clone(rectList)
      let rIndex = old.findIndex(v => v.id === selectRect?.id)
      if (rIndex !== -1) {
        let rect = old[rIndex]
        let s = selectRect

        // let currentPosition = { x: x , y: y }
        let currentPosition = {
          x: (x - handMove.x) / handScale,
          y: (y - handMove.y) / handScale
        }
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


        if (rect.type === RectType.TEXT) {
          this.calcText(null, null, null,
            null,
            TextMode.FIXED,
            newTopLeftPoint.x,
            newTopLeftPoint.y,
            newWidth,
            newHeight)
        } else {
          rect.x = newTopLeftPoint.x
          rect.y = newTopLeftPoint.y
          rect.w = newWidth
          rect.h = newHeight
          // console.log(rect)

          rect = getPath(rect)
          this.setState({ rectList: old }, this.draw)
        }
      }
      return;
    }

    if (enterRT) {
      console.log('enterRT')
      if (!selectRect) return;

      let old = clone(rectList)
      let rIndex = old.findIndex(v => v.id === selectRect?.id)
      if (rIndex !== -1) {
        let rect = old[rIndex]
        let s = selectRect

        let currentPosition = {
          x: (x - handMove.x) / handScale,
          y: (y - handMove.y) / handScale
        }
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
        let newTopRightPoint = getRotatedPoint(currentPosition, newCenterPoint, -s.rotate)
        let newBottomLeftPoint = getRotatedPoint(sPoint, newCenterPoint, -s.rotate)

        let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
        let newHeight = newBottomLeftPoint.y - newTopRightPoint.y


        if (rect.type === RectType.TEXT) {
          this.calcText(null, null, null,
            null,
            TextMode.FIXED,
            newBottomLeftPoint.x,
            newTopRightPoint.y,
            newWidth,
            newHeight)
        } else {
          rect.x = newBottomLeftPoint.x
          rect.y = newTopRightPoint.y
          rect.w = newWidth
          rect.h = newHeight

          rect = getPath(rect)
          this.setState({ rectList: old }, this.draw)
        }
      }
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
    //     now = getPath(now)
    //   }
    //   this.setState({boxList: old}, this.draw2)
    //   return;
    // }
    if (enterLTR) {
      console.log('enterLTR')
      if (!selectRect) return;

      // console.log('x-------', x, '          y--------', y)
      let a = getAngle([selectRect.x + selectRect.w / 2, selectRect.y + selectRect.h / 2],
        [startX, startY],
        [x, y]
      )
      console.log('getAngle', a)
      // return;

      let old = clone(rectList)
      let rIndex = old.findIndex(v => v.id === selectRect?.id)
      if (rIndex !== -1) {
        let now = old[rIndex]
        now.rotate = a
      }

      this.setState({ rectList: old }, this.draw)
      return;
    }
    if (enterLeft) {
      console.log('enterLeft')
      if (!selectRect) return;

      let dx = x - startX
      let dy = y - startY
      let old = clone(rectList)
      let rIndex = old.findIndex(v => v.id === selectRect?.id)
      if (rIndex !== -1) {
        let now = old[rIndex]
        now.x = x - offsetX
        // one.y = one.y
        now.w = selectRect.w - (x - startX)
        now = getPath(now)
      }
      this.setState({ rectList: old }, this.draw)
      return;
    }
    if (enter) {
      if (!selectRect?.id) return
      // console.log('startX')
      // console.log('按下了')
      let dx = (x - startX) / handScale
      let dy = (y - startY) / handScale
      let old = clone(rectList)
      let rIndex = old.findIndex(v => v.id === selectRect?.id)
      if (rIndex !== -1) {
        let now = old[rIndex]
        now.x = selectRect.x + dx
        now.y = selectRect.y + dy
        now = getPath(now)
      }
      this.setState({ rectList: old }, this.draw)
      return
    }
    // return console.log(x, y)
    // isPointInPath(x, y, blocks[0])
    // for (let i = 0; i < rectList.length; i++) {
    for (let i = rectList.length - 1; i >= 0; i--) {
      let b = rectList[i]
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
    }, this.draw)
  }

  getTextModeAutoHTexts(texts: string[], ctx: any, w: number) {
    let newTexts: string[] = []
    for (let i = 0; i < texts.length; i++) {
      let text = texts[i]
      if (!text) continue
      let measureText = ctx.measureText(text)
      if (measureText.width <= w) {
        newTexts.push(text)
      } else {
        for (let i = text.length - 1; i >= 0; i--) {
          measureText = ctx.measureText(text.substring(0, i))
          if (measureText.width <= w) {
            newTexts.push(text.substring(0, i))
            let res = this.getTextModeAutoHTexts([text.substring(i, text.length)], ctx, w)
            newTexts = newTexts.concat(res)
            break
          }
        }
      }
    }
    return newTexts
  }

  calcText = (
    texts?: any,
    fontSize?: any,
    textLineHeight?: any,
    letterSpacing?: any,
    textMode?: TextMode,
    x?: any,
    y?: any,
    w?: any,
    h?: any,
    textAlign?: TextAlign,
    fontWeight?: FontWeight,
    fontFamily?: FontFamily,
  ) => {
    let {
      ctx
    } = this.state
    let current: Rect = this.getSelect()

    let brokenTexts = current.brokenTexts

    if (!texts) {
      texts = current.texts
    } else {
      brokenTexts = texts
    }
    if (!fontSize) fontSize = current.fontSize
    if (!textLineHeight) textLineHeight = current.textLineHeight
    if (!letterSpacing) letterSpacing = current.letterSpacing
    if (!textMode) textMode = current.textMode
    if (!textAlign) textAlign = current.textAlign
    if (!fontWeight) fontWeight = current.fontWeight
    if (!fontFamily) fontFamily = current.fontFamily
    if (!x) x = current.x
    if (!y) y = current.y
    if (!w) w = current.w
    if (!h) h = current.h

    ctx.font = `${fontWeight} ${fontSize}rem "${fontFamily}", sans-serif`;
    if (textMode === TextMode.AUTO_W) {
      let widths = texts.map((text: string) => {
        let measureText = ctx.measureText(text)
        return measureText.width
      })
      w = Math.max(...widths)
      h = texts.length * textLineHeight
      brokenTexts = texts
    }
    if (textMode === TextMode.AUTO_H) {
      brokenTexts = this.getTextModeAutoHTexts(texts, ctx, w)
      h = brokenTexts.length * textLineHeight
    }
    if (textMode === TextMode.FIXED) {
      // brokenTexts = texts
    }
    console.log('brokenTexts', brokenTexts)
    this.changeSelect({
      x,
      y,
      w,
      h,
      brokenTexts,
      texts,
      textLineHeight,
      letterSpacing,
      fontSize,
      textMode,
      textAlign,
      fontWeight,
      fontFamily
    })
  }

  onChange = (e: any) => {
    console.log('onChange', e)
  }

  onTextAlignChange = (e: any) => {
    this.calcText(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      e
    )
    console.log('onTextAlignChange', e)
  }

  onTextModeChange = (e: any) => {
    this.calcText(
      undefined,
      undefined,
      undefined,
      undefined,
      e)
    console.log('onTextModeChange', e)
  }

  onFontWeightChange = (e: any) => {
    this.calcText(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      e)
    console.log('onFontWeightChange', e)
  }

  onFontFamilyChange = (e: any) => {
    this.calcText(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      e)
    console.log('onFontFamilyChange', e)
  }
  onFontSizeChange = (e: any) => {
    this.calcText(
      undefined,
      e)
    console.log('onFontSizeChange', e)
  }
  onTextLineHeightChange = (e: any) => {
    this.calcText(
      undefined,
      undefined,
      e.target.value)
    console.log('onTextLineHeightChange', e)
  }

  changeRectColor = (e: any) => {
    const { rectColorType } = this.state

    console.log('e', e.hex)
    this.changeSelect({ [rectColorType]: e.hex })
    this.setState({ rectColor: e.hex })
  }

  onContextMenu = (e: any) => {
    e.preventDefault()
    return false
  }

  render() {
    // console.log('render')
    const {
      activeHand, handScale, showPicker, rectColor,
      usePencil,
      usePen,
    } = this.state
    // console.log('selectRect', selectRect?.fontFamily)
    // @ts-ignore
    const selectRect: Rect = this.getSelect()
    // console.log('se', selectRect)
    const type = selectRect?.type
    return <>
      <div className={'design dark'}>
        <div className="header">
          <div className={'fps'}>
            FPS:<Fps/>
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
              <div className="left">
                <div className={cx('tool', activeHand && 'active')}
                     onClick={() => this.setState({ activeHand: !activeHand })}>
                  <Icon type={'FiveFive'} size="20"/>
                </div>
                <div className="tool">
                  <Icon type={'FiveFive'} size="20"/>
                  <Icon type={'Down'} size="14" className='arrow'/>
                </div>
                <div className="tool">
                  <Icon type={'Text'} size="20"/>
                </div>
                <div className="tool">
                  <Icon type={'pic'} size="20"/>
                </div>
                <div className={cx('tool', usePencil && 'active')}>
                  <Icon type={'pencil'} size="20"/>
                </div>
                <div className={cx('tool', usePen && 'active')}>
                  <Icon type={'ElectronicPen'} size="20"/>
                </div>
              </div>
              <div className="right">
                <div className="resize">
                  <span>{((handScale - 1) * 100).toFixed(0)}%</span>
                  <Down theme="outline" size="14" fill="#ffffff" className='arrow'/>
                </div>
              </div>
            </div>
            <div id="canvasArea">
              <canvas
                onContextMenu={this.onContextMenu}
                onDoubleClick={this.onDbClick}
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
                    <BaseInput value={selectRect?.x?.toFixed(0)} prefix={<span className={'gray'}>X</span>}/>
                  </div>
                  <div className="col">
                    <BaseInput value={selectRect?.y?.toFixed(0)} prefix={<span className={'gray'}>Y</span>}/>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <BaseInput value={selectRect?.w?.toFixed(0)} prefix={<span className={'gray'}>W</span>}/>
                  </div>
                  <div className="col">
                    <BaseInput value={selectRect?.h?.toFixed(0)} prefix={<span className={'gray'}>H</span>}/>
                  </div>
                  <div className="col">
                    <BaseIcon active={false}>
                      <Unlock theme="outline" size="16" fill="#929596"/>
                    </BaseIcon>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <BaseInput value={selectRect?.rotate} prefix={<RotateIcon style={{ fontSize: "16rem" }}/>}/>
                  </div>
                  <div className="col">
                    <BaseButton active={selectRect?.flipHorizontal} onClick={() => this.flip(0)}>
                      <FlipIcon style={{ fontSize: "16rem", 'transform': 'rotate(-90deg)' }}/>
                    </BaseButton>
                    <BaseButton active={selectRect?.flipVertical} onClick={() => this.flip(1)}>
                      <FlipIcon style={{ fontSize: "16rem", 'transform': 'rotate(0deg)' }}/>
                    </BaseButton>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <BaseInput value={selectRect?.radius} prefix={<AngleIcon style={{ fontSize: "16rem" }}/>}/>
                  </div>
                  <div className="col">
                    <BaseIcon active={false}>
                      <FullScreen theme="outline" size="16" fill="#929596"/>
                    </BaseIcon>
                  </div>
                </div>
              </div>
              {
                type === RectType.TEXT &&
                <div className="base-info">
                  <div className="header">文字</div>
                  <div className="row-single">
                    <div className="col">
                      <BaseSelect value={selectRect?.fontFamily} onChange={this.onFontFamilyChange}>
                        {
                          fontFamilies.map((v, i) => {
                            return <BaseOption key={i} value={v.value} label={v.label}>{v.label}</BaseOption>
                          })
                        }
                      </BaseSelect>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <BaseSelect value={selectRect?.fontWeight} onChange={this.onFontWeightChange}>
                        {
                          fontWeight.map((v, i) => {
                            return <BaseOption key={i} value={v.value} label={v.label}>{v.label}</BaseOption>
                          })
                        }
                      </BaseSelect>
                    </div>
                    <div className="col">
                      <BaseSelect value={selectRect?.fontSize} onChange={this.onFontSizeChange}>
                        {
                          fontSize.map((v, i) => {
                            return <BaseOption key={i} value={v.value} label={v.label}>{v.label}</BaseOption>
                          })
                        }
                      </BaseSelect>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <BaseInput value={selectRect?.textLineHeight}
                                 onChange={this.onTextLineHeightChange}
                                 prefix={<RowHeight size="14" fill="#929596"/>}/>
                    </div>
                    <div className="col">
                      <BaseInput value={selectRect?.letterSpacing}
                                 prefix={<AutoLineWidth fill="#929596"/>}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <BaseRadioGroup value={selectRect?.textAlign} onChange={this.onTextAlignChange}>
                        <BaseRadio key={0} value={TextAlign.LEFT} label={'左对齐'}>
                          <AlignTextLeft fill="#929596"/>
                        </BaseRadio>
                        <BaseRadio key={1} value={TextAlign.CENTER} label={'居中对齐'}>
                          <AlignTextLeft fill="#929596"/>
                        </BaseRadio>
                        <BaseRadio key={2} value={TextAlign.RIGHT} label={'右对齐'}>
                          <AlignTextLeft fill="#929596"/>
                        </BaseRadio>
                      </BaseRadioGroup>
                    </div>
                    <div className="col">
                      <BaseRadioGroup value={selectRect?.textMode} onChange={this.onTextModeChange}>
                        <BaseRadio key={0} value={TextMode.AUTO_W} label={'自动宽度'}>
                          <AutoWidthOne fill="#929596"/>
                        </BaseRadio>
                        <BaseRadio key={1} value={TextMode.AUTO_H} label={'自动高度'}>
                          <AutoHeightOne fill="#929596"/>
                        </BaseRadio>
                        <BaseRadio key={2} value={TextMode.FIXED} label={'固定宽高'}>
                          <Square fill="#929596"/>
                        </BaseRadio>
                      </BaseRadioGroup>
                    </div>
                    <div className="col">
                      <BaseIcon active={false}>
                        <More fill="#929596"/>
                      </BaseIcon>
                    </div>
                  </div>
                </div>
              }
              <div className="base-info">
                <div className="header">填充</div>
                <div className="row-single">
                  <div className="col">
                    <BaseSlotButton value={selectRect?.x?.toFixed(0)}
                                    prefix={
                                      <div className={'color-block'}
                                           style={{ background: selectRect.fillColor }}
                                           onClick={() => this.setState({
                                             showPicker: !showPicker,
                                             rectColor: selectRect.fillColor,
                                             rectColorType: RectColorType.FillColor
                                           })}/>
                                    }
                      // suffix={<PreviewOpen fill="#929596"/>}
                                    suffix={<PreviewClose fill="#929596"/>}
                    >
                      <div className={'test'}>
                        <input type="text" value={selectRect?.fillColor}/>
                        <input type="text"/>
                      </div>
                    </BaseSlotButton>
                  </div>

                  <div className="col">
                    <BaseIcon active={false}>
                      <Unlock theme="outline" size="16" fill="#929596"/>
                    </BaseIcon>
                  </div>
                </div>
              </div>
              <div className="base-info">
                <div className="header">描边</div>
                <div className="row-single">
                  <div className="col">
                    <BaseSlotButton value={selectRect?.x?.toFixed(0)}
                                    prefix={
                                      <div className={'color-block'}
                                           style={{ background: selectRect.borderColor }}
                                           onClick={() => this.setState({
                                             showPicker: !showPicker,
                                             rectColor: selectRect.borderColor,
                                             rectColorType: RectColorType.BorderColor
                                           })}/>
                                    }
                      // suffix={<PreviewOpen fill="#929596"/>}
                                    suffix={<PreviewClose fill="#929596"/>}
                    >
                      <div className={'test'}>
                        <input type="text" value={selectRect?.borderColor}/>
                        <input type="text"/>
                      </div>
                    </BaseSlotButton>
                  </div>

                  <div className="col">
                    <BaseIcon active={false}>
                      <Unlock theme="outline" size="16" fill="#929596"/>
                    </BaseIcon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        showPicker &&
        <BasePicker
          visible={showPicker}
          setVisible={() => this.setState({ showPicker: false })}
          color={rectColor || 'white'}
          onChange={this.changeRectColor}/>
      }
    </>
  }
}

export default withRouter(Canvas)