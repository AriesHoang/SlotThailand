var SlotAladdin = SlotAladdin || {};

(function () {
    SlotAladdin.MainButton = ccui.Button.extend({
        ctor: function (icon) {
            this._super("slotwomenagent_main_btn.png", "slotwomenagent_main_btn_selected.png", "", ccui.Widget.PLIST_TEXTURE);
            if (icon.indexOf("#"))
                icon = "#" + icon;

            var iconSprite = new cc.Sprite(icon);
            iconSprite.setPosition(45, 45);
            this.addChild(iconSprite);
        }
    });
})();
