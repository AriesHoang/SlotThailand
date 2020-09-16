var HomeSecurityController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);
        SmartfoxClient.getInstance().addExtensionListener("2110", this._onVerifyPhoneRespone, this);
    },

    _onVerifyPhoneRespone: function (cmd, data) {
        data = data["p"];
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];
        // cc.log("_onVerifyPhoneRespone: " + JSON.stringify(data));
        this._view.onVerifyPhoneRespone(res.errorCode);
    },
    sendVerifyPhone: function (params) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2110", params);
    }
});