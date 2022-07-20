import React, {useEffect, useRef} from "react"
// @ts-ignore
import {SketchPicker} from 'react-color'

export default React.memo((props: any) => {
  const {color, onChange, visible, setVisible} = props
  const style = {
    position: 'fixed',
    display: 'flex',
    width: '200rem',
    top: '100rem',
    right: '260rem',
  }
  const elRef: any = useRef(null);
  useEffect(() => {
    const hide = (e: any) => {
      let r = elRef.current?.contains(e.target);
      if (!r) {
        e.stopPropagation()
        setVisible(false);
      }
    };
    document.body.addEventListener('click', hide, true);
    return () => {
      document.body.removeEventListener('click', hide, true);
    };
  }, []);

  return (
    // @ts-ignore
    <div className={'base-picker'} style={style} ref={elRef}>
      <SketchPicker
        color={color || 'white'}
        onChange={onChange}
      />
    </div>
  )
})