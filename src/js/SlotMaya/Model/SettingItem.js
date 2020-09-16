var SlotMaya = SlotMaya || {};

(function () {
    var SettingItem = cc.Node.extend({
        ctor: function (texture, type) {
            this._super();
            if (texture[0] === "#")
                texture = texture.substring(1);

            var sprite = new ccui.Button(texture, "", "", ccui.Widget.PLIST_TEXTURE);
            sprite.setZoomScale(0);
            this.addChild(sprite);

            var disabledSprite = new cc.Sprite("#slotmaya_setting_disable.png");
            this.addChild(disabledSprite);
            this.disabledSprite = disabledSprite;
            this._disabled = false;
            this.setDisabled(this._disabled);
            var thiz = this;
            sprite.addClickEventListener(function () {
                thiz.setDisabled(!thiz.getDisabled());
                if (type === 1) {
                    if (!thiz.getDisabled()) {
                        SlotMayaSoundPlayer.playSound("theme_khaihoi", true);
                    }
                    else {
                        SlotMayaSoundPlayer.stopSound("theme_khaihoi");
                    }
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
        },
        getDiableByTpe: function (type) {
            if (type === 1) {
                cc.log("11111");
            } else if (type === 2) {
                cc.log("2222");
            }
        }

    });

    (function () {
        var proto = SettingItem.prototype;
        cc.defineGetterSetter(proto, "disabled", proto.getDisabled, proto.setDisabled);
    })();

    SlotMaya.SettingItem = SettingItem;
})();
