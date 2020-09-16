var SlotMaya = SlotMaya || {};

(function () {
    SlotMaya.LobbyNode = cc.Node.extend({
        ctor: function () {
            this._super();
            var bg = new cc.Sprite("res/SlotMaya/main_background.png");
            cc.GlobalSlotMaya.scaleBackground(bg);
            bg.setAnchorPoint(cc.p(0, 0));
            this.addChild(bg);

            this.initGUI();
            this.initCharacter();
            this.initRoomNames();

            this.initBetLevel();
            this.initBetBtn();
            this.visible = false;
            this._backCb = null;
            this._backCbTarget = null;
            this._betSelectCb = null;
            this._betSelectCbTarget = null;
            this._oldJackpotValue = [0, 0, 0];
        },

        initGUI: function () {
            var backBtn = new ccui.Button("slotkhaihoi_button_back.png", "", "", ccui.Widget.PLIST_TEXTURE);
            backBtn.setPosition(114, cc.winSize.height - 70);
            this.addChild(backBtn);

            var creditBg = new cc.Sprite("#slotkhaihoi_bg_credit.png");
            creditBg.setPosition(427, cc.winSize.height - 66);
            this.addChild(creditBg);

            var creditLabel = new cc.LabelBMFont("0", cc.SlotMayaRes.font.Arial_White);
            creditLabel.setColor(cc.color("#000000"));
            creditLabel.setPosition(creditBg.x + 20, creditBg.y + 5);
            this.addChild(creditLabel);
            this.creditLabel = creditLabel;

            var logo = new cc.Sprite("#slotkhaihoi_logo_game.png");
            logo.setPosition(cc.winSize.width / 2, cc.winSize.height - 164);
            this.addChild(logo);

            var thiz = this;
            backBtn.addClickEventListener(function () {
                thiz.visible = false;
                thiz._backCb && thiz._backCb.call(thiz._backCbTarget);
            });
        },

        initCharacter: function () {
        },

        onExit: function () {
            this._super();
            GlobalEvent.getInstance().removeListener(this);
        },

        initRoomNames: function () {
            var poses = [410, 1043, 1678];
            var roomNameLabels = [];
            for (var i = 0; i < poses.length; i++) {
                var label = new cc.LabelBMFont("ROOM NAME", cc.SlotMayaRes.font.Roboto_Bold_White);
                label.setPosition(poses[i], cc.winSize.height / 2 + 284);
                this.addChild(label);
                roomNameLabels.push(label);
            }

            this.roomNameLabels = roomNameLabels;
        },

        initBetLevel: function () {
            var allJackpotLabel = [];
            var xpos = [404, 1061, 1686];
            for (var i = 0; i < xpos.length; i++) {
                var xuPanel = new cc.Sprite("#slotkhaihoi_panel_xu.png");
                xuPanel.setPosition(xpos[i], cc.winSize.height / 2 - 474);
                this.addChild(xuPanel);

                var xuLabel = new cc.LabelBMFont(cc.GlobalSlotMaya.FormatGold(Math.pow(10, i + 2)), cc.SlotMayaRes.font.Roboto_Bold_White);
                xuLabel.setColor(cc.color("#000000"));
                xuLabel.setPosition(xuPanel.x + 10, xuPanel.y + 3);
                this.addChild(xuLabel);

                var jackpotPanel = new cc.Sprite("#slotkhaihoi_panel_jackpot.png");
                jackpotPanel.setPosition(xpos[i], cc.winSize.height / 2 - 398);
                this.addChild(jackpotPanel);

                var jackpotLabel = new cc.LabelBMFont("0", cc.SlotMayaRes.font.Roboto_Bold_White);
                jackpotLabel.setColor(cc.color("#000000"));
                jackpotLabel.setPosition(jackpotPanel.x + 20, jackpotPanel.y + 5);
                this.addChild(jackpotLabel);
                allJackpotLabel.push(jackpotLabel);
            }
            this._allJackpotLabel = allJackpotLabel;
        },

        initBetBtn: function () {
            var poses = [
                cc.p(262, cc.winSize.height / 2 - 496),
                cc.p(887, cc.winSize.height / 2 - 496),
                cc.p(1548, cc.winSize.height / 2 - 496)
            ];

            var thiz = this;
            for (var i = 0; i < poses.length; i++) {
                var btn = new cc.Node();
                btn.setContentSize(cc.size(330, 810));
                btn.setAnchorPoint(cc.p(0, 0));
                btn.setPosition(poses[i]);
                this.addChild(btn);
                (function (button, index) {
                    cc.eventManager.addListener({
                        event: cc.EventListener.TOUCH_ONE_BY_ONE,
                        swallowTouches: true,
                        onTouchBegan: function (touch, event) {
                            var target = event.getCurrentTarget();
                            if (target.parent && target.parent.visible) {
                                var loc = touch.getLocation();
                                loc = target.convertToNodeSpace(loc);
                                if (cc.rectContainsPoint(cc.rect(0, 0, target.width, target.height), loc)) {
                                    thiz.visible = false;
                                    thiz._betSelectCb && thiz._betSelectCb.call(thiz._betSelectCbTarget, index);
                                    return true;
                                }
                            }
                            return false;
                        }
                    }, button);
                })(btn, i);
            }
        },

        setJackpot: function (betId, value) {
            if (!this._allJackpotLabel[betId])
                return;
            if (!this._allJackpotLabel[betId].setString)
                return;
            this._allJackpotLabel[betId].stopAllActions();
            SlotMaya.runActionNumber(this._allJackpotLabel[betId], value, this._oldJackpotValue[betId]);
            this._oldJackpotValue[betId] = value;
        },

        setCredit: function (value) {
            if (isNaN(value))
                return;
            this.creditLabel.stopAllActions();
            SlotMaya.runActionNumber(this.creditLabel, value, 1);
            cc.GlobalSlotMaya.PlayerGold = value;
        },

        setBackBtnCallback: function (fn, target) {
            this._backCb = fn;
            this._backCbTarget = target;
        },

        setBetSelectCallback: function (fn, target) {
            this._betSelectCb = fn;
            this._betSelectCbTarget = target;
        },

        setRoomNames: function (roomNames) {
            for (var i = 0; i < roomNames.length; i++) {
                this.roomNameLabels[i].setString(roomNames[i]);
            }
        }
    });
})();
