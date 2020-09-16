var SlotWomenAgent = SlotWomenAgent || {};

(function () {

    var Dialog = SlotWomenAgent.Dialog;

    SlotWomenAgent.BonusPrepareDialog = Dialog.extend({
        ctor: function (betLevel, width, height) {
            width = width || cc.winSize.width;
            height = height || cc.winSize.height;
            this._super.call(this, width, height);

            // var upperTip = new cc.Sprite("#slotwomenagent_hautuhaidao.png");
            var upperTip = new cc.Sprite("#icon_womenagent.png");
            upperTip.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 28);
            this.addChild(upperTip);

            var iconGame = new cc.Sprite("#slotwomenagent_shootboss_title.png");
            iconGame.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 236);
            this.addChild(iconGame);

            var countDownLabel = new cc.LabelBMFont("Auto play in 9s... ", cc.SlotWomenAgentRes.font.PopupFont);
            countDownLabel.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 422);
            this.addChild(countDownLabel);
            this.countDownLabel = countDownLabel;

            this.setTitle("");

            this.cooldown = 10;
            this.setCooldown(this.cooldown);
            this._timeoutCallback = null;
            this._timeoutCallbackTarget = null;
        },

        onEnter: function () {
            this._super();
            var thiz = this;

            //countdown
            this.runAction(new cc.RepeatForever(new cc.Sequence(new cc.DelayTime(1), new cc.CallFunc(function () {
                thiz.setCooldown(--thiz.cooldown);
            }))));
        },

        setCooldown: function (cd) {
            cd = Math.floor(cd);
            if (cd <= 0) {
                if (this._timeoutCallback) {
                    this._timeoutCallback.call(this._timeoutCallbackTarget);
                }
                this.hide();
                return;
            }

            this.countDownLabel.setString("Auto play in " + cd + " s...");
        },

        setTimeoutCallback: function (cb, target) {
            this._timeoutCallback = cb;
            this._timeoutCallbackTarget = target;
        },

        initButton: function () {
            var haiBtn = new ccui.Button("slotwomenagent_btn_choi.png", "slotwomenagent_btn_choi.png", "", ccui.Widget.PLIST_TEXTURE);
            haiBtn.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 300);
            this.addChild(haiBtn);

            var thiz = this;
            haiBtn.addClickEventListener(function () {
                thiz.hide();
            });
        },

        initBackground: function (w, h) {
            var bg = new cc.Sprite("res/SlotWomenAgent/bonus_bg.png");
            cc.GlobalSlotWomenAgent.scaleBackground(bg);
            bg.setPosition(this.width / 2, this.height / 2);
            this.addChild(bg);
        }
    });
})();
