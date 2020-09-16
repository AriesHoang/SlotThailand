var SlotAladdin = SlotAladdin || {};

(function () {
    var Popup = SlotAladdin.Popup;
    var X2Controller = SlotAladdin.X2Controller;
    SlotAladdin.X2Popup = Popup.extend({
        ctor: function (potentialReward,baseReward) {
            this._super(1190, 673);
            potentialReward = potentialReward || 0;
            this._potentialReward = potentialReward;
            this._baseReward = baseReward;

            var bg = new cc.Sprite("res/SlotAladdin/main_background.png");
            bg.setPosition(this.width / 2, this.height / 2);
            this.mainLayer.addChild(bg);

            var totalWinBg = new cc.Sprite("#slotwomenagent_total_win_x2.png");
            totalWinBg.setPosition(202, 94);
            this.mainLayer.addChild(totalWinBg);

            var title = new cc.Sprite("#slotwomenagent_tim_gay_nhu_y.png");
            title.setPosition(588, 600);
            this.mainLayer.addChild(title);

            var thang = new cc.Sprite("#slotwomenagent_txt_x2_thang.png");
            thang.setPosition(644, 210);
            thang.visible = false;
            this.mainLayer.addChild(thang);
            this.thang = thang;

            var thua = new cc.Sprite("#slotwomenagent_txt_x2_thua.png");
            thua.setPosition(648, 200);
            thua.visible = false;
            this.mainLayer.addChild(thua);
            this.thua = thua;

            var baseThap = cc.p(196, 402);
            var baseGayNhuY = cc.p(131, 396);
            var baseVongKimCo = cc.p(190, 400);
            var horizontalOffset = 270;

            var allThap = [], allGay = [], allVong = [];
            var thiz = this;
            for (var i = 0; i < 4; i++) {
                var thap = new ccui.Button("slotwomenagent_x2_thap.png", "", "", ccui.Widget.PLIST_TEXTURE);
                thap.setZoomScale(0);
                thap.setPosition(baseThap.x + i * horizontalOffset, baseThap.y);
                thap.visible = true;
                this.mainLayer.addChild(thap);
                allThap.push(thap);

                (function (index) {
                    thap.addClickEventListener(function () {
                        thiz.selectThap(index + 1);
                    });
                })(i);

                var gay = new cc.Sprite("#slotwomenagent_x2_gaynhuy.png");
                gay.setPosition(baseGayNhuY.x + i * horizontalOffset, baseGayNhuY.y);
                gay.visible = false;
                this.mainLayer.addChild(gay);
                allGay.push(gay);

                var vong = new cc.Sprite("#slotwomenagent_x2_vongkimco.png");
                vong.setPosition(baseVongKimCo.x + i * horizontalOffset, baseVongKimCo.y);
                vong.visible = false;
                this.mainLayer.addChild(vong);
                allVong.push(vong);
            }

            var txtX2 = new cc.Sprite("#slotwomenagent_x2_popup.png");
            txtX2.setPosition(1069, 101);
            this.mainLayer.addChild(txtX2);

            var expectLabel = new cc.LabelBMFont(cc.GlobalSlotAladdin.FormatGold(potentialReward), cc.SlotAladdinRes.font.Bay_Buom_X2Popup);
            expectLabel.setPosition(txtX2.x, 55);
            this.mainLayer.addChild(expectLabel);
            this.expectLabel = expectLabel;

            this.allThap = allThap;
            this.allGay = allGay;
            this.allVong = allVong;

            var btnDung = new ccui.Button("slotwomenagent_btn_dung.png", "slotwomenagent_btn_dung_selected.png", "", ccui.Widget.PLIST_TEXTURE);
            btnDung.setPosition(691, 79);
            this.mainLayer.addChild(btnDung);

            var txtDung = new cc.Sprite("#slotwomenagent_text_dung.png");
            txtDung.setPosition(btnDung.getPosition());
            this.mainLayer.addChild(txtDung);

            var totalWinLabel = new cc.LabelBMFont("0", cc.SlotAladdinRes.font.Bay_Buom_Stroke_White);
            totalWinLabel.setPosition(200, 57);
            this.mainLayer.addChild(totalWinLabel);
            this.totalWinLabel = totalWinLabel;
            this._totalWin = 0;

            btnDung.addClickEventListener(function () {
                thiz.removeFromParent();
            });

            this.setTotalWin(baseReward);
        },

        onEnter: function () {
            this._super();
            this.initController();
        },

        onExit: function () {
            if (!this._ended)
                this._controller.sendDoubleRequest(false, 0);
            if (this._exitCallback && typeof (this._exitCallback) === "function"){
                this._exitCallback.call(this._exitCallbackTarget,this._totalWin - this._baseReward);
                this._exitCallback = null; // prevent super call
            }
            this._super();
        },

        initController: function () {
            this._controller = new X2Controller(this);
        },

        selectThap: function (index) {
            if (this._pending)
                return;
            this._pendingIndex = index;
            this._pending = true;
            this._controller.sendDoubleRequest(true, index);
        },

        showLostGame: function () {
            for (var i = 0; i < 4; i++) {
                this.allThap[i].visible = false;
                this.allGay[i].visible = (i % 2 === this._pendingIndex % 2 );
                this.allVong[i].visible = !this.allGay[i].visible;
            }
            this.thang.visible = false;
            this.thua.visible = true;
            this._totalWin = 0;

            //show result
            var thiz = this;
            setTimeout(function () {
                thiz.removeFromParent();
            }, 3000);
            this._ended = true;
        },

        showWinGame: function (amount,expected) {
            for (var i = 0; i < 4; i++) {
                this.allThap[i].visible = false;
                this.allVong[i].visible = (i % 2 === this._pendingIndex % 2 );
                this.allGay[i].visible = !this.allVong[i].visible;
            }

            this._totalWin = amount;
            this.setTotalWin(this._totalWin);
            this.expectLabel.setString(cc.GlobalSlotAladdin.FormatGold(expected));
            this._pending = false;
            this.thua.visible = false;
            this.thang.visible = true;
            var thiz = this;
            setTimeout(function () {
                thiz.resetThap();
            }, 3000);
        },

        setTotalWin: function (value) {
            this.totalWinLabel.setString(cc.GlobalSlotAladdin.FormatGold(value));
        },

        resetThap: function () {
            for (var i = 0; i < 4; i++) {
                this.allThap[i].visible = true;
                this.allVong[i].visible = false;
                this.allGay[i].visible = false;
            }

            this.thang.visible = false;
            this.thua.visible = false;
        }
    });
})();
