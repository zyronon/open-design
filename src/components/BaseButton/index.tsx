import {memo} from "react";
import './index.scss'
import cx from "classnames";

export default memo((props: { active: boolean } & any) => {
  const {active, ...reset} = props
  return (
    <div className={cx('d-button', {
      'active': props.active
    })} {...reset}>{props.children}</div>
  )
})