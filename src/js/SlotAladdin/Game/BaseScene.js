var SlotAladdin = SlotAladdin || {};

(function () {
    var ErrorDialog = SlotAladdin.ErrorDialog;
    SlotAladdin.BaseScene = cc.Scene.extend({
        ctor: function () {
            this._super();
            this.setTag(2);
            var dialogLayer = new cc.LayerColor(cc.color(0, 0, 0, 0));
            dialogLayer.visible = false;
            this.addChild(dialogLayer, 3);
            this.dialogLayer = dialogLayer;

            this.initController();
        },

        initController: function () {
            this._controller = new BaseController(this);
        },

        showDialog: function (dialog) {
            if (dialog && this.dialogLayer.children.indexOf(dialog) === -1) {
                this.dialogLayer.removeAllChildren(true);
                dialog.setPosition(cc.winSize.width / 2 + 5, cc.winSize.height / 2 - 45);
                this.dialogLayer.addChild(dialog);
                this.dialogLayer.currentDialog = dialog;
                this.dialogLayer.visible = true;
                return true;
            }
            return false;
        },

        showError: function (code, msg) {
            var d = new ErrorDialog(msg);
            this.showDialog(d);
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
        }
    });
})();
