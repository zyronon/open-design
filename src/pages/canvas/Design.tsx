import React, {RefObject} from "react"
import './index.scss'
import BaseInput from "../../components/BaseInput"
import {AlignTextLeft, Down, FullScreen, PreviewClose, Unlock,} from "@icon-park/react"
import BaseIcon from "../../components/BaseIcon"
import BaseButton from "../../components/BaseButton"
import FlipIcon from "../../assets/icon/FlipIcon"
import RotateIcon from "../../assets/icon/RotateIcon"
import AngleIcon from "../../assets/icon/AngleIcon"
import {withRouter} from "../../components/WithRouter"
import Fps from "../../components/Fps"
import {BaseOption, BaseSelect} from "../../components/BaseSelect2"
import {defaultConfig, rects} from "../../lib/designer/utils/constant"
import {EditModeType, EventTypes, IState, RectColorType, ShapeType} from "../../lib/designer/utils/type"
import BaseSlotButton from "../../components/BaseSlotButton"
import Icon from '@icon-park/react/es/all'
import {message} from "antd"
import Left from "./components/Left/left"
import EventBus from "../../utils/event-bus"
import cx from "classnames"
import CanvasUtil2 from "../../lib/designer/engine/CanvasUtil2"
import {BaseConfig} from "../../lib/designer/config/BaseConfig"
import {BaseRadio, BaseRadioGroup} from "../../components/BaseRadio"
import {TextAlign} from "../canvas-old/type"


class Design extends React.Component<any, IState> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef()
  // @ts-ignore
  body: HTMLElement = document.querySelector("body")

  state = {
    showPicker: false,
    rectColor: null,
    rectColorType: null,
    drawCount: 0,
    handScale: defaultConfig.handScale,
    selectShape: undefined,
    selectDrawType: 'drawType',
    mode: ShapeType.SELECT,
    editModeType: EditModeType.Select,
    drawType: ShapeType.SELECT,
    drawType2: ShapeType.FRAME,
    drawType3: ShapeType.RECTANGLE,
    drawType4: ShapeType.PEN,
    drawType5: ShapeType.TEXT,
    drawType6: ShapeType.MOVE,
  } as IState

  componentDidMount() {
    // console.log('componentDidMount')
    this.init()
  }

  componentWillUnmount() {
    EventBus.offAll()
    // console.log('componentWillUnmount')
  }

  init() {
    EventBus.offAll()
    //这个绘制会刷新整个render...,从而获取到最新的selectShape，凑合着用吧
    EventBus.on(EventTypes.onDraw, () => {
      this.setState(s => {
        return {drawCount: s.drawCount + 1}
      })
    })
    EventBus.on([EventTypes.onMouseDown, EventTypes.onMouseMove, EventTypes.onMouseUp], (val: any) => {
      this.setState({selectShape: val})
    })
    EventBus.on([EventTypes.onWheel], (val: any) => {
      val && this.setState({handScale: val})
    })
    EventBus.on(EventTypes.onModeChange, (val: ShapeType) => {
      this.setState({mode: val})
    })
    this.setState({drawCount: 0})
    let canvas: HTMLCanvasElement = this.canvasRef.current!
    const c = CanvasUtil2.getInstance(canvas)
    c.clear()
    c.addChildren(rects)
    c.render()
    this.setState({cu: c})
  }

  flip(type: number) {
    this.state.selectShape?.flip(type)
    this.setState({selectShape: this.state.selectShape})
    this.state.cu.render()
  }

  clip = () => {
    if (this.state.selectShape) {
      this.state.selectShape.conf.clip = !this.state.selectShape.conf.clip
    }
    this.setState({selectShape: this.state.selectShape})
    this.state.cu.render()
  }


  onContextMenu = (e: any) => {
    e.preventDefault()
    return false
  }

  copy = () => {
    console.log(this.state.cu.print())
    navigator.clipboard.writeText(JSON.stringify(this.state.cu.print(), null, 2))
      .then(() => {
        message.success('复制成功')
      })
  }

  copy2 = () => {
    console.log(this.state.cu.print2())
    navigator.clipboard.writeText(JSON.stringify(this.state.cu.print2(), null, 2))
      .then(() => {
        message.success('复制成功,带id')
      })

  }

  setCanvasUtilMode = (mode: ShapeType, key: any) => {
    // @ts-ignore
    this.setState({[key]: mode, selectDrawType: key})
    this.state.cu.setMode(mode)
  }

  setCanvasUtilEditModeType = (type: EditModeType) => {
    this.setState({editModeType: type})
    this.state.cu.editModeType = type
  }

  inputOnChange = () => {
  }

  render() {
    // console.log('render')
    const {
      handScale,
      showPicker,
      drawType,
      drawType2,
      drawType3,
      drawType4,
      selectShape,
      selectDrawType,
      editModeType,
      mode
    } = this.state
    // console.log('selectRectConf', selectRectConf?.fontFamily)
    // @ts-ignore
    const selectRectConf: BaseConfig = selectShape?.conf
    const hide = false

    return <>
      <div className={cx('design', {'white': hide})}>
        <div className="header">
          <div className={'fps'}>
            FPS:<Fps/>
            总绘制次数：{this.state.drawCount}
          </div>
        </div>
        <div className="content">
          <Left
            hide={hide}
            init={() => this.init()}
            navigate={() => this.props.navigate('/test')}
            copy={this.copy}
            copy2={this.copy2}
          />
          <div className="canvas-wrapper">
            <div className="tool-bar">
              <div className="left">
                {mode === ShapeType.EDIT ? (
                  <>
                    <div className={cx('tool', editModeType === EditModeType.Select && 'active')}
                         onClick={() => this.setCanvasUtilEditModeType(EditModeType.Select)}>
                      <Icon type={'MoveOne'} size="20"/>
                    </div>
                    <div className={cx('tool', editModeType === EditModeType.Edit && 'active')}
                         onClick={() => this.setCanvasUtilEditModeType(EditModeType.Edit)}>
                      <Icon type={'pencil'} size="20"/>
                    </div>
                    <div className={cx('tool', editModeType === EditModeType.Curve && 'active')}
                         onClick={() => this.setCanvasUtilEditModeType(EditModeType.Curve)}>
                      <Icon type={'BezierCurve'} size="20"/>
                    </div>
                    <div className={cx('tool', editModeType === EditModeType.Cut && 'active')}
                         onClick={() => this.setCanvasUtilEditModeType(EditModeType.Cut)}>
                      <Icon type={'CuttingOne'} size="20"/>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={cx('tool select', selectDrawType === 'drawType' && 'active')}>
                      <BaseSelect
                        value={drawType}
                        selectRender={(e: any) => {
                          if (e.value === ShapeType.SELECT) return <Icon type={'MoveOne'}/>
                          if (e.value === ShapeType.SCALE) return <Icon type={'Scale'}/>
                        }}
                        onChange={(e: any) => this.setCanvasUtilMode(e, 'drawType')}>
                        <BaseOption key={1} value={ShapeType.SELECT} label={ShapeType.SELECT}>
                          <SelectItem name={'选择'} iconName={'MoveOne'} hotkey={'V'}/>
                        </BaseOption>
                        <BaseOption key={2} value={ShapeType.SCALE} label={ShapeType.SCALE}>
                          <SelectItem name={'等比缩放'} iconName={'Scale'} hotkey={'K'}/>
                        </BaseOption>
                      </BaseSelect>
                    </div>
                    <div className={cx('tool select', selectDrawType === 'drawType2' && 'active')}>
                      <BaseSelect
                        value={drawType2}
                        selectRender={(e: any) => {
                          if (e.value === ShapeType.FRAME) return <Icon type={'Pound'}/>
                          if (e.value === ShapeType.SLICE) return <Icon type={'StraightRazor'}/>
                        }}
                        onChange={(e: any) => this.setCanvasUtilMode(e, 'drawType2')}>
                        <BaseOption key={1} value={ShapeType.FRAME} label={ShapeType.FRAME}>
                          <SelectItem name={'窗器'} iconName={'Pound'} hotkey={'F'}/>
                        </BaseOption>
                        <BaseOption key={2} value={ShapeType.SLICE} label={ShapeType.SLICE}>
                          <SelectItem name={'切图'} iconName={'StraightRazor'} hotkey={'S'}/>
                        </BaseOption>
                      </BaseSelect>
                    </div>
                    <div className={cx('tool select', selectDrawType === 'drawType3' && 'active')}>
                      <BaseSelect
                        value={drawType3}
                        selectRender={(e: any) => {
                          if (e.value === ShapeType.RECTANGLE) return <Icon type={'RectangleOne'}/>
                          if (e.value === ShapeType.ELLIPSE) return <Icon type={'Round'}/>
                          if (e.value === ShapeType.ARROW) return <Icon type={'ArrowRightUp'}/>
                          if (e.value === ShapeType.LINE) return <Icon type={'Minus'}/>
                          if (e.value === ShapeType.POLYGON) return <Icon type={'Triangle'}/>
                          if (e.value === ShapeType.STAR) return <Icon type={'star'}/>
                          if (e.value === ShapeType.IMAGE) return <Icon type={'pic'}/>
                        }}
                        onChange={(e: any) => this.setCanvasUtilMode(e, 'drawType3')}>
                        <BaseOption key={1} value={ShapeType.RECTANGLE} label={ShapeType.RECTANGLE}>
                          <SelectItem name={'矩形'} iconName={'RectangleOne'} hotkey={'R'}/>
                        </BaseOption>
                        <BaseOption key={2} value={ShapeType.ELLIPSE} label={ShapeType.ELLIPSE}>
                          <SelectItem name={'圆'} iconName={'Round'} hotkey={'O'}/>
                        </BaseOption>
                        <BaseOption key={3} value={ShapeType.ARROW} label={ShapeType.ARROW}>
                          <SelectItem name={'箭头'} iconName={'ArrowRightUp'} hotkey={'Shift + L'}/>
                        </BaseOption>
                        <BaseOption key={4} value={ShapeType.LINE} label={ShapeType.LINE}>
                          <SelectItem name={'直线'} iconName={'Minus'} hotkey={'L'}/>
                        </BaseOption>
                        <BaseOption key={5} value={ShapeType.POLYGON} label={ShapeType.POLYGON}>
                          <SelectItem name={'多边形'} iconName={'Triangle'} hotkey={''}/>
                        </BaseOption>
                        <BaseOption key={6} value={ShapeType.STAR} label={ShapeType.STAR}>
                          <SelectItem name={'星形'} iconName={'star'} hotkey={''}/>
                        </BaseOption>
                        <BaseOption key={7} value={ShapeType.IMAGE} label={ShapeType.IMAGE}>
                          <SelectItem name={'图片'} iconName={'pic'} hotkey={'Shift Ctrl K'}/>
                        </BaseOption>
                      </BaseSelect>
                    </div>
                    <div className={cx('tool select', selectDrawType === 'drawType4' && 'active')}>
                      <BaseSelect
                        value={drawType4}
                        selectRender={(e: any) => {
                          if (e.value === ShapeType.PEN) return <Icon type={'pencil'}/>
                          if (e.value === ShapeType.PENCIL) return <Icon type={'ElectronicPen'}/>
                        }}
                        onChange={(e: any) => this.setCanvasUtilMode(e, 'drawType4')}>
                        <BaseOption key={1} value={ShapeType.PEN} label={ShapeType.PEN}>
                          <SelectItem name={'钢笔'} iconName={'pencil'} hotkey={'P'}/>
                        </BaseOption>
                        <BaseOption key={2} value={ShapeType.PENCIL} label={ShapeType.SLICE}>
                          <SelectItem name={'铅笔'} iconName={'ElectronicPen'} hotkey={'Shift P'}/>
                        </BaseOption>
                      </BaseSelect>
                    </div>
                    <div className={cx('tool', selectDrawType === 'drawType5' && 'active')}
                         onClick={() => this.setCanvasUtilMode(ShapeType.TEXT, 'drawType5')}>
                      <Icon type={'Text'} size="20"/>
                    </div>
                    <div className={cx('tool', selectDrawType === 'drawType6' && 'active')}
                         onClick={() => this.setCanvasUtilMode(ShapeType.MOVE, 'drawType6')}>
                      <Icon type={'FiveFive'} size="20"/>
                    </div>
                  </>
                )}
              </div>
              <div className="right">
                <div className="resize">
                  <span>{((handScale - 1) * 100).toFixed(0)}%</span>
                  <Down theme="outline" size="14" fill="#ffffff" className="arrow"/>
                </div>
              </div>
            </div>
            <div id="canvasArea">
              {/*为 canvas 增加键盘事件的时候，需要给 canvas 增加一个属性 tabinex = 0 , 不然 绑定无效。*/}
              <canvas
                onContextMenu={this.onContextMenu}
                // onDoubleClick={this.onDbClick}
                // onMouseMove={this.onMouseMoveWrapper}
                // onMouseDown={this.onMouseDown}
                // onMouseUp={this.onMouseUp}
                // onWheel={this.onWheel}
                tabIndex={1}
                id="canvas" ref={this.canvasRef}/>
            </div>
          </div>
          <div className="right">
            {/*<img src={require('../../assets/image/a.jpg')} alt=""/>*/}
            <div className="config-wrapper">
              {
                selectShape && (
                  <>
                    {mode === ShapeType.EDIT ? (
                      <div className="base-info">
                        <div className="row">
                          <div className="col">
                            <BaseInput value={selectRectConf?.layout?.x?.toFixed(2)}
                                       prefix={<span className={'gray'}>X</span>}/>
                          </div>
                          <div className="col">
                            <BaseInput value={selectRectConf?.layout?.y?.toFixed(2)}
                                       prefix={<span className={'gray'}>Y</span>}/>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col">
                            <BaseInput value={selectRectConf?.radius} prefix={<AngleIcon style={{fontSize: "16rem"}}/>}/>
                          </div>
                        </div>
                        <div className="row">
                          <BaseRadioGroup value={selectRectConf?.flipHorizontal}>
                            <BaseRadio key={0} value={TextAlign.LEFT} label={'左对齐'}>
                              <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none"
                                   xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.5"
                                      d="M10.2299 7.18115C9.40386 8.0002 8.26124 8.50714 6.99888 8.50714C5.73715 8.50714 4.59504 8.00077 3.76913 7.18238L0.691262 11.4119C0.210292 12.0729 0.682414 13.0003 1.49983 13.0003L12.5001 13.0003C13.3175 13.0003 13.7896 12.0729 13.3086 11.4119L10.2299 7.18115Z"
                                      fill="currentcolor"></path>
                                <circle cx="7.00195" cy="4" r="2.5" fill="currentcolor"></circle>
                              </svg>
                            </BaseRadio>
                            <BaseRadio key={1} value={TextAlign.CENTER} label={'居中对齐'}>
                              <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none"
                                   opacity="0.7">
                                <path opacity="0.5"
                                      d="M3.53812 7.06079C3.11524 7.34103 2.72041 7.67389 2.36266 8.05538C1.35537 9.1295 0.709611 10.5171 0.508885 12.0031C0.434956 12.5504 0.889629 13.0002 1.44191 13.0002L6.99975 13.0002L12.5576 13.0002C13.1099 13.0002 13.5646 12.5504 13.4906 12.0031C13.2899 10.5171 12.6441 9.12951 11.6369 8.05538C11.2792 7.67396 10.8844 7.34115 10.4616 7.06093C9.58862 7.96256 8.36042 8.52383 6.99993 8.52383C5.63937 8.52383 4.41111 7.9625 3.53812 7.06079Z"
                                      fill="currentcolor"></path>
                                <path
                                  d="M9.45189 4.4893C9.2244 5.63575 8.213 6.5 6.99975 6.5C5.78894 6.5 4.77918 5.63923 4.549 4.49624L2.37132 4.4876C2.20025 4.79333 1.87328 5 1.49805 5C0.945762 5 0.498047 4.55228 0.498047 4C0.498047 3.44772 0.945762 3 1.49805 3C1.86961 3 2.19384 3.20264 2.36625 3.50344L4.54734 3.51209C4.77428 2.36495 5.786 1.5 6.99975 1.5C8.21105 1.5 9.22114 2.36147 9.45078 3.50516L11.6241 3.51377C11.7949 3.20735 12.1223 3.0001 12.498 3.0001C13.0503 3.0001 13.498 3.44781 13.498 4.0001C13.498 4.55238 13.0503 5.0001 12.498 5.0001C12.127 5.0001 11.8032 4.79803 11.6306 4.49794L9.45189 4.4893Z"
                                  fill="currentcolor"></path>
                              </svg>
                            </BaseRadio>
                            <BaseRadio key={2} value={TextAlign.RIGHT} label={'右对齐'}>
                              <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none"
                                   opacity="0.7">
                                <path opacity="0.5"
                                      d="M2.46582 7.36012C2.31573 7.50739 2.16147 7.66693 2.00001 7.83911C0.989108 8.91708 0.587133 10.4568 0.476051 12.0009C0.436421 12.5518 0.889295 13.0001 1.44158 13.0001L6.99942 13.0001L12.5573 13.0001C13.1095 13.0001 13.5654 12.5486 13.4631 12.0059C13.1878 10.5462 12.34 9.22713 11.334 8.1544C10.7942 7.57873 9.99339 7.08349 9.11767 6.70898C8.28445 7.83037 6.97344 8.55333 5.49892 8.55333C4.33425 8.55333 3.2716 8.10228 2.46582 7.36012Z"
                                      fill="currentcolor"></path>
                                <path
                                  d="M7.9577 4.48514C7.73184 5.63366 6.71946 6.5 5.50474 6.5C4.29259 6.5 3.28193 5.63733 3.05322 4.49244L1.87511 4.48437C1.70454 4.79191 1.37658 5.00006 1 5.00006C0.447715 5.00006 0 4.55235 0 4.00006C0 3.44778 0.447715 3.00006 1 3.00006C1.37018 3.00006 1.69338 3.2012 1.86627 3.50016L3.05308 3.50828C3.2815 2.36304 4.29233 1.5 5.50474 1.5C6.71456 1.5 7.72367 2.35938 7.95493 3.50099L12.1255 3.51463C12.2963 3.20772 12.6239 3.00006 13 3.00006C13.5523 3.00006 14 3.44778 14 4.00006C14 4.55235 13.5523 5.00006 13 5.00006C12.6293 5.00006 12.3058 4.7984 12.1331 4.4988L7.9577 4.48514Z"
                                  fill="currentcolor"></path>
                              </svg>
                            </BaseRadio>
                            <BaseRadio key={3} value={TextAlign.RIGHT} label={'右对齐'}>
                              <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none"
                                   opacity="0.7">
                                <path opacity="0.5"
                                      d="M8.85653 8.14994C8.2833 8.37547 7.65637 8.49971 6.99945 8.49971C5.60877 8.49971 4.35247 7.94291 3.4556 7.04711C3.1079 7.30104 2.75992 7.63199 2.36266 8.05561C1.35537 9.12973 0.709611 10.5173 0.508885 12.0033C0.434956 12.5506 0.889629 13.0004 1.44191 13.0004L6.99975 13.0004H11.289C12.1584 13.0004 12.5974 11.9829 11.9925 11.3584C11.0229 10.3575 9.86322 9.175 9.05144 8.35151C8.98299 8.28208 8.91813 8.21491 8.85653 8.14994Z"
                                      fill="currentcolor"></path>
                                <path
                                  d="M9.34254 4.87517C9.44434 4.60279 9.5 4.30789 9.5 4C9.5 2.61929 8.38071 1.5 7 1.5C5.61929 1.5 4.5 2.61929 4.5 4C4.5 5.38071 5.61929 6.5 7 6.5C7.7099 6.5 8.35069 6.20411 8.80577 5.72893L11.0042 7.90998C11.0015 7.93966 11.0002 7.9697 11.0002 8.00006C11.0002 8.55235 11.4479 9.00006 12.0002 9.00006C12.5525 9.00006 13.0002 8.55235 13.0002 8.00006C13.0002 7.44778 12.5525 7.00006 12.0002 7.00006C11.8494 7.00006 11.7064 7.03343 11.5782 7.09319L9.34254 4.87517Z"
                                  fill="currentcolor"></path>
                                <circle cx="1" cy="4" r="1" fill="currentcolor"></circle>
                                <path d="M1 3.5L5 3.51586V4.5L1 4.48414V3.5Z" fill="currentcolor"></path>
                              </svg>
                            </BaseRadio>
                          </BaseRadioGroup>
                        </div>
                        <div className="row">
                          <BaseButton onClick={() => this.flip(0)}>
                            退出编辑模式
                          </BaseButton>
                        </div>
                      </div>
                    ) : (
                      <div className="base-info">
                        <div className="row">
                          <div className="col">
                            <BaseInput value={selectRectConf?.layout?.x?.toFixed(2)}
                                       prefix={<span className={'gray'}>X</span>}/>
                          </div>
                          <div className="col">
                            <BaseInput value={selectRectConf?.layout?.y?.toFixed(2)}
                                       prefix={<span className={'gray'}>Y</span>}/>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col">
                            <BaseInput value={selectRectConf?.layout?.w?.toFixed(2)}
                                       prefix={<span className={'gray'}>W</span>}/>
                          </div>
                          <div className="col">
                            <BaseInput value={selectRectConf?.layout?.h?.toFixed(2)}
                                       prefix={<span className={'gray'}>H</span>}/>
                          </div>
                          <div className="col">
                            <BaseIcon active={selectRectConf.clip}
                                      onClick={this.clip}
                            >
                              <Unlock theme="outline" size="16" fill="#929596"/>
                            </BaseIcon>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col">
                            <BaseInput value={selectRectConf?.rotation}
                                       prefix={<RotateIcon style={{fontSize: "16rem"}}/>}/>
                          </div>
                          <div className="col">
                            <BaseButton active={selectRectConf?.flipHorizontal} onClick={() => this.flip(0)}>
                              <FlipIcon style={{fontSize: "16rem", 'transform': 'rotate(-90deg)'}}/>
                            </BaseButton>
                            <BaseButton active={selectRectConf?.flipVertical} onClick={() => this.flip(1)}>
                              <FlipIcon style={{fontSize: "16rem", 'transform': 'rotate(0deg)'}}/>
                            </BaseButton>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col">
                            <BaseInput value={selectRectConf?.radius} prefix={<AngleIcon style={{fontSize: "16rem"}}/>}/>
                          </div>
                          <div className="col">
                            <BaseIcon active={false}>
                              <FullScreen theme="outline" size="16" fill="#929596"/>
                            </BaseIcon>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="base-info" style={{lineBreak: 'anywhere'}}>
                      <div dangerouslySetInnerHTML={{__html: selectShape.getStatus()}}>
                      </div>
                    </div>
                    <div className="base-info">
                      <div className="header">填充</div>
                      <div className="row-single">
                        <div className="col">
                          <BaseSlotButton value={selectRectConf?.x?.toFixed(0)}
                                          prefix={
                                            <div className={'color-block'}
                                                 style={{background: selectRectConf.fillColor}}
                                                 onClick={() => this.setState({
                                                   showPicker: !showPicker,
                                                   rectColor: selectRectConf.fillColor,
                                                   rectColorType: RectColorType.FillColor
                                                 })}/>
                                          }
                            // suffix={<PreviewOpen fill="#929596"/>}
                                          suffix={<PreviewClose fill="#929596"/>}
                          >
                            <div className={'test'}>
                              <input type="text" value={selectRectConf?.fillColor} onChange={this.inputOnChange}/>
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
                          <BaseSlotButton value={selectRectConf?.x?.toFixed(0)}
                                          prefix={
                                            <div className={'color-block'}
                                                 style={{background: selectRectConf.borderColor}}
                                                 onClick={() => this.setState({
                                                   showPicker: !showPicker,
                                                   rectColor: selectRectConf.borderColor,
                                                   rectColorType: RectColorType.BorderColor
                                                 })}/>
                                          }
                            // suffix={<PreviewOpen fill="#929596"/>}
                                          suffix={<PreviewClose fill="#929596"/>}
                          >
                            <div className={'test'}>
                              <input type="text" value={selectRectConf?.borderColor} onChange={this.inputOnChange}/>
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
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  }
}

function SelectItem(props: any) {
  const {name = '', hotkey = '', icon = null, iconName = ''} = props
  return (
    <div className="tool-option">
      <div className="left">
        {icon ? icon : <Icon type={iconName}/>}
        <span className="name">{name}</span>
      </div>
      <span className="hotkey">{hotkey}</span>
    </div>
  )
}

export default withRouter(Design)