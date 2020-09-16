var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    var BaseScene = SlotThreeKingdom.BaseScene;
    var BonusController = SlotThreeKingdom.BonusController;
    var BonusObject = SlotThreeKingdom.BonusObject;
    var BonusDialog = SlotThreeKingdom.BonusDialog;
    var CompleteBonusDialog = SlotThreeKingdom.CompleteBonusDialog;
    var BonusPrepareDialog = SlotThreeKingdom.BonusPrepareDialog;
    var Dialog = SlotThreeKingdom.Dialog;

    SlotThreeKingdom.BonusScene = BaseScene.extend({
        ctor: function (betLevel, isSandboxMode) {
            this.betLevel = betLevel;
            this.isSandboxMode = isSandboxMode;
            this._super.apply(this, arguments);

            var bg = new cc.Sprite("res/SlotThreeKingdom/bonus_bg.png");
            cc.GlobalSlotThreeKingdom.scaleBackground(bg);

            bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.addChild(bg);

            // var bonus_board = new cc.Sprite("res/SlotThreeKingdom/BONUS/board_map.png");
            // bonus_board.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            // this.addChild(bonus_board);

            this._bonusAmount = 0;
            this._revealing = false;
            this.cooldown = 50;

            this.initGUI();
            var thiz = this;
            var prepareDialog = new BonusPrepareDialog(betLevel);
            prepareDialog.setTimeoutCallback(this.showCompleteLayer, this);
            prepareDialog.hide = function () {
                BonusPrepareDialog.prototype.hide.call(prepareDialog);
                thiz.cooldownInterval = setInterval(function () {
                    thiz.setCooldown(--thiz.cooldown);
                }, 1000);
            };
            this.showDialog(prepareDialog);
        },

        setCooldown: function (cd) {
            // cd = Math.floor(cd);
            // if (cd <= 0) {
            // clearInterval(this.cooldownInterval);
            //     this.showCompleteLayer();
            //     return;
            // }
            //
            // this.countDownLabel.setString(" " + cd + "s");
        },

        initGUI: function () {
            var mainLayer = new cc.Node();
            this.addChild(mainLayer);
            this.mainLayer = mainLayer;

            var thiz = this;
            setTimeout(function () {
                thiz.showMultiplyBonusLayer();
            }, 100);
            // this.initRewards();


            // var countDownLabel = new cc.LabelTTF(" " + this.cooldown + "s", "Arial", 45);
            // countDownLabel._setStrokeStyle(cc.color(0, 0, 0, 255));
            // countDownLabel.setAnchorPoint(cc.p(0, 0));
            // countDownLabel._setLineWidth(3);
            // countDownLabel.setPosition(1280, 130);
            // countDownLabel.retain();
            // countDownLabel.visible = false;
            // this.mainLayer.addChild(countDownLabel);
            // this.countDownLabel = countDownLabel;
        },

        initRewards: function () {
            cc.log("init rewards");
            this.multiplierLayer.hide();
            var backgroundBonus = new cc.Sprite("#slotthreekingdom_bg_board_reward.png");
            backgroundBonus.setPosition(cc.winSize.width/2 , cc.winSize.height/2);
            this.mainLayer.addChild(backgroundBonus);

            var rewardPanel = new cc.Sprite("#slotthreekingdom_bonus_rewardPanel.png");
            rewardPanel.setPosition(cc.winSize.width - 268, cc.winSize.height - 135);
            this.mainLayer.addChild(rewardPanel);

            // var totalBonusTitle = new cc.LabelTTF("TỔNG THẮNG", cc.SlotThreeKingdomRes.font.UVNThangVu, 40);
            // var totalBonusTitle = new cc.LabelBMFont("TỔNG THẮNG", cc.SlotThreeKingdomRes.font.Bay_Buom_Text_Stroke);
            // var totalBonusTitle = new cc.LabelTTF("TOTAL", "Arial", 30);
            // totalBonusTitle.enableStroke(cc.color(160, 0, 0), 2);
            // totalBonusTitle.setPosition(cc.winSize.width - 268, cc.winSize.height - 130);
            // // totalBonusTitle.setScale(0.55);
            // this.mainLayer.addChild(totalBonusTitle);

            var totalBonusLabel = new cc.LabelBMFont("0", cc.SlotThreeKingdomRes.font.Bonus_Reward);
            totalBonusLabel.setPosition(cc.winSize.width - 268, cc.winSize.height - 170);
            totalBonusLabel.setScale(0.8);
            this.mainLayer.addChild(totalBonusLabel);
            this.totalBonusLabel = totalBonusLabel;

            // var bottomTip = new cc.Sprite("#slotwomenagent_shootboss_title.png");
            // // bottomTip.setScale(1.0);
            // bottomTip.setPosition(1012, -200);
            // this.mainLayer.addChild(bottomTip);


            // var boss2 = new cc.Sprite("#slotwomenagent_boss2.png");
            // boss2.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            //
            // var boss1 = new cc.Sprite("#slotwomenagent_boss3.png");
            // boss1.setPosition(boss2.x - 450, boss2.y);
            //
            // var boss3 = new cc.Sprite("#slotwomenagent_boss1.png");
            // boss3.setPosition(boss2.x + 450, boss2.y);
            //
            // this.mainLayer.addChild(boss2, 0);
            // this.mainLayer.addChild(boss1, 0);
            // this.mainLayer.addChild(boss3, 0);

            var rewardLayer = new cc.Node();
            rewardLayer.setPosition(0, 0);
            // rewardLayer.visible = false;
            this.mainLayer.addChild(rewardLayer, 1);
            this.rewardLayer = rewardLayer;

            var poses = [
                cc.p(475, 305),
                cc.p(360, 660),
                cc.p(550, 545),
                cc.p(630, 430),
                cc.p(768, 435),
                cc.p(850, 310),
                cc.p(600, 780),

                cc.p(760, 850),
                cc.p(780, 650),
                cc.p(900, 750),
                cc.p(1020, 850),
                cc.p(1085, 620),
                cc.p(1033, 750),
                cc.p(1160, 297),

                cc.p(1480, 840),
                cc.p(1170, 800),
                cc.p(1314, 719),
                cc.p(1485, 475),
                cc.p(1564, 590),
                cc.p(1345, 410),
                cc.p(1380, 283)
            ];

            for (var i = 0; i < poses.length; i++) {
                var reward = new BonusObject();
                reward.setRevealCallback(this.revealReward, this.postRevealReward, this);
                reward.setPosition(poses[i]);
                rewardLayer.addChild(reward);
            }
        },

        revealReward: function () {
            if ((!this._bonuses) || this._bonuses.length === 0)
                return 0;

            // pop a bonus out
            var bonus = this._bonuses.splice(0, 1)[0];
            this._revealing = !isNaN(bonus);
            cc.log(bonus);
            return bonus;
        },

        postRevealReward: function (revealResult) {
            if (!revealResult) {
                var thiz = this;
                setTimeout(function () {
                    thiz.showCompleteLayer();
                }, 1500);
                return;
            }

            var bonus = revealResult.bonus;
            var pos = revealResult.pos;

            var thiz = this;
            thiz.setBonusAmount(thiz._bonusAmount + bonus);
            thiz._revealing = false;
        },

        pushFlyingText: function (str, from, to, callback) {
            var flyingLabel = new cc.LabelBMFont(str, cc.SlotThreeKingdomRes.font.Bonus_Multiplier);
            flyingLabel.setPosition(from);
            flyingLabel.setScale(0.6);
            this.addChild(flyingLabel, 500);

            var moveAct = new cc.MoveTo(1, to);
            var scaleAct = new cc.ScaleTo(1, 0.5);
            var clearAct = new cc.CallFunc(function () {
                flyingLabel.removeFromParent(true);
                callback && callback();
            });

            flyingLabel.runAction(new cc.Sequence(new cc.Spawn(moveAct, scaleAct), clearAct));
        },

        setupBonusGame: function (results) {
            this._bonuses = [].concat(results.bonuses);
            this._totalBonus = results.totalWin;
            this._dedicatedMultiplier = results.resultMultiplier;
            this._multiplers = results.multiplers;
            this.cooldown = results.cooldown;
            this.setCooldown(this.cooldown);
        },

        setBonusAmount: function (value) {
            this._bonusAmount = value;
            this.totalBonusLabel.setString(cc.GlobalSlotThreeKingdom.FormatGold(this._bonusAmount));
        },

        onEnter: function () {
            this._super.apply(this, arguments);
            this._ended = false;
        },

        initController: function () {
            this._controller = new BonusController(this, this.betLevel, this.isSandboxMode);
        },

        showDialog: function (dialog) {
            this._super.apply(this, arguments);
            var thiz = this;
            dialog.onExit = function () {
                Dialog.prototype.onExit.call(this);
                thiz.mainLayer && (thiz.mainLayer.visible = true);
                thiz._revealing = false;
            };
            this.mainLayer && (this.mainLayer.visible = false);
        },

        onExit: function () {
            this._super();
            // this.countDownLabel.release();
        },

        onReconnect: function () {
            this.showCompleteLayer();
        },

        showCompleteLayer: function () {
            this._totalBonus = this._totalBonus || 0;
            var thiz = this;
            if (this.mainLayer) {
                this.mainLayer.visible = false;
            }
            this.showDialog(new CompleteBonusDialog(this._totalBonus, this._dedicatedMultiplier, function () {
                var value = thiz._totalBonus;
                cc.GlobalSlotThreeKingdom.totalRewardValue += value;

                // free spin game
                if (cc.GlobalSlotThreeKingdom.FreeSpinGame.enabled)
                    cc.GlobalSlotThreeKingdom.FreeSpinGame.reward += value;

                cc.director.replaceScene(new SlotThreeKingdom.SlotScene());
                if (thiz.cooldown >= 0) {
                    thiz._controller.sendEndgameRequest();
                }
            }));
            this._ended = true;
            clearTimeout(this.cooldownInterval);
        },

        showMultiplyBonusLayer: function () {
            var thiz = this;
            var multiplyDialog = new BonusDialog();
            multiplyDialog.setBonusResult(this._multiplers, this._multiplers.indexOf(this._dedicatedMultiplier), this._totalBonus);
            multiplyDialog.setRevealMultiplyCallback(function () {
                // thiz.showCompleteLayer();
                thiz.initRewards();
            });
            this.multiplierLayer = multiplyDialog;
            // this.rewardLayer.visible = false;
            this.showDialog(multiplyDialog);
        }

    });
})();
