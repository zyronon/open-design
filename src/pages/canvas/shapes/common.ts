import {ShapeConfig, ShapeType} from "../type"
import {Frame} from "./Frame"
import {Rectangle} from "./Rectangle"
import {Ellipse} from "./Ellipse"
import {Polygon} from "./Polygon"
import {Star} from "./Star"
import {Img} from "./Img"
import {Text} from "./Text"
import {Pen} from "./Pen"
import {Pencil} from "./Pencil"

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
    case ShapeType.POLYGON:
      r = new Polygon(conf)
      break
    case ShapeType.STAR:
      r = new Star(conf)
      break
    case ShapeType.IMAGE:
      r = new Img(conf)
      break
    case ShapeType.TEXT:
      r = new Text(conf)
      break
    case ShapeType.PEN:
      console.log('config',conf)
      r = new Pen(conf)
      break
    case ShapeType.PENCIL:
      r = new Pencil(conf)
      break
  }
  return r
}
