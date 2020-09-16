var SlotZodiac = SlotZodiac || {};
(function () {
    SlotZodiac.Dialog = cc.Node.extend({
        ctor: function (width, height) {
            this._super();
            this.setAnchorPoint(cc.p(0.5, 0.5));
            this._initWithSize(width || 1280, height || 691);
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

            // buttons
            this.initButton();
        },

        initBackground: function (w, h) {
            // background
            // var dialogBg = new ccui.Scale9Sprite("slotmaya_dialog_border_bg.png", cc.rect(142, 142, 2, 2));
            // dialogBg.setPreferredSize(cc.size(w, h));
            // this.addChild(dialogBg);
            // dialogBg.setPosition(this.width / 2, this.height / 2);

            // tiles
            var clippingTilesLayout = new ccui.Layout();
            clippingTilesLayout.setContentSize(w - 24, h - 24);
            clippingTilesLayout.setAnchorPoint(cc.p(0.5, 0.5));
            clippingTilesLayout.setClippingEnabled(true);
            clippingTilesLayout.setPosition(w / 2, h / 2);
            var xPos = -1;
            var yPos = -1;
            while (yPos < h) {
                xPos = 0;
                var tileHeight = 0;
                while (xPos < w) {
                    var tile = new cc.Sprite("res/SlotZodiac/slotmaya_dialog_bg.png");
                    tile.setAnchorPoint(cc.p(0, 0));
                    tile.setPosition(xPos, yPos);
                    clippingTilesLayout.addChild(tile);
                    tileHeight = tile.height;
                    xPos += (tile.width - 2);
                }
                yPos += (tileHeight - 2);
            }
            this.addChild(clippingTilesLayout, -1);

            // horizontal gradients
            // var gradientMargin = 30;
            // var gradientBar = new cc.Sprite("#slotkhaihoi_gradient_bar.png");
            // var gradientThreshold = gradientBar.width * 3;
            //
            // xPos = gradientMargin + gradientBar.width / 2;
            // yPos = this.height - 10;
            // while (xPos + gradientBar.width / 2 + gradientMargin < this.width) { // loop for top horizontal bar
            //     gradientBar.setPosition(xPos, yPos);
            //     this.addChild(gradientBar);
            //     xPos += gradientThreshold;
            //     gradientBar = new cc.Sprite("#slotkhaihoi_gradient_bar.png");
            // }
            //
            // xPos = this.width - gradientMargin - gradientBar.width / 2;
            // yPos = 10;
            // while (xPos > gradientBar.width / 2 + gradientMargin) { // loop for bottom horizontal bar
            //     gradientBar.setRotation(180);
            //     gradientBar.setPosition(xPos, yPos);
            //     this.addChild(gradientBar);
            //     xPos -= gradientThreshold;
            //     gradientBar = new cc.Sprite("#slotkhaihoi_gradient_bar.png");
            // }
            //
            // xPos = 9;
            // yPos = this.height - gradientMargin - gradientBar.width / 2;
            // while (yPos > gradientBar.width / 2 + gradientMargin) { // loop for left vertical bar
            //     gradientBar.setRotation(-90);
            //     gradientBar.setPosition(xPos, yPos);
            //     this.addChild(gradientBar);
            //     yPos -= gradientThreshold;
            //     gradientBar = new cc.Sprite("#slotkhaihoi_gradient_bar.png");
            // }
            //
            // xPos = this.width - 10;
            // yPos = gradientMargin + gradientBar.width / 2;
            // while (yPos + gradientBar.width / 2 + gradientMargin < this.height) { // loop for right vertical bar
            //     gradientBar.setRotation(90);
            //     gradientBar.setPosition(xPos, yPos);
            //     this.addChild(gradientBar);
            //     yPos += gradientThreshold;
            //     gradientBar = new cc.Sprite("#slotkhaihoi_gradient_bar.png");
            // }
        },

        initController: function () {
            this._controller = null;
        },

        initButton: function () {
            var closeBtn = new ccui.Button("slotmaya_x_down.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // closeBtn.setScale(0.65);
            closeBtn.setPosition(this.width + 150, this.height - 105);
            // closeBtn.setPosition(this.width - 78, this.height - 71);
            this.addChild(closeBtn, 99);

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

        // setTitle: function (str) {
        //     this.title.setString(str);
        //     //this.titleBg.visible = str.length > 0;
        // }
    });
})();
