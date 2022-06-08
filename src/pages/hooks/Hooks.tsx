import {useCallback, useEffect, useState} from "react";
import {memo} from "react";
import * as React from 'react'

import {Button} from "antd";
import eventBus from "../../utils/event-bus";

function Child() {
  let [c, setC] = useState(1)
  return <Button onClick={() => eventBus.emit('notice', ++c)}>child{c}</Button>
}

export default function Hooks() {

  let [count, setCount] = useState(0)
  useEffect(() => {
    eventBus.on('notice', e => {
      console.log('e-count', count)
    })

    console.log('count-start', count)
    return () => {
      setCount(o => {
        console.log('count-end', count)
        console.log('count-o', o)
        return o
      })
      console.log('count-end', count)
    }
  }, [])

  return (
    <>
      <p>{count}</p>
      <Button onClick={() => setCount(++count)}>Click</Button>
      <Child/>
    </>
  )
}