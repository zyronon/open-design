import {fontSize, fontWeight} from "./constant";

export enum RectType {
  LINE = 0,
  FILL = 1,
  WRAPPER = 2,
  SELECT = 3,
  TEXT = 4,
}

export interface Rect extends RectText {
  id: number | string,
  name?: number | string,
  x: number,
  y: number,
  w: number,
  h: number,
  rotate: number,
  lineWidth: number,
  type: RectType,
  color: string,
  leftX?: number,
  topY?: number,
  rightX?: number,
  bottomY?: number,
  children: Rect[],
  flipVertical?: boolean,
  flipHorizontal?: boolean,
}

export enum TextMode {
  AUTO_W = 1,
  AUTO_H = 2,
  FIXED = 3,
}

export enum TextBaseline {
  LEFT = 1,
  RIGHT = 2,
  CENTER = 3,
}

export interface RectText {
  brokenTexts: string[],
  texts: string[],
  textLineHeight: number,
  letterSpacing: number,
  textMode: TextMode,
  textBaseline: TextBaseline,
  fontFamily: number,
  fontWeight: number,
  fontSize: number,
}