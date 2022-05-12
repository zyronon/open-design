import * as React from "react";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {decrement, increment} from "../../store/todo";
import {add, remove} from "../../store/post";

export default function Counter() {
  let todoList = useSelector(s => s.todo.list)
  let dispatch = useDispatch()


  let postList = useSelector(s => s.post)

  console.log(postList)

  const exampleThunkFunction = (dispatch, getState) => {
    const stateBefore = getState()
    console.log(`Counter before: ${stateBefore.post}`)
    dispatch(add(1, 2, 3))
    const stateAfter = getState()
    console.log(`Counter after: ${stateAfter.post}`)
  }


  // View: UI 定义
  return (
    <>
      <div>
        {todoList}
        <button onClick={() => dispatch(increment(1))}>Increment</button>
        <button onClick={() => dispatch(decrement(1))}>Decrement</button>
      </div>
      <p>-------------</p>
      <div>
        {postList.map(v => {
          return <span key={v.id}>{v.content}</span>
        })}
        <button onClick={() => dispatch(add(1, 2, 3))}>Increment</button>
        <button onClick={() => dispatch(remove(1))}>Decrement</button>
        <button onClick={() => dispatch(exampleThunkFunction)}>Decrement</button>
      </div>
    </>

  )
}