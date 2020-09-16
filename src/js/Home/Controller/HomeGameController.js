var HomeGameController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);

        SmartfoxClient.getInstance().addExtensionListener("103", this._onGetGamesData, this);
        SmartfoxClient.getInstance().addExtensionListener("100", this._onGetJackpotData, this);
        SmartfoxClient.getInstance().addExtensionListener("232", this._onGetOnOffBigJackpot, this);
        SmartfoxClient.getInstance().addExtensionListener("233", this._onGetDataBigJackpot, this);
    },
    _onGetDataBigJackpot: function (cmd, data) {
        var arr = data["p"]["2"];
        //  this._view.setBigDataJackpot(arr);
    },
    _onGetOnOffBigJackpot: function (cmd, data) {
        var isShow = data["p"]["1"];
        //this._view.setOnOffBigJackpot(isShow);
    },
    _onGetGamesData: function (cmd, data) {

        var gameData = data["p"]["1"];
        var res = [];
        for (var i = 0; i < gameData.length; i++) {
            var entry = {
                id: gameData[i]["0"],
                name: gameData[i]["1"],
                gameUrl: gameData[i]["2"],
                iconUrl: gameData[i]["3"],
                type: gameData[i]["5"],
                iconSize: gameData[i]["6"]
            };
            res.push(entry);
        }
        cc.log("_onGetGamesData: "+JSON.stringify(data));
        // this._view.initJackpotGameList(res);
        // cc.Global.gameData = res;
    },
    _onGetJackpotData: function (cmd, data) {
        var id = data["p"]["1"];

        var bankInfor = data["p"]["2"];
        var res = [];
        for (var i = 0; i < bankInfor.length; i++) {
            var entry = {
                name: bankInfor[i]["1"],
                money: bankInfor[i]["2"],
            };
            res.push(entry);
        }
        res.sort(function (lhs, rhs) {
            return lhs.name - rhs.name;
        });
        res.reverse();
        // cc.log("_onGetJackpotData: " + JSON.stringify(data));
        this._view.setDataJackpot(id, res);
    },
});
