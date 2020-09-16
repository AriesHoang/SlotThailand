var UserAvatar = cc.Node.extend({
    ctor: function () {
        this._super();
        // var bg=new cc.Sprite("#Avatar.png");
        // bg.scale=0.72;
        // bg.x=91;
        // var bgGoldLabel=new ccui.Scale9Sprite("gate_bg_coin.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // bgGoldLabel.setPreferredSize(cc.size(400, 90));
        // bgGoldLabel.scale = 0.6;
        // bgGoldLabel.setPosition(430,660);
        // infoLayer.addChild(bgGoldLabel);

        var bg =new ccui.Scale9Sprite("gate_bg_coin.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bg.setPreferredSize(cc.size(440, 90));
        bg.scale = 0.65;
        bg.x=110;
        this.addChild(bg);

        var iconAvatar=new cc.Sprite("#gate_avatar_bg.png");
        iconAvatar.scale=0.65;
        // iconAvatar.setPosition(340,660);
        // iconAvatar.y = 1;
        this.addChild(iconAvatar);


        this._loadDefaultAvatar();
    },

    _loadDefaultAvatar: function () {
        if (this._avtSprite) {
            this._avtSprite.removeFromParent(true);
            this._avtSprite = null;
        }


        var stencil = new cc.Sprite("#home_clippingAvatar.png");

        var clippingNode = new cc.ClippingNode(stencil);
        clippingNode.setAlphaThreshold(0.5);

        var avatar = new cc.Sprite("#home_defaultAvatar.png");
        this.setContentSize(avatar.getContentSize());
        clippingNode.addChild(avatar);
        this.addChild(clippingNode);

        this._avtSprite = avatar;
        this.clippingNode = clippingNode;
    },

    loadAvatar: function (url) {
        var thiz = this;
        TextureDownloader.load(url, function (tex) {
            cc.spriteFrameCache.addSpriteFrames(url, tex);
            if (thiz._avtSprite!=null && thiz._avtSprite!=undefined && thiz._avtSprite.parent!=null)
                thiz._avtSprite.removeFromParent();

            var avatar = new cc.Sprite(tex);
            avatar.setContentSize(92, 92);
            avatar.setScale(92 / avatar.width);
            thiz.clippingNode.addChild(avatar);
            thiz._avtSprite = avatar;
        });
    }
});

var UserAvatarMe = UserAvatar.extend({
    ctor: function () {
        this._super();
    }
});