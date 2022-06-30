import {memo} from "react";
import './index.scss'
import cx from "classnames";

export default memo((props: any) => {
  const {active} = props
  return (
    <div className={cx('d-icon', active && 'active')}>
      {props.children}
    </div>
  )
})