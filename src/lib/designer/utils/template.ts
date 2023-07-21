import {HandleMirroring, PenNetworkNode} from "../config/PenConfig"

export function generateNode(val?: any): PenNetworkNode {
  let node: PenNetworkNode = {
    x: 0,
    y: 0,
    cornerRadius: 0,
    realCornerRadius: 0,
    handleMirroring: HandleMirroring.RightAngle,
    cornerCps: [-1, -1],
    cps: [-1, -1],
  }
  return val ? Object.assign(node, val) : node
}