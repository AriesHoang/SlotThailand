var HomeProfileController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);
        SmartfoxClient.getInstance().addExtensionListener("42", this._onGetDataProfile, this);
        SmartfoxClient.getInstance().addExtensionListener("43", this._onGetUserInfoProfile, this);
        SmartfoxClient.getInstance().addExtensionListener("2106", this._onGetUserGiftCode, this);
        SmartfoxClient.getInstance().addExtensionListener("2107", this._onChangePassResponse, this);
        SmartfoxClient.getInstance().addExtensionListener("2109", this._onGetUserDataResponse, this);
    },

    //===== GET USER PROFILE ======
    _onGetUserInfoProfile: function (cmd, data) {
        this._view.updateUserInfo(data);
    },
    _onGetDataProfile: function (cmd, data) {
        this._view.setDataProfile(data);
    },
    getDataProfile: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("42", {});
    },
    sendUpadateInfo: function (key, text) {
        var sendObj = {
            1: key,
            2: text
        };
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("43", sendObj);
    },

    sendGetUserProfile: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2109", {});
    },
    _onGetUserDataResponse: function (cmd, data) {
        data = data["p"];
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];
        res.userID = data["3"];
        res.Username = data["4"];
        res.avatarUrl = data["5"];
        res.userGold = data["6"];
        res.vipInfo = data["7"];
        res.vipPoint = data["8"];
        res.status = data["9"];
        res.userGoldFreeze = data["10"];
        res.userType = data["11"];
        res.openIdProvider = data["12"];
        res.userPhone = data["13"];
        // cc.log("_onGetUserDataResponse" + JSON.stringify(res));
        this._view.updateGetUserInfo(res);
    },

    //=== GIFT CODE ====
    _onGetUserGiftCode: function (cmd, data) {
        data = data["p"];
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];
        res.Coin = data["3"];
        res.Amount = data["4"];
        res.eventName = data["5"];
        // cc.log("_onGetUserGiftCode: " + JSON.stringify(res));
        this._view._getGiftCodeCallback(res);
    },

    sendGiftCode: function (code) {
        var content = {
            "1": code
        }
        // cc.log("sendGiftCode: " + JSON.stringify(content));
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2106", content);
    },

    //==== CHANGE PASS ====
    sendChangePass: function (oldPass, newPass) {
        var content = {
            "1": oldPass,
            "2": newPass
        };
        // cc.log("sendChangePass: " + JSON.stringify(content));
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2107", content);
    },
    _onChangePassResponse: function (cmd, data) {
        data = data["p"];
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];
        cc.log("_onChangePassResponse: " + JSON.stringify(res));
        this._view._onGetChangePassResponse(res);
    }
});
