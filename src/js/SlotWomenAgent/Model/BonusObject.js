var SlotWomenAgent = SlotWomenAgent || {};

(function () {
    SlotWomenAgent.BonusObject = cc.Node.extend({
        ctor: function () {
            this._super();
            var value = value || cc.GlobalSlotWomenAgent.randomInt(1, 12);
            value = value % 12 + 1;

            this._revealed = false;

            // var natra = sp.SkeletonAnimation.createWithJsonFile("res/SlotWomenAgent/spine/effect_lotus.json", "res/SlotWomenAgent/spine/effect_lotus.atlas");
            var hold = new cc.Sprite("#slotwomenagent_bonus_shoot_hold.png");
            this.addChild(hold);
            // hold.setSkin(value);
            // natra.setAnimation(0, "animation", true);
            // hold.setScale(1.0);
            this.natra = hold;
        },

        onEnter: function () {
            this._super();

            var thiz = this;

            var btn = new cc.Node();
            btn.setContentSize(95, 150);
            btn.setAnchorPoint(cc.p(0.5, 0.5));
            btn.setPosition(0, 0);

            this.addChild(btn);

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    if (this._revealed)
                        return false;

                    var target = event.getCurrentTarget();
                    var p = target.convertToNodeSpace(touch.getLocation());
                    var rect = cc.rect(0, 0, target.width, target.height);
                    if (cc.rectContainsPoint(rect, p)) {
                        var revealResult = thiz.reveal();

                        // blocking will return undefined
                        if (revealResult === undefined)
                            return true;

                        thiz._postRevealCallback.call(thiz._revealCallbackTarget, revealResult);
                        return true;
                    }
                    return false;
                }
            }, btn);
        },

        setRevealCallback: function (preReveal, postReveal, target) {
            this._preRevealCallback = preReveal;
            this._postRevealCallback = postReveal;
            this._revealCallbackTarget = target;
        },

        reveal: function () {
            if (this._revealed)
                return;

            if (!this._preRevealCallback)
                return;

            var bonus = this._preRevealCallback.call(this._revealCallbackTarget);
            if (bonus === false)
                return;

            else if (bonus === 0) {
                this.showTextBonus();
                this._revealed = true;
                return 0;
            }

            var retVal = {};
            retVal.bonus = bonus;
            retVal.pos = this.convertToWorldSpace(cc.p(0, 70));

            this._revealed = true;
            var natra = this.natra;
            // natra.setAnimation(0, "animation", false);
            // natra.setCompleteListener(function () {
            //     // natra.setSkin("1");
            //     natra.setCompleteListener(null);
            // });
            this.showMoneyBonus(retVal.bonus, this._position, null);

            return retVal;
        },

        showMoneyBonus: function (str, pos, callback) {
            var flyingLabel = new cc.LabelBMFont(cc.GlobalSlotWomenAgent.FormatGold(str), cc.SlotWomenAgentRes.font.Bonus_Multiplier);
            flyingLabel.y += 50;
            flyingLabel.setScale(0.5);
            this.addChild(flyingLabel, 2);
            var scaleAct = new cc.ScaleTo(0.2, 1.0);
            flyingLabel.runAction(new cc.Sequence(new cc.Spawn(scaleAct), new cc.CallFunc(function () {
                callback && callback();
            })));
        },

        showTextBonus: function () {
            var finishLabel = new cc.LabelBMFont("MISS", cc.SlotWomenAgentRes.font.PopupFont);
            finishLabel.x += 20;
            finishLabel.y += 50;
            finishLabel.setScale(0.5);
            finishLabel.setColor(cc.color(0, 0, 255));
            this.addChild(finishLabel, 2);
            var scaleAct = new cc.ScaleTo(0.2, 1.2);
            finishLabel.runAction(new cc.Spawn(scaleAct));
        }
    });
})();
