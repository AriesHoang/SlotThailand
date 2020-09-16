var SlotAladdin = SlotAladdin || {};

(function () {
    SlotAladdin.LoadingLayer = cc.Node.extend({
        ctor: function (title, content) {
            this._super();
            var bg = new cc.LayerColor(cc.color(0, 0, 0, 178), cc.winSize.width, cc.winSize.height);
            bg.setPosition(-cc.winSize.width / 2, -cc.winSize.height / 2);
            this.addChild(bg);

            var body = new cc.Sprite("#slotaladdin_dialog_frame.png");
            // body.x += 75;
            body.setScale(1);
            this.addChild(body);

            this.initAnimation();
            this.initLabels.apply(this, arguments);

            var agreeBtn = new ccui.Button("slotwomenagent_btn_dongy.png", "slotwomenagent_btn_dongy.png", "", ccui.Widget.PLIST_TEXTURE);
            // agreeBtn.setScale(1.2);
            agreeBtn.setPosition(20, -200);
            this.addChild(agreeBtn);

            var agreeLabel = new cc.LabelBMFont("OK", cc.SlotAladdinRes.font.PopupFont);
            agreeLabel.setScale(1.1);
            agreeLabel.setColor(cc.color("#ffffff"));
            agreeLabel.setPosition(agreeBtn.getPosition());
            this.addChild(agreeLabel);

            this._callback = null;
            var thiz = this;
            agreeBtn.addClickEventListener(function () {
                thiz.hide();

                if (thiz._callback)
                    thiz._callback();
            });
        },

        initAnimation: function () {
            var base = cc.p(-93, -75);
            var offset = 38;
            for (var i = 0; i < 6; i++) {
                var sprite = new cc.Sprite("#slotwomenagent_loading_dot.png");
                sprite.setPosition(base.x + offset * i, base.y);
                this.addChild(sprite);

                var seed = (i % 5 + 1);
                sprite.setScale(seed * 0.2);
                var initAction = new cc.ScaleTo((5 - seed) * 0.1, 1);
                var scaleUp = new cc.ScaleTo(0.4, 1);
                var scaleDown = new cc.ScaleTo(0.4, 0.2);
                var loopAction = new cc.RepeatForever(new cc.Sequence(scaleDown, scaleUp));
                loopAction.retain();
                (function (sp, ia, la) {
                    sp.runAction(new cc.Sequence(ia, new cc.CallFunc(function () {
                        sp.runAction(la);
                        la.release();
                    })));
                })(sprite, initAction, loopAction);
            }
        },

        hide: function () {
            var parent = this.getParent();
            if (parent.loadingLayer !== this) {
                parent.loadingLayer.removeFromParent();
            }
            parent.loadingLayer = null;
            this.removeFromParent();
        },

        initLabels: function (title, content) {
            // cc.log("titleLabel");
            var titleLabel = new cc.LabelBMFont(title, cc.SlotAladdinRes.font.PopupFont);
            titleLabel.setScale(1.2);
            titleLabel.setPosition(20, 150);
            this.addChild(titleLabel);

            // cc.log("contentLabel");
            var contentLabel = new cc.LabelBMFont(content, cc.SlotAladdinRes.font.PopupFont);
            contentLabel.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
            contentLabel.setPosition(20, 0);
            this.addChild(contentLabel);
        },

        setCallback: function (fn) {
            this._callback = fn;
        }
    });
})();
