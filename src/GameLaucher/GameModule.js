/**
 * Created by Quyet Nguyen on 6/20/2017.
 */

var ResoucesLoaderStatus = ResoucesLoaderStatus || {};
ResoucesLoaderStatus.OnLoadResources = 1;
ResoucesLoaderStatus.OnLoadTexture = 2;
ResoucesLoaderStatus.OnLoadScript = 3;
ResoucesLoaderStatus.OnLoadFinished = 4;
ResoucesLoaderStatus.OnLoadSpine = 5;
ResoucesLoaderStatus.OnWaitingLoadResources = 100;

var ModuleStatus = ModuleStatus || {};
ModuleStatus.UpdateFailure = 1;
ModuleStatus.UpdateOk = 2;
ModuleStatus.LoadResourceFailure = 3;
ModuleStatus.LoadResourceFinished = 4;

var GameModule = cc.Class.extend({
    intervalUpdate:null,
    ctor: function (data) {
        this._resouces = [];
        this._textures = [];
        this._scripts = [];
        this._spineData = [];

        this._moduleLoaed = true;

        if(data != undefined){
            if(data.hasOwnProperty("texture"))
                this._initTexture(data["texture"]);
            if(data.hasOwnProperty("fonts"))
                this._initBitmapFont(data["fonts"]);
            if(data.hasOwnProperty("sound"))
                this._initSound(data["sound"]);
            if(data.hasOwnProperty("raw"))
                this._initRawFile(data["raw"]);
            if(data.hasOwnProperty("script"))
                this._initScript(data["script"]);
            if(data.hasOwnProperty("spine"))
                this._initSpine(data["spine"]);
        }



        this.itemLoaded = 0;
    },

    _initTexture: function (data) {
        cc.log("_initTexture: " + JSON.stringify(data));
        if (!data) {
            return;
        }

        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            this._initResource(obj["img"]);
            this._initResource(obj["plist"]);
            this._moduleLoaed = false;
        }
        this._textures = data;
    },

    _initBitmapFont: function (data) {
        cc.log("_initBitmapFont: " + JSON.stringify(data));
        if (!data) {
            return;
        }

        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            this._initResource(obj["img"]);
            this._initResource(obj["fnt"]);
            this._moduleLoaed = false;
        }
    },

    _initSound: function (data) {
        cc.log("_initSound: " + JSON.stringify(data));
        if (!data) {
            return;
        }

        for (var i = 0; i < data.length; i++) {
            this._initResource(data[i]);
            this._moduleLoaed = false;
        }
    },

    _initScript: function (data) {
        cc.log("_initScript: " + JSON.stringify(data));
        if (!data || data.length === 0) {
            return;
        }
        this._scripts = data;
        this._moduleLoaed = false;
    },

    _initSpine: function (data) {
        cc.log("_initSpine: " + JSON.stringify(data));
        for (var key in data) {
            if (!data.hasOwnProperty(key))
                continue;
            var spine = new SpineDataItem(key);
            spine._initWithData(data[key]);
            this._spineData.push(spine);

            var tex = spine._texture;
            for (var i = 0; i < tex.length; i++) {
                cc.log("text: " + tex[i]);
                this._resouces.push(tex[i]);
            }
            cc.log("spine: " + JSON.stringify(spine));
                this._resouces.push(spine._jsonFile);
                this._resouces.push(spine._atlasFile);
            this._moduleLoaed = false;
        }
    },

    _initRawFile: function (data) {
        cc.log("_initRawFile: " + JSON.stringify(data));
        if (!data) {
            return;
        }

        for (var i = 0; i < data.length; i++) {
            this._initResource(data[i]);
            this._moduleLoaed = false;
        }
    },

    _initResource: function (res) {
        cc.log("_initResource: " + JSON.stringify(res));
        if (res) {
            // if(cc.sys.isNative)
            //     res = "src/" + res;
            this._resouces.push(res);
        }
    },

    _updateLoadResources: function () {
        cc.log("_updateLoadResources: " + JSON.stringify(this._resouces));
        if (!this._resouces || this._resouces.length === 0) {
            this._status = ResoucesLoaderStatus.OnLoadTexture;
            return;
        }
        this._status = ResoucesLoaderStatus.OnWaitingLoadResources;
        var thiz = this;
        if(cc.sys.isNative){
            this._resouces
        }
        cc.log("cc.loader.load: " + JSON.stringify(this._resouces));


        cc.loader.load(this._resouces,
            function (result, count, loadedCount) {
                cc.log("result: " + result);
                thiz._currentStep = (loadedCount + 1);
                thiz._onLoadProcess();
            }, function () { //finished
                cc.log("finished load resource!");
                thiz.itemLoaded = 0;
                thiz._status = ResoucesLoaderStatus.OnLoadTexture;
            });
    },

    _updateLoadTexture: function () {
        cc.log("_updateLoadTexture: ");
        if (this.itemLoaded >= this._textures.length) {
            this.itemLoaded = 0;
            this._status = ResoucesLoaderStatus.OnLoadSpine;
        }
        else {
            var texture = this._textures[this.itemLoaded];
            if (texture["plist"]) {
                cc.spriteFrameCache.addSpriteFrames(texture["plist"], texture["img"]);
            }
            this.itemLoaded++;

            this._currentStep++;
            this._onLoadProcess();
        }
    },

    _updateLoadSpine: function () {
        // cc.log("_updateLoadSpine: " + JSON.stringify(this.itemLoaded));
        // cc.log("this._spineData: " + JSON.stringify(this._spineData));
        if (this.itemLoaded >= this._spineData.length) {
            this.itemLoaded = 0;
            this._status = ResoucesLoaderStatus.OnLoadScript;
        }
        else {
            var spine = this._spineData[this.itemLoaded];
            cc.log("spine Item: " + JSON.stringify(spine));
            spine._load();
            cc.log("Loaded!!!!");
            this.itemLoaded++;
            this._currentStep++;
            this._onLoadProcess();
        }
    },

    _updateLoadScript: function () {
        cc.log("_updateLoadScript: ");
        if(cc.sys.isNative)
        if (!this._scripts || this._scripts.length === 0) {
            this._status = ResoucesLoaderStatus.OnLoadFinished;
            return;
        }

        this._status = ResoucesLoaderStatus.OnWaitingLoadResources;
        var thiz = this;
        cc.loader.loadJs(cc.loader.resPath, this._scripts, function (err) {
            if (err) {
                throw new Error(err);
            }
            else {
                thiz._currentStep++;
                thiz._onLoadProcess();
                thiz.itemLoaded = 0;
                thiz._status = ResoucesLoaderStatus.OnLoadFinished;
            }
        });
    },

    _updateLoadFinished: function () {
        cc.log("_updateLoadFinished: ");
        if(!cc.sys.isNative)
            cc.director.getScheduler().unscheduleUpdate(this);
        else
            clearInterval(this.intervalUpdate);
        if (this._finishedCallback) {
            this._finishedCallback(true);
            this._finishedCallback = null;
        }
        this._moduleLoaed = true;

        GlobalEvent.getInstance().postEvent("onLoadModuleStatus", {
            module: this.name,
            status: ModuleStatus.LoadResourceFinished
        });
    },

    _onLoadProcess: function () {
        cc.log("_onLoadProcess:: this.name: " + this.name + " - this._currentStep: " + this._currentStep + " - this._targetStep: " + this._targetStep);
        GlobalEvent.getInstance().postEvent("onLoadModule", {
            module: this.name,
            current: this._currentStep,
            target: this._targetStep
        });
    },

    loadModule: function (cb) {
        this._finishedCallback = cb;

        if (this._moduleLoaed) {
            this._updateLoadFinished();
        }
        else {
            //load
            this._targetStep = this._resouces.length;
            this._targetStep += this._textures.length;
            this._targetStep += this._spineData.length;
            this._targetStep += 1;
            this._currentStep = 0;

            this._finishedCallback = cb;
            this._status = LaucherStatus.OnLoadResources;
            if(!cc.sys.isNative)
                cc.director.getScheduler().scheduleUpdate(this, 0, false);
            else {
                var self = this;
                this.intervalUpdate = setInterval(function () {
                    self.update();
                },1);
            }

        }
    },

    loadScript: function (cb) {
        var thiz;
        cc.loader.loadJs(cc.loader.resPath, this._scripts, function (err) {
            if (err) {
                throw new Error(err);
            }
            else {
                //finished
                if (cb) {
                    cb(thiz);
                }
            }
        });
    },

    unloadModule: function (cb) {
        for (var i = 0; i < this._textures.length; i++) {
            if (this._textures[i]["plist"]) {
                // cc.log(this._textures[i]["plist"]);
                cc.spriteFrameCache.removeSpriteFramesFromFile(this._textures[i]["plist"]);
            }
            if (this._textures[i]["img"]) {
                // cc.log(this._textures[i]["img"]);
                cc.textureCache.removeTextureForKey(this._textures[i]["img"]);
            }
        }
        for (var i = 0; i < this._resouces.length; i++) {
            if (this._resouces[i])
                cc.loader.release(this._resouces[i]);
        }

        for (var i = 0; i < this._scripts.length; i++) {
            if (this._scripts[i]) {
                // cc.log(this._scripts[i]);
                cc.loader.release(this._scripts[i]);
            }
        }
        // for (var i = 0; i < this._resouces.length; i++) {
        //     cc.log(this._resouces[i]);
        // }
        cb && cb();
    },

    isLoaded: function () {
        return this._moduleLoaed;
    },

    isReady: function () {
        return true;
    },

    update: function (dt) {
        cc.log("GameModule: " + this._status);
        switch (this._status) {
            case (ResoucesLoaderStatus.OnLoadResources) : {
                this._updateLoadResources();
                break;
            }
            case (ResoucesLoaderStatus.OnLoadTexture) : {
                this._updateLoadTexture();
                break;
            }
            case (ResoucesLoaderStatus.OnLoadSpine) : {
                this._updateLoadSpine();
                break;
            }
            case (ResoucesLoaderStatus.OnLoadScript) : {
                this._updateLoadScript();
                break;
            }
            case (ResoucesLoaderStatus.OnLoadFinished) : {
                this._updateLoadFinished();
                break;
            }
        }
    },

    getName: function () {
        return this.name;
    }
});

var ModuleManager = (function () {
    var _instance = null;
    var Clazz = cc.Class.extend({
        ctor: function () {
            this._allModule = {};
        },

        init: function (versionFile, func) {
            cc.log("ModuleManager init:" + versionFile);
            var thiz = this;
            cc.loader.loadTxt(versionFile, function (err, txt) {
                cc.log("versionFile:" + versionFile);
                cc.log("ModuleManager: " + txt);
                var data = JSON.parse(txt);
                thiz._loadModuleDefine(data["module"], func);
            });


        },

        _loadModuleDefine: function (data, cb) {
            cc.log("_loadModuleDefine");
            var thiz = this;
            var files = [];
            for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;
                files.push(data[key]);
            }

            cc.loader.load(files, function () {

            }, function () {
                thiz._initAllModule(data, cb);
                if (cb) {
                    cb();
                }
            })
        },

        _initAllModule: function (data) {
            for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;
                var moduleData = cc.loader.getRes(data[key]);
                var module = new GameModule(moduleData);
                module.name = key;
                this._allModule[key] = module;
            }
        },

        getModule: function (moduleName) {
            return this._allModule[moduleName];
        },

        allModuleName: function () {
            var ret = [];
            for (var name in this._allModule) {
                if (!this._allModule.hasOwnProperty(name)) continue;
                if (name !== "main") {
                    ret.push(name);
                }
            }
            return ret;
        }
    });

    Clazz.getInstance = function () {
        if (!_instance) {
            _instance = new Clazz();
        }
        return _instance;
    };

    return Clazz;
})();