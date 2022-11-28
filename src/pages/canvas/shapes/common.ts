import {ShapeConfig, ShapeProps, ShapeType} from "../type"
import {Frame} from "./Frame"
import {Rectangle} from "./Rectangle"
import {Ellipse} from "./Ellipse"
import {Polygon} from "./Polygon"
import {Star} from "./Star"
import {Img} from "./Img"
import {Text} from "./Text"
import {Pen} from "./Pen"
import {Pencil} from "./Pencil"
import {Line} from "./Line"
import {Arrow} from "./Arrow"

export const getShapeFromConfig = (props: ShapeProps): any => {
  const {conf} = props
  let r
  switch (conf.type) {
    case ShapeType.FRAME:
      r = new Frame(props)
      break
    case ShapeType.RECTANGLE:
      r = new Rectangle(props)
      break
    case ShapeType.ELLIPSE:
      r = new Ellipse(props)
      break
    case ShapeType.POLYGON:
      r = new Polygon(props)
      break
    case ShapeType.STAR:
      r = new Star(props)
      break
    case ShapeType.IMAGE:
      r = new Img(props)
      break
    case ShapeType.TEXT:
      r = new Text(props)
      break
    case ShapeType.PEN:
      r = new Pen(props)
      break
    case ShapeType.PENCIL:
      r = new Pencil(props)
      break
    case ShapeType.LINE:
      r = new Line(props)
      break
    case ShapeType.ARROW:
      r = new Arrow(props)
      break
  }
  return r
}
