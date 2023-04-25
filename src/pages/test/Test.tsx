import React, {ChangeEventHandler, Component, MutableRefObject, SyntheticEvent, useMemo, useRef} from 'react'
import './index.scss'
import {withRouter} from "../../components/WithRouter"
import {Button} from "antd";
import {useNavigate} from "react-router-dom"
import {TextAlign} from "../../lib/designer/config/TextConfig"
import {CU} from "../../lib/designer/engine/CanvasUtil2"
import {TextMode} from "../canvas-old/type"
import helper from "../../lib/designer/utils/helper"
import {ShapeType} from "../../lib/designer/types/type"

let conf = {
  "name": "文字",
  layout: {
    "x": 1050,
    "y": 50,
    "w": 100,
    "h": 50,
  },
  "rotation": 0,
  "lineWidth": 2,
  "type": ShapeType.TEXT,
  "fontFamily": "SourceHanSansCN",
  "textAlign": TextAlign.LEFT,
  "textBaseline": 1,
  "fontSize": 20,
  "fontWeight": 500,
  "letterSpacing": 0,
  "textLineHeight": 20,
  "textMode": TextMode.AUTO_H,
  "texts": [
    "输入文本"
  ],
  "brokenTexts": [
    "输入文本"
  ],
  "color": "gray",
  "radius": 0,
  "borderColor": "rgb(216,216,216)",
  "fillColor": "rgb(241,238,238)",
  flipHorizontal: false,
  flipVertical: false
}

function T() {
  const textRef = useRef<HTMLDivElement>(undefined as any)
  const canvasRef = useRef<HTMLCanvasElement>(undefined as any)
  const inputRef = useRef<HTMLTextAreaElement>(undefined as any)
  let navigate = useNavigate();

  return (
    <>
      <div className={'content'}>
        <div className={'wrapper'}>
        </div>
        <Button onClick={() => navigate('/')}>回/</Button>
      </div>
    </>
  )
}

export default T