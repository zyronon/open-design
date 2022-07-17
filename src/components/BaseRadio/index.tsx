import React, {memo, useEffect, useState} from "react";
import './index.scss'
import cx from "classnames";

export const BaseRadioGroup = memo((props: any) => {
  const {value = null, active, children, onChange, ...reset} = props
  const [selectItem, setSelectItem] = useState<any>({});

  useEffect(() => {
    if (value !== null) {
      // console.log('value', value)
      props.children.map((item: any) => {
        // console.log('item.props.value', item.props.value)
        if (item.props.value == value) {
          console.log(item.props)
          setSelectItem(item.props);
        }
      });
    }
  }, [value, props.children]);

  function onSelect(e: any) {
    props.children.map((item: any) => {
      if (item.props.value === e) {
        setSelectItem(item.props);
      }
    });
    onChange(e);
  }

  return (
    <div className={cx('base-radio-group', {
      'active': props.active
    })} {...reset}>
      {React.Children.map(children, (child: { props: { value: any } }) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        const childProps = {
          ...child.props,
          selected: selectItem.value === child.props.value,
          onSelect: () => onSelect(child.props.value),
        };
        return React.cloneElement(child, childProps);
      })}
    </div>
  )
})
export const BaseRadio = memo((props: any) => {
  const {value, children, selected, onSelect} = props;
  return (
    <div
      className={cx('base-radio', {'base-radio-active': selected})}
      onClick={onSelect}
    >
      {children}
    </div>
  );
})