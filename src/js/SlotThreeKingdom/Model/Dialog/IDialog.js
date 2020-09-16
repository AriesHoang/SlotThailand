var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    SlotThreeKingdom.Dialog = cc.Node.extend({
        ctor: function (width, height) {
            this._super();
            this.setAnchorPoint(cc.p(0.5, 0.5));
            this._initWithSize(width || 1219, height || 671);
        },

        /**
         * Init the dialog with a specific size
         * @override
         * @param size {cc.size|Number} position
         * @param y {Number} [posy]
         */
        _initWithSize: function (size, y) {
            var w = size.width ? size.width : size, h = size.height ? size.height : y;

            this.setContentSize(w, h);
            this._touchRect = cc.rect(0, 0, this.width, this.height);

            this.initBackground(w, h);

            // title
            // var title = new cc.LabelBMFont("", cc.SlotThreeKingdomRes.font.Bay_Buom_Text_Stroke);
            var title = new cc.LabelTTF("", cc.SlotThreeKingdomRes.font.UVNThangVu, 50, cc.p(400, 300), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            // title.setFontFillColor(cc.color(250,220,120));
            // title.enableShadow(1,1,1);
            // title.enableStroke(cc.color(0,0,0),2);
            title.setColor(cc.color(250, 220, 120));
            title.setPosition(this.width / 2, this.height - 20);
            // title.setScale(0.6);
            this.addChild(title);
            this.title = title;

            // buttons
            this.initButton();
        },

        initBackground: function (w, h) {
            // background
            var dialogBg = new cc.Sprite("res/SlotThreeKingdom/slotwomenagent_bg_popup.png");
            dialogBg.setPosition(this.width / 2 - 5, this.height / 2 + 35);
            this.addChild(dialogBg);
        },

        initController: function () {
            this._controller = null;
        },

        initButton: function () {
            var closeBtn = new ccui.Button("slotwomentagent_x_down.png", "slotwomentagent_x_down.png", "", ccui.Widget.PLIST_TEXTURE);
            closeBtn.setPosition(this.width - 44, this.height - 29);
            this.addChild(closeBtn);
            this.closeBtn = closeBtn;

            var thiz = this;
            closeBtn.addClickEventListener(function () {
                thiz.hide();
            });
        },

        onEnter: function () {
            this._super();
            var thiz = this;
            this.initController();
        },

        onExit: function () {
            this._super();
            if (this._controller) {
                this._controller.releaseController();
            }
        },

        hide: function () {
            var parent = this.getParent();
            this.removeFromParent(true);
            if (parent) {
                if (parent.hideDialogCallback) {
                    parent.hideDialogCallback();
                }
                parent.visible = false;
            }
        },

        setTitle: function (str) {
            this.title.setString(str);
            //this.titleBg.visible = str.length > 0;
        }
    });
})();
