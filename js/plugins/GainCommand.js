//=============================================================================
// GainCommand.js
//=============================================================================

/*:
 * @plugindesc 提供获取各种东西（物品，技能，武器，护甲）的插件命令
 * @author isuncy
 *
 * @help
 * 提供获取各种东西（物品，技能，武器，护甲）的插件命令，可配合其他插件使用。
 *
 * 插件命令：
 * GainItem [itemId] [amount] - 获取指定物品
 * GainSkill [skillId] [actorId] - 获取指定技能给指定角色
 * GainWeapon [weaponId] [amount] - 获取指定武器
 * GainArmor [armorId] [amount] - 获取指定护甲
 */

(function() {

    //插件命令
    var Isuncy = Isuncy || {};
    Isuncy.Parameters = PluginManager.parameters('GainCommand');
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'GainItem') {
            var itemId = Number(args[0]);
            let amount = Number(args[1]) || 1; // 默认数量为1
            var item = $dataItems[itemId];
            if (item) {
                $gameParty.gainItem(item, amount);
                $gameMessage.add(`获得物品：${item.name} x${amount}`);
                console.log("Gain Item: ", item.name, " x", amount);
            } else {
                console.error("Item not found: ", itemId);
            }
        }
        else if (command === 'GainSkill') {
            var skillId = Number(args[0]);
            var actorId = Number(args[1]);
            var actor = $gameActors.actor(actorId);
            if (actor) {
                actor.learnSkill(skillId);
                $gameMessage.add(`角色：${actor.name()} 获得技能：\\C[2]${$dataSkills[skillId].name}\\C[0]`);
                console.log("Gain Skill: ", skillId, " for Actor: ", actor.name());
            } else {
                console.error("Actor not found: ", actorId);
            }
        }
        else if (command === 'GainWeapon') {
            var weaponId = Number(args[0]);
            let amount = Number(args[1]) || 1; // 默认数量为1
            var weapon = $dataWeapons[weaponId];
            if (weapon) {
                $gameParty.gainItem(weapon, amount);
                $gameMessage.add(`获得武器：${weapon.name} x${amount}`);
                console.log("Gain Weapon: ", weapon.name, " x", amount);
            } else {
                console.error("Weapon not found: ", weaponId);
            }
        }
        else if (command === 'GainArmor') {
            var armorId = Number(args[0]);
            var amount = Number(args[1]) || 1; // 默认数量为1
            var armor = $dataArmors[armorId];
            if (armor) {
                $gameParty.gainItem(armor, amount);
                $gameMessage.add(`获得护甲：${armor.name} x${amount}`);
                console.log("Gain Armor: ", armor.name, " x", amount);
            } else {
                console.error("Armor not found: ", armorId);
            }
        }
    }

})()
