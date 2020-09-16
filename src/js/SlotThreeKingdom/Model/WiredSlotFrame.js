var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    var SlotFrame = SlotThreeKingdom.SlotFrame;
    var AllSlotObject = SlotThreeKingdom.AllSlotObject;
    var WireAllLineEffect = [];
    var SymbolEffect = [];
    var QueueActions = [];
    var WireAction = [];

    SlotThreeKingdom.WiredSlotFrame = SlotFrame.extend({
        ctor: function (row, column) {
            this._super.apply(this, arguments);
        },

        setWires: function (wires) {
            this.wires = wires;
            this._implementWires();
        },

        _implementWires: function () {
            if (this.wireNodes && this.wireNodes.length) {
                for (var i = 0; i < this.wireNodes.length; i++) {
                    var w = this.wireNodes[i];
                    w.removeFromParent(true);
                }
                this.wireNodes = null;
            }

            var wireNodes = [];
            for (var i = 0; i < this.wires.length; i++) {
                var w = new cc.Sprite("res/SlotThreeKingdom/payline/Payline_" + (i + 1) + ".png");
                if (i === 0)
                    w.setPosition(-20, 50);
                else if (i === 1)
                    w.setPosition(-20, 245);
                else if (i === 2)
                    w.setPosition(-30, -195);
                else if (i === 3)
                    w.setPosition(35, 40);
                else if (i === 4)
                    w.setPosition(45, 50);
                else if (i === 5)
                    w.setPosition(45, 155);
                else if (i === 6)
                    w.setPosition(-30, -35);
                else if (i === 7)
                    w.setPosition(-20, 75);
                else if (i === 8)
                    w.setPosition(-15, 65);
                else if (i === 9)
                    w.setPosition(-35, 50);
                else if (i === 10)
                    w.setPosition(35, 20);
                else if (i === 11)
                    w.setPosition(40, 170);
                else if (i === 12)
                    w.setPosition(40, -15);
                else if (i === 13)
                    w.setPosition(-35, 155);
                else if (i === 14)
                    w.setPosition(-30, -5);
                else if (i === 15)
                    w.setPosition(30, 130);
                else if (i === 16)
                    w.setPosition(-35, -2);
                else if (i === 17)
                    w.setPosition(28, 75);
                else if (i === 18)
                    w.setPosition(25, 60);
                else if (i === 19)
                    w.setPosition(-30, 105);
                else if (i === 20)
                    w.setPosition(-15, 20);
                else if (i === 21)
                    w.setPosition(30, 50);
                else if (i === 22)
                    w.setPosition(-40, 35);
                else if (i === 23)
                    w.setPosition(20, 7);
                else
                    w.setPosition(25, 20);

                w.visible = false;
                this.addChild(w, 8);
                wireNodes.push(w);
            }
            this.wireNodes = wireNodes;
        },

        _convertIndexToXY: function (wires) {
            if (wires instanceof Array) {
                var result = [];
                for (var i = 0; i < wires.length; i++) {

                    var points = wires[i].points;
                    if (points instanceof Array) {
                        //recursive convert
                        result[i] = this._convertIndexToXY(points);
                    } else if (wires[i].hasOwnProperty("xIndex") && wires[i].hasOwnProperty("yIndex")) {
                        result[i] = cc.p(this._getSlotXPosition(wires[i].xIndex),
                            this._getSlotYPosition(wires[i].yIndex));
                    } else {
                        // do nothing, converted or don't know how to convert
                    }
                }
                return result;
            } else {
                return null;
            }
        },

        /**
         * Toggle visibility of Wire
         * @param nodeIndex Wire index
         * @param {Boolean} [visible] Force visibility of wire
         */
        toggleWireNode: function (nodeIndex, visible) {
            if (!this.wireNodes[nodeIndex])
                return;

            if (visible !== undefined) {
                this.wireNodes[nodeIndex].visible = visible;
            } else {
                this.wireNodes[nodeIndex].visible = !this.wireNodes[nodeIndex].visible;
            }
        },

        showReward: function (isShow, results, freeSpin, bonus, revealLineCallback, callback) {
            var delay = 0;
            var thiz = this;
            var megaWin = false;
            var levelUp = false;

            for (var i = 0; i < results.length; i++) {
                var res = results[i];
                var lineId = res["1"];
                var rewardObjs = res["2"];
                this._showAllLine(this.wires[lineId - 1]);
                if (!isShow) {
                    var timeoutRevealLine = setTimeout(function (w, v, wI, l) {
                        thiz._revealReward(w, v, wI);
                        if (typeof (revealLineCallback) === "function")
                            revealLineCallback.call(null, l);
                    }, delay += 1500, this.wires[lineId - 1], rewardObjs, lineId - 1, results[i]);
                    QueueActions.push(timeoutRevealLine);
                }
            }

            if (freeSpin) {
                var timeoutFreeSpin = setTimeout(function () {
                    thiz._revealSymbol(4);
                }, delay += 1500);
                QueueActions.push(timeoutFreeSpin);
            }

            if (bonus) {
                var timeoutBonus = setTimeout(function () {
                    thiz._revealSymbol(3);
                }, delay += 1500);
                QueueActions.push(timeoutBonus);
            }

            var callbackParam = Array.prototype.slice.call(arguments, 6);
            var timeoutCallback = setTimeout(function () {
                thiz.hideAllWires();
                if (typeof callback === "function") {
                    callback.apply(null, callbackParam);
                }
            }, delay + 1500);
            QueueActions.push(timeoutCallback);
        },

        //Show all line
        _showAllLine: function (wireIndex) {
            var wireNode = this.wireNodes[this.wires.indexOf(wireIndex)];
            wireNode.visible = true;
            var thiz = this;
            var timeoutRemoveWireNode = setTimeout(function () {
                thiz.hideAllWires();
            }, 1000);
            WireAction.push(timeoutRemoveWireNode);
        },

        _revealSymbol: function (symbolValue) {
            this.hideAllWires();
            for (var i = 0; i < this.column; i++) {
                for (var j = 0; j < this.row; j++) {
                    var slotObj = this.getSlotObject(j, i);
                    if (slotObj.getValue() !== symbolValue)
                        continue;
                    var eff = sp.SkeletonAnimation.createWithJsonFile("res/SlotThreeKingdom/spine/effect_sym_fire.json", "res/SlotThreeKingdom/spine/effect_sym_fire.atlas");
                    eff.setAnimation(0, "animation", true);
                    eff.setPosition(slotObj.x, slotObj.y - 150);
                    eff.retain();
                    SymbolEffect.push(eff);
                    this.containerLayout.addChild(eff, 10);
                    var thiz = this;
                    var delayAct = new cc.DelayTime(1.5);
                    var finalAct = (function (target) {
                        return new cc.CallFunc(function () {
                            target.removeFromParent();
                        });
                    })(eff);

                    // eff.update = function () {
                    //     return function (p) {
                    //
                    //     }
                    // }();

                    slotObj.runAction(new cc.Sequence(delayAct, finalAct));
                }
            }
        },

        _revealReward: function (wire, value, wireIndex) {
            this.hideAllWires();
            //show the wire
            var wireNode = this.wireNodes[this.wires.indexOf(wire)];
            wireNode.visible = true;
            var isContinus = true;
            var listSymHasEff = [];
            for (var i = 0; i < wire.points.length; i++) {
                var p = wire.points[i];
                var slotObj = this.getSlotObject(p.yIndex, p.xIndex);
                // cc.log("VALUE: " + slotObj.value);
                if ((value % 11) === (slotObj.value % 11) || (slotObj.value % 11) === 2) {
                    if (isContinus) {
                        listSymHasEff.push(slotObj);
                    }
                }

                if ((slotObj.value % 11) !== (value % 11) && (slotObj.value % 11) !== 2) {
                    isContinus = false;
                }
            }

            if (listSymHasEff.length > 0) {
                for (var i = 0; i < listSymHasEff.length; i++) {
                    var eff = sp.SkeletonAnimation.createWithJsonFile("res/SlotThreeKingdom/spine/effect_sym_fire.json", "res/SlotThreeKingdom/spine/effect_sym_fire.atlas");
                    eff.setAnimation(0, "animation", true);
                    eff.setPosition(listSymHasEff[i].x, listSymHasEff[i].y - 150);
                    eff.retain();
                    SymbolEffect.push(eff);
                    this.containerLayout.addChild(eff, 10);
                    var thiz = this;
                    var delayAct = new cc.DelayTime(1.5);
                    var finalAct = (function (target) {
                        return new cc.CallFunc(function () {
                            target.removeFromParent();
                        });
                    })(eff);
                    listSymHasEff[i].runAction(new cc.Sequence(delayAct, finalAct));
                }
            }
        },

        hideAllWires: function () {
            for (var i = 0; i < this.wireNodes.length; i++)
                this.wireNodes[i].visible = false;
        },

        hideWireAndSymbolEffect: function () {
            this.hideAllWires();

            if (QueueActions.length > 0)
                for (var i = 0; i < QueueActions.length; i++) {
                    clearTimeout(QueueActions[i]);
                }
            QueueActions = [];

            if (SymbolEffect.length > 0)
                for (var i = 0; i < SymbolEffect.length; i++) {
                    if (SymbolEffect[i]) {
                        var eff = SymbolEffect[i];
                        eff.removeFromParent();
                    }
                }
            SymbolEffect = [];

            if (WireAction.length > 0)
                for (var i = 0; i < WireAction.length; i++) {
                    clearTimeout(WireAction[i]);
                }
            WireAction = [];

            if (WireAllLineEffect.length > 0)
                for (var i = 0; i < WireAllLineEffect.length; i++) {
                    var eff = WireAllLineEffect[i];
                    eff.removeFromParent();
                }
            WireAllLineEffect = [];
        }
    });
})();
