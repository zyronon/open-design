import {memo, MouseEvent, ReactNode, useRef, useState} from "react";
// import './index.scss'
import styles from './index.module.scss'
import cx from "classnames";
import {useCreation, useMemoizedFn} from "ahooks"

interface IProps {
  prefix?: ReactNode,
  suffix?: ReactNode,
  value?: any,
  onChange?: Function,
  min?: number
}

export default memo((props: IProps) => {
  const {
    prefix,
    suffix,
    value = '', onChange = (e: any) => {
    }
  } = props
  const start = useRef<{x: number, y: number}>({x: 0, y: 0})
  const cursor = useRef<HTMLImageElement>()
  const img = {
    w: 20,
    h: 8
  }

  const onMouseMove: any = useMemoizedFn((e: MouseEvent) => {
    start.current.x = start.current.x + e.movementX
    start.current.y = start.current.y + e.movementY
    // console.log('onMouseMove-e', start.current.x, e.movementX)

    //往左
    if (e.movementX > 0) {
      if (start.current.x > window.innerWidth - img.w / 2) {
        start.current.x = 0
      }
    } else {
      if (start.current.x < 0) {
        start.current.x = window.innerWidth - img.w / 2
      }
    }

    if (cursor.current) {
      cursor.current.style.left = start.current.x + 'px'
      cursor.current.style.top = start.current.y + 'px'
    }

    let s = Number(value)
    let t = s + e.movementX
    if (props.min !== undefined) {
      if (t < props.min) t = props.min
    }
    // console.log('t', t)
    onChange(t)
  })

  const onMouseUp: any = useMemoizedFn((e: MouseEvent) => {
    // console.log('onMouseUp', e.clientX)
    window.removeEventListener('mousemove', onMouseMove)
    document.exitPointerLock()
    cursor.current!.style.display = 'none'
  })


  const onMouseDown = useMemoizedFn((e: MouseEvent) => {
    // console.log('onMouseDown')
    start.current = {x: e.clientX - img.w / 2, y: e.clientY - img.h / 2}
    //隐藏光标
    // @ts-ignore
    e.target.requestPointerLock()

    if (!cursor.current) {
      cursor.current = document.createElement('img')
      cursor.current.classList.add('cursor')
      cursor.current.src = require('@/assets/image/cursor/ew-resize.png')
      document.body.append(cursor.current)
    }

    cursor.current.style.left = start.current.x + 'px'
    cursor.current.style.top = start.current.y + 'px'
    cursor.current.style.display = 'block'

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