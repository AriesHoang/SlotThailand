var SlotZodiac = SlotZodiac || {};

(function () {
    var Dialog = SlotZodiac.Dialog;

    SlotZodiac.BonusDialog = Dialog.extend({
        ctor: function (width, height) {
            width = width || 1408;
            height = height || 899;
            this._super.call(this, width, height);
            this._callback = null;
            this._ended = false;

            // var poses = [
            //     {x: 504, y: 548},
            //     {x: 890, y: 548},
            //     {x: 726, y: 275},
            //     {x: 364, y: 275},
            //     {x: 1090, y: 275}
            // ];

            var pos = [
                {rect: cc.rect(390, 460, 250, 206), pos: cc.p(504, 548)},
                {rect: cc.rect(780, 460, 250, 206), pos: cc.p(890, 548)},
                {rect: cc.rect(600, 180, 250, 206), pos: cc.p(726, 275)},
                {rect: cc.rect(240, 180, 250, 206), pos: cc.p(364, 275)},
                {rect: cc.rect(960, 180, 250, 206), pos: cc.p(1090, 275)}
            ];


            // var moLixi = new cc.Sprite("#slotmaya_bonus_title_tip.png");
            // moLixi.setPosition(this.width / 2, this.height);
            // this.addChild(moLixi);


            // var draw = new cc.DrawNode();
            // this.addChild(draw, 500);
            //
            // for (var j = 0; j < pos.length; j++) {
            //     var r = pos[j].rect;
            //     cc.log(r.x + " - " + r.y);
            //     draw.drawRect(cc.p(r.x, r.y),
            //         cc.p(r.x + r.width, r.y + r.height),
            //         cc.color(0, 0, 0, 150));
            // }

            this.allBonus = [];
            this._currentBonus = null;
            var thiz = this;

            for (var i = 0; i < pos.length; i++) {
                var lixi = new cc.Sprite("#slotmaya_reward_coin.png");
                lixi.setPosition(pos[i].pos);
                lixi.rect = pos[i].rect;
                thiz.addChild(lixi);
                (function (obj) {
                    cc.eventManager.addListener({
                        event: cc.EventListener.TOUCH_ONE_BY_ONE,
                        swallowTouches: true,
                        onTouchBegan: function (touch, event) {
                            var target = event.getCurrentTarget();
                            var p = target.convertToNodeSpace(touch.getLocation());
                            var rect = cc.rect(-175, -68, 340, 206);
                            if (cc.rectContainsPoint(rect, p)) {
                                if (thiz._ended)
                                    return false;
                                thiz._currentBonus = obj;
                                // target.visible = false;
                                // obj.setSpriteFrame("slotmaya_bonus_kimtien.png");
                                thiz._ended = true;
                                var delayAct = new cc.DelayTime(0);
                                var revealAct = new cc.CallFunc(function () {
                                    thiz.revealBonus();
                                });
                                target.runAction(new cc.Sequence(delayAct, revealAct));
                                return true;
                            }
                            return false;
                        }
                    }, obj);
                })(lixi);

                this.allBonus.push(lixi);
            }
            this._bonusArray = null;
            this._bonusIndex = null;
        },

        initBackground: function () {

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

            var label = new cc.LabelBMFont(cc.GlobalSlotZodiac.FormatGold(value), cc.SlotZodiacRes.font.Arial_Bold_Blue_Bonus);
            label.setPosition(this._currentBonus.getPosition());
            this.addChild(label);

            // reveal missed bonuses
            var resultIndex = 0;
            this._bonusArray.splice(this._bonusIndex, 1);
            for (var i = 0; i < this.allBonus.length; i++) {
                if (this.allBonus[i] === this._currentBonus) {
                    continue;
                }
                var subLabel = new cc.LabelBMFont(cc.GlobalSlotZodiac.FormatGold(this._bonusArray[resultIndex]),
                    cc.SlotZodiacRes.font.Arial_Bold_Purple_Bonus);
                subLabel.setOpacity(192);
                subLabel.setPosition(this.allBonus[i].getPosition());
                this.addChild(subLabel);
                resultIndex++;
            }

            if (typeof (this._revealMultiplyCallback) === "function") {
                var thiz = this;
                setTimeout(function () {
                    thiz._revealMultiplyCallback(label, thiz.convertToWorldSpace(label.getPosition()), value);
                }, 2000);
            }
        },

        initButton: function () {

        },

        setBonusResult: function (bonusArray, bonusIndex) {
            this._bonusArray = bonusArray;
            this._bonusIndex = bonusIndex;
        },

        setRevealMultiplyCallback: function (fn) {
            if (typeof (fn) === "function")
                this._revealMultiplyCallback = fn;
        }
    });
})();
