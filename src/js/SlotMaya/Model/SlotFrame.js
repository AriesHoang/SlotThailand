var SlotMaya = SlotMaya || {};

(function () {
    var SlotObject = SlotMaya.SlotObject;
    var AllSlotObject = SlotMaya.AllSlotObject;

    SlotMaya.SlotFrame = cc.Node.extend({
        ctor: function (row, column) {
            this._super();
            this.row = row || 3;
            this.column = column || 5;
            this.horizontalMargin = 36;
            this.verticalMargin = 6;

            /**
             * @type {cc.Size}
             */
            this.slotObjectSize = cc.size(222, 222);
            this.rollingSpeed = 3300;

            this.slotObjects = [];
            this.rollingSlotObjects = [];
            this._initSlotFrame();


            var rolling = false;
            this._betType = 0;
            var thiz = this;
            var rollingParams = [undefined];
            var rollingBools = [true];
            for (var i = 0; i < this.column; i++) {
                rollingParams.push(i);
                rollingBools.push(false);
            }

            var cmdIndex = 0;
        },

        _initSlotFrame: function () {
            var row = this.row, column = this.column;

            var slotBackground = new cc.Sprite("res/SlotMaya/slotmaya_frame.png");
            // var slotFrame = new cc.Sprite("res/SlotMaya/slotmaya_bg_symbol.png");
            // slotFrame.setScale(0.9);
            // slotFrame.setPosition(slotBackground.x - 20, slotBackground.y - 70);
            // slotBackground.setScale(1, 1.03);
            // slotBackground.setScale(1);

            var clippingSlotLayout = new ccui.Layout();
            clippingSlotLayout.setContentSize(
                column * this.slotObjectSize.width + (column + 1) * this.horizontalMargin,
                row * this.slotObjectSize.height + (row + 1) * this.verticalMargin);

            this.setContentSize(clippingSlotLayout.getContentSize());
            clippingSlotLayout.setClippingEnabled(true);
            clippingSlotLayout.setAnchorPoint(cc.p(0.5, 0.5));
            clippingSlotLayout.setPosition(slotBackground.x - 10, slotBackground.y - 75);
            /**
             * @type {ccui.Layout}
             */
            this.containerLayout = clippingSlotLayout;
            this.addChild(clippingSlotLayout, 5);

            this.addChild(slotBackground);
            // this.addChild(slotFrame, 1);

            //setup slot objects
            for (var i = 0; i < row * column; i++) {
                var slotObj = new SlotObject(cc.GlobalSlotMaya.randomInt(0, 7));
                slotObj.setScale(0.95);
                slotObj.setPosition(this._getSlotXPosition(i % column),
                    this._getSlotYPosition(Math.floor(i / column)));
                clippingSlotLayout.addChild(slotObj, 1);

                this.slotObjects.push(slotObj);
            }

            //setup rolling animation object
            for (var i = 0; i < (row + 2) * column; i++) {
                var rollingSlotObj = new cc.Sprite("#slotmaya_" + AllSlotObject[cc.GlobalSlotMaya.randomInt(0, 6)] + ".png");
                // rollingSlotObj.setScale(this.slotObjectSize.width / rollingSlotObj.width);
                rollingSlotObj.setScale(0.95);
                rollingSlotObj.setPosition(this._getSlotXPosition(i % column),
                    this._getSlotYPosition(Math.floor(i / column) - 1));
                clippingSlotLayout.addChild(rollingSlotObj, 1);
                rollingSlotObj.visible = false;
                this.rollingSlotObjects.push(rollingSlotObj);
            }
        },

        onEnter: function () {
            this._super();
            this.scheduleUpdate();
        },

        onExit: function () {
            this._super();
            this.unscheduleUpdate();
        },

        update: function (dt) {
            var dy = dt * this.rollingSpeed;
            for (var i = 0; i < (this.row + 2) * (this.column); i++) {
                var posY = this.rollingSlotObjects[i].getPositionY() - dy;
                if (posY < -(this.slotObjectSize.height * 1.5))
                    posY += ((this.slotObjectSize.height + this.verticalMargin) * (this.row + 2));
                this.rollingSlotObjects[i].setPositionY(posY);
            }
        },

        _getSlotXPosition: function (xIndex) {
            var posX = xIndex * this.slotObjectSize.width;
            posX += ((xIndex + 1) * this.horizontalMargin + this.slotObjectSize.width / 2); // margin
            return posX;
        },

        _getSlotYPosition: function (yIndex) {
            var posY = yIndex * this.slotObjectSize.height;
            posY += ((yIndex + 1) * this.verticalMargin + this.slotObjectSize.height / 2); // margin
            posY = this.getContentSize().height - posY; // reverse
            return posY;
        },

        /**
         * Set rolling state for column(s)
         * @param {Boolean} isRolling
         * @param {Number} [columnIndex] Skip this param to set for all columns
         */
        setRolling: function (isRolling, columnIndex) {
            // cc.log("isRolling: " + isRolling);
            // cc.log("columnIndex: " + columnIndex);
            for (var i = 0; i < (this.row + 2) * this.column; i++) {
                if (columnIndex !== undefined && i % this.column !== columnIndex) {
                    continue;
                }
                this.rollingSlotObjects[i].visible = isRolling;
                if (this.slotObjects[i]) {
                    this.slotObjects[i].visible = !isRolling;
                    if (!isRolling)
                        this.slotObjects[i].runAction(new cc.Sequence(
                            new cc.MoveBy(0.1, cc.p(0, -20)),
                            new cc.MoveBy(0.1, cc.p(0, 20))
                        ));
                }
            }
        },

        /**
         * Set the result to slot frame
         * @param result A 2D-array contains the rolling result
         */
        setResult: function (result) {
            // cc.log(JSON.stringify(result));
            if (result instanceof Array === false) {
                return;
            }
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                if (row instanceof Array === false) {
                    continue;
                }
                for (var j = 0; j < row.length; j++) {
                    if (isNaN(row[j]))
                        continue;
                    this.getSlotObject(i, j).value = row[j];
                }
            }
        },

        /**
         * Perform show reward animation, call callback function when done
         * @param callback
         */
        showReward: function (callback) {
            if (typeof callback === "function")
                callback();
        },

        /**
         *
         * @param {Number} row
         * @param {Number} column
         * @returns {SlotObject}
         */
        getSlotObject: function (row, column) {
            if (isNaN(row) || isNaN(column))
                return null;
            if (row < 0 || row >= this.row || column < 0 || column >= this.column)
                return null;
            return this.slotObjects[row * this.column + column];
        },

        setBetType: function (betId) {
            this._betType = betId;
            for (var i = 0; i < this.slotObjects.length; i++) {
                var obj = this.slotObjects[i];
                obj.setType(betId + 1);
            }
        },

        setSymbolVisible: function (isVisible) {
            this.containerLayout.visible = isVisible;
        },

        getSymbolVisible: function () {
            return this.containerLayout.visible;
        }
    });
})();
