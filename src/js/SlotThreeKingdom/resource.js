var SlotThreeKingdom = SlotThreeKingdom || {};

(function () {
    var res_initial = [
        "res/SlotThreeKingdom/HelloWorld.png",
        "res/SlotThreeKingdom/loading_back.png",
        "res/SlotThreeKingdom/loading.png"
    ];

    var res = [
        "res/SlotThreeKingdom/payline/Payline_1.png",
        "res/SlotThreeKingdom/payline/Payline_2.png",
        "res/SlotThreeKingdom/payline/Payline_3.png",
        "res/SlotThreeKingdom/payline/Payline_4.png",
        "res/SlotThreeKingdom/payline/Payline_5.png",
        "res/SlotThreeKingdom/payline/Payline_6.png",
        "res/SlotThreeKingdom/payline/Payline_7.png",
        "res/SlotThreeKingdom/payline/Payline_8.png",
        "res/SlotThreeKingdom/payline/Payline_9.png",
        "res/SlotThreeKingdom/payline/Payline_10.png",
        "res/SlotThreeKingdom/payline/Payline_11.png",
        "res/SlotThreeKingdom/payline/Payline_12.png",
        "res/SlotThreeKingdom/payline/Payline_13.png",
        "res/SlotThreeKingdom/payline/Payline_14.png",
        "res/SlotThreeKingdom/payline/Payline_15.png",
        "res/SlotThreeKingdom/payline/Payline_16.png",
        "res/SlotThreeKingdom/payline/Payline_17.png",
        "res/SlotThreeKingdom/payline/Payline_18.png",
        "res/SlotThreeKingdom/payline/Payline_19.png",
        "res/SlotThreeKingdom/payline/Payline_20.png",
        "res/SlotThreeKingdom/payline/Payline_21.png",
        "res/SlotThreeKingdom/payline/Payline_22.png",
        "res/SlotThreeKingdom/payline/Payline_23.png",
        "res/SlotThreeKingdom/payline/Payline_24.png",
        "res/SlotThreeKingdom/payline/Payline_25.png",
        "res/SlotThreeKingdom/SlotObject.png",
        "res/SlotThreeKingdom/SlotObject.plist",
        "res/SlotThreeKingdom/MainGame.png",
        "res/SlotThreeKingdom/MainGame.plist",
        "res/SlotThreeKingdom/BonusGame.png",
        "res/SlotThreeKingdom/BonusGame.plist",
        "res/SlotThreeKingdom/Dialog.png",
        "res/SlotThreeKingdom/Dialog.plist",
        "res/SlotThreeKingdom/Popup.png",
        "res/SlotThreeKingdom/Popup.plist",
        "res/SlotThreeKingdom/main_background.png",
        "res/SlotThreeKingdom/bonus_natra_nolotus.png",
        "res/SlotThreeKingdom/slotwomenagent_frame.png",
        "res/SlotThreeKingdom/font/bonus_multiplier.fnt",
        "res/SlotThreeKingdom/font/bonus_reward.png",
        "res/SlotThreeKingdom/font/creditfont.fnt",
        "res/SlotThreeKingdom/font/freespinfont.png",
        "res/SlotThreeKingdom/font/happyhourfont.fnt",
        "res/SlotThreeKingdom/font/jackpotnormalfont.png",
        "res/SlotThreeKingdom/font/popupfont.fnt",
        "res/SlotThreeKingdom/font/resultfont.png",
        "res/SlotThreeKingdom/font/reward_jackpot_font.fnt",
        "res/SlotThreeKingdom/font/reward_normal_font.png",
        "res/SlotThreeKingdom/font/total_reward_font.fnt",
        "res/SlotThreeKingdom/agent.png",
        "res/SlotThreeKingdom/font/bonus_result.fnt",
        "res/SlotThreeKingdom/Dialog2.png",
        "res/SlotThreeKingdom/Dialog2.plist",
        "res/SlotThreeKingdom/win/slotthreekingdom_bonus.png",
        "res/SlotThreeKingdom/win/slotthreekingdom_epicwin.png",
        "res/SlotThreeKingdom/win/slotthreekingdom_freespin.png",
        "res/SlotThreeKingdom/win/slotthreekingdom_jackpotwin.png",
        "res/SlotThreeKingdom/win/slotthreekingdom_megawin.png"
    ];

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
            var str = "res/SlotThreeKingdom/spine/" + input[i] + ".json";
            var str2 = "res/SlotThreeKingdom/spine/" + input[i] + ".atlas";
            var str3 = "res/SlotThreeKingdom/spine/" + input[i] + ".png";
            res.push(str);
            res.push(str2);
            res.push(str3);
        }
    })([
        "wukong",
        "effect_sym_fire",
        "effect_lotus",
        "effect_book",
        "effect_spin",
        "effect_peach",
        "win_big",
        "win_bonus",
        "win_freespin",
        "win_jackpot",
        "win_rich"
    ]);

    SlotThreeKingdom.res_initial = res_initial;
    SlotThreeKingdom.res = res;
    SlotThreeKingdom.res_texture = res_texture;
})();
