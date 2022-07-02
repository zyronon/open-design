import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button} from 'antd';
import './index.scss'
import {clone} from "lodash"
import cx from "classnames"
import {useNavigate} from "react-router-dom";

export default function Test(props: any) {

  useEffect(() => {
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 500, 500)
    ctx.strokeStyle = 'gray'
    ctx.strokeRect(0, 0, 500, 500)

    // ctx.rotate(20 * Math.PI / 180)
    // ctx.moveTo(100, 100)
    // ctx.lineTo(400, 100)
    // ctx.lineTo(400, 200)
    // ctx.lineTo(100, 200)
    // ctx.lineTo(100, 100)
    // ctx.stroke()
    //
    // ctx.scale(-1, 1);
    // ctx.font = '48px serif';
    // ctx.fillText('Hello world!', -280, 90);
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    // return

    var strImgUrl = 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1600';
    var eleImg = document.createElement('img');
    eleImg.origin = '';
    eleImg.onload = function () {
      let rect = {x: 0, y: 300, w: 250, h: 100, rotate: 20}
      let {x, y, w, h, rotate} = rect
      // ctx.save()
      // ctx.scale(-1, 1)
      // ctx.translate(-(x + w / 2), h / 2)
      // ctx.rotate(rotate * Math.PI / 180)
      // ctx.drawImage(this, -w / 2, -h / 2, w, h);
      // ctx.restore()

      ctx.save()
      ctx.scale(-1, -1)
      ctx.translate(-(x + w / 2), -h / 2)
      ctx.rotate(rotate * Math.PI / 180)
      ctx.drawImage(this, -w / 2, -h / 2, w, h);
      ctx.restore()

      ctx.save()
      ctx.translate(x + w / 2, y + h / 2)
      ctx.drawImage(this, -w / 2, -h / 2, w, h);
      ctx.restore()

      ctx.save()
      ctx.translate(x + w / 2, y + h / 2)
      ctx.rotate(rotate * Math.PI / 180)
      ctx.drawImage(this, -w / 2, -h / 2, w, h);
      ctx.restore()
    };
    eleImg.src = strImgUrl;

    // ctx.moveTo()
  }, [])

  let nav = useNavigate()

  return (
    <div>
      <canvas width="500" height="500"></canvas>
      <Button onClick={() => nav('/')}>回/</Button>
    </div>
  );
}
