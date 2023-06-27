import {ShapeProps, ShapeType} from "../types/type"
import {Frame} from "../shapes/Frame"
import {Rectangle} from "../shapes/Rectangle"
import {Ellipse} from "../shapes/Ellipse";
import {Star} from "../shapes/Star";
import {Polygon} from "../shapes/Polygon";
import {AssetImage} from "../shapes/AssetImage";
import {Text} from "../shapes/Text"
import {Pen} from "../shapes/Pen"

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
      r = new AssetImage(props)
      break
    case ShapeType.TEXT:
      r = new Text(props)
      break
    case ShapeType.PEN:
      r = new Pen(props)
      break
    // case ShapeType.PENCIL:
    //   r = new Pencil(props)
    //   break
    // case ShapeType.LINE:
    //   r = new Line(props)
    //   break
    // case ShapeType.ARROW:
    //   r = new Arrow(props)
    //   break
    // case ShapeType.RULER:
    //   r = new Ruler(props)
    //   break
    // case ShapeType.RULER_LINE:
    //   r = new RulerLine(props)
    //   break
  }
  return r
}
