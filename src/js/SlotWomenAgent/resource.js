var SlotWomenAgent = SlotWomenAgent || {};

(function () {
    var res_initial = [
        "res/SlotWomenAgent/HelloWorld.png",
        "res/SlotWomenAgent/loading_back.png",
        "res/SlotWomenAgent/loading.png"
    ];

    var res = [
        "res/SlotWomenAgent/payline/Payline_1.png",
        "res/SlotWomenAgent/payline/Payline_2.png",
        "res/SlotWomenAgent/payline/Payline_3.png",
        "res/SlotWomenAgent/payline/Payline_4.png",
        "res/SlotWomenAgent/payline/Payline_5.png",
        "res/SlotWomenAgent/payline/Payline_6.png",
        "res/SlotWomenAgent/payline/Payline_7.png",
        "res/SlotWomenAgent/payline/Payline_8.png",
        "res/SlotWomenAgent/payline/Payline_9.png",
        "res/SlotWomenAgent/payline/Payline_10.png",
        "res/SlotWomenAgent/payline/Payline_11.png",
        "res/SlotWomenAgent/payline/Payline_12.png",
        "res/SlotWomenAgent/payline/Payline_13.png",
        "res/SlotWomenAgent/payline/Payline_14.png",
        "res/SlotWomenAgent/payline/Payline_15.png",
        "res/SlotWomenAgent/payline/Payline_16.png",
        "res/SlotWomenAgent/payline/Payline_17.png",
        "res/SlotWomenAgent/payline/Payline_18.png",
        "res/SlotWomenAgent/payline/Payline_19.png",
        "res/SlotWomenAgent/payline/Payline_20.png",
        "res/SlotWomenAgent/payline/Payline_21.png",
        "res/SlotWomenAgent/payline/Payline_22.png",
        "res/SlotWomenAgent/payline/Payline_23.png",
        "res/SlotWomenAgent/payline/Payline_24.png",
        "res/SlotWomenAgent/payline/Payline_25.png",
        "res/SlotWomenAgent/SlotObject.png",
        "res/SlotWomenAgent/SlotObject.plist",
        "res/SlotWomenAgent/MainGame.png",
        "res/SlotWomenAgent/MainGame.plist",
        "res/SlotWomenAgent/BonusGame.png",
        "res/SlotWomenAgent/BonusGame.plist",
        "res/SlotWomenAgent/Dialog.png",
        "res/SlotWomenAgent/Dialog.plist",
        "res/SlotWomenAgent/Popup.png",
        "res/SlotWomenAgent/Popup.plist",
        "res/SlotWomenAgent/main_background.png",
        "res/SlotWomenAgent/bonus_natra_nolotus.png",
        "res/SlotWomenAgent/slotwomenagent_frame.png",
        "res/SlotWomenAgent/font/bonus_multiplier.fnt",
        "res/SlotWomenAgent/font/bonus_reward.png",
        "res/SlotWomenAgent/font/creditfont.fnt",
        "res/SlotWomenAgent/font/freespinfont.png",
        "res/SlotWomenAgent/font/happyhourfont.fnt",
        "res/SlotWomenAgent/font/jackpotnormalfont.png",
        "res/SlotWomenAgent/font/popupfont.fnt",
        "res/SlotWomenAgent/font/resultfont.png",
        "res/SlotWomenAgent/font/reward_jackpot_font.fnt",
        "res/SlotWomenAgent/font/reward_normal_font.png",
        "res/SlotWomenAgent/font/total_reward_font.fnt",
        "res/SlotWomenAgent/agent.png",
        "res/SlotWomenAgent/font/bonus_result.fnt"
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
            var str = "res/SlotWomenAgent/spine/" + input[i] + ".json";
            var str2 = "res/SlotWomenAgent/spine/" + input[i] + ".atlas";
            var str3 = "res/SlotWomenAgent/spine/" + input[i] + ".png";
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

    SlotWomenAgent.res_initial = res_initial;
    SlotWomenAgent.res = res;
    SlotWomenAgent.res_texture = res_texture;
})();
