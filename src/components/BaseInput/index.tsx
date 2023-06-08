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
    prefix, suffix, value = '', onChange = (e: any) => {
    }
  } = props
  const start = useRef<number>(0)

  const onMouseMove: any = useMemoizedFn((e: MouseEvent) => {
    let d = start.current - e.clientX
    let s = Number(value)
    if (d > 0) {
      onChange(s > 1 ? s - 1 : 0)
    } else {
      onChange(s + 1)
    }
    console.log('onMouseMove-e', d)
  })

  const onMouseUp: any = useMemoizedFn((e: MouseEvent) => {
    // console.log('onMouseUp', e.clientX)
    window.removeEventListener('mousemove', onMouseMove)
    document.body.style.cursor = 'default';
  })


  const onMouseDown = useMemoizedFn((e: MouseEvent) => {
    // console.log('onMouseDown')
    start.current = e.clientX
    document.body.style.cursor = 'ew-resize';
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
      <input type="text" value={value} onChange={e => onChange(Number(e.target.value))}/>
      {suffix && <div className={styles.suffix}>{suffix}</div>}
    </div>
  )
})