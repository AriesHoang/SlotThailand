var SlotWomenAgent = SlotWomenAgent || {};

(function () {
    var Dialog = SlotWomenAgent.Dialog;

    SlotWomenAgent.BonusDialog = Dialog.extend({
        ctor: function (width, height) {
            width = width || cc.winSize.width;
            height = height || cc.winSize.height;
            this._super.call(this, width, height);
            this._callback = null;
            this._ended = false;

            var poses = [
                {x: 728, y: cc.winSize.height / 2},
                {x: 1024, y: cc.winSize.height / 2},
                {x: 1297, y: cc.winSize.height / 2}
            ];

            this.allBonus = [];
            this._currentBonus = null;
            var thiz = this;

            var gun1 = new cc.Sprite("#slotwomenagent_icon_gun2.png");
            var gun1bg = new cc.Sprite("#slotwomenagent_bg_gun.png");
            gun1bg.setPosition(poses[0].x, poses[0].y);
            gun1.setPosition(gun1bg.width / 2, gun1bg.height / 2);
            this.addChild(gun1bg);
            gun1bg.addChild(gun1, 1);
            (function (obj) {
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        var target = event.getCurrentTarget();
                        var p = target.convertToNodeSpace(touch.getLocation());
                        var rect = cc.rect(gun1bg.x, gun1bg.y, 225, 247);
                        // var draw = new cc.DrawNode();
                        // thiz.addChild(draw, 500);
                        // draw.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x + rect.width, rect.y + rect.height), cc.color(
                        //     0, 0, 0, 150));
                        if (cc.rectContainsPoint(rect, p)) {
                            if (thiz._ended) return false;

                            thiz._currentBonus = obj;
                            thiz._ended = true;
                            var delayAct = new cc.DelayTime(0.85);
                            var revalAct = new cc.CallFunc(function () {
                                thiz.revealBonus();
                            });
                            target.runAction(new cc.Sequence(delayAct, revalAct));
                            return true;
                        }
                        return false;
                    }
                }, obj);
            })(gun1);
            this.allBonus.push(gun1);

            var gun2 = new cc.Sprite("#slotwomenagent_icon_gun1.png");
            var gun2bg = new cc.Sprite("#slotwomenagent_bg_gun.png");
            gun2bg.setPosition(poses[1].x, poses[1].y);
            gun2.setPosition(gun2bg.width / 2, gun2bg.height / 2);
            cc.log(gun2.getPosition());
            this.addChild(gun2bg);
            gun2bg.addChild(gun2, 1);
            (function (obj) {
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        var target = event.getCurrentTarget();
                        var p = target.convertToNodeSpace(touch.getLocation());
                        var rect = cc.rect(gun2.x, gun2.y, 225, 247);
                        // var draw = new cc.DrawNode();
                        // thiz.addChild(draw, 500);
                        // draw.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x + rect.width, rect.y + rect.height), cc.color(
                        //     0, 0, 0, 150));
                        if (cc.rectContainsPoint(rect, p)) {
                            if (thiz._ended) return false;

                            thiz._currentBonus = obj;
                            thiz._ended = true;
                            var delayAct = new cc.DelayTime(0.85);
                            var revalAct = new cc.CallFunc(function () {
                                thiz.revealBonus();
                            });
                            target.runAction(new cc.Sequence(delayAct, revalAct));
                            return true;
                        }
                        return false;
                    }
                }, obj);
            })(gun2);
            this.allBonus.push(gun2);

            var gun3 = new cc.Sprite("#slotwomenagent_icon_gun3.png");
            var gun3bg = new cc.Sprite("#slotwomenagent_bg_gun.png");
            gun3bg.setPosition(poses[2].x, poses[2].y);
            gun3.setPosition(gun3bg.width / 2, gun3bg.height / 2);
            this.addChild(gun3bg);
            gun3bg.addChild(gun3, 1);

            (function (obj) {
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        var target = event.getCurrentTarget();
                        var p = target.convertToNodeSpace(touch.getLocation());
                        var rect = cc.rect(gun3.x, gun3.y, 225, 247);
                        // var draw = new cc.DrawNode();
                        // thiz.addChild(draw, 500);
                        // draw.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x + rect.width, rect.y + rect.height), cc.color(
                        //     0, 0, 0, 150));
                        if (cc.rectContainsPoint(rect, p)) {
                            if (thiz._ended) return false;

                            thiz._currentBonus = obj;
                            thiz._ended = true;
                            var delayAct = new cc.DelayTime(0.85);
                            var revalAct = new cc.CallFunc(function () {
                                thiz.revealBonus();
                            });
                            target.runAction(new cc.Sequence(delayAct, revalAct));
                            return true;
                        }
                        return false;
                    }
                }, obj);
            })(gun3);
            this.allBonus.push(gun3);

            this.setTitle("");
            this._bonusArray = null;
            this._bonusIndex = null;

            var bottomTip = new cc.Sprite("#slotwomenagent_chooseweapon_agent.png");
            bottomTip.setPosition(1012, cc.winSize.height - 200);
            this.addChild(bottomTip);
        },

        onEnter: function () {
            cc.Node.prototype.onEnter.call(this);
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    return true;
                },

                onTouchEnded: function (touch, event) {
                    return true;
                }
            }, this);
        },

        revealBonus: function () {
            if (!this._currentBonus)
                return;

            var value = this._bonusArray[this._bonusIndex];

            var label = new cc.LabelBMFont("X" + value, cc.SlotWomenAgentRes.font.Bonus_Multiplier);
            label.setPosition(this._currentBonus.x - 15, this._currentBonus.y + 300);
            this.addChild(label);

            var valueLabel = new cc.LabelBMFont(cc.GlobalSlotWomenAgent.FormatGold(this._totalBonus), cc.SlotWomenAgentRes.font.Bonus_Multiplier);
            // valueLabel.setScale(0.8);
            valueLabel.setPosition(label.x, label.y - 100);
            this.addChild(valueLabel);

            // // reveal missed bonuses
            // var resultIndex = 0;
            // this._bonusArray.splice(this._bonusIndex, 1);
            // for (var i = 0; i < this.allBonus.length; i++) {
            //     if (this.allBonus[i] === this._currentBonus) {
            //         continue;
            //     }
            //     var subLabel = new cc.LabelBMFont(this._bonusArray[resultIndex], cc.SlotWomenAgentRes.font.Bay_Buom_Stroke_White);
            //     subLabel.setOpacity(192);
            //     subLabel.setPosition(this.allBonus[i].getPosition());
            //     this.addChild(subLabel);
            //     resultIndex++;
            // }

            if (typeof (this._revealMultiplyCallback) === "function") {
                var thiz = this;
                setTimeout(function () {
                    thiz._revealMultiplyCallback(label, thiz.convertToWorldSpace(label.getPosition()), value);
                }, 1500);
            }
        },

        initButton: function () {

        },

        setBonusResult: function (bonusArray, bonusIndex, totalBonus) {
            this._bonusArray = bonusArray;
            this._bonusIndex = bonusIndex;
            this._totalBonus = totalBonus;
        },

        setRevealMultiplyCallback: function (fn) {
            if (typeof (fn) === "function")
                this._revealMultiplyCallback = fn;
        },

        initBackground: function () {

        }
    });
})();
