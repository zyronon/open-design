import { LineType, P } from "../types/type";
import { BaseConfig } from "./BaseConfig"

export type StrokeCap =
  'NONE'
  | 'ROUND'
  | 'SQUARE'
  | 'LINE_ARROW'
  | 'TRIANGLE_ARROW'
  | 'ROUND_ARROW'
  | 'RING'
  | 'DIAMOND'
  | 'LINE'

export type WindingRule = 'Nonzero' | 'Evenodd'

//点的类型
export enum HandleMirroring {
  RightAngle = 'RightAngle',//直角
  MirrorAngleAndLength = 'MirrorAngleAndLength',//完全对称
  MirrorAngle = 'MirrorAngle',//角度对称
  NoMirror = 'NoMirror',//不对称
}

export interface PenNetworkNode {
  x: number
  y: number
  cornerRadius: number
  realCornerRadius: number,//真实的圆角
  handleMirroring: HandleMirroring,
  cornerCps: number[]
  cps: number[]
}

export function getPenPoint(val: P) {
  return {
    ...{
      x: 0,
      y: 0,
      cornerRadius: 0,
      realCornerRadius: 0,
      handleMirroring: HandleMirroring.RightAngle,
      cornerCps: [-1, -1],
      cps: [-1, -1],
    },
    ...val
  }
}

export interface Region {
  loops: number[][]
  windingRule: WindingRule
}

//老起点下标、终点下标、控制点0下标、控制点1下标，arc控制点下标、arc终/起点下标，线段类型
//新：起点下标、终点下标、控制点0下标、控制点1下标，线段类型
export  type PenNetworkLine = [number, number, number, number, LineType]

export interface PenNetwork {
  ctrlNodes: P[],
  nodes: PenNetworkNode[]
  paths: PenNetworkLine[]
  regions: Region[]
}

export interface PenConfig extends BaseConfig {
  // penNetwork: PenNetwork
}