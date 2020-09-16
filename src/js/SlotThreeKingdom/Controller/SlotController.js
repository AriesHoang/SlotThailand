var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    var BaseController = SlotThreeKingdom.BaseController;
    var SlotClient = SlotThreeKingdom.SlotClient;

    var SlotBonus = SlotBonus || {};
    SlotBonus.JACKPOT = 1;
    SlotBonus.COIN = 2;
    SlotBonus.FREE_SPIN = 3;
    SlotBonus.BONUS = 4;

    var SlotError = SlotError || {};
    SlotError["1"] = "Không đủ tiền để chơi.";

    var SlotController = BaseController.extend({
        ctor: function () {
            this._super.apply(this, arguments);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("4", this._onSlotResult, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("41", this._onCreditChange, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("14", this._onJackpotUpdate, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("13", this._onUpdateBetAmount, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("39", this._onJackpotSandboxUpdate, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("2", this._onLineConfig, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("24", this._onJoinSandbox, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("35", this._onSessionInfo, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("38", this._onUpdateFreeSpin, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("61", this._onUpdatePortalFreeSpin, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("36", this._onResumeState, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("37", this._onUpdateGoldenTime, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("48", this._onUpdatePotentialDoubleAmount, this);
            // SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("7", this._onUpdateBetLevel, this);
            SlotThreeKingdom.SlotClient.getInstance().addExtensionListener("___err___", this._onError, this);
            this.sendJoinSlotRequest();
        },

        _onSlotResult: function (cmd, data) {
            cc.log(JSON.stringify(data));
            data = data["p"];
            var result = {};
            result["1"] = data["1"];
            var allReward = [];
            var result2 = data["2"];
            var freeSpin = 0;
            var bonus = false;
            var jackpot = false;
            var totalCoin = 0;

            // reward lines
            for (var i = 0; i < result2.length; i++) {
                var rwObj = result2[i];
                var resObj = {};
                for (var j = 0; j < rwObj["2"].length; j++) {
                    var symObj = rwObj["2"][j];
                    resObj["1"] = rwObj["1"];
                    resObj["2"] = symObj["0"];
                    resObj["amount"] = symObj["5"]["2"];
                    resObj["type"] = symObj["5"]["3"];

                    jackpot = jackpot | (resObj["type"] === SlotBonus.JACKPOT);
                    switch (resObj["type"]) {
                        case SlotBonus.JACKPOT:
                            jackpot = true;
                            break;
                        case SlotBonus.BONUS:
                            bonus = true;
                            break;
                        case SlotBonus.FREE_SPIN:
                            freeSpin < resObj["amount"] && (freeSpin = resObj["amount"]);
                            break;
                        case SlotBonus.COIN:
                            totalCoin += resObj["amount"];
                            break;
                    }
                }
                // resObj["rewardObj"] = rwObj["3"];
                allReward.push(resObj);
            }
            result["2"] = allReward;
            result["jackpot"] = jackpot;
            result["free_spin"] = data["4"];
            result["bonus"] = data["3"];
            result["total_coin"] = totalCoin;
            result["free_spin_count"] = data["5"];
            result["wt"] = data["wt"];
            result["jc"] = data["jc"];
            // result["x2"] = data["x2"];
            cc.log(JSON.stringify(result));
            this._view.updateSlotResult(result);
        },

        _onCreditChange: function (cmd, data) {
            this._view.setCredit(data["p"]);
        },

        _onSessionInfo: function (cmd, data) {
            var session = data["p"]["1"];
            this._view.setSession(session);
        },

        _onError: function (cmd, data) {
            data = data["p"];
            if (!SlotError[data["code"]])
                return;
            this._view.showError(data["code"], SlotError[data["code"]]);
            this._view.stopRolling();
        },

        _onJackpotUpdate: function (cmd, data) {
            data = data["p"];
            var jackpotObjs = data["2"];
            var result = [];
            for (var i = 0; i < jackpotObjs.length; i++) {
                var item = jackpotObjs[i];
                result.push({
                    betId: item["1"],
                    jackpotValue: item["2"]
                });
            }

            this._view.updateJackpot(result);
        },

        _onJackpotSandboxUpdate: function (cmd, data) {
            var jackpotValue = data["p"]["2"];
            this._view.updateSandboxJackpot(jackpotValue);
        },

        _onUpdateBetAmount: function (cmd, data) {
            var betLevels = data["p"]["1"];
            var allBetLevel = [];
            for (var i = 0; i < betLevels.length; i++) {
                var entry = betLevels[i];
                allBetLevel[entry["1"]] = entry["2"]["2"];
            }
            this._view.updateBetAmount(allBetLevel);
        },

        _onLineConfig: function () {
            this._view.configLine(SlotThreeKingdom.Lines);
        },

        _onJoinSandbox: function (cmd, data) {
            var coin = data["p"]["1"];
            coin && this._view.switchToSandbox(coin);
        },

        _onBalanceInfo: function (cmd, data) {
            var coin = data = data["p"]["1"];
            cc.log(coin + "lmaokai");
            coin && this._view.quitSandbox(coin);
        },

        // _onUpdateBetLevel: function (cmd, data) {
        //     data = data["p"];
        //     if (!data)
        //         return;
        //
        //     var freeSpinCount = data["2"];
        //     var betId = data["3"];
        //     var lines = data["4"];
        //
        //     this._view.setFreeSpinCount(freeSpinCount);
        //     this._view.setBetLevel(betId);
        //     this._view.setSelectedLines(lines);
        // },

        _onUpdateFreeSpin: function (cmd, data) {
            var freeSpinCount = data["p"]["1"];
            (!isNaN(freeSpinCount)) && this._view.setPendingFreeSpinCount(freeSpinCount);
        },

        _onUpdatePortalFreeSpin: function (cmd, data) {
            var freeSpinCount = data["p"]["1"];
            cc.log(JSON.stringify(freeSpinCount));
            (!isNaN(freeSpinCount)) && this._view.setPendingPortalFreeSpinCount(freeSpinCount);
        },

        _onUpdateGoldenTime: function (cmd, data) {
            data = data["p"];
            var enabled = data["2"];
            var remainingTime = Math.floor(data["3"] / 1000);
            var multiplier = data["4"];

            this._view.updateGoldenTime({
                enabled: enabled,
                remainingTime: remainingTime,
                multiplier: multiplier
            });
        },

        _onUpdatePotentialDoubleAmount: function (cmd, data) {
            this._view.setPotentialDoubleAmount(data["p"]["3"], data["p"]["1"]);
        },

        _onResumeState: function (cmd, data) {
            data = data["p"];

            // bonus
            var bonus = !!data["1"]; // force boolean

            var fn = null;

            //portal free spin
            if (data["3"]) {
                var portalFreeSpinCount = data["3"]["2"];
                var portalBetId = data["3"]["3"];
                var portalLines = data["3"]["4"];

                fn = bonus ? this._view.setPendingPortalFreeSpinCount : this._view.setPortalFreeSpinCount;
                fn.call(this._view, portalFreeSpinCount);
                this._view.setSelectedLines(portalLines);
            } else {
                fn = bonus ? this._view.setPendingPortalFreeSpinCount : this._view.setPortalFreeSpinCount;
                fn.call(this._view, 0);
            }

            //free spin
            if (data["2"]) {
                var freeSpinCount = data["2"]["2"];
                var betId = data["2"]["3"];
                var lines = data["2"]["4"];

                fn = bonus ? this._view.setPendingFreeSpinCount : this._view.setFreeSpinCount;
                fn.call(this._view, freeSpinCount);
                this._view.setSelectedLines(lines);
            } else {
                fn = bonus ? this._view.setPendingFreeSpinCount : this._view.setFreeSpinCount;
                fn.call(this._view, 0);
            }

            if (bonus)
                this._view.showBonusGame();
        },

        sendRollRequest: function (betLevel, lines, cheatCode, skipX2) {
            var sendObj = {1: betLevel, 2: lines};
            if (cheatCode && cheatCode.length)
                sendObj["3"] = cheatCode;
            sendObj["0"] = skipX2;
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom("6", sendObj);
        },

        sendCheatBonusRequest: function (betLevel, lines) {
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom("16", {1: betLevel, 2: lines});
        },

        sendJoinSlotRequest: function () {
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom("8", null);
        },

        sendCheatFSRequest: function (betLevel, lines) {
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom("20", {1: betLevel, 2: lines});
        },

        sendSandboxRequest: function (betLevel) {
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom("23", {1: betLevel});
        },

        sendSandBoxRollRequest: function (betLevel, lines, cheatCode, skipX2) {
            var sendObj = {1: betLevel, 2: lines};
            if (cheatCode && cheatCode.length)
                sendObj["3"] = cheatCode;
            sendObj["0"] = skipX2;
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom("25", sendObj);
        },

        sendGetBalanceRequest: function () {
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom("41", null);
        },

        sendSetBetLevelRequest: function (betId) {
            SlotThreeKingdom.SlotClient.getInstance().sendExtensionRequestCurrentRoom("36", {1: betId});
        }
    });

    SlotThreeKingdom.SlotBonus = SlotBonus;
    SlotThreeKingdom.SlotError = SlotError;
    SlotThreeKingdom.SlotController = SlotController;
})();
