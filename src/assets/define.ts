import {fontSize, fontWeight} from "./constant";

export enum RectType {
  LINE = 0,
  FILL = 1,
  WRAPPER = 2,
  SELECT = 3,
  TEXT = 4,
  IMG = 5,
  PENCIL = 6,
}

export interface RectImg {
  img: any,
}

export interface Rect extends RectText, RectImg {
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
  fillColor: string,
  borderColor: string,
  leftX?: number,
  topY?: number,
  rightX?: number,
  bottomY?: number,
  radius: number,
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

export enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export enum FontWeight {
  LIGHT = 300,
  REGULAR = 400,
  Normal = 500,
  MEDIUM = 600,
  BOLD = 700,
  HEAVY = 900,
}

export enum RectColorType {
  FillColor = 'fillColor',
  BorderColor = 'borderColor',
}

export enum FontFamily {
  SourceHanSerifCN = 'SourceHanSerifCN',
  SourceHanSansCN = 'SourceHanSansCN',
}

export interface RectText {
  brokenTexts: string[],
  texts: string[],
  textLineHeight: number,
  letterSpacing: number,
  textMode: TextMode,
  textBaseline: TextBaseline,
  textAlign: TextAlign,
  fontFamily: FontFamily,
  fontWeight: FontWeight,
  fontSize: number,
}