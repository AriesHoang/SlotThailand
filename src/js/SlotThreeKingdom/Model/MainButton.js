var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    SlotThreeKingdom.MainButton = ccui.Button.extend({
        ctor: function (icon) {
            this._super("SlotThreeKingdom_main_btn.png", "SlotThreeKingdom_main_btn_selected.png", "", ccui.Widget.PLIST_TEXTURE);
            if (icon.indexOf("#"))
                icon = "#" + icon;

            var iconSprite = new cc.Sprite(icon);
            iconSprite.setPosition(45, 45);
            this.addChild(iconSprite);
        }
    });
})();
