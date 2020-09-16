var SlotZodiac = SlotZodiac || {};

(function () {
    var BaseScene = SlotZodiac.BaseScene;
    var BonusController = SlotZodiac.BonusController;
    var BonusPrepareDialog = SlotZodiac.BonusPrepareDialog;
    var Dialog = SlotZodiac.Dialog;
    var BonusDialog = SlotZodiac.BonusDialog;
    var CompleteBonusDialog = SlotZodiac.CompleteBonusDialog;

    SlotZodiac.BonusScene = BaseScene.extend({
        ctor: function (betLevel, isSandbox) {
            this.betLevel = betLevel;
            this.isSandbox = isSandbox;
            this._super.apply(this, arguments);

            this.dialogLayer.setOpacity(0);
            var bg = new cc.Sprite("res/SlotZodiac/slotmaya_bonus_bg.png");
            cc.GlobalSlotZodiac.scaleBackground(bg);
            bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.addChild(bg);

            this._bonusAmount = 0;
            this._revealing = false;
            this._multiplyVal = 1;
            this._playTime = 1;
            this.cooldown = 50;

            this.initGUI();
            this.initCharacter();
            this.initTouches();
            var thiz = this;

            var prepareDialog = new BonusPrepareDialog(betLevel);
            prepareDialog.setTimeoutCallback(this.showCompleteDialog, this);
            prepareDialog.hide = function () {
                BonusPrepareDialog.prototype.hide.call(prepareDialog);
                thiz.cooldownInterval = setInterval(function () {
                    thiz.setCooldown(--thiz.cooldown);
                }, 1000);
            };
            this.showDialog(prepareDialog);
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    return thiz.mainLayer.visible && (!!thiz.revealReward(touch.getLocation()));
                }
            }, this);
        },

        setCooldown: function (cd) {
            cd = Math.floor(cd);
            if (cd <= 0) {
                clearInterval(this.cooldownInterval);
                this.showCompleteDialog();
                return;
            }

            this.countDownLabel.setString(" " + cd);
        },

        initTouches: function () {

            this._touches = [
                {rect: cc.rect(450, 810, 171, 161), pos: cc.p(535, 895)},
                {rect: cc.rect(700, 810, 171, 161), pos: cc.p(785, 895)},
                {rect: cc.rect(950, 810, 171, 161), pos: cc.p(1035, 895)},
                {rect: cc.rect(1200, 810, 171, 161), pos: cc.p(1285, 895)},
                {rect: cc.rect(1450, 810, 171, 161), pos: cc.p(1535, 895)},

                {rect: cc.rect(450, 615, 171, 161), pos: cc.p(535, 700)},
                {rect: cc.rect(700, 615, 171, 161), pos: cc.p(785, 700)},
                {rect: cc.rect(950, 615, 171, 161), pos: cc.p(1035, 700)},
                {rect: cc.rect(1200, 615, 171, 161), pos: cc.p(1285, 700)},
                {rect: cc.rect(1450, 615, 171, 161), pos: cc.p(1535, 700)},

                {rect: cc.rect(450, 430, 171, 161), pos: cc.p(535, 515)},
                {rect: cc.rect(700, 430, 171, 161), pos: cc.p(785, 515)},
                {rect: cc.rect(950, 430, 171, 161), pos: cc.p(1035, 515)},
                {rect: cc.rect(1200, 430, 171, 161), pos: cc.p(1285, 515)},
                {rect: cc.rect(1450, 430, 171, 161), pos: cc.p(1535, 515)},

                {rect: cc.rect(450, 245, 171, 161), pos: cc.p(535, 330)},
                {rect: cc.rect(700, 245, 171, 161), pos: cc.p(785, 330)},
                {rect: cc.rect(950, 245, 171, 161), pos: cc.p(1035, 330)},
                {rect: cc.rect(1200, 245, 171, 161), pos: cc.p(1285, 330)},
                {rect: cc.rect(1450, 245, 171, 161), pos: cc.p(1535, 330)}
            ];

            // var draw = new cc.DrawNode();
            // this.addChild(draw, 500);
            //
            // for (var i = 0; i < this._touches.length; i++) {
            //     var r = this._touches[i].rect;
            //     draw.drawRect(cc.p(r.x, r.y), cc.p(r.x + r.width, r.y + r.height), cc.color(
            //         0, 0, 0, 150));
            // }

            //randomize order + create animation
            var newList = [];
            // var allSkin = ["Blue", "Pink", "Yellow"];
            while (this._touches.length) {
                var randomIndex = cc.GlobalSlotZodiac.randomInt(0, this._touches.length - 1);
                // var effect = sp.SkeletonAnimation.createWithJsonFile("res/SlotZodiac/spine/touch_bonus_lion.json", "res/SlotZodiac/spine/touch_bonus_lion.atlas");
                var effect = new cc.Sprite("#slotmaya_box_reward.png");
                // effect.setAnimation(0, "animation", true);
                // effect.setScale(0.9);
                effect.setPosition(this._touches[randomIndex].pos);
                // effect.setSkin(allSkin[cc.GlobalSlotZodiac.randomInt(0, allSkin.length - 1)]);
                this._touches[randomIndex].effect = effect;
                this.characterLayer.addChild(effect);
                newList.push(this._touches[randomIndex]);
                this._touches.splice(randomIndex, 1);
            }
            this._touches = newList;
        },
        initGUI: function () {
            var mainLayer = new cc.Node();
            this.addChild(mainLayer);
            this.mainLayer = mainLayer;

            var playTime = new cc.Sprite("#slotmaya_bonus_playtime.png");
            playTime.setPosition(152, cc.winSize.height - 153);
            this.mainLayer.addChild(playTime);

            var multiply = new cc.Sprite("#slotmaya_bonus_multiply.png");
            multiply.setPosition(playTime.x, playTime.y - 189);
            this.mainLayer.addChild(multiply);

            var rewardPanel = new cc.Sprite("#slotmaya_bonus_rewardPanel.png");
            rewardPanel.setPosition(cc.winSize.width - 129, cc.winSize.height - 146);
            this.mainLayer.addChild(rewardPanel);

            // var tips = new cc.Sprite("#slotmaya_bonus_prepare_bottom_tip.png");
            // tips.setPosition(1021, 150);
            // this.mainLayer.addChild(tips);

            var playTimeLabel = new cc.LabelBMFont("X1", cc.SlotZodiacRes.font.Jackpot_Font);
            playTimeLabel.setPosition(playTime.width / 2, 60);
            playTime.addChild(playTimeLabel);
            this.playTimeLabel = playTimeLabel;

            var multiplyLabel = new cc.LabelBMFont("X1", cc.SlotZodiacRes.font.Jackpot_Font);
            multiplyLabel.setPosition(playTimeLabel.getPosition());
            multiply.addChild(multiplyLabel);
            this.multiplyLabel = multiplyLabel;

            var totalBonusLabel = new cc.LabelBMFont("0", cc.SlotZodiacRes.font.Jackpot_Font);
            totalBonusLabel.setPosition(cc.winSize.width - 129, cc.winSize.height - 150);
            totalBonusLabel.setScale(0.7);
            this.mainLayer.addChild(totalBonusLabel);
            this.totalBonusLabel = totalBonusLabel;

            var countDownLabel = new cc.LabelBMFont(" " + this.cooldown, cc.SlotZodiacRes.font.Roboto_Bold_Bonus_30);
            countDownLabel.setAnchorPoint(cc.p(0, 0));
            countDownLabel.setScale(1.2);
            countDownLabel.setPosition(1200, 13);
            countDownLabel.retain();
            this.mainLayer.addChild(countDownLabel);
            this.countDownLabel = countDownLabel;

            var countDown = new cc.LabelTTF("End in ", "Arial", 35);
            countDown.setScale(1.2);
            countDown.setPosition(1080, 30);
            countDown.setColor(cc.color("#000"));
            this.mainLayer.addChild(countDown);
        },
        initCharacter: function () {
            var characterLayer = new cc.Node();
            this.mainLayer.addChild(characterLayer);
            this.characterLayer = characterLayer;

            // var bonus_lion = new sp.SkeletonAnimation("res/SlotZodiac/spine/bonus_lion.json", "res/SlotZodiac/spine/bonus_lion.atlas");
            // bonus_lion.setPosition(cc.winSize.width / 2, 0);
            // bonus_lion.setSkin("default");
            // bonus_lion.setAnimation(0, "animation", true);
            // characterLayer.addChild(bonus_lion);
            // this.bonus_lion = bonus_lion;

            var bgReward = new cc.Sprite("res/SlotZodiac/slotmaya_bg_board_reward.png");
            bgReward.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.characterLayer.addChild(bgReward);

        },

        revealReward: function (point) {
            if (this._pending)
                return false;

            if ((!this._bonuses) || this._bonuses.length === 0)
                return false;

            var match = false;
            var foundIndex = -1;
            for (var i = 0; i < this._touches.length; i++) {
                if (cc.rectContainsPoint(this._touches[i].rect, point)) {
                    match = true;
                    foundIndex = i;
                    break;
                }
            }
            if (!match)
                return;

            // pop a bonus out
            var bonus = this._bonuses.splice(0, 1)[0];
            if (!bonus)
                return false;

            point = this._touches[foundIndex].pos;
            // this._touches[foundIndex].effect && this._touches[foundIndex].effect.removeFromParent();
            this.setPlaytime(this._bonuses.length);
            var thiz = this;
            this._revealing = true;
            thiz._revealing = !thiz.mainLayer.visible;
            switch (bonus.type) {
                case "gold":
                    this._touches[foundIndex].effect.setSpriteFrame("slotmaya_reward4.png");
                    this.pushFlyingText(bonus.gold, point, this.totalBonusLabel.getPosition(),
                        function () {
                            thiz.setBonusAmount(thiz._bonusAmount + bonus.gold);
                            if (thiz._playTime === 0 && (!thiz._pending)) {
                                setTimeout(function () {
                                    thiz.showCompleteDialog();
                                }, 1000);
                            }
                        });
                    break;

                case "multiply":
                    this._touches[foundIndex].effect.setSpriteFrame("slotmaya_reward3.png");
                    var pos = this.multiplyLabel.convertToWorldSpace(this.multiplyLabel.getPosition());
                    this.pushFlyingText("X" + bonus.multiplier, point, pos,
                        function () {
                            thiz.setMultiply(thiz._multiplyVal + bonus.multiplier);
                            if (thiz._playTime === 0 && (!thiz._pending)) {
                                setTimeout(function () {
                                    thiz.showCompleteDialog();
                                }, 1000);
                            }
                        });
                    break;

                case "bonus":
                    this._touches[foundIndex].effect.setSpriteFrame("slotmaya_reward1.png");
                    this.showMultiplyBonus(bonus.bonusResult, bonus.bonusResult.indexOf(bonus.gold));
                    this._pending = true;
                    break;
            }
            this._touches.splice(foundIndex, 1);
            return true;
        },

        pushFlyingText: function (str, from, to, callback) {
            var flyingLabel = new cc.LabelBMFont(str, cc.SlotZodiacRes.font.Jackpot_Font);
            flyingLabel.setPosition(from);
            this.addChild(flyingLabel, 500);

            var moveAct = new cc.MoveTo(1, to);
            var scaleAct = new cc.ScaleTo(1, 0.5);
            var clearAct = new cc.CallFunc(function () {
                flyingLabel.removeFromParent(true);
                callback();
            });

            flyingLabel.runAction(new cc.Sequence(new cc.Spawn(moveAct, scaleAct), clearAct));
        },

        setupBonusGame: function (results) {
            this.setMultiply(results.initialMultiplier);
            this.setPlaytime(results.bonuses.length);
            this._bonuses = results.bonuses;
            this._totalBonus = results.totalWin;
            this.cooldown = results.cooldown;
            this.setCooldown(this.cooldown);
            this._finalAmount = results.totalAmount;
            this._finalMultiplier = results.totalMultiplier;
        },

        setMultiply: function (value) {
            this._multiplyVal = value;
            this.multiplyLabel.setString("X" + this._multiplyVal);
        },

        setBonusAmount: function (value) {
            this._bonusAmount = value;
            this.totalBonusLabel.setString(cc.GlobalSlotZodiac.FormatGold(this._bonusAmount));
        },

        setPlaytime: function (value) {
            this._playTime = value;
            this.playTimeLabel.setString(this._playTime);
        },

        onEnter: function () {
            this._super.apply(this, arguments);
            this._ended = false;
        },

        initController: function () {
            this._controller = new BonusController(this, this.betLevel, this.isSandbox);
        },

        showMultiplyBonus: function (bonusArr, bonusIndex) {
            var d = new BonusDialog();
            d.setBonusResult(bonusArr, bonusIndex);
            var thiz = this;
            d.setRevealMultiplyCallback(function (xLabel, pos, xValue) {
                xLabel.setPosition(pos);
                xLabel.retain();
                xLabel.removeFromParent(true);
                thiz.addChild(xLabel);
                xLabel.release();
                thiz.hideAllDialog();
                thiz._pending = false;
                thiz._revealing = false;

                var moveAct = new cc.MoveTo(0.5, thiz.totalBonusLabel.getPosition());
                var scaleAct = new cc.ScaleTo(0.5, 0.5);
                var clearAct = new cc.CallFunc(function () {
                    if (thiz._playTime === 0) {
                        thiz.showCompleteDialog();
                    }
                    xLabel.removeFromParent(true);
                    thiz.setBonusAmount(thiz._bonusAmount + xValue);
                });

                xLabel.runAction(new cc.Sequence(new cc.Spawn(moveAct, scaleAct), clearAct));
            });
            this.showDialog(d);
        },

        showDialog: function (dialog) {
            this._super.apply(this, arguments);
            var thiz = this;
            dialog.onExit = function () {
                Dialog.prototype.onExit.call(this);
                thiz.mainLayer.visible = !thiz._ended;
                thiz._revealing = false;
                if (thiz._playTime === 0 && (!thiz._pending) && (!thiz._ended)) {
                    thiz.showCompleteDialog();
                }
            };
            this.mainLayer.visible = false;
        },

        onExit: function () {
            this._super();
            this.countDownLabel.release();
        },

        onReconnect: function () {
            this.showCompleteDialog();
        },

        showCompleteDialog: function () {
            this._totalBonus = this._totalBonus || 0;
            this.characterLayer.visible = false;
            var thiz = this;
            this.showDialog(new CompleteBonusDialog(this._finalAmount, this._finalMultiplier,
                _exitCompleteBonusDialog));

            function _exitCompleteBonusDialog() {
                var value = thiz._finalAmount * thiz._finalMultiplier;
                cc.GlobalSlotZodiac.totalRewardValue += value;

                // free spin game
                if (cc.GlobalSlotZodiac.FreeSpinGame.enabled)
                    cc.GlobalSlotZodiac.FreeSpinGame.reward += value;

                // cc.log(cc.GlobalSlotZodiac.totalRewardValue);
                cc.director.replaceScene(new SlotZodiac.SlotScene());
                if (thiz.cooldown >= 0) {
                    thiz._controller.sendEndgameRequest(cc.GlobalSlotZodiac.isSandboxMode);
                }
            }

            this._ended = true;
            clearTimeout(this.cooldownInterval);
        }
    });
})();
