
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

- 多边形
  - 当radius为0时，纯直线绘制，只需要用lineTo方法
  - 不为0是，采用arcTo绘制
  - 当自定义后，采用acrTo和quadraticCurveTo混合绘制，其中quadraticCurveTo又分为3种模式（完全对称、角度对称、不对称）

- 圆形
  - 用bezierCurveTo绘制，一个控制点为0.6倍长，另一个为0.5倍宽，可以对调
  - http://www.alloyteam.com/2015/07/canvas-hua-tuo-yuan-di-fang-fa/
  - 默认椭圆可以用直接用canvas api
  - 默认椭圆可以用压缩法来画

- 贝塞尔曲线
  - 原理
    - https://zh.javascript.info/bezier-curve
    - https://www.zhihu.com/question/29565629
  -在线
    - https://jarenchow.github.io/JanvasExamples/html/beziermaker.html
  - 从贝塞尔曲线反推控制点
    - https://jermmy.github.io/2016/08/01/2016-8-1-Bezier-Curve-SVG/
    - https://juejin.cn/post/6995482699037147166
  