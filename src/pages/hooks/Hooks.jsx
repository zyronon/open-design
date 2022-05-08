import {useCallback, useEffect, useState} from "react";
import {memo} from "react";
import * as React from 'react'

// import {Button} from "antd";


function Button(props) {
  const {handleClick, children} = props;
  console.log('Button -> render');

  return (
    <button onClick={handleClick}>{children}</button>
  )
}

const MemoizedButton = React.memo(Button);

export default function Hooks() {

  console.log('hook->render')
  // const handleClick = () => {
  //   console.log('handleClick');
  //   increaseCount(clickCount + 1);
  // }

  const [text, updateText] = useState('Initial value');

  // const handleSubmit = useCallback(() => {
  //   console.log(`Text: ${text}`); // 每次输出都是初始值
  // }, [text]); // 把`text`写在依赖数组里

  let handleSubmit = ()=>{
    console.log(`Text: ${text}`); // 每次输出都是初始值
  }

  const [clickCount, increaseCount] = useState(0);
  // 这里使用了`useCallback`,这里依赖项因为传的空，所以父组件渲染也不会更新子组件
  const handleClick = useCallback(() => {
    console.log('handleClick');
    increaseCount(clickCount + 1);
  }, [])
  return (
    <>
      <input value={text} onChange={(e) => updateText(e.target.value)} />
      <p onClick={handleSubmit}>useCallback(fn, deps)</p>

      <p>{clickCount}</p>
      <MemoizedButton  handleClick={handleClick}>Click</MemoizedButton>
    </>
  )
}