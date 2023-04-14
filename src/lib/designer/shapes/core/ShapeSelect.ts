import {P} from "../../types/type";
import CanvasUtil2 from "../../engine/CanvasUtil2";
import helper from "../../utils/helper";
import {Math2} from "../../utils/math";
import {BaseShape} from "./BaseShape";

export class ShapeSelect extends BaseShape {
  //移动图形
  move(point: P) {
    let cu = CanvasUtil2.getInstance()
    let {x, y,} = point
    this.moved = true

    this.conf.center.x = this.original.center.x + (x - cu.mouseStart.x)
    this.conf.center.y = this.original.center.y + (y - cu.mouseStart.y)

    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    this.notifyConfUpdate()
    this.calcChildrenConf()
    cu.render()
  }

  //拖动左上旋转
  dragTopLeftRotation(point: P) {
    // console.log('dragTopLeftRotation')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let {center, original,} = this.conf
    let current = {x, y}
    // console.log('x-------', x, '          y--------', y)
    let moveDegree = Math2.getDegree(center, original, current)

    //这里要减去，父级的旋转角度
    let realRotation = (moveDegree < 180 ? moveDegree : moveDegree - 360)
    // console.log('旋转角度', realRotation)

    this.conf.realRotation = realRotation.toFixed2()
    this.conf.rotation = (realRotation - (this.parent?.conf?.realRotation ?? 0)).toFixed2()

    // console.log('dragTopLeftRotation', this.conf)
    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    this.notifyConfUpdate()
    this.calcChildrenConf()
    cu.render()
  }

  //拖动左上
  dragTopLeft(point: P) {
    // console.log('dragTopLeft')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    const conf = this.conf
    let {realRotation} = conf
    let isReverseW = false
    let isReverseH = false
    let current = {x, y}
    let newCenter = helper.getStraightLineCenterPoint(current, this.diagonal)
    let zeroDegreeTopLeft = Math2.getRotatedPoint(current, newCenter, -realRotation)
    let zeroDegreeBottomRight = Math2.getRotatedPoint(this.diagonal, newCenter, -realRotation)

    let newWidth = zeroDegreeBottomRight.x - zeroDegreeTopLeft.x
    let newHeight = zeroDegreeBottomRight.y - zeroDegreeTopLeft.y

    conf.layout.w = Math.abs(newWidth)
    conf.layout.h = Math.abs(newHeight)
    conf.center = newCenter

    if (this.original.flipHorizontal) {
      if (zeroDegreeTopLeft.x < this.diagonal.x) {
        isReverseW = true
      }
    } else {
      if (zeroDegreeTopLeft.x > this.diagonal.x) {
        isReverseW = true
      }
    }
    if (this.original.flipVertical) {
      if (zeroDegreeTopLeft.y < this.diagonal.y) {
        isReverseH = true
      }
    } else {
      if (zeroDegreeTopLeft.y > this.diagonal.y) {
        isReverseH = true
      }
    }
    if (isReverseW) {
      if (conf.flipHorizontal === this.original.flipHorizontal) this.flip(0, 'Diagonal')
    } else {
      if (conf.flipHorizontal !== this.original.flipHorizontal) this.flip(0, 'Diagonal')
    }
    if (isReverseH) {
      if (conf.flipVertical === this.original.flipVertical) this.flip(1, 'Diagonal')
    } else {
      if (conf.flipVertical !== this.original.flipVertical) this.flip(1, 'Diagonal')
    }
    // console.log(conf)
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.notifyConfUpdate()
    this.calcChildrenConf()
    cu.render()
  }

  //拖动上边
  dragTop(point: P) {
    // console.log('拖动上边')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let conf = this.conf
    let isReverseW = false
    const {realRotation} = conf
    if (realRotation) {
      const current = {x, y}
      const handlePoint = this.handLineCenterPoint
      const zeroAngleCurrentPoint = Math2.getRotatedPoint(current, handlePoint, -realRotation)
      const zeroAngleMovePoint = {x: handlePoint.x, y: zeroAngleCurrentPoint.y}
      const currentAngleMovePoint = Math2.getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
      const newHeight = Math.hypot(currentAngleMovePoint.x - this.diagonal.x, currentAngleMovePoint.y - this.diagonal.y)
      const newCenter = {
        x: this.diagonal.x + (currentAngleMovePoint.x - this.diagonal.x) / 2,
        y: this.diagonal.y + (currentAngleMovePoint.y - this.diagonal.y) / 2
      }
      conf.layout.h = newHeight
      conf.center = newCenter
      if (this.original.flipVertical) {
        if (currentAngleMovePoint.y < this.diagonal.y) isReverseW = true
      } else {
        if (currentAngleMovePoint.y > this.diagonal.y) isReverseW = true
      }
    } else {
      // conf.layout.y = (y - cu.offsetY)
      // conf.layout.h = this.original.box.bottomY - conf.layout.y
      // conf.center.y = conf.layout.y + conf.layout.h / 2
      let d = y - cu.mouseStart.y
      if (this.original.flipVertical) d = -d
      conf.layout.h = this.original.layout.h - d
      let d2 = d / 2
      conf.center.y = this.original.center.y + (this.original.flipVertical ? -d2 : d2)
      if (conf.layout.h < 0) {
        isReverseW = true
      }
      conf.layout.h = Math.abs(conf.layout.h)
    }
    if (isReverseW) {
      if (conf.flipVertical === this.original.flipVertical) this.flip(1, 'Diagonal')
    } else {
      if (conf.flipVertical !== this.original.flipVertical) this.flip(1, 'Diagonal')
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.notifyConfUpdate()
    this.calcChildrenConf()
    cu.render()
  }

  //拖动下边
  dragBottom(point: P) {
    // console.log('拖动下边')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let conf = this.conf
    let isReverseW = false
    const {realRotation} = conf
    if (realRotation) {
      const current = {x, y}
      const handlePoint = this.handLineCenterPoint
      const zeroAngleCurrentPoint = Math2.getRotatedPoint(current, handlePoint, -realRotation)
      const zeroAngleMovePoint = {x: handlePoint.x, y: zeroAngleCurrentPoint.y}
      const currentAngleMovePoint = Math2.getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
      const newHeight = Math.hypot(currentAngleMovePoint.x - this.diagonal.x, currentAngleMovePoint.y - this.diagonal.y)
      const newCenter = {
        x: this.diagonal.x + (currentAngleMovePoint.x - this.diagonal.x) / 2,
        y: this.diagonal.y + (currentAngleMovePoint.y - this.diagonal.y) / 2
      }
      conf.layout.h = newHeight
      conf.center = newCenter
      if (this.original.flipVertical) {
        if (currentAngleMovePoint.y > this.diagonal.y) isReverseW = true
      } else {
        if (currentAngleMovePoint.y < this.diagonal.y) isReverseW = true
      }
    } else {
      // conf.layout.y = (y - cu.offsetY)
      // conf.layout.h = this.original.box.bottomY - conf.layout.y
      // conf.center.y = conf.layout.y + conf.layout.h / 2
      let d = y - cu.mouseStart.y
      if (this.original.flipVertical) d = -d
      conf.layout.h = this.original.layout.h + d
      let d2 = d / 2
      conf.center.y = this.original.center.y + (this.original.flipVertical ? -d2 : d2)
      if (conf.layout.h < 0) {
        isReverseW = true
      }
      conf.layout.h = Math.abs(conf.layout.h)
    }
    if (isReverseW) {
      if (conf.flipVertical === this.original.flipVertical) this.flip(1, 'Diagonal')
    } else {
      if (conf.flipVertical !== this.original.flipVertical) this.flip(1, 'Diagonal')
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.notifyConfUpdate()
    this.calcChildrenConf()
    cu.render()
  }

  //拖动左边，最完整的
  dragLeft(point: P) {
    // console.log('拖动左边')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let conf = this.conf
    const {realRotation} = conf
    let isReverseW = false
    if (realRotation) {
      const current = {x, y}
      const handlePoint = this.handLineCenterPoint
      //0度的当前点：以当前边中间点为圆心，负角度偏转当前点，得到0度的当前点
      const zeroAngleCurrentPoint = Math2.getRotatedPoint(current, handlePoint, -realRotation)
      //0度的移动点：x取其0度的当前点的，y取当前边中间点的（保证在一条直线上，因为只能拖动x，y不需要变动）
      const zeroAngleMovePoint = {x: zeroAngleCurrentPoint.x, y: handlePoint.y}
      // 当前角度的移动点：以当前边中间点为圆心，正角度偏转
      const currentAngleMovePoint = Math2.getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
      //最新宽度：利用勾股定理求出斜边(不能直接zeroAngleMovePoint.x - this.diagonal.x相减，会有细微的差别)
      const newWidth = Math.hypot(currentAngleMovePoint.x - this.diagonal.x, currentAngleMovePoint.y - this.diagonal.y)
      //最新中心点：
      const newCenter = {
        x: this.diagonal.x + (currentAngleMovePoint.x - this.diagonal.x) / 2,
        y: this.diagonal.y + (currentAngleMovePoint.y - this.diagonal.y) / 2
      }
      conf.layout.w = newWidth
      conf.center = newCenter
      if (this.original.flipHorizontal) {
        if (currentAngleMovePoint.x < this.diagonal.x) isReverseW = true
      } else {
        if (currentAngleMovePoint.x > this.diagonal.x) isReverseW = true
      }
    } else {
      //dx和dragRight相反
      let d = x - cu.mouseStart.x
      //如果水平翻转，那么移动距离取反
      if (this.original.flipHorizontal) d = -d
      //原始值，加或减去移动的值
      conf.layout.w = this.original.layout.w - d
      let d2 = d / 2
      conf.center.x = this.original.center.x + (this.original.flipHorizontal ? -d2 : d2)
      //是否要反转w值，因为反向拉动会使w值，越来越小，小于0之后就是负值了
      if (conf.layout.w < 0) {
        isReverseW = true
      }
      //反向拉动会使w为负值，取绝对值
      conf.layout.w = Math.abs(conf.layout.w)
    }
    //如果反向拉伸，图形水平翻转,反之，图形保持和原图形一样的翻转
    if (isReverseW) {
      if (conf.flipHorizontal === this.original.flipHorizontal) this.flip(0, 'Diagonal')
    } else {
      if (conf.flipHorizontal !== this.original.flipHorizontal) this.flip(0, 'Diagonal')
    }
    this.conf = helper.calcConf(this.conf, this.parent?.conf)
    this.notifyConfUpdate()
    this.calcChildrenConf()
    cu.render()
  }

  //拖动右边
  dragRight(point: P) {
    // console.log('拖动右边')
    let {x, y,} = point
    let cu = CanvasUtil2.getInstance()
    let conf = this.conf
    const {realRotation} = conf
    let isReverseW = false

    if (realRotation) {
      const current = {x, y}
      const handlePoint = this.handLineCenterPoint
      const zeroAngleCurrentPoint = Math2.getRotatedPoint(current, handlePoint, -realRotation)
      const zeroAngleMovePoint = {x: zeroAngleCurrentPoint.x, y: handlePoint.y}
      const currentAngleMovePoint = Math2.getRotatedPoint(zeroAngleMovePoint, handlePoint, realRotation)
      const newWidth = Math.hypot(currentAngleMovePoint.x - this.diagonal.x, currentAngleMovePoint.y - this.diagonal.y)
      const newCenter = {
        x: this.diagonal.x + (currentAngleMovePoint.x - this.diagonal.x) / 2,
        y: this.diagonal.y + (currentAngleMovePoint.y - this.diagonal.y) / 2
      }
      conf.layout.w = newWidth
      conf.center = newCenter
      if (this.original.flipHorizontal) {
        //这里判断和left不同
        if (currentAngleMovePoint.x > this.diagonal.x) isReverseW = true
      } else {
        //这里判断和left不同
        if (currentAngleMovePoint.x < this.diagonal.x) isReverseW = true
      }
    } else {
      let d = x - cu.mouseStart.x
      if (this.original.flipHorizontal) d = -d
      //这里不同，left是减去dx
      conf.layout.w = this.original.layout.w + d
      let d2 = d / 2
      conf.center.x = this.original.center.x + (this.original.flipHorizontal ? -d2 : d2)
      if (conf.layout.w < 0) {
        isReverseW = true
      }
      conf.layout.w = Math.abs(conf.layout.w)
    }
    if (isReverseW) {
      if (conf.flipHorizontal === this.original.flipHorizontal) this.flip(0, 'Diagonal')
    } else {
      if (conf.flipHorizontal !== this.original.flipHorizontal) this.flip(0, 'Diagonal')
    }
    this.conf = helper.calcConf(conf, this.parent?.conf)
    this.notifyConfUpdate()
    this.calcChildrenConf()
    cu.render()
  }

}