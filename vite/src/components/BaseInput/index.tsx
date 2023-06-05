import {memo, ReactNode, useState} from "react";
import './index.scss'
import cx from "classnames";
import {useMemoizedFn} from "ahooks"

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
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)

  const onMouseDown = useMemoizedFn(() => {
    setIsMouseDown(true)
  })
  const onMouseMove = useMemoizedFn((e) => {
    if (isMouseDown) {

    }
  })
  const onMouseUp = useMemoizedFn(() => {
    setIsMouseDown(false)
  })
  return (
    <div className={cx('d-input', !prefix && 'padding')}>
      {
        prefix &&
        <div className="prefix"
             onMouseDown={onMouseDown}
             onMouseMove={onMouseMove}
             onMouseUp={onMouseUp}>
          {prefix}
        </div>
      }
      <input type="text" value={value} onChange={e => onChange(e)}/>
      {suffix && <div className="suffix">{suffix}</div>}
    </div>
  )
})