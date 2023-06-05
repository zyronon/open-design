import {memo, ReactNode} from "react";
import './index.scss'
import cx from "classnames";

interface IProps {
  prefix?: ReactNode,
  suffix?: ReactNode,
  children?: ReactNode,
  value?: any,
  onChange?: Function
}

export default memo((props: IProps) => {
  const {
    prefix, suffix, value = '', onChange = () => {
    }
  } = props
  return (
    <div className={cx('BaseSlotButton')}>
      {prefix && <div className="prefix">{prefix}</div>}
      {props.children}
      {suffix && <div className="suffix">{suffix}</div>}
    </div>
  )
})