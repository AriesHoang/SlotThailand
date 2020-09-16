
var SlotZodiac = SlotZodiac || {};
(function () {
    var BaseController = SlotZodiac.BaseController;

    SlotZodiac.BaseScene = cc.Scene.extend({
        ctor: function () {
            this._super();
            this.setTag(3);
            var dialogLayer = new cc.LayerColor(cc.color(0, 0, 0, 255));
            dialogLayer.visible = false;
            // dialogLayer.setOpacity(200);
            this.addChild(dialogLayer, 3);
            this.dialogLayer = dialogLayer;
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    return dialogLayer.visible;
                },
                onTouchMoved: function (touch, event) {

                },
                onTouchEnded: function (touch, event) {

                }
            }, dialogLayer);

            this.initController();
        },

        initController: function () {
            this._controller = new BaseController(this);
        },

        showDialog: function (dialog) {
            if (dialog && this.dialogLayer.children.indexOf(dialog) === -1) {
                this.dialogLayer.removeAllChildren(true);
                dialog.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
                this.dialogLayer.addChild(dialog);
                this.dialogLayer.currentDialog = dialog;
                this.dialogLayer.visible = true;
                return true;
            }
            return false;
        },

        showError: function (code, msg) {
            var d = new SlotZodiac.LoadingLayer("NOTIFICATION", msg);
            var scene = cc.director.getRunningScene();
            scene.loadingLayer = d;
            d.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.addChild(d, 999);
        },

        showDialogWithAnimation: function (dialog) {
            if (this.showDialog.apply(this, arguments)) {
                var scale = dialog.getScale();
                dialog.stopAllActions();
                dialog.setScale(0.0);
                var scaleAction = new cc.EaseElasticOut(new cc.ScaleTo(0.7, scale));
                dialog.runAction(scaleAction);
            }
        },

        hideAllDialog: function () {
            if (this.dialogLayer.currentDialog) {
                this.dialogLayer.currentDialog.hide();
                this.dialogLayer.currentDialog = null;
            }
        },

        onExit: function () {
            this._super();
            if (this._controller) {
                this._controller.releaseController();
            }

            GlobalEvent.getInstance().removeListener(this);
        }
    });
})();
