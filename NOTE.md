
- 翻转后，单边拉伸、自由拉伸时，均需要将当前点{x,y}进行对应（水平就翻转x，垂直就翻转y）翻转。同时渲染时要将tran(X,Y)加上两个中心点偏移量。最后停止变换也要将对应x，y加上两个中心点偏移量


```javascript
 if (flipHorizontal) {
  scaleX = -1
  // tranX = -tranX
  //如果在翻转情况下，拉伸要将tranX减去两个中心点偏移量
  if ((enterLT || enterL)) {
    console.log('tranX1', tranX)
    let d = oldCenter!.x - currentCenter!.x
    tranX += d * 2
    console.log('tranX2', tranX)
  }
}
```