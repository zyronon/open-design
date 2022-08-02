import React, { memo } from "react"
import { store } from "../../store"
import './index.scss'

export default memo((props: any) => {
  return (
    <div className="left">
      <div className="tabs">
        <div className="tab">
          图层
        </div>
        <div className="tab">
          组件
        </div>
        <div className="tab">
          资源库
        </div>
      </div>
      <div className={'layer'}>
        <div className="pages">

        </div>
        <div className='components'>
          <div className="component" onClick={() => props.init()}>
            刷新
          </div>
          <div className="component" onClick={() => props.navigate('/test')}>
            去test
          </div>
          <div className="component" onClick={props.print}>
            打印
          </div>
          <div className="component" onClick={() => console.log(store.rectList)}>
            打印2
          </div>
        </div>
      </div>
    </div>
  )
})