import React, { memo, useEffect, useRef, useState } from 'react';
import './index.scss';
import cx from 'classnames';
import ReactDOM from 'react-dom';
import { CheckSmall, Down } from "@icon-park/react";
import Icon from "@icon-park/react/es/all";
import { useToggle } from "ahooks";

interface IProps {
  value: any;
  onChange: Function;
  children: any;
  prefix?: React.ReactNode;
  // prefix={<img src={require('@/assets/images/im/shijian@2x.png')} alt=""/>}
  selectRender?: Function;
  alwaysTop?: boolean;
}

const List = memo((props: any) => {
  let { open, cc, onClose } = props;

  const [style, setStyle] = useState<any>({});

  useEffect(() => {
    if (props.parentRef.current) {
      let rect = props.parentRef.current.getBoundingClientRect();
      // console.log('rect.height', rect)
      setStyle({
        top: rect.height + rect.top + 10 + 'px',
        left: rect.left + 'px',
      });
    }
  }, [props.parentRef.current]);

  if (!open) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={cx('b-select-option-list')} style={style}>
      {React.Children.map(cc, (child: { props: { value: any } }) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        const childProps = {
          ...child.props,
          selected: props.selectItem?.value === child.props.value,
          onSelect: () => props.onSelect(child.props.value),
        };
        return React.cloneElement(child, childProps);
      })}
    </div>,
    document.body,
  );
});

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
    console.log('value', value)
    if (value !== null) {
      setSelectItem(props?.children?.find((item: any) => item.props.value === value)?.props)
    }
  }, [value,]);

  useEffect(() => {
    if (value !== null) {
      let el: any = document.querySelector(`#select-option-${value}`);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  }, []);

  const [show, { toggle, set }] = useToggle<boolean>(false);
  const elRef: any = useRef(null);

  useEffect(() => {
    const hide = (e: any) => {
      if (elRef.current.contains(e.target)) {
        return;
      }
      let list: any = document.querySelector('.b-select-option-list');
      let r = list.contains(e.target);
      if (!r) {
        set(false);
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

  function onSelect(e: any) {
    if (onChange) {
      onChange(e);
    } else {
      setSelectItem(props?.children?.find((item: any) => item.props.value === value)?.props)
    }
    toggle();
  }

  return (
    <>
      <div className={'b-select'} onClick={toggle} ref={elRef}>
        <div className={'b-select-left'}>
          {
            selectItem &&
            (selectRender ? selectRender(selectItem) : selectItem.label)
          }
        </div>
        <div className={'b-select-right'}>
          <Down theme="outline" size="14" fill="#ffffff" className={cx({ 'b-select-arrow': show })}/>
        </div>
      </div>
      <List
        open={show}
        cc={children}
        selectItem={selectItem}
        onSelect={onSelect}
        parentRef={elRef}
      />
    </>
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
      <Icon type={'CheckSmall'} style={{ opacity: selected ? 1 : 0 }}/>
      {children}
    </div>
  );
});

export {
  BaseSelect,
  BaseOption
};
