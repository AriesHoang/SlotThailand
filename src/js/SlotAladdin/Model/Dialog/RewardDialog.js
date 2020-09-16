var SlotAladdin = SlotAladdin || {};

(function () {
    var PagedDialog = SlotAladdin.PagedDialog;
    SlotAladdin.RewardDialog = PagedDialog.extend({
        ctor: function () {
            this._super();
            this.setTitle("");

            this.addPage(new cc.Sprite("res/SlotAladdin/paytable/paytable_1.png"));
            this.addPage(new cc.Sprite("res/SlotAladdin/paytable/paytable_2.png"));
            this.addPage(new cc.Sprite("res/SlotAladdin/paytable/paytable_3.png"));
            this.addPage(new cc.Sprite("res/SlotAladdin/paytable/paytable_4.png"));
            this.addPage(new cc.Sprite("res/SlotAladdin/paytable/paytable_5.png"));
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
