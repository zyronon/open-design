import * as React from "react";
import {useState} from "react";

export default function Counter() {

  console.log(1)
  // State: a counter value
  const [counter, setCounter] = useState(0)

  // Action: 当事件发生后，触发状态更新的代码
  const increment = () => {
    setCounter(prevCounter => prevCounter + 1)
  }

  // View: UI 定义
  return (
    <div>
      Value: {counter}
      <button onClick={increment}>Increment</button>
    </div>
  )
}