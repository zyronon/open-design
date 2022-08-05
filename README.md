矩形
旋转    
自由拉伸
翻转
翻转后的自由拉伸与旋转

画布的缩放与拖动

文字
输入
自动高度时的文本截断
文本的align，居中和居左

画多边形，是直接用圆心旋转正圆可以画出正多边形
变换多边形，需要用圆心旋转椭圆来画
求椭圆上的点：
x1 = (w/2) * Math.cos((角度 + i * 角度) / 180 * Math.PI);
y1 = (h/2) * Math.sin((角度 + i * 角度) / 180 * Math.PI);
 

Bugs:Vite + React,一个组件用到Context或Redux，如果写在同一页面，那么任何改动都会导致page reload
把Context或Redux单独写一个页面，包含组件，就可以正常hmr