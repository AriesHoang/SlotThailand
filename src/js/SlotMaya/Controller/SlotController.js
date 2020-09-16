var SlotMaya = SlotMaya || {};

(function () {
    var BaseController = SlotMaya.BaseController;
    var SlotClient = SlotMaya.SlotClient;

    var SlotBonus = SlotBonus || {};
    SlotBonus.JACKPOT = 1;
    SlotBonus.COIN = 2;
    SlotBonus.FREE_SPIN = 3;
    SlotBonus.BONUS = 4;

    var SlotError = SlotError || {};
    SlotError["1"] = "Not enough coin";

    var SlotController = BaseController.extend({
        ctor: function () {
            this._super.apply(this, arguments);
            SlotClient.getInstance().addExtensionListener("4", this._onSlotResult, this);
            SlotClient.getInstance().addExtensionListener("41", this._onCreditChange, this);
            SlotClient.getInstance().addExtensionListener("14", this._onJackpotUpdate, this);
            SlotClient.getInstance().addExtensionListener("13", this._onUpdateBetAmount, this);
            SlotClient.getInstance().addExtensionListener("39", this._onJackpotSandboxUpdate, this);
            SlotClient.getInstance().addExtensionListener("2", this._onLineConfig, this);
            SlotClient.getInstance().addExtensionListener("24", this._onJoinSandbox, this);
            SlotClient.getInstance().addExtensionListener("35", this._onSessionInfo, this);
            SlotClient.getInstance().addExtensionListener("38", this._onUpdateFreeSpin, this);
            SlotClient.getInstance().addExtensionListener("37", this._onUpdateGoldenTime, this);
            SlotClient.getInstance().addExtensionListener("61", this._onUpdatePortalFreeSpin, this);
            // SlotClient.getInstance().addExtensionListener("7", this._onUpdateBetLevel, this);
            SlotClient.getInstance().addExtensionListener("36", this._onResumeState, this);
            SlotClient.getInstance().addExtensionListener("___err___", this._onError, this);
            this.sendJoinSlotRequest();
        },

        _onSlotResult: function (cmd, data) {
            cc.log(JSON.stringify(data));
            data = data["p"];
            var result = {};
            result["1"] = data["1"];
            var allReward = [];
            var result2 = data["2"];
            var jackpot = false;
            var freeSpin = 0;
            var bonus = false;
            var totalCoin = 0;
            for (var i = 0; i < result2.length; i++) {
                var rwObj = result2[i];
                for (var j = 0; j < rwObj["2"].length; j++) {
                    var symObj = rwObj["2"][j];
                    var resObj = {};
                    resObj["1"] = rwObj["1"];
                    resObj["2"] = symObj["0"];
                    resObj["amount"] = symObj["5"]["2"];
                    resObj["type"] = symObj["5"]["3"];

                    jackpot = jackpot | (resObj["type"] === SlotBonus.JACKPOT);
                    bonus = bonus | (resObj["type"] === SlotBonus.BONUS);
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

                    allReward.push(resObj);
                }
            }
            result["2"] = allReward;
            result["jackpot"] = jackpot;
            result["free_spin"] = freeSpin;
            result["bonus"] = bonus;
            result["total_coin"] = totalCoin;
            result["jc"] = data["jc"];
            result["wt"] = data["wt"];
            result["tb"] = data["tb"];
            this._view.updateSlotResult(result);
        },

        _onCreditChange: function (cmd, data) {
            var betting = data["p"]["2"];
            if (betting < 0)
                this._view.setCreditAfterRoll(data["p"]["1"]);
            else
                this._view.setCredit(data["p"]["1"]);
        },

        _onSessionInfo: function (cmd, data) {
            var session = data["p"]["1"];
            this._view.setSession(session);
        },

        _onError: function (cmd, data) {
            data = data["p"];
            if (!SlotError[data["code"]])
                return;
            this._view.showError(data["code"], SlotError[data["code"]] || data["msg"]);
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
            var roomNames = [];
            for (var i = 0; i < betLevels.length; i++) {
                var entry = betLevels[i];
                allBetLevel[entry["1"]] = entry["2"]["2"];
                roomNames.push(entry["2"]["1"]);
            }
            this._view.updateBetAmount(allBetLevel);
            // this._view.updateRoomNames(roomNames);
        },

        _onLineConfig: function () {
            this._view.configLine(SlotMaya.Lines);
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
        //     //var freeSpinCount = data["2"];
        //     //var betId = data["3"];
        //     var lines = data["4"];
        //
        //     //this._view.setFreeSpinCount(freeSpinCount);
        //     //this._view.setBetLevel(betId);
        //     this._view.setSelectedLines(lines);
        // },

        _onUpdateFreeSpin: function (cmd, data) {
            var freeSpinCount = data["p"]["1"];
            (!isNaN(freeSpinCount)) && this._view.setPendingFreeSpinCount(freeSpinCount);
        },

        _onUpdatePortalFreeSpin: function (cmd, data) {
            var freeSpinCount = data["p"]["1"];
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

        sendRollRequest: function (betLevel, lines, cheatCode) {
            var sendObj = {1: betLevel, 2: lines};
            if (cheatCode && cheatCode.length)
                sendObj["3"] = cheatCode;
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("6", sendObj);
        },

        sendCheatBonusRequest: function (betLevel, lines) {
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("16", {1: betLevel, 2: lines});
        },

        sendJoinSlotRequest: function () {
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("8", null);
        },

        sendCheatFSRequest: function (betLevel, lines) {
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("20", {1: betLevel, 2: lines});
        },

        sendSandboxRequest: function (betLevel) {
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("23", {1: betLevel});
        },

        sendSandBoxRollRequest: function (betLevel, lines, cheatCode) {
            var sendObj = {1: betLevel, 2: lines};
            if (cheatCode && cheatCode.length)
                sendObj["3"] = cheatCode;
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("25", sendObj);
        },

        sendGetBalanceRequest: function () {
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("41", null);
        },

        sendSetBetLevelRequest: function (betId) {
            SlotClient.getInstance().sendExtensionRequestCurrentRoom("36", {1: betId});
        }
    });

    SlotMaya.SlotBonus = SlotBonus;
    SlotMaya.SlotController = SlotController;
})();
