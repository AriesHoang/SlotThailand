var SlotZodiac = SlotZodiac || {};

(function () {
    var Dialog = SlotZodiac.Dialog;
    var AllSlotObject = SlotZodiac.AllSlotObject;

    SlotZodiac.RewardDialog = Dialog.extend({
        ctor: function (type, width, height) {
            width = width || 1315;
            height = height || 703;
            type++;
            this._super.call(this, width, height);

            // this.initBackground();

            // this.createReward(cc.p(661, 450), 506, type, 1, "5  Jackpot", "4  x 30", "3  x 5");
            //
            // this.createReward(cc.p(364, 257), 375, type, 2, "5  x 8000", "4  Bonus X 5", "3  Bonus");
            // this.createReward(cc.p(949, 257), 375, type, 3, "5  15 FreeSpin", "4  5 FreeSpin", "3  1 FreeSpin");
            //
            // this.createReward(cc.p(171, 85), 280, type, 4, "5  x 500", "4  x 20", "3  x 4");
            // this.createReward(cc.p(497, 85), 280, type, 5, "5  x 200", "4  x 15", "3  x 3");
            // this.createReward(cc.p(824, 85), 280, type, 6, "5  x 75", "4  x 10", "3  x 2");
            // this.createReward(cc.p(1150, 85), 280, type, 7, "5  x 30", "4  x 6", "");

            this.setLogo();
            this.loadReward();

        },

        initBackground: function () {
            var bg_reward = new cc.Sprite("res/SlotZodiac/slotmaya_dialog_bg.png");
            bg_reward.setPosition(this.width / 2, this.height / 2 + 80);
            this.addChild(bg_reward);
        },

        setLogo: function () {
            var logotitle = new cc.Sprite("#slotmaya_reward_title.png");
            logotitle.setPosition(this.width / 2, this.height - 120);
            this.addChild(logotitle);
        },

        loadReward: function () {
            var reward = new cc.Sprite("res/SlotZodiac/slotmaya_reward_paytable.png");
            reward.setPosition(this.width / 2 - 20, this.height / 2 - 70);
            // bg_reward.setScale(1, 1.03);
            this.addChild(reward);
        },

        createReward: function (pos, width, objType, objVal, text1, text2, text3) {

            // var bg = new cc.Sprite("#slotkhaihoi_dialog-content-border.png");
            //
            // var bg_item = new cc.Sprite("#slotkhaihoi_dialog_border_bg.png");
            // bg_item.setScale(1);
            // bg_item.setPosition(82, 78);
            // bg.addChild(bg_item);
            //
            // var slotObj = new cc.Sprite("#slotkhaihoi_Sym" + AllSlotObject[objVal % 7] + ".png");
            // slotObj.setScale(0.65);
            // slotObj.setPosition(bg_item);
            // bg.addChild(slotObj);
            //
            // var label1 = new cc.LabelTTF(text1, "Arial", 30);
            // label1._setStrokeStyle(cc.color(255, 255, 255, 255));
            // // label1._setLineWidth(1);
            // label1.setAnchorPoint(cc.p(0, 0));
            // label1.setPosition(250, 100);
            // label1.setScale(Math.sqrt(bg.width / width));
            // label1.setColor(cc.color("#000000"));
            // bg.addChild(label1);
            //
            // var label2 = new cc.LabelTTF(text2, "Arial", 30);
            // label2._setStrokeStyle(cc.color(255, 255, 255, 255));
            // // label2._setLineWidth(1);
            // label2.setAnchorPoint(cc.p(0, 0));
            // width === 280 ? label2.setPosition(250, 59) : label2.setPosition(250, 61);
            // label2.setScale(Math.sqrt(bg.width / width));
            // label2.setColor(cc.color("#000000"));
            // bg.addChild(label2);
            //
            // var label3 = new cc.LabelTTF(text3, "Arial", 30);
            // label3._setStrokeStyle(cc.color(255, 255, 255, 255));
            // // label3._setLineWidth(1);
            // label3.setAnchorPoint(cc.p(0, 0));
            // label3.setColor(cc.color("#000000"));
            // width === 288 ? label3.setPosition(250, -2) : label3.setPosition(250, 20);
            // label3.setScale(Math.sqrt(bg.width / width));
            // bg.addChild(label3);
            //
            // bg.setScale(width / bg.width);
            // bg.setPosition(pos);
            // this.addChild(bg);
        }
    });
})();
