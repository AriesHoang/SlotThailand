var SlotAladdin = SlotAladdin || {};

(function () {
    var res = SlotAladdin.res;
    var res_initial = SlotAladdin.res_initial;
    var res_texture = SlotAladdin.res_texture;

    SlotAladdin.LoadingScene = cc.Scene.extend({
        ctor: function () {
            this._super();
            var background = new cc.Sprite("res/SlotAladdin/main_background.png");
            cc.GlobalSlotAladdin.scaleBackground(background);
            background.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.addChild(background);

            var loadingLabel = new cc.Sprite("res/SlotAladdin/loading.png");
            loadingLabel.setPosition(cc.winSize.width / 2,
                cc.winSize.height / 2);
            this.addChild(loadingLabel);
            this.loadingLabel = loadingLabel;

            var fadeIn = new cc.FadeIn(0.3);
            var fadeOut = new cc.FadeOut(0.5);
            var action = new cc.RepeatForever(new cc.Sequence(fadeIn, fadeOut));
            loadingLabel.runAction(action);

            // cc.director.replaceScene = function (scene) {
            //     cc.director.runScene(new cc.TransitionFade(0.5, scene, cc.color("#000000")));
            // };

            var dialogLayer = new cc.LayerColor(cc.color(0, 0, 0, 200));
            dialogLayer.visible = false;
            this.addChild(dialogLayer, 420);
            this.dialogLayer = dialogLayer;
        },

        onEnter: function () {
            this._super();
            var thiz = this;
            cc.loader.register(res, {
                load: function (realUrl, url, res, cb) {
                    cc.loader.cache[url] = {};
                    setTimeout(function () {
                        cb && cb(null, cc.loader.cache[url]);
                        return cc.loader.cache[url];
                    }, Math.random() * 100);
                }
            });
            res.forEach(function (item) {
                cc.loader.release(item);
            });
            this.loadResources(0);
        },

        onEnterTransitionDidFinish:function () {
            this._super();
            // cc.log("onEnterTransitionDidFinish");
        },

        onExitTransitionDidStart:function () {
            this._super();
            // cc.log("onExitTransitionDidStart");
        },

        loadResources: function (index) {
            var thiz = this;
            if (cc.loader.getRes(res[index])) {
                if (index >= res.length - 1) {
                    for (var i = 0; i < res_texture.length; i++) {
                        var texture = res_texture[i];
                        cc.spriteFrameCache.addSpriteFrames(texture.plist, texture.img);
                        //thiz.loadingLabel.setString("Đang tải " + i + "/" + res_texture.length);
                        // cc.log("Đang tải " + i + "/" + res_texture.length + " " + texture.img);
                    }
                    SlotThoKing.SlotClient.getInstance().connect();
                }
                else {
                    this.loadResources(++index);
                }
                return;
            }

            cc.loader.load(res[index], function (err, result) {
                //thiz.loadingLabel.setString("Đang tải " + loadedCount + "/" + count);
                // cc.log(index + " " + res[index]);
            }, function () {// finished
                index++;
                if (index < res.length) {
                    thiz.loadResources(index);
                }
                else {
                    for (var i = 0; i < res_texture.length; i++) {
                        var texture = res_texture[i];
                        cc.spriteFrameCache.addSpriteFrames(texture.plist, texture.img);
                        //thiz.loadingLabel.setString("Đang tải " + i + "/" + res_texture.length);
                        // cc.log("Đang tải " + i + "/" + res_texture.length + " " + texture.img);
                    }
                    SlotAladdin.SlotClient.getInstance().connect();
                }
            });
        },

        onReconnect: function () {
            // var scene = new SlotAladdin.SlotScene();
            // // cc.director.replaceScene(scene);
            // cc.director.runScene(new cc.TransitionFade(0.5, scene));
        },
    });
})();
