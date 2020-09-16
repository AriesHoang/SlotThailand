var HomeChargeController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);

        SmartfoxClient.getInstance().addExtensionListener("2100", this._onGetListIAP, this);
        SmartfoxClient.getInstance().addExtensionListener("2102", this._onGetCardTopUpRespone, this);
        SmartfoxClient.getInstance().addExtensionListener("2103", this._onGetDoTranferSuccess, this);
        SmartfoxClient.getInstance().addExtensionListener("2104", this._onGetBuyCardSuccess, this);
        SmartfoxClient.getInstance().addExtensionListener("2105", this._onGetListCard, this);
        SmartfoxClient.getInstance().addExtensionListener("2112", this._onGetListBuyCard, this);
    },
    _onGetListIAP: function (cmd, data) {
        data = data["p"];
        var res = {};
        res.listIAP = data["1"];
        // cc.log("_onGetListIAP: " + JSON.stringify(res.listIAP));
        this._view._initItemIAP(true, res.listIAP);
    },

    _onGetCardTopUpRespone: function (cmd, data) {
        data = data["p"];
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];
        res.coin = data["3"];
        // cc.log("_onGetCardTopUpRespone: " + JSON.stringify(res));
        if (res.errorCode !== 0)
            this._view._showError(res.errorCode);
        else
            this._view._updateUserMoneyWhenTopUpSuccess(res);
    },
    _onGetDoTranferSuccess: function (cmd, data) {
        data = data["p"];
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];
        res.coin = data["3"];
        // cc.log("_onGetDoTranferSuccess: " + JSON.stringify(data));
        if (res.errorCode !== 0)
            this._view._showErrorChuyenTien(res.errorCode);
        else
            this._view._onGetTransferResutlSuccess(res.coin);
    },
    _onGetBuyCardSuccess: function (cmd, data) {
        // cc.log("CMD: " + cmd);
        data = data["p"];
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];
        res.coin = data["3"];
        res.cardSerial = data["4"];
        res.provider = data["5"];
        res.cardCode = data["6"];
        res.expire = data["7"];
        res.amount = data["8"];
        res.useLevel1 = data[i]["9"];
        res.userLevel2 = data[i]["10"];
        res.userLevel3 = data[i]["11"];
        res.displayName = data[i]["12"];
        res.password = data[i]["13"];
        res.isEnable = data[i]["14"];
        res.isDelete = data[i]["15"];


        if (res.errorCode !== 0)
            this._view._showErrorDoiThuong(res.errorCode);
        else
            this._view._onBuyCardResponse(res);

    },
    _onGetListCard: function (cmd, data) {
        data = data["p"];
        // cc.log("_onGetListCard: " + JSON.stringify(data));
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];
        res.listcard = data["3"];

        if (res.errorCode === 0)
            this._view._onGetListCardView(res.listcard);
    },
    _onGetListBuyCard: function (cmd, data) {
        data = data["p"];
        var res = {};
        res.errorCode = data["1"];
        res.errorMessage = data["2"];
        res.listcard = data["3"];
        cc.log("_onGetListBuyCard: " + JSON.stringify(res));
        if (res.errorCode === 0)
            this._view._onGetListBuyCard(res.listcard);

    },

    //+++++++++++++ Send Controller +++++++++
    //====== Get List Card =======
    sendGetListCard: function () {
        var content = {
            "1": "camap"
        };
        // cc.log("sendGetItemRequest: " + JSON.stringify(content));
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2105", content);
    },

    sendTranfer: function (toUser, amount, otpcode) {
        var content = {
            "1": toUser,
            "3": amount,
            "4": otpcode
        };
        // cc.log("sendTranfer: " + JSON.stringify(content));
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2103", content);
    },

    sendCardTopUp: function (provider, serial, cardNumber, amount) {
        var content = {
            "1": provider,
            "2": serial,
            "3": cardNumber,
            "4": amount
        };
        // cc.log("sendCardTopUP: " + JSON.stringify(content));
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2102", content);
    },
    sendBuyCard: function (provider, amount) {
        var content = {
            "1": provider,
            "2": amount
        };
        // cc.log("sendBuyCard: " + JSON.stringify(content));
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2104", content);
    },
    sendGetListBuyCard: function () {
        var content = {};
        // cc.log("sendGetListBuyCard: " + JSON.stringify(content));
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2112", content);
    },
    sendGetListIAP: function () {
        // cc.log("sendGetListIAP");
        var content = {
            "1": "google",
            "2": "camap"
        };
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("2100", content);
    }
});
