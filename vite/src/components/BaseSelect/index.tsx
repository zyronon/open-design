import React, { memo, useEffect, useRef, useState } from 'react';
import './index.scss';
import cx from 'classnames';
import { Down } from "@icon-park/react";
import { isEmpty } from "lodash";

interface IProps {
  value: any;
  onChange: Function;
  children: any;
  prefix?: React.ReactNode;
  // prefix={<img src={require('@/assets/images/im/shijian@2x.png')} alt=""/>}
  selectRender?: Function;
  alwaysTop?: boolean;
}

const BaseSelect = memo((props: IProps) => {
  const {
    value = null,
    onChange,
    children,
    alwaysTop = false,
    prefix = null,
    selectRender = null,
  } = props;
  const [selectItem, setSelectItem] = useState<any>({});

  useEffect(() => {
    if (value !== null) {
      // console.log('value', value)
      props.children.map((item: any) => {
        // console.log('item.props.value', item.props.value)
        if (item.props.value == value) {
          // console.log(item.props)
          setSelectItem(item.props);
        }
      });
    }
  }, [value, props.children]);

  useEffect(() => {
    if (value !== null) {
      let el: any = document.querySelector(`#select-option-${value}`);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
        });
      }
      // console.log('va', value)
    }
  }, []);

  const [show, setShow] = useState<boolean>(false);
  const elRef: any = useRef(null);

  useEffect(() => {
    const hide = (e: any) => {
      let r = elRef.current.contains(e.target);
      if (!r) {
        setShow(false);
      }
    };
    if (show) {
      if (alwaysTop) {
        let list = document.querySelector('.b-select-option-list');
        list && (list.scrollTop = 0);
      }
      document.body.addEventListener('click', hide, false);
    } else {
      document.body.removeEventListener('click', hide, false);
    }
    return () => {
      document.body.removeEventListener('click', hide, false);
    };
  }, [show, alwaysTop]);

  function toggle() {
    setShow(!show);
  }

  function onSelect(e: any) {
    if (onChange) {
      onChange(e);
    } else {
      props.children.map((item: any) => {
        if (item.props.value === e) {
          setSelectItem(item.props);
        }
      });
    }
    toggle();
  }

  return (
    <div className={'b-select-wrapper'} ref={elRef}>
      <div className={'b-select'} onClick={toggle}>
        <div className={'b-select-left'}>
          {prefix}
          <span className={'b-select-label'}>
              {selectRender ? selectRender(selectItem) : selectItem.label}
          </span>
        </div>
        <div className={'b-select-right'}>
          <Down theme="outline" size="14" fill="#ffffff" className={cx({ 'b-select-arrow': show })}/>
        </div>
      </div>
      <div className={cx('b-select-option-list', { ['show']: show })}>
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
    </div>
  );
})

const BaseOption = memo((props: any) => {
  const { value, children, selected, onSelect } = props;
  return (
    <div
      id={`select-option-${value}`}
      className={cx('b-select-option', { 'b-select-selected': selected })}
      onClick={onSelect}
    >
      {children}
    </div>
  );
})

export {
  BaseSelect,
  BaseOption
};
