/**
 * Created by QuyetNguyen on 11/15/2016.
 */

var LaucherStatus = LaucherStatus || {};
LaucherStatus.OnLoadNotRun = 0;
LaucherStatus.OnLoadResources = 1;
LaucherStatus.OnWaitingLoadResources = 2;
LaucherStatus.OnLoadTexture = 3;
LaucherStatus.OnLoadFonts = 4;
LaucherStatus.OnLoadSound = 5;
LaucherStatus.OnLoadFinished = 6;

var GameLaucher = cc.Class.extend({
    ctor : function () {

    },

    start : function () {
        cc.log("GameLaucher start!");
        var thiz = this;
        var versionFile = "";
        if(window.cc_resources_search_path){
            versionFile = window.cc_resources_search_path + "/version.json";
        }
        else{
            versionFile = "src/version.json";
        }
        cc.log("GameLaucher start 2 - " + versionFile);
        ModuleManager.getInstance().init(versionFile, function () {
            cc.log("ModuleManager.getInstance...");
            thiz.loadMainModule();
        });
    },

    loadMainModule : function () {
        cc.log("loadMainModule!");
        var mainModule = ModuleManager.getInstance().getModule("main");
        mainModule.loadModule(function () {
            // var currentScene = cc.director.getRunningScene();
            // if(currentScene.nextScene){
            //     currentScene.nextScene();
            // }
        });
    }
});