var SlotMaya = SlotMaya || {};

(function () {
    var SlotFrame = SlotMaya.SlotFrame || cc.Class;
    var WireEffect = [];
    var WireAllLineEffect = [];
    var SymbolEffect = [];
    var QueueActions = [];
    var WireAction = [];

    SlotMaya.WiredSlotFrame = SlotFrame.extend({
        ctor: function (row, column) {
            this._super.apply(this, arguments);

            this.effectSrc = [
                "res/SlotMaya/spine/spine_eff_symbol"
            ];
        },

        setWires: function (wires) {
            this.wires = wires;
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

        showReward: function (isShow, results, revealLineCallback, callback) {
            this.hideWireAndSymbolEffect();

            var delay = 0;
            var thiz = this;
            var megaWin = false;
            var levelUp = false;

            for (var i = 0; i < results.length; i++) {
                var res = results[i];
                var lineId = res["1"];
                var rewardSymbol = res["2"];
                this._showAllLine(lineId - 1);
                if (!isShow) {
                    var timeoutRevealLine = setTimeout(function (w, v, wI, l) {
                        thiz._revealReward(w, v, wI);
                        if (typeof (revealLineCallback) === "function")
                            revealLineCallback.call(null, l);
                    }, delay += 1500, this.wires[lineId - 1], rewardSymbol, lineId - 1, results[i]);
                    QueueActions.push(timeoutRevealLine);
                }
            }
            var callbackParam = Array.prototype.slice.call(arguments, 4);
            var timeoutCallback = setTimeout(function () {
                if (typeof callback === "function") {
                    callback.apply(null, callbackParam);
                }
            }, delay + 1500);
            QueueActions.push(timeoutCallback);
        },

        _showAllLine: function (wireIndex) {
            var wireNode = new cc.Sprite("res/SlotMaya/payline/payline_" + wireIndex + ".png");
            // wireNode.setScaleY(1.03);
            if (wireIndex === 0)
                wireNode.setPosition(-80, -35);
            else if (wireIndex === 1)
                wireNode.setPosition(-85, 155);
            else if (wireIndex === 2)
                wireNode.setPosition(-70, -295);
            else if (wireIndex === 3)
                wireNode.setPosition(-80, 20);
            else if (wireIndex === 4)
                wireNode.setPosition(-85, -125);
            else if (wireIndex === 5)
                wireNode.setPosition(-85, 85);
            else if (wireIndex === 6)
                wireNode.setPosition(-80, -175);
            else if (wireIndex === 7)
                wireNode.setPosition(-55, -60);
            else if (wireIndex === 8)
                wireNode.setPosition(-85, -110);
            else if (wireIndex === 9)
                wireNode.setPosition(-45, -65);
            else if (wireIndex === 10)
                wireNode.setPosition(85, -75);
            else if (wireIndex === 11)
                wireNode.setPosition(85, -60);
            else if (wireIndex === 12)
                wireNode.setPosition(85, -60);
            else if (wireIndex === 13)
                wireNode.setPosition(80, -60);
            else if (wireIndex === 14)
                wireNode.setPosition(30, -150);
            else if (wireIndex === 15)
                wireNode.setPosition(80, 85);
            else if (wireIndex === 16)
                wireNode.setPosition(85, -160);
            else if (wireIndex === 17)
                wireNode.setPosition(85, -10);
            else if (wireIndex === 18)
                wireNode.setPosition(80, -60);
            else if (wireIndex === 19)
                wireNode.setPosition(90, -105);
            wireNode.retain();
            this.addChild(wireNode, 5);
            WireAllLineEffect.push(wireNode);

            var thiz = this;

            var timeoutRemoveWireNode = setTimeout(function () {
                wireNode.removeFromParent();
                thiz.containerLayout.wireNode = null;
            }, 1500);
            WireAction.push(timeoutRemoveWireNode);
        },

        _revealReward: function (wire, value, wireIndex) {
            //show the wire
            var wireNode = new cc.Sprite("res/SlotMaya/payline/payline_" + wireIndex + ".png");

            if (wireIndex === 0)
                wireNode.setPosition(-80, -35);
            else if (wireIndex === 1)
                wireNode.setPosition(-85, 155);
            else if (wireIndex === 2)
                wireNode.setPosition(-70, -295);
            else if (wireIndex === 3)
                wireNode.setPosition(-80, 20);
            else if (wireIndex === 4)
                wireNode.setPosition(-85, -125);
            else if (wireIndex === 5)
                wireNode.setPosition(-85, 85);
            else if (wireIndex === 6)
                wireNode.setPosition(-80, -175);
            else if (wireIndex === 7)
                wireNode.setPosition(-55, -60);
            else if (wireIndex === 8)
                wireNode.setPosition(-85, -110);
            else if (wireIndex === 9)
                wireNode.setPosition(-45, -65);
            else if (wireIndex === 10)
                wireNode.setPosition(85, -75);
            else if (wireIndex === 11)
                wireNode.setPosition(85, -60);
            else if (wireIndex === 12)
                wireNode.setPosition(85, -60);
            else if (wireIndex === 13)
                wireNode.setPosition(80, -60);
            else if (wireIndex === 14)
                wireNode.setPosition(30, -150);
            else if (wireIndex === 15)
                wireNode.setPosition(80, 85);
            else if (wireIndex === 16)
                wireNode.setPosition(85, -160);
            else if (wireIndex === 17)
                wireNode.setPosition(85, -10);
            else if (wireIndex === 18)
                wireNode.setPosition(80, -60);
            else if (wireIndex === 19)
                wireNode.setPosition(90, -105);


            wireNode.visible = this.getSymbolVisible();
            this.containerLayout.wireNode = wireNode;
            wireNode.retain();
            this.addChild(wireNode, 5);
            WireEffect.push(wireNode);

            for (var i = 0; i < wire.points.length; i++) {
                var p = wire.points[i];
                var slotObj = this.getSlotObject(p.yIndex, p.xIndex);
                if ((value % 7) === (slotObj.value % 7)) {
                    var eff = sp.SkeletonAnimation.createWithJsonFile(this.effectSrc[0] + ".json",
                        this.effectSrc[0] + ".atlas");
                    // eff.setScale(3.4);
                    eff.setAnimation(0, "animation", true);
                    // eff.setPosition(slotObj.getPosition());
                    eff.setPosition(slotObj.x, slotObj.y - 165);
                    eff.retain();
                    this.containerLayout.addChild(eff, 10);
                    SymbolEffect.push(eff);
                    var thiz = this;
                    var delayAct = new cc.DelayTime(1.5);
                    var finalAct = (function (target) {
                        return new cc.CallFunc(function () {
                            target.removeFromParent();
                        });
                    })(eff);

                    slotObj.runAction(new cc.Sequence(delayAct, finalAct));
                }
            }

            //clean all object
            var timeoutRemoveWireNode = setTimeout(function () {
                wireNode.removeFromParent();
                thiz.containerLayout.wireNode = null;
            }, 1500);
            WireAction.push(timeoutRemoveWireNode);
        },


        setSymbolVisible: function (isVisible) {
            this._super.apply(this, arguments);
            this.containerLayout.wireNode && (this.containerLayout.wireNode.visible = isVisible);
        }
        ,

        hideWireAndSymbolEffect: function () {
            for (var i = 0; i < QueueActions.length; i++) {
                clearTimeout(QueueActions[i]);
            }
            QueueActions = [];

            for (var i = 0; i < WireAction.length; i++) {
                clearTimeout(WireAction[i]);
            }
            WireAction = [];

            for (var i = 0; i < SymbolEffect.length; i++) {
                var eff = SymbolEffect[i];
                eff.removeFromParent();
            }
            SymbolEffect = [];

            for (var i = 0; i < WireEffect.length; i++) {
                var eff = WireEffect[i];
                eff.removeFromParent();
            }
            WireEffect = [];

            for (var i = 0; i < WireAllLineEffect.length; i++) {
                var eff = WireAllLineEffect[i];
                eff.removeFromParent();
            }
            WireAllLineEffect = [];
        }
    });
})
();
