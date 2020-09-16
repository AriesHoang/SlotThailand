var HomeBottomBar = cc.Node.extend({
    ctor: function () {
        this._super();

        this._initMessageLabel();

        var bgButton = new cc.Sprite("#gate_bg_btn_bottom.png");
        bgButton.setScale(0.65);
        bgButton.setPosition(0, 45);
        this.addChild(bgButton);
        //
        // var animLogo = sp.SkeletonAnimation.createWithJsonFile("res/Animation/logo_animation.json", "res/Animation/logo_animation.atlas");
        // animLogo.setPosition(cc.winSize.width / 2 + 30, 0);
        // animLogo.scale = 0.7;
        // animLogo.setAnimation(0, "animation", true);
        // this.addChild(animLogo);
        //
        // var animHoa = sp.SkeletonAnimation.createWithJsonFile("res/Animation/yellow_flower_animation.json", "res/Animation/yellow_flower_animation.atlas");
        // animHoa.setPosition(cc.winSize.width / 2 + 30, animLogo.y);
        // animHoa.scale = 0.62;
        // animHoa.setAnimation(0, "animation", true);
        // this.addChild(animHoa);

        // var ani = sp.SkeletonAnimation.createWithJsonFile("res/Home/Mini_Poker.json", "res/Home/Mini_Poker.atlas");
        // ani.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        // ani.scale = 1;
        // ani.setAnimation(0, "animation", true);
        // this.addChild(ani);
    },

    _initMessageLabel: function () {
        var bg = new ccui.Scale9Sprite("home_bottomBar_bg.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bg.setPreferredSize(cc.size(800, 30));
        bg.setPosition(cc.winSize.width / 2 + 150, 120);
        this.bg = bg;
        this.addChild(bg);

        var messageBoxLeft = 120;
        // var messageBoxRight = cc.winSize.width;
        var messageBoxRight = bg.width;
        var messageBoxWidth = messageBoxRight - messageBoxLeft;

        var clippingMessage = new ccui.Layout();
        clippingMessage.setContentSize(messageBoxWidth, 50);
        clippingMessage.setClippingEnabled(true);
        clippingMessage.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingMessage.setPosition(cc.winSize.width / 2 - 220, bg.y - bg.height / 2 - 5);
        this.clippingMessage = clippingMessage;
        this.addChild(clippingMessage);

        var messageText = new cc.LabelTTF("", cc.res.font.Myriad_Pro_Regular, 22);
        messageText.setColor(cc.color("#ffffff"));
        messageText.setAnchorPoint(0.0, 0.5);
        messageText.setPosition(0.0, clippingMessage.height / 2 - 5);
        clippingMessage.addChild(messageText);

        this.messageText = messageText;
        this.messageBoxWidth = messageBoxWidth;
    },

    showMessage: function (isShow) {
        this.bg.visible = isShow;
        this.clippingMessage.visible = isShow;
    },

    setMessage: function (res) {
        this.showMessage(res.length);
        var thiz = this;
        var mess = "";
        for (var i = 0; i < res.length; i++) {
            mess = mess.concat("\t \t \t \t \t \t \t \t", res[i].message);
        }

        var messageText = this.messageText;
        var messageBoxWidth = this.messageBoxWidth + 10.0;

        messageText.stopAllActions();
        messageText.setString(mess);
        messageText.x = messageBoxWidth;
        var moveWidth = messageBoxWidth + messageText.getContentSize().width;
        var duration = moveWidth / 100.0;

        var action = new cc.Sequence(new cc.MoveBy(duration, cc.p(-moveWidth, 0)), new cc.CallFunc(function () {
            messageText.x = messageBoxWidth;
        }));

        var repeatAction = new cc.RepeatForever(action);
        this.messageText.runAction(repeatAction);
    },

    onEnter: function () {
        this._super();
        this.setMessage(GameConfig.broadcastMessage);
    }
});
