import React, { memo, useState } from "react"
import { store } from "../../store"
import './index.scss'
import Icon from "@icon-park/react/es/all";
import cx from "classnames"
import { useSelector } from "react-redux"

const RectComponent = (props: any) => {
  const [expand, setExpand] = useState<boolean>(true)

  return (
    <div className="component" {...props}>
      <div className="top" style={{ paddingLeft: (props.index + 1) * 20 + 'rem' }}>
        {
          props.item?.children &&
          <Icon type={'right-one'} size={14} theme={'filled'} onClick={() => setExpand(!expand)}/>
        }
        <span className={'name'}>{props.item.name}</span>
      </div>
      {
        expand && <div className="children">
          {
            props.item?.children?.map((item: any, index: any) => {
              return <RectComponent
                item={item}
                key={index}
                index={props.index + 1}
              />
            })
          }
        </div>
      }
    </div>
  )
}

export default memo((props: any) => {
  const [tabIndex, setTabIndex] = useState<number>(0)
  const rectList = useSelector((state: any) => state.canvas.rectList)
  const pageList = useSelector((state: any) => state.canvas.pageList)

  const components = [
    {
      name: '1',
      children: [
        {
          name: '2'
        },
        {
          name: '2'
        },
        {
          name: '2'
        },
      ]
    },
    {
      name: '1',
      children: [
        {
          name: '2'
        },
        {
          name: '2'
        },
        {
          name: '2'
        },
      ]
    },
    {
      name: '1',
      children: [
        {
          name: '2'
        },
        {
          name: '2'
        },
        {
          name: '2'
        },
      ]
    }
  ]
  return (
    <div className="left-wrapper">
      <div className="temp">
        <div className="component" onClick={() => props.init()}>
          刷新
        </div>
        <div className="component" onClick={() => props.navigate('/test')}>
          去test
        </div>
        <div className="component" onClick={props.print}>
          打印
        </div>
        <div className="component" onClick={() => console.log(store.rectList)}>
          打印2
        </div>
      </div>
      <div className="tabs">
        <div className={cx('tab', tabIndex === 0 && 'active')} onClick={() => setTabIndex(0)}>
          图层
        </div>
        <div className={cx('tab', tabIndex === 1 && 'active')} onClick={() => setTabIndex(1)}>
          组件
        </div>
        <div className={cx('tab', tabIndex === 2 && 'active')} onClick={() => setTabIndex(2)}>
          资源库
        </div>
      </div>
      {
        tabIndex === 0 &&
        <div className={'layer'}>
          <div className="page-wrapper">
            <div className="header">
              <div className="left">
                <div className="name">页面</div>
              </div>
              <div className="right">
                <Icon type={'plus'} size="20"/>
                <Icon type={'down'} size="20"/>
              </div>
            </div>
            <div className="pages">
              {
                pageList.map((v, i) => {
                  return <div className="page" key={i}>
                    <Icon type={'check-small'} size="16"/>
                    <span>Cover</span>
                  </div>
                })
              }
            </div>
          </div>
          <div className="search">
            <Icon type={'search'} size="14"/>
            <Icon type={'down'} size="14"/>
            <input type="text" placeholder={'请输入'}/>
            <Icon type={'close-one'} className={'close'} theme="filled" size="18" fill="#8f8f8f"/>
          </div>
          <div className="components">
            <div className="scroll">
              {
                rectList.map((item, index) => {
                  return <RectComponent item={item} key={index} index={-1}/>
                })
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
})