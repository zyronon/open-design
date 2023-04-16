import {ShapeSelect} from "./ShapeSelect";
import {BaseConfig, Rect} from "../../config/BaseConfig";

//统一出口类，BaseShape到最终的子类，中间可能还会加子类去拆分功能代码
export abstract class ParentShape extends ShapeSelect {

  abstract drawShape(ctx: CanvasRenderingContext2D, newLayout: Rect, parent?: BaseConfig): void
}