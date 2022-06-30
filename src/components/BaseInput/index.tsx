import {memo, ReactNode} from "react";
import './index.scss'
import cx from "classnames";

interface IProps {
  prefix?: ReactNode,
  suffix?: ReactNode,
  value?: any,
  onChange?: Function
}

export default memo((props: IProps) => {
  const {
    prefix, suffix, value = '', onChange = () => {
    }
  } = props
  return (
    <div className={cx('d-input', !prefix && 'padding')}>
      {prefix && <div className="prefix">{prefix}</div>}
      <input type="text" value={value} onChange={e => onChange(e)}/>
      <div className="suffix"></div>
    </div>
  )
})