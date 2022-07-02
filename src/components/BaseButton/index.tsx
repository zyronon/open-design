import {memo} from "react";
import './index.scss'

export default memo((props: any) => {
  return (
    <div className={'d-button'} {...props}>{props.children}</div>
  )
})