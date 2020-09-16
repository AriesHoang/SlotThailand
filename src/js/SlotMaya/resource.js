var SlotMaya = SlotMaya || {};

(function () {
    var res_initial = [
        "res/SlotMaya/main_background.png",
        "res/SlotMaya/loading_maya_bg.png",
        "res/SlotMaya/loading.png"
    ];

    var res = [
        "res/SlotMaya/slotmaya_dialog_bg.png",
        "res/SlotMaya/SlotObjects.png",
        "res/SlotMaya/SlotObjects.plist",
        "res/SlotMaya/coin.png",
        "res/SlotMaya/coin.plist",
        "res/SlotMaya/MainGames.png",
        "res/SlotMaya/MainGames.plist",
        "res/SlotMaya/BonusGame.png",
        "res/SlotMaya/BonusGame.plist",
        "res/SlotMaya/Dialog.png",
        "res/SlotMaya/Dialog.plist",
        "res/SlotMaya/main_background.png",
        "res/SlotMaya/slotmaya_bonus_bg.png",
        "res/SlotMaya/slotmaya_frame.png",
        "res/SlotMaya/font/arial_blue_stoke_number.png",
        "res/SlotMaya/font/arial_blue_stoke_number.fnt",
        "res/SlotMaya/font/arial_purple_stoke_number.png",
        "res/SlotMaya/font/arial_purple_stoke_number.fnt",
        "res/SlotMaya/font/GENTONA_BOLD_NUMBER.png",
        "res/SlotMaya/font/GENTONA_BOLD_NUMBER.fnt",
        "res/SlotMaya/font/jackpot_font.png",
        "res/SlotMaya/font/jackpot_font.fnt",
        "res/SlotMaya/font/UVN_DUNGDAN_GOLDENTIME.png",
        "res/SlotMaya/font/UVN_DUNGDAN_GOLDENTIME.fnt",
        "res/SlotMaya/font/SVN_GENICA_GOLDENTIME.png",
        "res/SlotMaya/font/SVN_GENICA_GOLDENTIME.fnt",
        "res/SlotMaya/font/roboto_bold_freespin_number_100.png",
        "res/SlotMaya/font/roboto_bold_freespin_number_100.fnt",
        "res/SlotMaya/font/roboto_medium_stoke_30.png",
        "res/SlotMaya/font/roboto_medium_stoke_30.fnt",
        "res/SlotMaya/font/roboto_medium_white_24.png",
        "res/SlotMaya/font/roboto_medium_white_24.fnt",
        "res/SlotMaya/font/roboto_bold_bonus.png",
        "res/SlotMaya/font/roboto_bold_bonus.fnt",
        "res/SlotMaya/font/roboto_bold_stroke_bonus.png",
        "res/SlotMaya/font/roboto_bold_stroke_bonus.fnt",
        "res/SlotMaya/font/roboto_medium_white_30.png",
        "res/SlotMaya/font/roboto_medium_white_30.fnt",
        "res/SlotMaya/font/roboto_bold_freespin_result_30.png",
        "res/SlotMaya/font/roboto_bold_freespin_result_30.fnt",
        "res/SlotMaya/font/gentona_white_30.png",
        "res/SlotMaya/font/gentona_white_30.fnt",
        "res/SlotMaya/font/uvn_dungdan_35.png",
        "res/SlotMaya/font/uvn_dungdan_35.fnt",
        "res/SlotMaya/font/uvn_dungdan_freespin_35.png",
        "res/SlotMaya/font/uvn_dungdan_freespin_35.fnt",
        "res/SlotMaya/font/uvn_thangvu_30.png",
        "res/SlotMaya/font/uvn_thangvu_30.fnt",
        "res/SlotMaya/font/total_reward_font.png",
        "res/SlotMaya/font/total_reward_font.fnt",
        "res/SlotMaya/coin_particle.plist",
        "res/SlotMaya/coin_particle.png",
        "res/SlotMaya/slotmaya_bg_board_reward.png"
    ];

    // Add payline
    (function () {
        for (var i = 0; i < 20; i++) {
            res.push("res/SlotMaya/payline/payline_" + i + ".png");
        }
    })();


    var res_texture = [];

    // Add res_texture
    (function () {
        for (var i = 0; i < res.length; i++) {
            var resName = res[i];
            if (resName.slice(resName.lastIndexOf(".")) === ".png") {
                var plistName = resName.slice(0, resName.lastIndexOf(".")) + ".plist";
                if (~res.indexOf(plistName))
                    res_texture.push({
                        img: resName,
                        plist: plistName
                    });
            }
        }
    })();

    // Add spine animation
    (function (input) {
        for (var i = 0; i < input.length; i++) {
            var str = "res/SlotMaya/spine/" + input[i] + ".json";
            var str2 = "res/SlotMaya/spine/" + input[i] + ".atlas";
            var str3 = "res/SlotMaya/spine/" + input[i] + ".png";
            res.push(str);
            res.push(str2);
            res.push(str3);
        }
    })([
        "bonus_lion",
        "liondance_boy",
        "liondance_win",
        "spine_eff_symbol",
        "spine",
        "touch_bonus_lion"
    ]);

    SlotMaya.res_initial = res_initial;
    SlotMaya.res = res;
    SlotMaya.res_texture = res_texture;
})();
