# FavorabilitySystem Plugin

---

## 一、功能简介
在菜单中可查看队伍中角色的好感度。  
支持在事件/脚本中动态增减好感度，并根据好感度触发后续剧情或奖励。  
与 **GainCommand.js** 插件搭配使用可获得更流畅的事件流程。

---

## 二、安装方法
1. 将 `FavorabilitySystem.js` 放入项目 `js/plugins` 目录。
2. 在插件管理器中启用本插件。

---

## 三、插件命令（事件编辑器 → 插件命令）
| 命令                 | 参数                                    | 说明               | 示例                                                                                              |
|--------------------|---------------------------------------|------------------|-------------------------------------------------------------------------------------------------|
| `AddFavor`         | `actorId` `amount`                    | 为指定角色增加好感度       | `AddFavor 1 10` → 为 1 号角色加 10 点好感                                                               |
| `SetFavor`         | `actorId` `value`                     | 直接设置指定角色的好感度值    | `SetFavor 2 100` → 将 2 号角色好感设为 100                                                              |
| `FavorIfReachThen` | `actorId` `value` `command` `args...` | 好感度达到或超过指定值时执行命令 | `FavorIfReachThen 3 50 GainItem 1` → 若 3 号角色好感≥50，则执行插件命令GainItem 1,获取编号为1的物品（需安装GainCommand插件） |

> 提示：`actorId` 对应数据库中角色的编号，与队伍是否加入无关。

---

## 四、常见问题（FAQ）
**Q1：为什么菜单里没有“人物好感度”选项？**  
A：确认插件已启用，且队伍中至少有一名角色。

**Q2：如何修改好感度上限？**  
A：在插件参数中修改 `maxFavor`。

