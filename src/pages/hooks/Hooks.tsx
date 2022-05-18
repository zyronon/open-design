import {useCallback, useEffect, useState} from "react";
import {memo} from "react";
import * as React from 'react'

import {Button} from "antd";

export default function Hooks() {

  let [count, setCount] = useState(0)
  useEffect(() => {
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
      {/*<Button onClick={handleClick}>Click2</Button>*/}
    </>
  )
}