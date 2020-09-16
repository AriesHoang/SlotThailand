var SlotAladdin = SlotAladdin || {};

SlotAladdin.resetGlobal = function () {
    cc.GlobalSlotAladdin = {};
    cc.GlobalSlotAladdin.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    cc.SlotAladdinRes = cc.SlotAladdinRes || {};
    cc.SlotAladdinRes.font = cc.SlotAladdinRes.font || {};
    cc.SlotAladdinRes.font.Bonus_Multiplier = "res/SlotAladdin/font/bonus_multiplier.fnt";
    cc.SlotAladdinRes.font.Bonus_Reward = "res/SlotAladdin/font/bonus_reward.fnt";
    cc.SlotAladdinRes.font.Bonus_Result = "res/SlotAladdin/font/bonus_result.fnt";

    cc.SlotAladdinRes.font.CreditFont = "res/SlotAladdin/font/creditfont.fnt";
    cc.SlotAladdinRes.font.FreeSpinFont = "res/SlotAladdin/font/freespinfont.fnt";
    cc.SlotAladdinRes.font.HappyHourFont = "res/SlotAladdin/font/happyhourfont.fnt";
    cc.SlotAladdinRes.font.JackpotFont = "res/SlotAladdin/font/jackpotnormalfont.fnt";
    cc.SlotAladdinRes.font.ResultFont = "res/SlotAladdin/font/resultfont.fnt";
    cc.SlotAladdinRes.font.RewardNormalFont = "res/SlotAladdin/font/reward_normal_font.fnt";
    cc.SlotAladdinRes.font.RewardJackpotFont = "res/SlotAladdin/font/reward_jackpot_font.fnt";
    cc.SlotAladdinRes.font.PopupFont = "res/SlotAladdin/font/popupfont.fnt";


    SlotAladdin.SFS = SlotAladdin.SFS || {};
    SlotAladdin.SFS.roomId = -1;
    SlotAladdin.Lines = null;

    /**
     * @return {string}
     */
    cc.GlobalSlotAladdin.FormatGold = function (value) {
        var signed = value < 0;
        var ret = Math.abs(value).toString();
        for (var i = ret.length - 3; i > 0; i -= 3) {
            ret = ret.substr(0, i) + "." + ret.substr(i);
        }
        signed && (ret = "-" + ret);
        return ret;
    };

    cc.GlobalSlotAladdin.implementCoorFinder = function (_target) {
        var holder = {
            w: 0,
            h: 0,
            startLoc: null,
        };
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (touch, event) {
                var loc = touch.getLocation();
                var target = event.getCurrentTarget();
                loc = target.convertToNodeSpace(loc);
                var x = Math.round(loc.x);
                var y = Math.round(loc.y);
                cc.log("Start location : " + x + "," + y);
                holder.startLoc = {x: x, y: y};
                return true;
            },

            onTouchEnded: function (touch, event) {
                var loc = touch.getLocation();
                var target = event.getCurrentTarget();
                loc = target.convertToNodeSpace(loc);
                var x = Math.round(loc.x);
                var y = Math.round(loc.y);
                // cc.log("End location : " + x + "," + y);
                // cc.log("Width : " + Math.abs(x - holder.startLoc.x) + ", height : " + Math.abs(y - holder.startLoc.y));
                cc.log("cc.rect(" + Math.abs(holder.startLoc.x) + "," + y + "," + Math.abs(x - holder.startLoc.x) + "," + Math.abs(y - holder.startLoc.y) + ")");
                cc.log("cc.p(" + Math.floor(loc.x) + "," + Math.floor(loc.y) + ")");
                return true;
            }
        }, _target);
    };

    cc.GlobalSlotAladdin.scaleBackground = function (background) {
        if (cc.winSize.height / cc.winSize.width > background.height / background.width)
            background.setScale && background.setScale(
                cc.winSize.height * background.width
                / cc.winSize.width / background.height
            );
    };

    cc.GlobalSlotAladdin.PlayerGold = 0;

    cc.GlobalSlotAladdin.SlotState = cc.GlobalSlotAladdin.SlotState || {};
    cc.GlobalSlotAladdin.FreeSpinGame = {
        enabled: false,
        count: 0,
        reward: 0
    };
    cc.GlobalSlotAladdin.miniGameData = JSON.parse('[{"id":21,"name":"Tài Xỉu","gameUrl":"","iconUrl":"home_floatTaiXiu.png","isReady":false},{"id":3,"name":"Cao Thấp","gameUrl":"","iconUrl":"home_floatCaoThap.png","isReady":false},{"id":7,"name":"Tứ Linh","gameUrl":"","iconUrl":"home_floatTuLinh.png","isReady":false},{"id":4,"name":"MiniPoker","gameUrl":"","iconUrl":"home_floatMinipoker.png","isReady":true},{"id":5,"name":"Phục Sinh","gameUrl":"","iconUrl":"home_floatPhucSinh.png","isReady":false}]');
};

SlotAladdin.runActionNumber = function (label, targetValue, startValue, duration) {
    if (!label)
        return;

    duration = duration > 0 ? duration : 1;
    startValue = startValue || 0;

    label.setString(startValue);
    // label.runAction(new quyetnd.ActionNumber(duration, targetValue));
};
