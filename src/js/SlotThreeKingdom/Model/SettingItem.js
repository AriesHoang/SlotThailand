var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    var SettingItem = cc.Node.extend({
        ctor: function (texture, type) {
            this._super();
            if (texture[0] === "#")
                texture = texture.substring(1);

            var sprite = new ccui.Button(texture, "", "", ccui.Widget.PLIST_TEXTURE);
            sprite.setZoomScale(0);
            this.addChild(sprite);

            var disabledSprite = new cc.Sprite("#slotwomenagent_setting_disable.png");
            this.addChild(disabledSprite);
            this.disabledSprite = disabledSprite;
            this._disabled = false;
            this.setDisabled(this._disabled);
            var thiz = this;
            sprite.addClickEventListener(function () {
                thiz.setDisabled(!thiz.getDisabled());
                if (type === 1) {
                    if (!thiz.getDisabled())
                        SlotThreeKingdomSoundPlayer.playSound("theme_hauvuong", true);
                    else
                        SlotThreeKingdomSoundPlayer.stopSound("theme_hauvuong");

                }
            });
        },

        getDisabled: function () {
            return this._disabled;
        },

        setDisabled: function (d) {
            d = !!d; // force boolean
            this._disabled = d;
            this.disabledSprite.visible = d;
            this._toggleCallback && this._toggleCallback.call(this._toggleCallbackTarget, d);
        },

        setToggleCallback: function (fn, target) {
            if (typeof (fn) === "function") {
                this._toggleCallback = fn;
                this._toggleCallbackTarget = target;
            }
        }
    });

    (function () {
        var proto = SettingItem.prototype;
        cc.defineGetterSetter(proto, "disabled", proto.getDisabled, proto.setDisabled);
    })();

    SlotThreeKingdom.SettingItem = SettingItem;
})();
