var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    var PagedDialog = SlotThreeKingdom.PagedDialog;
    SlotThreeKingdom.RewardDialog = PagedDialog.extend({
        ctor: function () {
            this._super();
            this.setTitle("");

            this.addPage(new cc.Sprite("res/SlotThreeKingdom/paytable/paytable_1.png"));
            this.addPage(new cc.Sprite("res/SlotThreeKingdom/paytable/paytable_2.png"));
            this.addPage(new cc.Sprite("res/SlotThreeKingdom/paytable/paytable_3.png"));
            this.addPage(new cc.Sprite("res/SlotThreeKingdom/paytable/paytable_4.png"));
            this.addPage(new cc.Sprite("res/SlotThreeKingdom/paytable/paytable_5.png"));
        },
        createPage0: function () {

        },
        createPage1: function () {

        },
        createPage2: function () {

        },
        createPage3: function () {

        },
        createPage4: function () {

        },
        createPage:function () {

        }
    });
})();
