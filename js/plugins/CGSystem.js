//=============================================================================
// GainCommand.js
//=============================================================================

/*:
 * @plugindesc CG系统
 * @author isuncy
 *
 * @help
 * 提供CG的获取，显示，功能
 *
 * 插件命令：
 * AddCG [name] [image] [description] - 添加CG
 * RemoveCG [name] - 移除CG
 *
 * [image]参数为图片文件名不需要后缀名，源文件需要为png格式，默认从img/pictures目录加载。
 */

(function() {

    //name, image, description
    //拓展Game_System，添加CG相关数据
    var _Game_System_Initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_Initialize.call(this);
        this._cgData = [];
    }
    Game_System.prototype.addCG = function(cgData) {
        for (var i = 0; i < this._cgData.length; i++) {
            if (this._cgData[i].name === cgData.name) {
                console.warn("CG with name " + cgData.name + " already exists. Skipping add.");
                return;
            }
        }
        this._cgData.push(cgData);
    }
    Game_System.prototype.getAllCG = function() {
        return this._cgData;
    }
    Game_System.prototype.removeCG = function(name) {
        for (var i = 0; i < this._cgData.length; i++) {
            if (this._cgData[i].name === name) {
                this._cgData.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    Game_System.prototype.getCG = function(name) {
        for (var i = 0; i < this._cgData.length; i++) {
            if (this._cgData[i].name === name) {
                return this._cgData[i];
            }
        }
        return null;
    }

    //1.自己的自定义窗体
    function Window_Test() {
        this.initialize.apply(this, arguments);
    }

    //2.继承一个窗体类，根据不同需求可以自行改动
    Window_Test.prototype = Object.create(Window_Command.prototype);

    //3.把构造函数指向自己
    Window_Test.prototype.constructor = Window_Test;

    //4.写初始化函数
    Window_Test.prototype.initialize = function (x, y) {
        Window_Command.prototype.initialize.call(this, x, y)//xy代表位置
        // this.refresh();//刷新窗口
        this.activate();//激活
    }

    //窗口类的核心方法，自定义代码就在这里写
    Window_Test.prototype.makeCommandList = function () {
        var cgData = $gameSystem.getAllCG();
        for (var i = 0; i < cgData.length; i++) {
            var symbol = "cg_"+cgData[i].name
            this.addCommand(cgData[i].name, symbol, true);
        }
    }


    //右侧的说明区域
    function CgDisplayWindow(){
        this.initialize.apply(this, arguments);
    }
    CgDisplayWindow.prototype = Object.create(Window_Base.prototype);
    CgDisplayWindow.prototype.constructor = CgDisplayWindow;

    CgDisplayWindow.prototype.initialize = function () {
        var x = 250;
        var y = 0;
        var width = 550;
        var height = Graphics.boxHeight - this.fittingHeight(1);
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._cgItem = {};
    }

    //窗口类的核心方法，自定义代码就在这里写
    CgDisplayWindow.prototype.setInfo = function(cgItem){
        // this._cgItem = cgItem;
        // this.refresh();
        this.contents.clear();
        this._currentImage = cgItem.image || null;
        if (cgItem.image) {
            var bitmap = ImageManager.loadPicture(cgItem.image);
            if (bitmap.isReady()) {
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, this.lineHeight(), this.contents.width, this.contents.height - this.lineHeight());
            } else {
                bitmap.addLoadListener(() => {
                    this.refresh();
                });
            }
        }
        if (cgItem.description) {
            this.drawText(cgItem.description, 0, 0, this.contents.width, 'left');
        }
    }

    CgDisplayWindow.prototype.refresh = function() {
        if (this._cgItem) {
            this.setInfo(this._cgItem);
        }
    }

    CgDisplayWindow.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        // 只有点击图片区域时才全屏
        if (this._currentImage && TouchInput.isTriggered()) {
            var bitmap = ImageManager.loadPicture(this._currentImage);
            var imgX = this.x + this.padding;
            var imgY = this.y + this.lineHeight() + this.padding;
            var imgW = this.contents.width;
            var imgH = this.contents.height - this.lineHeight();
            var tx = TouchInput.x;
            var ty = TouchInput.y;
            if (tx >= imgX && tx <= imgX + imgW && ty >= imgY && ty <= imgY + imgH) {
                this.showFullScreenImage(this._currentImage);
            }
        }
    };



    //这个就是点击指令后的场景
    function Scene_CG() {
        this.initialize.apply(this, arguments)
    }

    Scene_CG.prototype = Object.create(Scene_MenuBase.prototype);//自行查看窗体所在的场景
    Scene_CG.prototype.constructor = Scene_CG;
    Scene_CG.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this)
    }

    Scene_CG.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this)
        this.createCGWindow();
        this.createCGContentWindow();
        this.bindCommands();
    }

    Scene_CG.prototype.start = function () {
        Scene_MenuBase.prototype.start.call(this)
        this.windowCG.refresh();
    }

    Scene_CG.prototype.createCGContentWindow =function(){
        this._cgWindow = new CgDisplayWindow();
        this._cgWindow.setInfo($gameSystem.getAllCG()[0] || {});
        this.addWindow(this._cgWindow);
    }

    Scene_CG.prototype.createCGWindow = function () {

        var x = 0;
        var y = 0;
        // console.log(xx,yy)
        this.windowCG = new Window_Test(x, y)
        this.addWindow(this.windowCG);//根据需求，可以添加很多个窗口

    }

    Scene_CG.prototype.bindCommands = function () {
        this.windowCG.setHandler('ok', this.windowOK.bind(this));
        this.windowCG.setHandler('cancel', this.windowCancel.bind(this));
        var cgData = $gameSystem.getAllCG();
        if (!cgData || cgData.length === 0) {
            return;
        }
        for (let i = 0; i < cgData.length; i++) {
            let symbol = "cg_" + cgData[i].name;
            console.log("selected: ", symbol);
            this.windowCG.setHandler(symbol, function() {
                console.log("cg clicked: ", cgData[i].name);
                this._cgWindow.setInfo(cgData[i]);
                this.windowCG.activate();
            }.bind(this));
        }
    }

    //当点击时触发
    Scene_CG.prototype.windowOK = function () {
        console.log("ok")
        this.windowCG.activate();
    }

    //当返回时除法
    Scene_CG.prototype.windowCancel = function () {
        console.log("cancel")
        SceneManager.pop();//返回上一级
    }




    Window_MenuCommand.prototype.addOriginalCommands = function () {//这个方法是专门给我们提供的，可以用来重写。
        //在菜单指令中添加指令，但是要注意，如果只写了这个，是没有效果的，
        //必须在createCommandWindow中，给test注册响应函数才能点进去
        this.addCommand('CG', 'cgSystem', true);
    }


    Scene_Menu.prototype.commandCG = function () {
        SceneManager.push(Scene_CG);
    }


    Scene_Menu.prototype.createCommandWindow = function () {

        this._commandWindow = new Window_MenuCommand(0, 0);
        this._commandWindow.setHandler('item', this.commandItem.bind(this));
        this._commandWindow.setHandler('skill', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('status', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
        this._commandWindow.setHandler('options', this.commandOptions.bind(this));
        this._commandWindow.setHandler('save', this.commandSave.bind(this));
        this._commandWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this._commandWindow.setHandler('cgSystem', this.commandCG.bind(this));
        this.addWindow(this._commandWindow);
    }

CgDisplayWindow.prototype.showFullScreenImage = function(imageName) {
        if (this._fullScreenSprite) return; // 防止重复

        // 创建灰色遮罩
        var mask = new Sprite(new Bitmap(Graphics.boxWidth, Graphics.boxHeight));
        mask.bitmap.fillAll('rgba(0,0,0,0.7)');
        SceneManager._scene.addChild(mask);

        // 加载图片
        var sprite = new Sprite(ImageManager.loadPicture(imageName));
        sprite.x = 0;
        sprite.y = 0;

        // 保持宽高比缩放
        var sw = sprite.bitmap.width;
        var sh = sprite.bitmap.height;
        var dw = Graphics.boxWidth;
        var dh = Graphics.boxHeight;
        var scale = Math.min(dw / sw, dh / sh);
        sprite.scale.x = scale;
        sprite.scale.y = scale;
        // 居中显示
        sprite.x = (dw - sw * scale) / 2;
        sprite.y = (dh - sh * scale) / 2;

        SceneManager._scene.addChild(sprite);
        this._fullScreenSprite = sprite;
        this._fullScreenMask = mask;

        // 监听点击或按键关闭
        this._closeFullScreenListener = function() {
            if (sprite.parent) sprite.parent.removeChild(sprite);
            if (mask.parent) mask.parent.removeChild(mask);
            this._fullScreenSprite = null;
            this._fullScreenMask = null;
            TouchInput._triggered = false;
            document.removeEventListener('keydown', this._closeFullScreenListener);
        }.bind(this);

        // 点击关闭
        sprite.update = function() {
            if (TouchInput.isTriggered()) {
                this._closeFullScreenListener();
            }
        }.bind(this);

        // 按键关闭
        document.addEventListener('keydown', this._closeFullScreenListener);
    };

    //插件命令
    var Isuncy = Isuncy || {};
    Isuncy.Parameters = PluginManager.parameters('CGSystem');
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'AddCG') {
            var name = args[0];
            var image = args[1];
            var description = args.slice(2).join(' ');
            var cgData = {
                name: name,
                image: image,
                description: description
            };
            $gameSystem.addCG(cgData);
            $gameMessage.add(`获得CG：\\C[4]${name}\\C[0]`);
            console.log("Added CG: ", cgData);
        } else if (command === 'RemoveCG') {
            let name = args[0];
            if ($gameSystem.removeCG(name)) {
                console.log("Removed CG: ", name);
            } else {
                console.error("CG not found: ", name);
            }
        }
    }

})()
