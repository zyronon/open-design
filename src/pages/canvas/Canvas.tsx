import React, {memo, useEffect, useRef, useState} from "react";
import Fps from "../../components/Fps";
import Left from "./components/Left/left";
import cx from "classnames";
import Icon from "@icon-park/react/es/all";
import {IState, Rect, RectColorType, RectType, TextAlign, TextMode} from "./type";
import {
  AlignTextLeft,
  AutoHeightOne,
  AutoLineWidth,
  AutoWidthOne,
  Down,
  FullScreen, More, PreviewClose,
  RowHeight, Square,
  Unlock
} from "@icon-park/react";
import BaseInput from "../../components/BaseInput";
import BaseIcon from "../../components/BaseIcon";
import RotateIcon from "../../assets/icon/RotateIcon";
import BaseButton from "../../components/BaseButton";
import FlipIcon from "../../assets/icon/FlipIcon";
import AngleIcon from "../../assets/icon/AngleIcon";
import {BaseOption, BaseSelect} from "../../components/BaseSelect";
import {fontFamilies, fontSize, fontWeight, rects} from "./constant";
import {BaseRadio, BaseRadioGroup} from "../../components/BaseRadio";
import BaseSlotButton from "../../components/BaseSlotButton";
import BasePicker from "../../components/BasePicker";
import {assign, cloneDeep} from "lodash";
import {clearAll, getPath, renderCanvas} from "./utils";
import {useDispatch, useSelector} from "react-redux";
import {clearRect, pushRect, store} from "./store";
import {message} from "antd";
import './index.scss'
import {useSetState} from "ahooks";

export default memo((props: any, context: any) => {
  const [showPicker, setShowPicker] = useState<boolean>(false)
  const [rectColor, setRectColor] = useState<any>('white')
  const [selectRect, setSelectRect] = useState<any>({})
  const [rectColorType, setRectColorType] = useState<any>(null)
  const [drawType, setDrawType] = useState<any>(RectType.ROUND)
  const [activeHand, setActiveHand] = useState<boolean>(false)
  const [usePencil, setUsePencil] = useState<boolean>(false)
  const [usePen, setUsePen] = useState<boolean>(false)
  const [enterLT, setEnterLT] = useState<boolean>(false)
  const [enterRT, setEnterRT] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [handMove, setHandMove] = useState<boolean>(false)
  const [handScale, setHandScale] = useState<number>(1)
  const rectList = useSelector((state: any) => state.canvas.rectList)
  const dispatch = useDispatch()
  const canvasRef: any = useRef()
  const [ctx, setCtx] = useState<any>(null)
  const [canvas, setCanvas] = useState<any>(null)
  const [canvas2, setCanvas2] = useState<any>(null)
  const [canvasRect, setCanvasRect] = useState<any>(null)
  const [currentMat, setCurrentMat] = useState<any>(new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]))

  useEffect(() => {
    let canvas: HTMLCanvasElement = canvasRef.current!
    let canvasRect = canvas.getBoundingClientRect()
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let {width, height} = canvasRect
    if (window.devicePixelRatio) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.height = height * window.devicePixelRatio;
      canvas.width = width * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    setCtx(ctx)
    setCanvas2({
      ctx,
      canvas,
      canvasRect
    })
  }, [])

  useEffect(() => {
    if (ctx) {
      draw()
    }
  }, [rectList])

  useEffect(() => {
    canvas2 && init()
  }, [canvas2])

  function clearRect() {
    dispatch({type: 'canvas/setRectList', payload: []})
  }

  function setRectList() {
    let temp: any = []
    cloneDeep(rects).map((rect: any) => {
      temp.push(getPath(rect))
    })
    dispatch({type: 'canvas/setRectList', payload: temp})
  }

  function init() {
    setRectList()
    draw()
  }


  function draw() {
    console.log('draw')
    clearAll(canvas2.canvas, ctx)
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

    // this.state.ctx.lineCap = 'square'
    ctx.lineCap = 'round'
    // console.log('this.state.boxList', this.state.boxList)
    rectList.map((v: Rect) => {
      renderCanvas(v, {
        ctx,
        enterLT,
        enterRT,
        selectRect,
        isEdit,
      } as IState)
    })
    ctx.restore()
  }

  function changeSelect(val: any) {
    let old = cloneDeep(rectList)
    let rIndex = old.findIndex((item: any) => item.id === selectRect?.id)
    if (rIndex > -1) {
      assign(old[rIndex], val)
      old[rIndex] = getPath(old[rIndex])
      dispatch({type: 'canvas/setRectList', payload: old})
    }
  }

  function changeRectColor(e: any) {
    console.log('e', e.hex)
    changeSelect({[rectColorType]: e.hex})
    setRectColor(e.hex)
  }

  function print() {
    navigator.clipboard.writeText(JSON.stringify(rectList, null, 2))
      .then(() => {
        message.success('复制成功')
      })
      .catch(err => {
        message.error('复制失败')
      })
  }

  function onContextMenu() {
  }

  function onDbClick() {
  }

  function onMouseMoveWrapper() {
  }

  function onMouseDown() {
  }

  function onMouseUp() {
  }

  function onWheel() {
  }

  function flip(type: number) {
  }

  function onFontFamilyChange() {
  }

  function onFontWeightChange() {
  }

  function onFontSizeChange() {
  }

  function onTextLineHeightChange() {
  }

  function onTextAlignChange() {
  }

  function onTextModeChange() {
  }

  function showBorderColorPicker() {
    setShowPicker(!showPicker)
    setRectColor(selectRect.borderColor)
    setRectColorType(RectColorType.BorderColor)
  }

  function showFillColorPicker() {
    setShowPicker(!showPicker)
    setRectColor(selectRect.fillColor)
    setRectColorType(RectColorType.FillColor)
  }

  const type = selectRect?.type

  return <>
    <div className={'design'}>
      <div className="header">
        <div className={'fps'}>
          FPS:<Fps/>
        </div>
      </div>
      <div className="content">
        <Left
          init={() => init()}
          navigate={() => props.navigate('/test')}
          print={print}
        />
        <div className="canvas-wrapper">
          <div className="tool-bar">
            <div className="left">
              <div className={cx('tool', activeHand && 'active')}
                   onClick={() => setActiveHand(!activeHand)}>
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
              <div className={cx('tool', drawType === RectType.ROUND && 'active')}>
                <Icon type={'Round'} size="20"/>
              </div>
              <div className={cx('tool', drawType === RectType.POLYGON && 'active')}>
                <Icon type={'Triangle'} size="20"/>
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
              onContextMenu={onContextMenu}
              onDoubleClick={onDbClick}
              onMouseMove={onMouseMoveWrapper}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onWheel={onWheel}
              id="canvas"
              ref={canvasRef}/>
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
                  <BaseInput value={selectRect?.rotate} prefix={<RotateIcon style={{fontSize: "16rem"}}/>}/>
                </div>
                <div className="col">
                  <BaseButton active={selectRect?.flipHorizontal} onClick={() => flip(0)}>
                    <FlipIcon style={{fontSize: "16rem", 'transform': 'rotate(-90deg)'}}/>
                  </BaseButton>
                  <BaseButton active={selectRect?.flipVertical} onClick={() => flip(1)}>
                    <FlipIcon style={{fontSize: "16rem", 'transform': 'rotate(0deg)'}}/>
                  </BaseButton>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <BaseInput value={selectRect?.radius} prefix={<AngleIcon style={{fontSize: "16rem"}}/>}/>
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
                            <BaseSelect value={selectRect?.fontFamily} onChange={onFontFamilyChange}>
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
                            <BaseSelect value={selectRect?.fontWeight} onChange={onFontWeightChange}>
                              {
                                fontWeight.map((v, i) => {
                                  return <BaseOption key={i} value={v.value} label={v.label}>{v.label}</BaseOption>
                                })
                              }
                            </BaseSelect>
                        </div>
                        <div className="col">
                            <BaseSelect value={selectRect?.fontSize} onChange={onFontSizeChange}>
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
                                       onChange={onTextLineHeightChange}
                                       prefix={<RowHeight size="14" fill="#929596"/>}/>
                        </div>
                        <div className="col">
                            <BaseInput value={selectRect?.letterSpacing}
                                       prefix={<AutoLineWidth fill="#929596"/>}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <BaseRadioGroup value={selectRect?.textAlign} onChange={onTextAlignChange}>
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
                            <BaseRadioGroup value={selectRect?.textMode} onChange={onTextModeChange}>
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
                                         style={{background: selectRect.fillColor}}
                                         onClick={showFillColorPicker}/>
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
                                         style={{background: selectRect.borderColor}}
                                         onClick={showBorderColorPicker}/>
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
            setVisible={() => setShowPicker(false)}
            color={rectColor || 'white'}
            onChange={changeRectColor}/>
    }
  </>
})