var SlotHero = SlotHero || {};

(function () {
    var res_initial = [
        "res/SlotHero/HelloWorld.png",
        "res/SlotHero/loading_back.png",
        "res/SlotHero/loading.png"
    ];

    var res = [
        "res/SlotHero/payline/Payline_1.png",
        "res/SlotHero/payline/Payline_2.png",
        "res/SlotHero/payline/Payline_3.png",
        "res/SlotHero/payline/Payline_4.png",
        "res/SlotHero/payline/Payline_5.png",
        "res/SlotHero/payline/Payline_6.png",
        "res/SlotHero/payline/Payline_7.png",
        "res/SlotHero/payline/Payline_8.png",
        "res/SlotHero/payline/Payline_9.png",
        "res/SlotHero/payline/Payline_10.png",
        "res/SlotHero/payline/Payline_11.png",
        "res/SlotHero/payline/Payline_12.png",
        "res/SlotHero/payline/Payline_13.png",
        "res/SlotHero/payline/Payline_14.png",
        "res/SlotHero/payline/Payline_15.png",
        "res/SlotHero/payline/Payline_16.png",
        "res/SlotHero/payline/Payline_17.png",
        "res/SlotHero/payline/Payline_18.png",
        "res/SlotHero/payline/Payline_19.png",
        "res/SlotHero/payline/Payline_20.png",
        "res/SlotHero/payline/Payline_21.png",
        "res/SlotHero/payline/Payline_22.png",
        "res/SlotHero/payline/Payline_23.png",
        "res/SlotHero/payline/Payline_24.png",
        "res/SlotHero/payline/Payline_25.png",
        "res/SlotHero/SlotObject.png",
        "res/SlotHero/SlotObject.plist",
        "res/SlotHero/MainGame.png",
        "res/SlotHero/MainGame.plist",
        "res/SlotHero/BonusGame.png",
        "res/SlotHero/BonusGame.plist",
        "res/SlotHero/Dialog.png",
        "res/SlotHero/Dialog.plist",
        "res/SlotHero/Popup.png",
        "res/SlotHero/Popup.plist",
        "res/SlotHero/main_background.png",
        "res/SlotHero/bonus_natra_nolotus.png",
        "res/SlotHero/font/bonus_multiplier.fnt",
        "res/SlotHero/font/bonus_reward.png",
        "res/SlotHero/font/creditfont.fnt",
        "res/SlotHero/font/freespinfont.png",
        "res/SlotHero/font/happyhourfont.fnt",
        "res/SlotHero/font/jackpotnormalfont.png",
        "res/SlotHero/font/popupfont.fnt",
        "res/SlotHero/font/resultfont.png",
        "res/SlotHero/font/reward_jackpot_font.fnt",
        "res/SlotHero/font/reward_normal_font.png",
        "res/SlotHero/font/total_reward_font.fnt",
        "res/SlotHero/agent.png",
        "res/SlotHero/font/bonus_result.fnt",
        "res/SlotHero/win/SlotHero_bigwin.png",
        "res/SlotHero/win/SlotHero_epicwin.png",
        "res/SlotHero/win/SlotHero_freespin.png",
        "res/SlotHero/win/SlotHero_jackpotwin.png",
        "res/SlotHero/win/SlotHero_megawin.png",
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
            var str = "res/SlotHero/spine/" + input[i] + ".json";
            var str2 = "res/SlotHero/spine/" + input[i] + ".atlas";
            var str3 = "res/SlotHero/spine/" + input[i] + ".png";
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

    SlotHero.res_initial = res_initial;
    SlotHero.res = res;
    SlotHero.res_texture = res_texture;
})();
