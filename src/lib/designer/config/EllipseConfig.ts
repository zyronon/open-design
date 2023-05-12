import {P} from "../types/type"
import {BaseConfig} from "./BaseConfig"

export interface EllipseConfig extends BaseConfig {
  /** @desc 圆弧总长度*/
  totalLength: number
  /** @desc 内圆的宽度
   * 因为内圆的长宽与外圆的长度是等比的。只需要一个就行了。通过比例可以算出来
   * */
  innerWidth: number
  /** @desc 圆弧起点长度*/
  startT: number,
  /** @desc 圆弧起点*/
  startPoint: P
  /** @desc 内圈圆弧起点*/
  innerStartPoint: P
  /** @desc 起点长度对应的 鼠标控制点*/
  startMouseControlPoint: P
  /** @desc 圆弧终点*/
  endPoint: P
  /** @desc 内圈圆弧终点*/
  innerEndPoint: P
  /** @desc 终点长度对应的 鼠标控制点*/
  endMouseControlPoint: P
  isComplete: boolean
}