var SlotThreeKingdom = SlotThreeKingdom || {};

SlotThreeKingdom.resetGlobal = function () {
    cc.GlobalSlotThreeKingdom = {};
    cc.GlobalSlotThreeKingdom.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    cc.SlotThreeKingdomRes = cc.SlotThreeKingdomRes || {};
    cc.SlotThreeKingdomRes.font = cc.SlotThreeKingdomRes.font || {};
    cc.SlotThreeKingdomRes.font.Bonus_Multiplier = "res/SlotThreeKingdom/font/bonus_multiplier.fnt";
    cc.SlotThreeKingdomRes.font.Bonus_Reward = "res/SlotThreeKingdom/font/bonus_multiplier.fnt";
    cc.SlotThreeKingdomRes.font.Bonus_Result = "res/SlotThreeKingdom/font/bonus_result.fnt";

    cc.SlotThreeKingdomRes.font.CreditFont = "res/SlotThreeKingdom/font/creditfont.fnt";
    cc.SlotThreeKingdomRes.font.FreeSpinFont = "res/SlotThreeKingdom/font/freespinfont.fnt";
    cc.SlotThreeKingdomRes.font.HappyHourFont = "res/SlotThreeKingdom/font/happyhourfont.fnt";
    cc.SlotThreeKingdomRes.font.JackpotFont = "res/SlotThreeKingdom/font/jackpotnormalfont.fnt";
    cc.SlotThreeKingdomRes.font.ResultFont = "res/SlotThreeKingdom/font/resultfont.fnt";
    cc.SlotThreeKingdomRes.font.RewardNormalFont = "res/SlotThreeKingdom/font/reward_normal_font.fnt";
    cc.SlotThreeKingdomRes.font.RewardJackpotFont = "res/SlotThreeKingdom/font/reward_jackpot_font.fnt";
    cc.SlotThreeKingdomRes.font.PopupFont = "res/SlotThreeKingdom/font/popupfont.fnt";


    SlotThreeKingdom.SFS = SlotThreeKingdom.SFS || {};
    SlotThreeKingdom.SFS.roomId = -1;
    SlotThreeKingdom.Lines = null;

    /**
     * @return {string}
     */
    cc.GlobalSlotThreeKingdom.FormatGold = function (value) {
        var signed = value < 0;
        var ret = Math.abs(value).toString();
        for (var i = ret.length - 3; i > 0; i -= 3) {
            ret = ret.substr(0, i) + "." + ret.substr(i);
        }
        signed && (ret = "-" + ret);
        return ret;
    };

    cc.GlobalSlotThreeKingdom.implementCoorFinder = function (_target) {
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

    cc.GlobalSlotThreeKingdom.scaleBackground = function (background) {
        if (cc.winSize.height / cc.winSize.width > background.height / background.width)
            background.setScale && background.setScale(
                cc.winSize.height * background.width
                / cc.winSize.width / background.height
            );
    };

    cc.GlobalSlotThreeKingdom.PlayerGold = 0;

    cc.GlobalSlotThreeKingdom.SlotState = cc.GlobalSlotThreeKingdom.SlotState || {};
    cc.GlobalSlotThreeKingdom.FreeSpinGame = {
        enabled: false,
        count: 0,
        reward: 0
    };
    cc.GlobalSlotThreeKingdom.miniGameData = JSON.parse('[{"id":21,"name":"Tài Xỉu","gameUrl":"","iconUrl":"home_floatTaiXiu.png","isReady":false},{"id":3,"name":"Cao Thấp","gameUrl":"","iconUrl":"home_floatCaoThap.png","isReady":false},{"id":7,"name":"Tứ Linh","gameUrl":"","iconUrl":"home_floatTuLinh.png","isReady":false},{"id":4,"name":"MiniPoker","gameUrl":"","iconUrl":"home_floatMinipoker.png","isReady":true},{"id":5,"name":"Phục Sinh","gameUrl":"","iconUrl":"home_floatPhucSinh.png","isReady":false}]');
};

SlotThreeKingdom.runActionNumber = function (label, targetValue, startValue, duration) {
    if (!label)
        return;

    duration = duration > 0 ? duration : 1;
    startValue = startValue || 0;

    label.setString(startValue);
    // label.runAction(new quyetnd.ActionNumber(duration, targetValue));
};
