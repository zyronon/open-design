import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import cx from 'classnames';
import ReactDOM from 'react-dom';
import { Down } from "@icon-park/react";

interface IProps {
  value: any;
  onChange: Function;
  children: any;
  prefix?: React.ReactNode;
  // prefix={<img src={require('@/assets/images/im/shijian@2x.png')} alt=""/>}
  selectRender?: Function;
  alwaysTop?: boolean;
}

const List = (props: any) => {
  let { open, cc, onClose } = props;
  const [active, setActive] = useState(false); // 弹窗的存在周期
  const [aniClassName, setAniClassName] = useState(''); // 动效的class
  const onTransitionEnd = () => {
    setAniClassName(open ? 'enter-done' : 'exit-done');
    if (!open) {
      setActive(false);
    }
  };

  const [style, setStyle] = useState<any>({});

  useEffect(() => {
    if (open) {
      setActive(true);
      setAniClassName('enter');
      setTimeout(() => {
        setAniClassName('enter-active');
      });
    } else {
      setAniClassName('exit');
      setTimeout(() => {
        setAniClassName('exit-active');
      });
    }
  }, [open]);

  useEffect(() => {
    if (props.parentRef.current) {
      let rect = props.parentRef.current.getBoundingClientRect();
      setStyle({
        bottom: document.body.clientHeight - rect.top + 'px',
        left: rect.left + 'px',
      });
    }
  }, [props.parentRef.current]);

  if (!open) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className={cx('b-select-option-list')} style={style} onTransitionEnd={onTransitionEnd}>
      {React.Children.map(cc, (child: { props: { value: any } }) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        const childProps = {
          ...child.props,
          selected: props.selectItem.value === child.props.value,
          onSelect: () => props.onSelect(child.props.value),
        };
        return React.cloneElement(child, childProps);
      })}
    </div>,
    document.body,
  );
};

const BaseSelect = (props: IProps) => {
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
        // console.log('item.props.value',item.props.value)
        if (item.props.value === value) {
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
    }
  }, []);

  const [show, setShow] = useState<boolean>(false);
  const elRef: any = useRef(null);

  useEffect(() => {
    const hide = (e: any) => {
      if (elRef.current.contains(e.target)) {
        return;
      }
      let list: any = document.querySelector('.b-select-option-list');
      let r = list.contains(e.target);
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
      <List
        open={show}
        cc={children}
        selectItem={selectItem}
        onSelect={onSelect}
        parentRef={elRef}
      />
    </div>
  );
};

const BaseOption = (props: any) => {
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
};

export {
  BaseSelect,
  BaseOption
};
