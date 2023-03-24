//获取斜边长度
//给一个圆心点和其他点
import { P } from "../lib/designer/types/type"
import { Math2 } from "../lib/designer/utils/math"

//废弃
export function jiaodu2hudu(v: number) {
  return Math2.jiaodu2hudu(v)
}

//获取两点之间角度
export function getAngle(center: number[], one: number[], two: number[]) {
  return Math2.getAngle(center, one, two)
}

export function getRotatedPoint(point: any, center: any, rotate: number) {
  return Math2.getRotatedPoint(point, center, rotate)
}

export default function getCenterPoint(p1: P, p2: P) {
  return Math2.getCenterPoint(p1, p2)

}