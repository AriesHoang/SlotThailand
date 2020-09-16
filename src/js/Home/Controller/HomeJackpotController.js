var HomeJackpotController = HomeBaseController.extend({
    ctor: function () {
        this._super.apply(this, arguments);
        SmartfoxClient.getInstance().addExtensionListener("103", this._onGetGamesData, this);
        SmartfoxClient.getInstance().addExtensionListener("100", this._onGetJackpotData, this);
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
        // this._view.initJackpotGameList(res);
    },

    _onGetJackpotData: function (cmd, data) {
        var id = data["p"]["1"];
        // cc.log("_onGetJackpotData: " + JSON.stringify(data["p"]));

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
        // cc.log(JSON.stringify(res));
        this._view.setDataJackpotTopHu(id, res);
    },
});
