var SlotZodiac = SlotZodiac || {};

(function () {
    var res_initial = [
        "res/SlotZodiac/main_background.png",
        "res/SlotZodiac/loading_maya_bg.png",
        "res/SlotZodiac/loading.png"
    ];

    var res = [
        "res/SlotZodiac/slotmaya_dialog_bg.png",
        "res/SlotZodiac/SlotObjects.png",
        "res/SlotZodiac/SlotObjects.plist",
        "res/SlotZodiac/coin.png",
        "res/SlotZodiac/coin.plist",
        "res/SlotZodiac/MainGames.png",
        "res/SlotZodiac/MainGames.plist",
        "res/SlotZodiac/BonusGame.png",
        "res/SlotZodiac/BonusGame.plist",
        "res/SlotZodiac/Dialog.png",
        "res/SlotZodiac/Dialog.plist",
        "res/SlotZodiac/main_background.png",
        "res/SlotZodiac/slotmaya_bonus_bg.png",
        "res/SlotZodiac/slotmaya_frame.png",
        "res/SlotZodiac/font/arial_blue_stoke_number.png",
        "res/SlotZodiac/font/arial_blue_stoke_number.fnt",
        "res/SlotZodiac/font/arial_purple_stoke_number.png",
        "res/SlotZodiac/font/arial_purple_stoke_number.fnt",
        "res/SlotZodiac/font/GENTONA_BOLD_NUMBER.png",
        "res/SlotZodiac/font/GENTONA_BOLD_NUMBER.fnt",
        "res/SlotZodiac/font/jackpot_font.png",
        "res/SlotZodiac/font/jackpot_font.fnt",
        "res/SlotZodiac/font/UVN_DUNGDAN_GOLDENTIME.png",
        "res/SlotZodiac/font/UVN_DUNGDAN_GOLDENTIME.fnt",
        "res/SlotZodiac/font/SVN_GENICA_GOLDENTIME.png",
        "res/SlotZodiac/font/SVN_GENICA_GOLDENTIME.fnt",
        "res/SlotZodiac/font/roboto_bold_freespin_number_100.png",
        "res/SlotZodiac/font/roboto_bold_freespin_number_100.fnt",
        "res/SlotZodiac/font/roboto_medium_stoke_30.png",
        "res/SlotZodiac/font/roboto_medium_stoke_30.fnt",
        "res/SlotZodiac/font/roboto_medium_white_24.png",
        "res/SlotZodiac/font/roboto_medium_white_24.fnt",
        "res/SlotZodiac/font/roboto_bold_bonus.png",
        "res/SlotZodiac/font/roboto_bold_bonus.fnt",
        "res/SlotZodiac/font/roboto_bold_stroke_bonus.png",
        "res/SlotZodiac/font/roboto_bold_stroke_bonus.fnt",
        "res/SlotZodiac/font/roboto_medium_white_30.png",
        "res/SlotZodiac/font/roboto_medium_white_30.fnt",
        "res/SlotZodiac/font/roboto_bold_freespin_result_30.png",
        "res/SlotZodiac/font/roboto_bold_freespin_result_30.fnt",
        "res/SlotZodiac/font/gentona_white_30.png",
        "res/SlotZodiac/font/gentona_white_30.fnt",
        "res/SlotZodiac/font/uvn_dungdan_35.png",
        "res/SlotZodiac/font/uvn_dungdan_35.fnt",
        "res/SlotZodiac/font/uvn_dungdan_freespin_35.png",
        "res/SlotZodiac/font/uvn_dungdan_freespin_35.fnt",
        "res/SlotZodiac/font/uvn_thangvu_30.png",
        "res/SlotZodiac/font/uvn_thangvu_30.fnt",
        "res/SlotZodiac/font/total_reward_font.png",
        "res/SlotZodiac/font/total_reward_font.fnt",
        "res/SlotZodiac/coin_particle.plist",
        "res/SlotZodiac/coin_particle.png",
        "res/SlotZodiac/slotmaya_bg_board_reward.png"
    ];

    // Add payline
    (function () {
        for (var i = 0; i < 20; i++) {
            res.push("res/SlotZodiac/payline/payline_" + i + ".png");
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
            var str = "res/SlotZodiac/spine/" + input[i] + ".json";
            var str2 = "res/SlotZodiac/spine/" + input[i] + ".atlas";
            var str3 = "res/SlotZodiac/spine/" + input[i] + ".png";
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

    SlotZodiac.res_initial = res_initial;
    SlotZodiac.res = res;
    SlotZodiac.res_texture = res_texture;
})();
