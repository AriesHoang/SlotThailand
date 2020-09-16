/**
 * Created by QuyetNguyen on 11/9/2016.
 */

var LoadingScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        var bg = new cc.Sprite("res/gate_bg_loading.jpg");
        bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        bg.scale = 0.8;
        this.addChild(bg);

        this.loadingSlider = new ccui.Slider();
        this.loadingSlider.scale = 0.68;
        this.loadingSlider.setTouchEnabled(false);
        this.loadingSlider.loadBarTexture("res/gate_loading_dictator.png");
        this.loadingSlider.loadProgressBarTexture("res/gate_loading_thumb.png");
        this.loadingSlider.setPercent(0);
        this.loadingSlider.x = cc.winSize.width/2;
        this.loadingSlider.y = cc.winSize.height/2 - 95;
        this.addChild(this.loadingSlider);


        var logo = new cc.Sprite("res/loading_logo.png");
        logo.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        logo.visible=false;
        this.addChild(logo);

        var label = new ccui.Text("Loading...", "arial", 30);
        label.x = cc.winSize.width / 2;
        label.y = this.loadingSlider.y - label.height - 5;
        this.title = label;
        label.enableOutline(cc.color("#000000"), 2);
        this.addChild(label);

        this.gameLaucher = new GameLaucher();
    },

    onEnter: function () {
        this._super();
        GlobalEvent.getInstance().addListener("onUpdateModule", this.onUpdateModule, this);
        GlobalEvent.getInstance().addListener("onLoadModule", this.onLoadModule, this);
        GlobalEvent.getInstance().addListener("onLoadModuleStatus", this.onLoadModuleStatus, this);

        //fix
        cc.director.replaceScene = cc.director.replaceScene || function (scene) {
            cc.director.runScene(scene);
        };
        this.schedule(this.startLoadResources, 0.3);
    },
    onExit: function () {
        this._super();
        this.gameLaucher = null;
        GlobalEvent.getInstance().removeListener(this);
    },
    startLoadResources: function () {
        if (window.cc_resources_search_path) {
            cc.loader.resPath = window.cc_resources_search_path;
        }
        cc.log("startLoadResource: " + cc.loader.resPath);
        this.unschedule(this.startLoadResources);
        this.gameLaucher.start();
    },

    onUpdateModule: function (name, data) {
        // var current = data["current"];
        // var target = data["target"];
        // if(data["module"] === "main"){
        //     var per = Math.floor(current / target * 50) + 25;
        // }
        // else{
        //     var per = Math.floor(this.moduleIndex / this.moduleReady.length * current / target * 25) + 75;
        // }
        // this.title.setString("Đang tải tài nguyên[" + per + "%]");
    },

    onLoadModule: function (name, data) {
        var current = data["current"];
        var target = data["target"];
        if (data["module"] === "main") {
            var per = Math.floor(current / target * 50) + 25;
        }
        else {
            var _p1 = 25.0 / this.moduleReady.length;
            var _p2 = (this.moduleIndex - 1) * _p1;
            var per = Math.floor(current / target / _p1 + _p2 + 75);
        }
        this.title.setString("Loading resource " + per + "%");
        this.loadingSlider.setPercent(per);
    },

    onLoadModuleStatus: function (name, data) {
        var status = data["status"];
        if (status === ModuleStatus.UpdateFailure) {
            this.title.setString("Cập nhật thất bại");
        }
        if (data["module"] === "main") {
            if (status === ModuleStatus.LoadResourceFinished) {
                this._getAllReadyModule();
                this._loadReadyModule();
            }
        }
        else {
            if (status === ModuleStatus.LoadResourceFinished) {
                this._loadReadyModule();
            }
        }
    },

    _getAllReadyModule: function () {
        cc.log("_getAllReadyModule");
        var allModule = ModuleManager.getInstance().allModuleName();
        var moduleReady = [];
        // for(var i=0;i<allModule.length;i++){
        //     if(allModule[i] !== "main"){
        //         var module = ModuleManager.getInstance().getModule(allModule[i]);
        //         moduleReady.push(module);
        //     }
        // }
        this.moduleReady = moduleReady;
        this.moduleIndex = 0;
    },

    _loadReadyModule: function () {
        if (this.moduleIndex >= this.moduleReady.length) {
            window._cc_finished_Loading();
        }
        else {
            this.moduleIndex++;
            this.moduleReady[this.moduleIndex - 1].loadModule();
        }
    },

    // updateLoadResources : function (current, target) {
    //     cc.log("updateLoadResources: "+current +"/"+target);
    // },
    // updateLoadTexture : function (current, target) {
    //     cc.log("updateLoadTexture: "+current +"/"+target);
    // },
    // onUpdateStatus : function (status) {
    //     cc.log("onUpdateStatus: "+status);
    //     if(status == LaucherStatus.OnLoadFinished){
    //         this.nextScene();
    //     }
    // }
});