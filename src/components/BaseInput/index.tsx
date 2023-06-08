import {memo, MouseEvent, ReactNode, useRef, useState} from "react";
// import './index.scss'
import styles from './index.module.scss'
import cx from "classnames";
import {useCreation, useMemoizedFn} from "ahooks"

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
  const start = useRef<number>(0)

  const onMouseMove: any = useMemoizedFn((e: MouseEvent) => {
    console.log('onMouseMove-e', start.current - e.clientX)
  })

  const onMouseUp: any = useMemoizedFn((e: MouseEvent) => {
    console.log('onMouseUp', e.clientX)
    window.removeEventListener('mousemove', onMouseMove)
    setIsMouseDown(false)
  })


  const onMouseDown = useMemoizedFn((e: MouseEvent) => {
    console.log('onMouseDown')
    setIsMouseDown(true)
    start.current = e.clientX
    window.addEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseup', onMouseUp)
  })


  return (
    <div className={cx(styles['d-input'], !prefix && styles['padding'])}>
      {
        prefix &&
        <div className={styles.prefix}
             onMouseDown={onMouseDown}>
          {prefix}
        </div>
      }
      <input type="text" value={value} onChange={e => onChange(e)}/>
      {suffix && <div className={styles.suffix}>{suffix}</div>}
    </div>
  )
})