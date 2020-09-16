var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    SlotThreeKingdom.GoldenTime = cc.Sprite.extend({
        ctor: function () {
            this._super("#slotwomenagent_golden_time.png");
            var xLabel = new cc.LabelBMFont("", cc.SlotThreeKingdomRes.font.FreeSpinFont);
            xLabel.setPosition(this.width / 2, 120);
            // xLabel.setScale(0.8);
            this.addChild(xLabel);
            this.xLabel = xLabel;

            var timeLabel = new cc.LabelBMFont("", cc.SlotThreeKingdomRes.font.HappyHourFont);
            timeLabel.setPosition(this.width / 2, 55);
            // timeLabel.setScale(0.55);
            this.addChild(timeLabel);
            this.timeLabel = timeLabel;

            // var dateLabel = new cc.LabelBMFont("111d", cc.SlotThreeKingdomRes.font.Bay_Buom_Stroke_White);
            // dateLabel.setPosition(this.width / 2, 15);
            // // dateLabel.setScale(0.4);
            // this.addChild(dateLabel);
            // this.dateLabel = dateLabel;
        },

        setXLabel: function (str) {
            this.xLabel.setString(str);
        },

        setTimeLabel: function (str) {
            this.timeLabel.setString(str);
        },

        // setDateLabel: function (str) {
        //     this.dateLabel.setString(str);
        // }
    });
})();
