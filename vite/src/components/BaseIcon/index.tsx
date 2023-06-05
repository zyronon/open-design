import {memo} from "react"
import './index.scss'
import cx from "classnames"

export default memo((props: any) => {
  const {active, ...reset} = props
  return (
    <div
      {...reset}
      className={cx('d-icon', active && 'active')}>
      {props.children}
    </div>
  )
})