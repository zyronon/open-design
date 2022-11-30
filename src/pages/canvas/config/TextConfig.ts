import {FontWeight,} from "../utils/type"
import {BaseConfig} from "./BaseConfig"


export interface TextConfig extends BaseConfig {
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
  /**
   * Text node properties
   * */
  hasMissingFont: boolean,//返回一个布尔值，代表文本节点所使用的字体中，是否存在未加载的（或丢失的）字体。
  /**
   * 相对于文本框的水平对齐方式。设置该属性需要确保字体加载完成。
   * */
  textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
  /**
   * 相对于文本框的垂直对齐方式。设置该属性需要确保字体加载完成。
   * */
  textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM'
  /** @desc 定义文本框的尺寸调整以及如何适配文本框内文字的行为。设置该属性需要确保字体加载完成。
   * 'NONE': 固定宽高，即文本框的尺寸是固定的（宽和高），无关其内容。
   * 'HEIGHT': 自动高度，即文本框的宽度是固定的，且会包裹文本内容，其高度随着内容得变化进行适配。
   * 'WIDTH_AND_HEIGHT': 单行模式，即文本框不会包裹其内容，文本框的宽高自动调整以适配其内容。
   * */
  textAutoResize: 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT'
  paragraphSpacing: number,//段落的垂直间距。设置该属性需要确保字体加载完成。
  hyperlinks: HyperlinkWithRange[]//获取文本节点的超链接数组。
  /**
   * Text content
   * */
  /**
   * 由于部分组合字符（如部分emoji表情、有序列表和无序列表的标识符等），是由两个或多个Unicode组成，
   * 直接使用characters.length则无法获取正确的长度。在设置和获取分段填充样式或列表样式时，
   * 建议使用 Array.from(textNode.characters).length 获取正确的文字长度和位置。
   * */
  characters: string//文本节点的原始字符。设置该属性需要确保字体加载完成。
  /**
   * TextStyles
   * */
  /*
  * 文字图层节点的特点之一是：它可以在不同的范围内采用不同的字体、字号、填充、样式等等。文本节点会对其进行分段表示，可获得文本节点的所有分段的样式属性。
  * */
  textStyles: TextSegStyle[]
  /*
  * 文字图层的 listStyles 属性表示文字的每一个段落是否设置了列表样式，其中 level 表示列表样式的缩进，当 level为 2 时，表示有2个缩进，为 0 时则表示没有缩进。
  * */
  listStyles: TextListStyle[]
}


/**
 * 表示超链接目标的对象。类型的可能值为：

 "PAGE": 超链接对象为一个页面。value值为当前文件中的pageId。
 "NODE": 超链接对象为一个容器节点。value值为当前文件中的frameId.
 "URL": 超链接对象为一个链接。value值为任意url。
 * */
interface Hyperlink {
  type: 'PAGE' | 'NODE' | 'URL',
  value: string
}

interface HyperlinkWithRange {
  start: number
  end: number
  hyperlink: Hyperlink
}

type ListType = 'ORDERED'  // 有序列表
  | 'BULLETED' // 无序列表
  | 'NONE' // 未设置列表样式

type TextListStyle = {
  // readonly type: listType
  readonly level: number
  readonly start: number
  readonly end: number
}

interface TextSegStyle {
  start: number;
  end: number;
  textStyleId: string;
  textStyle: {
    // fontName: FontName;
    fontSize: number;
    letterSpacing: LetterSpacing;
    lineHeight: LineHeight;
    textDecoration: TextDecoration;
    textCase: TextCase;
  };
  // fills: Paint[];
}


type LetterSpacing = {
  readonly value: number
  readonly unit: 'PIXELS' | 'PERCENT'
}

type LineHeight = {
  readonly value: number
  readonly unit: 'PIXELS'
}
type TextDecoration = 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH'

type TextCase = 'ORIGINAL' // 正常
  | 'UPPER' // 全大写
  | 'LOWER' // 全小写
  | 'TITLE' // 首字母大写

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

export enum FontFamily {
  SourceHanSerifCN = 'SourceHanSerifCN',
  SourceHanSansCN = 'SourceHanSansCN',
}
