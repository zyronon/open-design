import React, {memo, useEffect, useRef, useState} from "react"
import BaseInput from "../../../../components/BaseInput"
import AngleIcon from "../../../../assets/icon/AngleIcon"
import {BaseRadio, BaseRadioGroup} from "../../../../components/BaseRadio"
import {TextAlign} from "../../../canvas-old/type"
import BaseButton from "../../../../components/BaseButton"
import {BaseConfig} from "../../../../lib/designer/config/BaseConfig"
import {BaseShape} from "../../../../lib/designer/shapes/core/BaseShape"
import './index.scss'
import {ShapeType, TextMode} from "../../../../lib/designer/types/type"
import BaseIcon from "../../../../components/BaseIcon"
import {
  AlignTextLeft,
  AutoHeightOne,
  AutoLineWidth,
  AutoWidthOne,
  FullScreen,
  More,
  PreviewClose,
  RowHeight,
  Square,
  Unlock
} from "@icon-park/react"
import RotateIcon from "../../../../assets/icon/RotateIcon"
import FlipIcon from "../../../../assets/icon/FlipIcon"
import BaseSlotButton from "../../../../components/BaseSlotButton"
import {BaseOption, BaseSelect} from "../../../../components/BaseSelect2"
import BasePicker from "../../../../components/BasePicker";
import {useCreation, useMount} from "ahooks";
import EventBus from "../../../../lib/designer/event/eventBus";
import {EventKeys} from "../../../../lib/designer/event/eventKeys";
import {clone, cloneDeep} from "lodash";
import {fontFamilies, fontSize, fontWeight} from "../../../../lib/designer/utils/constant";

enum ChangeColorType {
  Border = 'Border',
  Fill = 'Fill',
}

const ShapeInfo = (props: any) => {
  const [mode, setMode] = useState<ShapeType>(ShapeType.SELECT)
  const [showPicker, setShowPicker] = useState<boolean>(false)
  const [pickerColor, setPickerColor] = useState<any>()
  const [changeColorType, setChangeColorType] = useState<ChangeColorType>()
  //可以直接从shape里面取conf。这里提出来是因为shape.conf永远是一个引用。不会引用react重渲染
  const [conf, setConf] = useState<BaseConfig>({} as any)
  const shape = useRef<BaseShape>()

  useEffect(() => {
    // console.log('useEffect-start')
    let keys = [
      EventKeys.ON_CONF_CHANGE,
      EventKeys.SELECT_SHAPE
    ]
    EventBus.on(EventKeys.ON_CONF_CHANGE, () => {
      shape.current && setConf(cloneDeep(shape.current.conf))
    })
    EventBus.on(EventKeys.SELECT_SHAPE, (s: BaseShape) => {
      shape.current = s
      setConf(s.conf)
    })
    return () => {
      EventBus.off(keys)
    }
  }, [shape])

  function changeRectColor(e: any) {
    let hex = e.hex
    setPickerColor(hex)
    if (changeColorType === ChangeColorType.Border) {
      shape.current!.conf.borderColor = hex
    } else {
      shape.current!.conf.fillColor = hex
    }
    EventBus.emit(EventKeys.RENDER)
    setConf(cloneDeep(shape.current!.conf))
  }

  function clip() {
  }

  function inputOnChange() {
  }

  function setFillColor() {
    setShowPicker(!showPicker)
    setPickerColor(conf?.fillColor)
    setChangeColorType(ChangeColorType.Fill)
  }

  function setBorderColor() {
    setShowPicker(!showPicker)
    setPickerColor(conf?.borderColor)
    setChangeColorType(ChangeColorType.Border)
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

  return (
    conf.id ?
      <>
        {
          mode === ShapeType.EDIT ?
            <div className="base-info">
              <div className="row grid2">
                <div className="col">
                  <BaseInput value={conf?.layout?.x?.toFixed2()} prefix={<span className={'gray'}>X</span>}/>
                </div>
                <div className="col">
                  <BaseInput value={conf?.layout?.y?.toFixed2()} prefix={<span className={'gray'}>Y</span>}/>
                </div>
              </div>
              <div className="row grid2">
                <div className="col">
                  <BaseInput value={conf?.radius} prefix={<AngleIcon style={{fontSize: "16rem"}}/>}/>
                </div>
              </div>
              <div className="row">
                <BaseRadioGroup value={conf?.flipHorizontal}>
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
              <div className="row grid1">
                <BaseButton active={true}>
                  退出编辑模式
                </BaseButton>
              </div>
            </div> :
            <div className="base-info">
              <div className="row grid2">
                <div className="col">
                  <BaseInput value={conf.layout.x.toFixed(2)}
                             prefix={<span className={'gray'}>X</span>}/>
                </div>
                <div className="col">
                  <BaseInput value={conf?.layout?.y?.toFixed(2)}
                             prefix={<span className={'gray'}>Y</span>}/>
                </div>
              </div>
              <div className="row grid2">
                <div className="col">
                  <BaseInput value={conf?.layout?.w?.toFixed(2)}
                             prefix={<span className={'gray'}>W</span>}/>
                </div>
                <div className="col">
                  <BaseInput value={conf?.layout?.h?.toFixed(2)}
                             prefix={<span className={'gray'}>H</span>}/>
                </div>
                <div className="col">
                  <BaseIcon active={conf?.clip}
                            onClick={clip}
                  >
                    <Unlock theme="outline" size="16" fill="#929596"/>
                  </BaseIcon>
                </div>
              </div>
              <div className="row grid2">
                <div className="col">
                  <BaseInput value={conf?.rotation}
                             prefix={<RotateIcon style={{fontSize: "16rem"}}/>}/>
                </div>
                <div className="col">
                  <BaseButton active={conf?.flipHorizontal} onClick={() => shape.current?.flip(0)}>
                    <FlipIcon style={{fontSize: "16rem", 'transform': 'rotate(-90deg)'}}/>
                  </BaseButton>
                  <BaseButton active={conf?.flipVertical} onClick={() => shape.current?.flip(1)}>
                    <FlipIcon style={{fontSize: "16rem", 'transform': 'rotate(0deg)'}}/>
                  </BaseButton>
                </div>
              </div>
              <div className="row grid2">
                <div className="col">
                  <BaseInput value={conf?.radius} prefix={<AngleIcon style={{fontSize: "16rem"}}/>}/>
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
        }
        {
          conf.type === ShapeType.TEXT &&
          <div className="base-info">
            <div className="header">文字</div>
            <div className="row grid1">
              <div className="col">
                <BaseSelect value={conf?.fontFamily} onChange={onFontFamilyChange}>
                  {
                    fontFamilies.map((v, i) => {
                      return <BaseOption key={i} value={v.value} label={v.label}>{v.label}</BaseOption>
                    })
                  }
                </BaseSelect>
              </div>
            </div>
            <div className="row grid2">
              <div className="col">
                <BaseSelect value={conf?.fontWeight} onChange={onFontWeightChange}>
                  {
                    fontWeight.map((v, i) => {
                      return <BaseOption key={i} value={v.value} label={v.label}>{v.label}</BaseOption>
                    })
                  }
                </BaseSelect>
              </div>
              <div className="col">
                <BaseSelect value={conf?.fontSize} onChange={onFontSizeChange}>
                  {
                    fontSize.map((v, i) => {
                      return <BaseOption key={i} value={v.value} label={v.label}>{v.label}</BaseOption>
                    })
                  }
                </BaseSelect>
              </div>
            </div>
            <div className="row grid2">
              <div className="col">
                <BaseInput value={conf?.textLineHeight}
                           onChange={onTextLineHeightChange}
                           prefix={<RowHeight size="14" fill="#929596"/>}/>
              </div>
              <div className="col">
                <BaseInput value={conf?.letterSpacing}
                           prefix={<AutoLineWidth fill="#929596"/>}/>
              </div>
            </div>
            <div className="row grid2">
              <div className="col">
                <BaseRadioGroup value={conf?.textAlign} onChange={onTextAlignChange}>
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
                <BaseRadioGroup value={conf?.textMode} onChange={onTextModeChange}>
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
        <div className="base-info" style={{lineBreak: 'anywhere'}}>
          <div dangerouslySetInnerHTML={{__html: shape.current!.getStatus()}}>
          </div>
        </div>
        <div className="base-info">
          <div className="header">填充</div>
          <div className="row grid1">
            <div className="col">
              <BaseSlotButton value={conf?.x?.toFixed(0)}
                              prefix={
                                <div className={'color-block'}
                                     style={{background: conf?.fillColor}}
                                     onClick={setFillColor}
                                />
                              }
                // suffix={<PreviewOpen fill="#929596"/>}
                              suffix={<PreviewClose fill="#929596"/>}
              >
                <div className={'test'}>
                  <input type="text" value={conf?.fillColor} onChange={inputOnChange}/>
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
          <div className="row grid1">
            <div className="col">
              <BaseSlotButton value={conf?.x?.toFixed(0)}
                              prefix={
                                <div className={'color-block'}
                                     style={{background: conf?.borderColor}}
                                     onClick={setBorderColor}/>}
                // suffix={<PreviewOpen fill="#929596"/>}
                              suffix={<PreviewClose fill="#929596"/>}
              >
                <div className={'test'}>
                  <input type="text" value={conf?.borderColor} onChange={inputOnChange}/>
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
        {
          showPicker &&
          <BasePicker
            visible={showPicker}
            setVisible={() => setShowPicker(false)}
            color={pickerColor || 'white'}
            onChange={changeRectColor}/>
        }
      </>
      : null
  )
}
export default memo(ShapeInfo)