import React from "react"

export default class Test extends React.Component<any, any> {
  canvasRef: any = React.createRef()

  componentDidMount() {
    let canvas: HTMLCanvasElement = this.canvasRef.current
    let ctx = canvas.getContext('2d')!

    let x = 10
    let y = 150
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arcTo(10, 10, 50, 0, 16);
    ctx.stroke();


    ctx.fillStyle = 'blue';
    ctx.fillRect(150, 20, 10, 10);
    ctx.fillStyle = 'red';
    ctx.fillRect(150, 100, 10, 10);
    ctx.fillRect(50, 20, 10, 10);

    ctx.stroke();
  }

  render() {
    return (
      <canvas ref={this.canvasRef}/>
    )
  }
}