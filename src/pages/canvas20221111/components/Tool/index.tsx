import React, {memo} from "react";
import cx from "classnames";
import {ShapeType} from "../../type";
import Icon from "@icon-park/react/es/all";
import {Popover} from "antd";

export default memo((props: any) => {
  let {drawType,onChange} = props
  return (
    <div className={cx('tool', (
      drawType === ShapeType.SELECT ||
      drawType === ShapeType.SCALE
    ) && 'active')}>
      {drawType === ShapeType.SELECT
        &&
          <Icon type={'MoveOne'}/>
      }
      {drawType === ShapeType.SCALE
        &&
          <Icon type={'Scale'}/>
      }
      <Popover
        trigger={'click'}
        overlayClassName={'tool-popover'}
        content={
          <div className={'select'}>
            <div
              onClick={() => onChange(ShapeType.SELECT)}
              className={cx('option', drawType === ShapeType.SELECT && 'active')}>
              <div className="left">
                <Icon type={'CheckSmall'}/>
                <Icon type={'MoveOne'}/>
                <span className="name">选择</span>
              </div>
              <span className="hotkey">V</span>
            </div>
            <div
              onClick={() => onChange(ShapeType.SCALE)}
              className={cx('option', drawType === ShapeType.SCALE && 'active')}>
              <div className="left">
                <Icon type={'CheckSmall'}/>
                <Icon type={'Scale'}/>
                <span className="name">等比缩放</span>
              </div>
              <span className="hotkey">V</span>
            </div>
          </div>
        }>
        <Icon type={'Down'} size="14" className='arrow'/>
      </Popover>
    </div>
  )
})