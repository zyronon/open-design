import {memo} from "react";
import './index.scss'

export default memo((props: any) => {
  return (
    <div className={'d-input'}>
      <div className="prefix">w</div>
      <input type="text"/>
      <div className="suffix"></div>
    </div>
  )
})