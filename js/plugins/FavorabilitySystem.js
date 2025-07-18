//=============================================================================
// FavorabilitySystem.js
//=============================================================================

/*:
 * @plugindesc 好感度系统
 * @author isuncy
 *
 * @param MaxFavor
 * @desc 最大好感度值
 * @default 100
 *
 * @help
 * 人物好感度系统，在菜单中添加人物好感度选项，显示人物好感度信息。
 * 配合GainCommand.js插件使用更佳。
 *
 * 插件命令：
 * AddFavor [actorId] [amount] - 增加指定角色的好感度
 * SetFavor [actorId] [value] - 设置指定角色的好感度
 * FavorIfReachThen [actorId] [value] [command] [args...] - 如果指定角色的好感度达到或超过指定值，则执行命令
 */

(function() {



    var _Window_Base_DrawActorSimpleStatus = Window_Base.prototype.drawActorSimpleStatus;
    Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        _Window_Base_DrawActorSimpleStatus.call(this, actor, x, y, width);
        this.drawActorFavorability(actor, x, y+80, width);
    };
    Window_Base.prototype.drawActorFavorability = function(actor, x, y, width) {
        const favorability = actor.favorability() || 0;
        this.changeTextColor(this.textColor(27));
        const text  = '好感度: ' + favorability;
        this.drawText(text, x, y, width);
        this.resetTextColor();
    };

    // 扩展 Game_Actor 类，添加 favorability 属性
    Game_Actor.prototype.favorability = function() {
        return this._favorability || 0; // 默认值为0
    };
    Game_Actor.prototype.setFavorability = function(value) {
        this._favorability = value;
    };
    Game_Actor.prototype.increaseFavorability = function(amount) {
        this._favorability = (this._favorability || 0) + amount;
        if (this._favorability < 0) {
            this._favorability = 0;
        }
        if (this._favorability > Isuncy.Parameters.MaxFavor) {
            this._favorability = Isuncy.Parameters.MaxFavor;
        }
        this.refresh(); // 刷新角色状态
    };

    //插件命令
    var Isuncy = Isuncy || {};
    Isuncy.Parameters = PluginManager.parameters('FavorabilitySystem');
    Isuncy.Parameters.MaxFavor = Number(Isuncy.Parameters['MaxFavor'] || 100);

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'SetFavor') {
            const actorId = Number(args[0]);
            const value = Number(args[1]);
            const actor = $gameActors.actor(actorId);
            if (actor) {
                actor.setFavorability(value);
                actor.refresh();
            }
            console.log("set favor : ", actorId, value);
        } else if (command === 'AddFavor') {
            const actorId = Number(args[0]);
            const amount = Number(args[1]);
            const actor = $gameActors.actor(actorId);
            if (actor) {
                actor.increaseFavorability(amount);
            }
            console.log("set favor : ", actorId, amount);
        } else if (command === "FavorIfReachThen") {
            const actorId = Number(args[0]);
            const value = Number(args[1]);
            const command = args[2];
            const childArgs = args.slice(3);
            const actor = $gameActors.actor(actorId);
            if (actor && actor.favorability() >= value) {
                $gameMessage.add(`${actor.name()}好感度达到\\C[27] ${value}\\C[0]`);
                this.pluginCommand(command, childArgs);
            }
        }
    }

})()
