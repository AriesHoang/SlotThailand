var SlotMaya = SlotMaya || {};

(function () {
    var res = SlotMaya.res;
    var res_initial = SlotMaya.res_initial;
    var res_texture = SlotMaya.res_texture;

    SlotMaya.LoadingScene = cc.Scene.extend({
        ctor: function () {
            this._super();
            var background = new cc.Sprite("res/SlotMaya/loading_maya_bg.png");
            cc.GlobalSlotMaya.scaleBackground(background);
            background.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.addChild(background);

            var loadingSprite = new cc.Sprite("res/SlotMaya/loading.png");
            loadingSprite.setPosition(cc.winSize.width / 2,
                cc.winSize.height / 2 + 187);
            loadingSprite.setScaleX(-1);
            this.addChild(loadingSprite);
            this.loadingLabel = loadingSprite;
            var actionBy = cc.rotateBy(0.6, 360);
            loadingSprite.runAction(cc.sequence(actionBy).repeatForever());
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

        onEnterTransitionDidFinish: function () {
            this._super();
        },

        onExitTransitionDidStart: function () {
            this._super();
        },

        loadResources: function (index) {
            var thiz = this;
            if (cc.loader.getRes(res[index])) {
                if (index >= res.length - 1) {
                    for (var i = 0; i < res_texture.length; i++) {
                        var texture = res_texture[i];
                        cc.spriteFrameCache.addSpriteFrames(texture.plist, texture.img);
                    }
                    SlotMaya.SlotClient.getInstance().connect();
                }
                else {
                    this.loadResources(++index);
                }
                return;
            }

            cc.loader.load(res[index], function (err, result) {
            }, function () {// finished
                index++;
                if (index < res.length) {
                    thiz.loadResources(index);
                }
                else {
                    for (var i = 0; i < res_texture.length; i++) {
                        var texture = res_texture[i];
                        cc.spriteFrameCache.addSpriteFrames(texture.plist, texture.img);
                    }
                    SlotMaya.SlotClient.getInstance().connect();
                }
            });
        },

        onReconnect: function () {
        },

        onExit: function () {
            this._super();
            if (this.loadingInterval)
                clearInterval(this.loadingInterval);
        }
    });
})();
