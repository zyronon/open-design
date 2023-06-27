import {P} from "../types/type";

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
export type HandleMirroring = "NONE" | "ANGLE" | "ANGLE_AND_LENGTH"

export interface PenNetworkNode {
  x: number
  y: number
  cornerRadius: number
  realCornerRadius?: number,//真实的圆角
  handleMirroring: HandleMirroring,
  cornerTangentStart: P,
  cornerTangentEnd: P,
}

export interface Region {
  loops: number[][]
  windingRule: WindingRule
}

export interface PenNetworkPath {
  start: number,
  end: number
  tangentStart: P,
  tangentEnd: P,
  arcCP: P,
  arcPoint: P
}

export interface PenNetwork {
  ctrlNodes: P[]
  nodes: PenNetworkNode[]
  paths: PenNetworkPath[]
  regions: Region[]
}

export interface PenConfig {
  pointNetwork: PenNetwork
}