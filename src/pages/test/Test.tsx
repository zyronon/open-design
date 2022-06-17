import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button} from 'antd';
import './index.scss'
import {clone} from "lodash"
import cx from "classnames"
// import { uuid2 } from "@/utils"
// @ts-ignore
import {v4 as uuid2} from 'uuid';


// 记录旧值的公用hooks
export function usePrevious(value: any) {
  const ref: any = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Test(props: any) {
  const [list, setList] = useState<any>(() => {
    return Array.from({length: 20}).map((v, i) => {
      return {
        id: uuid2(),
        isMe: i % 5 === 0,
        content: i % 5 === 0 ? '@我' : '普通信息'
      }
    })
  })

  function add() {
    setList((o: any[]) => {
      o.push({
        id: uuid2(),
        isMe: false,
        content: '普通信息'
      })
      return clone(o)
    })
  }

  const [callItem, setCallItem] = useState<any>(null)
  const prev = usePrevious(callItem); // 上一个激活的值

  function call() {
    let item = {
      id: uuid2(),
      isMe: true,
      content: 'call我',
      time: Date.now()
    }
    setList((o: any[]) => {
      o.push(item)
      return clone(o)
    })
    if (!callItem) {
      setCallItem(item)
    }
    if (alsoHover) {
      setCallItem(item)
    }
  }

  const [showCallTip, setShowCallTip] = useState(false)
  const [alsoHover, setAlsoHover] = useState(false)
  const cb = (entries: any) => {
    let item = entries[0]
    let id = item.target.id.substring(1)
    let isCanLook = item.isIntersecting
    setShowCallTip(!isCanLook)
    if (isCanLook) {
      setCallItem(null)
    }
    console.log(id, '--isCanLook--', isCanLook)
  }

  const [ob, setOb] = useState<IntersectionObserver>()
  useEffect(() => {
    if (ob) {
      ob.disconnect()
    }
    if (callItem) {
      let _ob = new IntersectionObserver(cb, {threshold: 1})
      setOb(_ob)
      let el = document.querySelector(`#a${callItem.id}`)
      if (el) {
        _ob.observe(el)
      }
    }
  }, [callItem])

  useEffect(() => {
    toEnd()
  }, [list])
  let listRef: any = useRef()
  const [show, setShow] = useState<boolean>(true)

  useEffect(() => {
    if (!show) {
      // setFirstCall(null)
      if (showCallTip) {
        setAlsoHover(true)
      }
    }
  }, [show])


  useEffect(() => {
    if (prev && !showCallTip && show) {
      console.log('prev-触发hover了', prev)
      let el: any = document.querySelector(`#a${prev.id}`)
      el.classList.toggle('call-hover')
      setTimeout(() => {
        el.classList.toggle('call-hover')
      }, 2000)
      setAlsoHover(false)
    }
  }, [prev, show, showCallTip])

  function jump() {
    if (alsoHover) return
    console.log('CallItem.id', callItem.id)
    let el: any = document.querySelector(`#a${callItem.id}`)
    // el.scrollIntoView({
    //   behavior: 'smooth',
    // })
    listRef.current.scrollTo({
      top: el.offsetTop - 50,
      behavior: 'smooth',
    })
  }

  function jumpTo() {
    let el: any = document.querySelector(`#a${list[2].id}`)
    el.scrollIntoView({
      behavior: 'smooth',
    })
  }

  function toEnd() {
    listRef.current.scrollTop = listRef.current.scrollHeight
  }


  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <div className={cx('wrapper')}>
        <div className={cx('listWrapper', {show})}>
          {
            showCallTip &&
              <Button onClick={jump} className={cx('callTip', {
                alsoHover
              })}>有人@我</Button>
          }
          <div className={cx('list',)} ref={listRef}>
            {
              list.map((v: any) => {
                return <div key={v.id} className="item" id={'a' + v.id}>{v.content}--{v.id}</div>
              })
            }
          </div>
        </div>
        <div className={cx('mask', {show: !show})}></div>
      </div>


      <div className="options">
        {/*<UserCardWrapper userId={1000685} onClose={() => {}} visible={true} />*/}
        <Button onClick={call}>@我</Button>
        <Button onClick={add}>添加</Button>
        <Button onClick={jumpTo}>跳转</Button>
        <Button onClick={toEnd}>到底</Button>
        <Button onClick={() => setShow(!show)}>显示</Button>
        {/*<SpaceShareModal2*/}
        {/*    visible={visible}*/}
        {/*    spaceInfo={{ id: 1000271 }}*/}
        {/*    setSpaceShareInfoModalVisible={() => setVisible(false)}*/}
        {/*/>*/}
      </div>

    </div>
  );
}
