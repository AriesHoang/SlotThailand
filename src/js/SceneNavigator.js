var SceneNavigator = SceneNavigator || {};
SceneNavigator._currentModuleProperties = [];

SceneNavigator.GameId = SceneNavigator.GameId || {};
SceneNavigator.GameId.SlotWomenAgent = 6;
SceneNavigator.GameId.SlotMayA = 7;
SceneNavigator.GameId.SlotZodiac = 8;
SceneNavigator.GameId.SlotThreeKingdom = 9;
SceneNavigator.GameId.SlotAladdin = 10;
SceneNavigator.GameId.SlotHero = 11;

SceneNavigator.ModuleProperties = SceneNavigator.ModuleProperties || {};

SceneNavigator.ModuleProperties[SceneNavigator.GameId.SlotMayA] = {
    moduleName: "slotMaya",
    designResolution: cc.size(2048, 1152),
    startScript: "SlotMaya.resetGlobal();" +
        "cc.director.replaceScene(new SlotMaya.LoadingScene());",

    cleanupScript: "SlotMaya.SlotClient.getInstance().closeSocket();"
};

SceneNavigator.ModuleProperties[SceneNavigator.GameId.SlotZodiac] = {
    moduleName: "slotZodiac",
    designResolution: cc.size(2048, 1152),
    startScript: "SlotZodiac.resetGlobal();" +
        "cc.director.replaceScene(new SlotZodiac.LoadingScene());",

    cleanupScript: "SlotZodiac.SlotClient.getInstance().closeSocket();"
};

SceneNavigator.ModuleProperties[SceneNavigator.GameId.SlotWomenAgent] = {
    moduleName: "slotWomenAgent",
    designResolution: cc.size(2048, 1152),
    startScript: "SlotWomenAgent.resetGlobal();" +
        "cc.director.replaceScene(new SlotWomenAgent.LoadingScene());",

    cleanupScript: "SlotWomenAgent.SlotClient.getInstance().closeSocket();"
};
SceneNavigator.ModuleProperties[SceneNavigator.GameId.SlotAladdin] = {
    moduleName: "slotAladdin",
    designResolution: cc.size(2048, 1152),
    startScript: "SlotAladdin.resetGlobal();" +
    "cc.director.replaceScene(new SlotAladdin.LoadingScene());",

    cleanupScript: "SlotAladdin.SlotClient.getInstance().closeSocket();"
};
SceneNavigator.ModuleProperties[SceneNavigator.GameId.SlotHero] = {
    moduleName: "slotHero",
    designResolution: cc.size(2048, 1152),
    startScript: "SlotHero.resetGlobal();" +
    "cc.director.replaceScene(new SlotHero.LoadingScene());",

    cleanupScript: "SlotHero.SlotClient.getInstance().closeSocket();"
};
SceneNavigator.ModuleProperties[SceneNavigator.GameId.SlotThreeKingdom] = {
    moduleName: "slotThreeKingdom",
    designResolution: cc.size(2048, 1152),
    startScript: "SlotThreeKingdom.resetGlobal();" +
    "cc.director.replaceScene(new SlotThreeKingdom.LoadingScene());",

    cleanupScript: "SlotThreeKingdom.SlotClient.getInstance().closeSocket();"
};

SceneNavigator.startGame = function (gameId) {
    // cc.log("startGame: " + gameId);

    var moduleProperties = SceneNavigator.ModuleProperties[gameId];
    if (!moduleProperties)
        return;


    var finishLoad = function () {
        var currentDesignRes = cc.view.getDesignResolutionSize();
        var targetDesignRes = moduleProperties.designResolution;
        var frameSize = cc.sys.isNative ? cc.view.getFrameSize() : targetDesignRes;

        // change the design resolution
        // if the module doesn't have a startscene nor design resolution, do nothing
        if (targetDesignRes && moduleProperties.startScript &&
            (targetDesignRes.width !== currentDesignRes.width ||
                targetDesignRes.height !== currentDesignRes.height)) {

            if (cc.sys.isNative)
                targetDesignRes.height = targetDesignRes.width / frameSize.width * frameSize.height;

            SceneNavigator.setDesignResolutionSize(targetDesignRes.width, targetDesignRes.height, cc.ResolutionPolicy.SHOW_ALL);
        }
        //
        if (moduleProperties.startScript) {
            // cc.log(moduleProperties.startScript);
            eval(moduleProperties.startScript);
        }
    };

    var gameModule = ModuleManager.getInstance().getModule(moduleProperties.moduleName);
    cc.log("gameModule " + gameModule);

    if (!gameModule)
        return;
    if (!gameModule.isReady() && cc.sys.isNative) {
        HomeDownloadManager.getInstance().downloadModule(gameModule);
        return;
    } else if (!gameModule.isLoaded() && (!cc.sys.isNative)) {
        HomeDownloadManager.getInstance().downloadModule(gameModule);
        return;
    }

    if (SceneNavigator._unloading) {
        SceneNavigator._unloadCallback = function () {
            SceneNavigator.startGame(gameId);
        };
        return;
    }

    if (SceneNavigator._loading)
        return;
    SceneNavigator._loading = true;
    gameModule.loadModule(function () {

        finishLoad();
        SceneNavigator._currentModuleProperties.push(moduleProperties);
        SceneNavigator._loading = false;
    });
};

SceneNavigator.goToHomeScene = function () {
    var runningScene = cc.director.getRunningScene();

    // currently in homescene, do nothing
    if (runningScene.ctor === HomeScene.prototype.ctor) {
        // cc.log("Already in home scene");
        return;
    }

    var currentModuleProperties;
    for (var i = 0; i < SceneNavigator._currentModuleProperties.length; i++) {
        currentModuleProperties = SceneNavigator._currentModuleProperties[i];
        if (currentModuleProperties && currentModuleProperties.cleanupScript) {
            cc.log(currentModuleProperties.cleanupScript);
            eval(currentModuleProperties.cleanupScript);

            var module = ModuleManager.getInstance().getModule(currentModuleProperties.moduleName);
            if (module) {
                SceneNavigator._unloading = true;
                module.unloadModule(function () {
                    SceneNavigator._unloading = false;
                    if (typeof (SceneNavigator._unloadCallback) === "function") {
                        SceneNavigator._unloadCallback();
                    }
                    SceneNavigator._unloadCallback = null;
                });
            }
        }
    }

    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    var frameSize = cc.view.getFrameSize();
    var designHeight = 720.0;
    var designWidth = frameSize.width * designHeight / frameSize.height;
    if (designWidth < 960.0) {
        designWidth = 960.0;
    }
    if (designWidth > 1280.0) {
        designWidth = 1280.0;
    }
    if (!cc.sys.isNative)
        designWidth = 1280;
    SceneNavigator.setDesignResolutionSize(designWidth, designHeight, cc.ResolutionPolicy.SHOW_ALL);
    cc.winSize.screenScale = designWidth / 1280.0;

    SceneNavigator._currentModuleProperties = [];

    // cc.director.replaceScene(new HomeScene());
    var director = cc.director;

    director.runScene(new cc.TransitionFade(0, new HomeScene()));
    cc.Global.isShowLuckyDialog = false;
};

SceneNavigator.setDesignResolutionSize = function (width, height) {
    //var blackLayer = new cc.LayerColor(cc.color(0, 0, 0), cc.winSize.width + 500, cc.winSize.height + 500);
    cc.director.getRunningScene().removeAllChildren();
    cc.director.getRunningScene().stopAllActions();
    cc.view.setDesignResolutionSize(width, height, cc.ResolutionPolicy.SHOW_ALL);
};
