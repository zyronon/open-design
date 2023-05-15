import {useState} from 'react'
import './App.css'

function App() {

  function onChange(e: any) {
    console.log(e)

  }

  return (
    <>
      <canvas width={500} height={500}/>
      <textarea onChange={onChange}></textarea>
    </>
  )
}

export default App
