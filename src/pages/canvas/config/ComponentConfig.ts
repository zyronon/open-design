import {BaseConfig} from "./BaseConfig"

export interface ComponentConfig extends BaseConfig {
  description: string,//组件的描述信息。
  ukey: string//组件唯一的key。
  isExternal: boolean//是否是团队库组件。
  publishStatus: PublishStatus//当前组件的团队库发布状态。
}

/**
 * @desc 描述可发布到团队库的元素（即样式和组件）的状态。
 * UNPUBLISHED：未发布到团队库.
 CURRENT：已发布，已发布版本与本地版本匹配。
 CHANGED：已发布，但具有本地更改。
 * */
type PublishStatus = "UNPUBLISHED" | "CURRENT" | "CHANGED"
