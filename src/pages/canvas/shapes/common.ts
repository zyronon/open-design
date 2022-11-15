import {ShapeConfig, ShapeType} from "../type"
import {Frame} from "./Frame"
import {Rectangle} from "./Rectangle"
import {Ellipse} from "./Ellipse"

export const getShapeFromConfig = (conf: ShapeConfig): any => {
  let r
  switch (conf.type) {
    case ShapeType.FRAME:
      r = new Frame(conf)
      break
    case ShapeType.RECTANGLE:
      r = new Rectangle(conf)
      break
    case ShapeType.ELLIPSE:
      r = new Ellipse(conf)
      break
  }
  return r
}
