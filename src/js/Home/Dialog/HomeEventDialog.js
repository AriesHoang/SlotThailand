var HomeEventDialog = IDialog.extend({
    ctor: function (item) {
        this._super();
        this._initButton();
        this._initItemEvent(item);
    },
    _initItemEvent: function (item) {
        var thiz = this;
        var url = item.bannerUrl;
        var eventUrl = item.eventUrl;
        TextureDownloader.load(url, function (tex) {
            cc.spriteFrameCache.addSpriteFrames(url, tex);
            cc.log(url);
            var event = new cc.Sprite(tex);
            event.setScale(800 / event.width);
            event.onEnter = function () {
                cc.Sprite.prototype.onEnter.call(event);

                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,

                    onTouchBegan: function (touch, event) {
                        var loc = touch.getLocation();
                        if (cc.rectContainsPoint(
                                cc.rect(cc.winSize.width / 2 - 400, cc.winSize.height / 2 - 300,
                                    800, 600),
                                loc)) {
                            cc.Global.openURL(eventUrl);
                            return true;
                        }

                        return false;
                    }
                }, event);
            };
            thiz.addChild(event);
        });
        // var webView1 = new ccui.WebView();
        // webView1.setContentSize(400, 400);
        // webView1.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        // this.addChild(webView1);
        // webView1.loadURL("http://google.com");
    },
    _initButton: function () {
        var btnClose = new ccui.Button("home_dialog_button_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnClose.setPosition(580, 300);
        this.addChild(btnClose);

        var thiz = this;
        btnClose.addClickEventListener(function () {
            thiz.hide();
        });
    }
});