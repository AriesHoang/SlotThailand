var SlotHero = SlotHero || {};

SlotHero.resetGlobal = function () {
    cc.GlobalSlotHero = {};
    cc.GlobalSlotHero.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    cc.SlotHeroRes = cc.SlotHeroRes || {};
    cc.SlotHeroRes.font = cc.SlotHeroRes.font || {};
    cc.SlotHeroRes.font.Bonus_Multiplier = "res/SlotHero/font/bonus_multiplier.fnt";
    cc.SlotHeroRes.font.Bonus_Reward = "res/SlotHero/font/bonus_reward.fnt";
    cc.SlotHeroRes.font.Bonus_Result = "res/SlotHero/font/bonus_result.fnt";

    cc.SlotHeroRes.font.CreditFont = "res/SlotHero/font/creditfont.fnt";
    cc.SlotHeroRes.font.FreeSpinFont = "res/SlotHero/font/freespinfont.fnt";
    cc.SlotHeroRes.font.HappyHourFont = "res/SlotHero/font/happyhourfont.fnt";
    cc.SlotHeroRes.font.JackpotFont = "res/SlotHero/font/jackpotnormalfont.fnt";
    cc.SlotHeroRes.font.ResultFont = "res/SlotHero/font/resultfont.fnt";
    cc.SlotHeroRes.font.RewardNormalFont = "res/SlotHero/font/reward_normal_font.fnt";
    cc.SlotHeroRes.font.RewardJackpotFont = "res/SlotHero/font/reward_jackpot_font.fnt";
    cc.SlotHeroRes.font.PopupFont = "res/SlotHero/font/popupfont.fnt";


    SlotHero.SFS = SlotHero.SFS || {};
    SlotHero.SFS.roomId = -1;
    SlotHero.Lines = null;

    /**
     * @return {string}
     */
    cc.GlobalSlotHero.FormatGold = function (value) {
        var signed = value < 0;
        var ret = Math.abs(value).toString();
        for (var i = ret.length - 3; i > 0; i -= 3) {
            ret = ret.substr(0, i) + "." + ret.substr(i);
        }
        signed && (ret = "-" + ret);
        return ret;
    };

    cc.GlobalSlotHero.implementCoorFinder = function (_target) {
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

    cc.GlobalSlotHero.scaleBackground = function (background) {
        if (cc.winSize.height / cc.winSize.width > background.height / background.width)
            background.setScale && background.setScale(
                cc.winSize.height * background.width
                / cc.winSize.width / background.height
            );
    };

    cc.GlobalSlotHero.PlayerGold = 0;

    cc.GlobalSlotHero.SlotState = cc.GlobalSlotHero.SlotState || {};
    cc.GlobalSlotHero.FreeSpinGame = {
        enabled: false,
        count: 0,
        reward: 0
    };
    cc.GlobalSlotHero.miniGameData = JSON.parse('[{"id":21,"name":"Tài Xỉu","gameUrl":"","iconUrl":"home_floatTaiXiu.png","isReady":false},{"id":3,"name":"Cao Thấp","gameUrl":"","iconUrl":"home_floatCaoThap.png","isReady":false},{"id":7,"name":"Tứ Linh","gameUrl":"","iconUrl":"home_floatTuLinh.png","isReady":false},{"id":4,"name":"MiniPoker","gameUrl":"","iconUrl":"home_floatMinipoker.png","isReady":true},{"id":5,"name":"Phục Sinh","gameUrl":"","iconUrl":"home_floatPhucSinh.png","isReady":false}]');
};

SlotHero.runActionNumber = function (label, targetValue, startValue, duration) {
    if (!label)
        return;

    duration = duration > 0 ? duration : 1;
    startValue = startValue || 0;

    label.setString(startValue);
    // label.runAction(new quyetnd.ActionNumber(duration, targetValue));
};
