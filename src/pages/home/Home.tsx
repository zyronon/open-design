import {Link} from "react-router-dom";
import * as React from "react";
import {Button, Modal} from "antd";
import style from './BaseModal.scss';
import {useEffect, useRef, useState} from "react";

function Home() {
  const [visible, setVisible] = React.useState(false);
  const [t, setT] = React.useState(false);

  useEffect(() => {
    console.log('2', visible)
  }, [t])

  function toggle() {
    setVisible(!visible);
  }

  const [count, setCount] = useState(0);

  const prevCountRef: any = useRef();
  useEffect(() => {
    prevCountRef.current = count;
    console.log('useEffect', count)

  });
  console.log('count', count)
  console.log('prevCountRef.current', prevCountRef.current)
  const prevCount = prevCountRef.current;

  return (
    <div>
      <h1>Now: {count}, before: {prevCount}</h1>;
      <Button onClick={() => setCount(count + 1)}>点击</Button>
    </div>
  )
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/layout/about">about</Link>
      </nav>
      <Button type="primary" onClick={toggle}>弹窗</Button>
      <Modal title="Basic Modal" visible={visible} onOk={toggle} onCancel={toggle}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <div className={style.baseModal}>
        <div className={style.modalHeader}>
          <h4 className={style.modalTitle}>Modal title</h4>
          <button type="button" className="close" aria-label="Close" onClick={toggle}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className={style.modalBody}>

        </div>
        <div className={style.modalFooter}>

        </div>
      </div>
    </>
  );
}

export default Home