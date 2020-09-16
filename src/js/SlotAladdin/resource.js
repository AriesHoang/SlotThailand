var SlotAladdin = SlotAladdin || {};

(function () {
    var res_initial = [
        "res/SlotAladdin/HelloWorld.png",
        "res/SlotAladdin/loading_back.png",
        "res/SlotAladdin/loading.png"
    ];

    var res = [
        "res/SlotAladdin/payline/Payline_1.png",
        "res/SlotAladdin/payline/Payline_2.png",
        "res/SlotAladdin/payline/Payline_3.png",
        "res/SlotAladdin/payline/Payline_4.png",
        "res/SlotAladdin/payline/Payline_5.png",
        "res/SlotAladdin/payline/Payline_6.png",
        "res/SlotAladdin/payline/Payline_7.png",
        "res/SlotAladdin/payline/Payline_8.png",
        "res/SlotAladdin/payline/Payline_9.png",
        "res/SlotAladdin/payline/Payline_10.png",
        "res/SlotAladdin/payline/Payline_11.png",
        "res/SlotAladdin/payline/Payline_12.png",
        "res/SlotAladdin/payline/Payline_13.png",
        "res/SlotAladdin/payline/Payline_14.png",
        "res/SlotAladdin/payline/Payline_15.png",
        "res/SlotAladdin/payline/Payline_16.png",
        "res/SlotAladdin/payline/Payline_17.png",
        "res/SlotAladdin/payline/Payline_18.png",
        "res/SlotAladdin/payline/Payline_19.png",
        "res/SlotAladdin/payline/Payline_20.png",
        "res/SlotAladdin/payline/Payline_21.png",
        "res/SlotAladdin/payline/Payline_22.png",
        "res/SlotAladdin/payline/Payline_23.png",
        "res/SlotAladdin/payline/Payline_24.png",
        "res/SlotAladdin/payline/Payline_25.png",
        "res/SlotAladdin/SlotObject.png",
        "res/SlotAladdin/SlotObject.plist",
        "res/SlotAladdin/MainGame.png",
        "res/SlotAladdin/MainGame.plist",
        "res/SlotAladdin/BonusGame.png",
        "res/SlotAladdin/BonusGame.plist",
        "res/SlotAladdin/Dialog.png",
        "res/SlotAladdin/Dialog.plist",
        "res/SlotAladdin/Popup.png",
        "res/SlotAladdin/Popup.plist",
        "res/SlotAladdin/main_background.png",
        "res/SlotAladdin/bonus_natra_nolotus.png",
        "res/SlotAladdin/font/bonus_multiplier.fnt",
        "res/SlotAladdin/font/bonus_reward.png",
        "res/SlotAladdin/font/creditfont.fnt",
        "res/SlotAladdin/font/freespinfont.png",
        "res/SlotAladdin/font/happyhourfont.fnt",
        "res/SlotAladdin/font/jackpotnormalfont.png",
        "res/SlotAladdin/font/popupfont.fnt",
        "res/SlotAladdin/font/resultfont.png",
        "res/SlotAladdin/font/reward_jackpot_font.fnt",
        "res/SlotAladdin/font/reward_normal_font.png",
        "res/SlotAladdin/font/total_reward_font.fnt",
        "res/SlotAladdin/agent.png",
        "res/SlotAladdin/font/bonus_result.fnt",
        "res/SlotAladdin/win/slotaladdin_bigwin.png",
        "res/SlotAladdin/win/slotaladdin_epicwin.png",
        "res/SlotAladdin/win/slotaladdin_freespin.png",
        "res/SlotAladdin/win/slotaladdin_jackpotwin.png",
        "res/SlotAladdin/win/slotaladdin_megawin.png",
        "res/SlotWomenAgent/Dialog.png",
        "res/SlotWomenAgent/Dialog.plist",
        "res/SlotWomenAgent/BonusGame.png",
        "res/SlotWomenAgent/BonusGame.plist",
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
            var str = "res/SlotAladdin/spine/" + input[i] + ".json";
            var str2 = "res/SlotAladdin/spine/" + input[i] + ".atlas";
            var str3 = "res/SlotAladdin/spine/" + input[i] + ".png";
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

    SlotAladdin.res_initial = res_initial;
    SlotAladdin.res = res;
    SlotAladdin.res_texture = res_texture;
})();
