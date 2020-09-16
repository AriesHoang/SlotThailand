var SlotZodiac = SlotZodiac || {};

(function () {
    var Dialog = SlotZodiac.Dialog;

    SlotZodiac.BonusPrepareDialog = Dialog.extend({
        ctor: function (betLevel, width, height) {
            width = width || 1408;
            height = height || 900;
            this._super.call(this, width, height);

            // var iconGame = new cc.Sprite("#slotkhaihoi_icon_game.png");
            // iconGame.setPosition(706, 574);
            // this.addChild(iconGame);

            var countDownLabel = new cc.LabelTTF("Auto play in 9 sec", "Arial", 35);
            countDownLabel.setScale(1.1);
            countDownLabel.setPosition(706, -19);
            this.addChild(countDownLabel);
            this.countDownLabel = countDownLabel;

            this.cooldown = 10;
            this.setCooldown(this.cooldown);
            this._timeoutCallback = null;
            this._timeoutCallbackTarget = null;
            var thiz = this;
            this.cooldownInterval = setInterval(function () {
                thiz.setCooldown(--thiz.cooldown);
            }, 1000);
        },

        setCooldown: function (cd) {
            cd = Math.floor(cd);
            if (cd <= 0) {
                this.destruct();
                if (this._timeoutCallback) {
                    this._timeoutCallback.call(this._timeoutCallbackTarget);
                }
                return;
            }

            this.countDownLabel.setString("Auto play in " + cd + " sec");
        },

        setTimeoutCallback: function (cb, target) {
            this._timeoutCallback = cb;
            this._timeoutCallbackTarget = target;
        },

        onEnter: function () {
            this._super();
        },

        initButton: function () {
            var choiBtn = new ccui.Button("slotmaya_btn_tim.png", "", "", ccui.Widget.PLIST_TEXTURE);
            choiBtn.setPosition(706, 152);
            this.addChild(choiBtn);

            var thiz = this;
            choiBtn.addClickEventListener(function () {
                thiz.destruct();
            });
        },

        initBackground: function (w, h) {
        },

        destruct: function () {
            this.hide();
        },

        hide: function () {
            this._super();
            this.cooldownInterval && clearInterval(this.cooldownInterval);
        }
    });
})();
