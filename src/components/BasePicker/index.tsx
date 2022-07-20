import React from "react"
import { SketchPicker } from 'react-color'

export default React.memo((props: any) => {
  const { color, onChange } = props
  const style = {
    position: 'fixed',
    display: 'flex',
    width: '260rem',
    top: '100rem',
    right: '260rem',
  }
  return (
    // @ts-ignore
    <div className={'base-picker'} style={style}>
      <SketchPicker
        style={{ width: '100%' }}
        color={color || 'white'}
        onChange={onChange}
      />
    </div>
  )
})