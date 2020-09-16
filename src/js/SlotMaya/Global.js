var SlotMaya = SlotMaya || {};
SlotMaya.resetGlobal = function () {
    cc.GlobalSlotMaya = {};
    cc.GlobalSlotMaya.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    cc.SlotMayaRes = cc.SlotMayaRes || {};
    cc.SlotMayaRes.font = cc.SlotMayaRes.font || {};

    cc.SlotMayaRes.font.Arial_Bold_Blue_Bonus = "res/SlotMaya/font/arial_blue_stoke_number.fnt";
    cc.SlotMayaRes.font.Arial_Bold_Purple_Bonus = "res/SlotMaya/font/arial_purple_stoke_number.fnt";
    //
    cc.SlotMayaRes.font.Gentona_Number = "res/SlotMaya/font/win_font.fnt";
    cc.SlotMayaRes.font.Session_Font = "res/SlotMaya/font/session_font.fnt";
    cc.SlotMayaRes.font.Gentona_White_30 = "res/SlotMaya/font/gentona_white_30.fnt";

    cc.SlotMayaRes.font.UVN_ThangVu = "res/SlotMaya/font/uvn_thangvu_30.fnt";
    //
    cc.SlotMayaRes.font.Jackpot_Font = "res/SlotMaya/font/jackpot_font.fnt";
    cc.SlotMayaRes.font.Bonus_Font = "res/SlotMaya/font/bonus.fnt";
    cc.SlotMayaRes.font.Total_Reward_Font = "res/SlotMaya/font/total_reward_font.fnt";
    //
    cc.SlotMayaRes.font.Roboto_bold_number_freespin = "res/SlotMaya/font/roboto_bold_freespin_number_100.fnt";
    cc.SlotMayaRes.font.Roboto_medium_white_30 = "res/SlotMaya/font/roboto_medium_white_30.fnt";
    cc.SlotMayaRes.font.Roboto_medium_blue_stoke = "res/SlotMaya/font/roboto_medium_stoke_30.fnt";
    cc.SlotMayaRes.font.Roboto_Medium_White = "res/SlotMaya/font/roboto_medium_white_30.fnt";
    cc.SlotMayaRes.font.Roboto_Bold_FreeSpin_Result_30 = "res/SlotMaya/font/roboto_bold_freespin_result_30.fnt";
    cc.SlotMayaRes.font.Roboto_Bold_Stoke_Bonus_30 = "res/SlotMaya/font/roboto_bold_stroke_bonus.fnt";
    cc.SlotMayaRes.font.Roboto_Bold_Bonus_30 = "res/SlotMaya/font/roboto_bold_bonus.fnt";


    cc.SlotMayaRes.font.UVN_DungDan_Freespin_35 = "res/SlotMaya/font/uvn_dungdan_freespin_35.fnt";
    cc.SlotMayaRes.font.UVN_DungDan_Gardient_35 = "res/SlotMaya/font/uvn_dungdan_35.fnt";
    cc.SlotMayaRes.font.UVN_DUNGDAN_GOLDENTIME = "res/SlotMaya/font/UVN_DUNGDAN_GOLDENTIME.fnt";

    cc.SlotMayaRes.font.SVN_GENICA_GOLDENTIME = "res/SlotMaya/font/SVN_GENICA_GOLDENTIME.fnt";


    SlotMaya.SFS = {};
    SlotMaya.SFS.roomId = -1;
    SlotMaya.Lines = null;

    /**
     * @return {string}
     */
    cc.GlobalSlotMaya.FormatGold = function (value) {
        var signed = value < 0;
        var ret = Math.abs(value).toString();
        for (var i = ret.length - 3; i > 0; i -= 3) {
            ret = ret.substr(0, i) + "." + ret.substr(i);
        }
        signed && (ret = "-" + ret);
        return ret;
    };

    cc.GlobalSlotMaya.implementCoorFinder = function (_target) {
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
                // cc.log("cc.rect(" + Math.abs(holder.startLoc.x) + "," + y + "," + Math.abs(x - holder.startLoc.x) + "," + Math.abs(y - holder.startLoc.y) + ")");
                // cc.log("cc.p(" + Math.floor(loc.x) + "," + Math.floor(loc.y) + ")");
                return true;
            }
        }, _target);
    };

    cc.GlobalSlotMaya.scaleBackground = function (background) {
        if (cc.winSize.height / cc.winSize.width > background.height / background.width)
            background.setScale && background.setScale(
                cc.winSize.height * background.width
                / cc.winSize.width / background.height
            );
    };

    cc.GlobalSlotMaya.PlayerGold = 0;

    cc.GlobalSlotMaya.SlotState = cc.GlobalSlotMaya.SlotState || {};
    cc.GlobalSlotMaya.FreeSpinGame = {
        enabled: false,
        count: 0,
        reward: 0
    };
    cc.GlobalSlotMaya.miniGameData = JSON.parse('[{"id":21,"name":"Tài Xỉu","gameUrl":"","iconUrl":"home_floatTaiXiu.png","isReady":false},{"id":3,"name":"Cao Thấp","gameUrl":"","iconUrl":"home_floatCaoThap.png","isReady":false},{"id":7,"name":"Tứ Linh","gameUrl":"","iconUrl":"home_floatTuLinh.png","isReady":false},{"id":4,"name":"MiniPoker","gameUrl":"","iconUrl":"home_floatMinipoker.png","isReady":true},{"id":31,"name":"Phục Sinh","gameUrl":"","iconUrl":"home_floatPhucSinh.png","isReady":false}]');
};

SlotMaya.runActionNumber = function (label, targetValue, duration) {
    if (!label)
        return;
    duration = duration > 0 ? duration : 1;
    // label.runAction(new quyetnd.ActionNumber(duration, targetValue));
};
