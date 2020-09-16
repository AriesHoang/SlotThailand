var SlotWomenAgent = SlotWomenAgent || {};

(function () {
    var BaseScene = SlotWomenAgent.BaseScene;
    var SlotController = SlotWomenAgent.SlotController;
    var WiredSlotFrame = SlotWomenAgent.WiredSlotFrame;
    var SettingItem = SlotWomenAgent.SettingItem;
    var FreeSpinNode = SlotWomenAgent.FreeSpinNode;
    var GoldenTime = SlotWomenAgent.GoldenTime;
    var MainButton = SlotWomenAgent.MainButton;
    var HistoryDialog = SlotWomenAgent.HistoryDialog;
    var RankingDialog = SlotWomenAgent.RankingDialog;
    var RewardDialog = SlotWomenAgent.RewardDialog;
    var CompleteFreeSpinDialog = SlotWomenAgent.CompleteFreeSpinDialog;
    var X2Popup = SlotWomenAgent.X2Popup;

    var SlotState = SlotState || {};
    SlotState.IDLE = 0;
    SlotState.ROLLING = 1;
    SlotState.SHOWING_REWARD = 2;
    SlotState.SHOWING_X2 = 3;
    SlotState.SHOWING_FS_RESULT = 4;

    var SlotScene = BaseScene.extend({
        ctor: function (row, column) {
            row = row || 3;
            column = column || 5;
            this._super.apply(this, arguments);

            this.autoSpin = false;
            this.fastRoll = false;
            this._isWaitingResult = false;
            this.allBetLevel = [1000, 10000, 100000];
            this.betLevel = 0;
            this.freeSpinCount = 0;
            this.jackpotValues = [0, 0, 0];
            this.isSandboxMode = false;
            this._oldJackpotValue = 0; // use for animation running

            var gameLayer = new cc.Node();
            this.addChild(gameLayer, 40);
            this.gameLayer = gameLayer;

            var thiz = this;

            this.dialogLayer.hideDialogCallback = function () {
                this.visible = false;
                thiz.slotFrame.visible = true;
                this.currentDialog = null;
                thiz.sandboxSprite.visible = thiz.isSandboxMode;
            };

            this.initBackground();

            SlotWomenAgentSoundPlayer.playSound("theme_hauvuong", true);

            var slotFrame = new WiredSlotFrame(row, column);
            SlotWomenAgent.Lines && slotFrame.setWires(SlotWomenAgent.Lines);
            this.slotFrame = slotFrame;
            slotFrame.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 40);
            this.gameLayer.addChild(slotFrame);
            if (cc.GlobalSlotWomenAgent.lastResult)
                slotFrame.setResult(cc.GlobalSlotWomenAgent.lastResult);

            // var btmBar = new ccui.Scale9Sprite("slotwomenagent_slot_btm_bar.png", cc.rect(0, 0, 1, 1));
            // btmBar.setPreferredSize(cc.size(cc.winSize.width, 143));
            // btmBar.setAnchorPoint(cc.p(0.5, 0));
            // btmBar.setPosition(cc.winSize.width / 2, 0);
            // this.gameLayer.addChild(btmBar);

            // var logo = new cc.Sprite("res/SlotWomenAgent/slotwomenagent_logo_game.png");
            // logo.setPosition(1030, cc.winSize.height / 2 + 386);
            // this.gameLayer.addChild(logo, 3);

            this.initCharacter();
            this.initGUI();
            this.initButton();

            var defaultLines = [];
            for (var i = 0; i < 25; i++)
                defaultLines.push(i + 1);

            this.isRunningMHV = true;
            this.setSelectedLines(cc.GlobalSlotWomenAgent.SlotState.lines || defaultLines);
            this.setFreeSpinCount(0);
            thiz.setBetLevel(cc.GlobalSlotWomenAgent.SlotState.betLevel || 0, cc.GlobalSlotWomenAgent.isSandboxMode || isNaN(cc.GlobalSlotWomenAgent.SlotState.betLevel) === false);
            this.setTotalWin(cc.GlobalSlotWomenAgent.totalRewardValue || 0, true, true, true);
            this.setCredit(cc.GlobalSlotWomenAgent.PlayerGold);
            this.setState(SlotState.IDLE);

            // this.initCheatLayer();

            this._performPendingFSAction();
            this.setSession(cc.GlobalSlotWomenAgent.sessionId);

            if (cc.GlobalSlotWomenAgent.FreeSpinCount)
                this.setFreeSpinCount(cc.GlobalSlotWomenAgent.FreeSpinCount);
            if (cc.GlobalSlotWomenAgent.PortalFreeSpinCount)
                this.setPortalFreeSpinCount(cc.GlobalSlotWomenAgent.PortalFreeSpinCount);
            else if (cc.GlobalSlotWomenAgent.FreeSpinGame.enabled && cc.GlobalSlotWomenAgent.FreeSpinCount === 0)
                this.showCompleteFreeSpinDialog();

            if (cc.GlobalSlotWomenAgent.AutoSpin)
                this.toggleAutoSpin();

            if (cc.GlobalSlotWomenAgent.FastRoll)
                this.toggleFastRoll();

            if (cc.GlobalSlotWomenAgent.isSandboxMode) {
                this.switchToSandbox(cc.GlobalSlotWomenAgent.PlayerGold);
                this._setJackPotLabel(cc.GlobalSlotWomenAgent.sandboxJackpot);
            }

            //Update Tiền khi chơi minigame
            GlobalEvent.getInstance().addListener("onUpdateUserChangeMoney", this.updateUserChangeMoney, this);

            //ShowMinigame Butotn
            SlotWomenAgentFloatButton.getInstance().show(this);
            //Hide all Minigame
            MiniGameNavigator.hideAll();

            // this.testShowLine();
        },

        testShowLine: function () {
            // for (var i = 1; i < 2; i++) {
            // var wireNode = new cc.Sprite("res/SlotWomenAgent/payline/payline_25.png");
            // wireNode.setPosition(-20, 50);
            // wireNode.setPosition(-20, 245);
            // wireNode.setPosition(-30, -195);
            // wireNode.setPosition(35, 40);
            // wireNode.setPosition(45, 50);
            // wireNode.setPosition(45, 155);
            // wireNode.setPosition(-30, -35);
            // wireNode.setPosition(-20, 75);
            // wireNode.setPosition(-15, 65);
            // wireNode.setPosition(-35, 50);
            // wireNode.setPosition(35, 20);
            // wireNode.setPosition(40, 170);
            // wireNode.setPosition(40, -15);
            // wireNode.setPosition(-35, 155);
            // wireNode.setPosition(-30, -5);
            // wireNode.setPosition(30, 130);
            // wireNode.setPosition(-35, -2);
            // wireNode.setPosition(28, 75);
            // wireNode.setPosition(25, 60);
            // wireNode.setPosition(-30, 105);
            // wireNode.setPosition(-15, 20);
            // wireNode.setPosition(30, 50);
            // wireNode.setPosition(-40, 35);
            // wireNode.setPosition(20, 7);
            // wireNode.setPosition(25, 20);
            // this.slotFrame.addChild(wireNode, 100);
            // }
        },


        initCheatLayer: function () {
            var bg = new cc.LayerColor(cc.color(0, 0, 0, 255), 1040, 90);
            bg.setPosition(371, 915);
            this.gameLayer.addChild(bg, 10);

            var cheatTF = new ccui.TextField("1,1,1,1,1;1,1,1,1,1;1,1,1,1,1", "Arial", 60);
            cheatTF.setAnchorPoint(cc.p(0, 0));
            cheatTF.setTouchSize(cc.size(1040, 90));
            cheatTF.setTextAreaSize(cc.size(1040, 90));
            cheatTF.setPosition(bg.getPosition());
            this.gameLayer.addChild(cheatTF, 10);
            this.cheatTF = cheatTF;
        },

        initBackground: function () {
            //background
            var background = new cc.Sprite("res/SlotWomenAgent/main_background.png");
            cc.GlobalSlotWomenAgent.scaleBackground(background);
            background.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.addChild(background, -1);
        },

        showDialog: function (dialog, keepGame) {
            var res = this._super.apply(this, arguments);
            this.slotFrame.visible = (!res) || (keepGame === true);
            this.sandboxSprite.visible = false;
            return res;
        },

        initGUI: function () {
            var jackpotLabel = new cc.LabelBMFont("500,000", cc.SlotWomenAgentRes.font.JackpotFont);
            jackpotLabel.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 400);
            this.gameLayer.addChild(jackpotLabel);
            this.jackpotLabel = jackpotLabel;

            var settingPanel = new ccui.Scale9Sprite("slotwomenagent_setting_panel.png");
            settingPanel.setPreferredSize(cc.size(88, 170));
            settingPanel.setAnchorPoint(cc.p(0.5, 0.5));
            settingPanel.setPosition(1760, cc.winSize.height - 250);
            settingPanel.visible = false;
            this.settingPanel = settingPanel;
            this.gameLayer.addChild(settingPanel);

            var soundSetting = new SettingItem("slotwomenagent_setting_sound.png", 1);
            soundSetting.setPosition(44, 90);
            settingPanel.addChild(soundSetting);

            var musicSetting = new SettingItem("slotwomenagent_setting_music.png", 2);
            musicSetting.setPosition(soundSetting.x, soundSetting.y - 60);
            this.musicSetting = musicSetting;
            settingPanel.addChild(musicSetting);

            var creditBg = new cc.Sprite("#slotwomenagent_bg_credit.png");
            creditBg.setPosition(408, cc.winSize.height - 70);
            creditBg.setScale(1.0);
            this.gameLayer.addChild(creditBg);

            var creditLabel = new cc.LabelBMFont("0", cc.SlotWomenAgentRes.font.CreditFont);
            creditLabel.setPosition(creditBg.x + 10, creditBg.y + 5);
            this.gameLayer.addChild(creditLabel, 1);
            this.creditLabel = creditLabel;

            var lineLabel = new cc.LabelBMFont("20", cc.SlotWomenAgentRes.font.ResultFont);
            lineLabel.setPosition(290, 65);
            this.gameLayer.addChild(lineLabel, 1);
            this.lineLabel = lineLabel;

            var betLevelLabel = new cc.LabelBMFont("100,000", cc.SlotWomenAgentRes.font.ResultFont);
            betLevelLabel.setPosition(525, lineLabel.y);
            this.gameLayer.addChild(betLevelLabel, 1);
            this.betLevelLabel = betLevelLabel;

            var totalBetSprite = new cc.Sprite("#slotwomenagent_total.png");
            totalBetSprite.setPosition(790, lineLabel.y + 16);
            this.gameLayer.addChild(totalBetSprite);

            var totalBetLabel = new cc.LabelBMFont("0", cc.SlotWomenAgentRes.font.ResultFont);
            totalBetLabel.setPosition(790, lineLabel.y);
            this.gameLayer.addChild(totalBetLabel, 2);
            this.totalBetLabel = totalBetLabel;

            var totalRewardSprite = new cc.Sprite("#slotwomenagent_win.png");
            totalRewardSprite.setPosition(1080, lineLabel.y + 16);
            this.gameLayer.addChild(totalRewardSprite);

            var totalRewardLabel = new cc.LabelBMFont("0", cc.SlotWomenAgentRes.font.ResultFont);
            totalRewardLabel.setPosition(1080, lineLabel.y);
            this.gameLayer.addChild(totalRewardLabel, 1);
            this.totalRewardLabel = totalRewardLabel;

            var freeSpinNode = new FreeSpinNode();
            freeSpinNode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 350);
            this.gameLayer.addChild(freeSpinNode, 10);

            this.freeSpinNode = freeSpinNode;

            var sessionBg = new cc.Sprite("#slotwomenagent_bg_credit.png");
            sessionBg.setPosition(cc.winSize.width - 410, cc.winSize.height - 70);
            sessionBg.setScale(1.0);
            this.gameLayer.addChild(sessionBg);

            var sessionLabel = new cc.LabelBMFont("# 123", cc.SlotWomenAgentRes.font.CreditFont);
            sessionLabel.setPosition(sessionBg.x + 10, sessionBg.y + 5);
            this.gameLayer.addChild(sessionLabel, 1);
            this.sessionLabel = sessionLabel;

            var thiz = this;
            var btnDong = new ccui.Button("slotwomenagent_line.png", "slotwomenagent_line.png", "", ccui.Widget.PLIST_TEXTURE);
            btnDong.setPosition(290, 76);
            this.gameLayer.addChild(btnDong);

            btnDong.addClickEventListener(function () {
                if (thiz.state !== SlotState.IDLE)
                    return;
                // if (!this.autoSpin || this.isSandboxMode) {
                if (!this.autoSpin) {
                    thiz.toggleLinesSelect();
                } else {
                    this.showError(0, MultiLanguage.getTextByKey("AUTO_ROLL_CANT_USE"));
                }
                if (!thiz.musicSetting.getDisabled())
                    SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);
            });

            var btnCuoc = new ccui.Button("slotwomenagent_bet.png", "slotwomenagent_bet.png", "", ccui.Widget.PLIST_TEXTURE);
            btnCuoc.setPosition(523, 76);
            this.gameLayer.addChild(btnCuoc);

            // var cuocLabel = new cc.LabelBMFont("CƯỢC", cc.SlotWomenAgentRes.font.Bay_Buom_Text_Stroke);
            // var cuocLabel = new cc.LabelTTF("CƯỢC", cc.SlotWomenAgentRes.font.UVNThangVu, 35);
            // var cuocLabel = new cc.LabelTTF(MultiLanguage.getTextByKey("BET_TITLE"), cc.SlotWomenAgentRes.font.UVNThangVu, 38, cc.p(200, 200), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            // cuocLabel.enableStroke(cc.color(0, 0, 0, 255), 2);
            // cuocLabel.setPosition(btnCuoc.x, btnCuoc.y + 30);
            // // cuocLabel.setScale(0.5);
            // this.gameLayer.addChild(cuocLabel, 1);

            btnCuoc.addClickEventListener(function () {
                if (thiz.state !== SlotState.IDLE)
                    return;
                // if (!thiz.autoSpin || !thiz.isSandboxMode) {
                if (!thiz.autoSpin) {
                    thiz.setBetLevel((thiz.betLevel + 1) % 3);
                } else {
                    thiz.showError(0, MultiLanguage.getTextByKey("AUTO_ROLL_OR_TRIAL_CANT_USE"));
                }
                if (thiz.isSandboxMode)
                    thiz.toggleSandboxMode();

                if (!thiz.musicSetting.getDisabled())
                    SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);
            });

            var sandboxSprite = new cc.Sprite("#slotwomenagent_sandbox_btn.png");
            sandboxSprite.setPosition(cc.winSize.width / 2 - 5, cc.winSize.height / 2 + 330);
            sandboxSprite.setVisible(false);
            this.gameLayer.addChild(sandboxSprite, 5);
            this.sandboxSprite = sandboxSprite;

            // var sandboxText1 = new cc.LabelTTF("TRAIL PLAY", cc.SlotWomenAgentRes.font.UVNThangVu, 35);
            // sandboxText1.setAnchorPoint(cc.p(0.5, 0.5));
            // sandboxText1.setPosition(sandboxSprite.width / 2, sandboxSprite.height / 2);
            // this.sandboxText1 = sandboxText1;
            // sandboxText1.enableStroke(cc.color("#000000"), 2);
            // this.sandboxSprite.addChild(sandboxText1);

            var goldenTime = new GoldenTime();
            goldenTime.setPosition(cc.winSize.width - 100, cc.winSize.height / 2 + 300);
            goldenTime.visible = false;
            this.gameLayer.addChild(goldenTime);
            this.goldenTime = goldenTime;

            var portalFreeSpin = new cc.Sprite("#slotwomenagent_free_spin.png");
            portalFreeSpin.setPosition(1903, cc.winSize.height / 2 - 132);
            this.gameLayer.addChild(portalFreeSpin);
            portalFreeSpin.visible = false;
            this.portalFreeSpin = portalFreeSpin;

            var portalFSCount = new cc.LabelBMFont("0", cc.SlotWomenAgentRes.font.FreeSpinFont);
            // var portalFSCount = new cc.LabelTTF("0", "Arial", 40);
            portalFSCount.setPosition(105, 110);
            portalFreeSpin.addChild(portalFSCount);

            // var portalFS = new cc.LabelTTF(MultiLanguage.getTextByKey("FREE_SPIN_TITLE"), cc.SlotWomenAgentRes.font.UVNThangVu, 35);
            // portalFS.setPosition(135, 115);
            // portalFreeSpin.addChild(portalFS);

            portalFreeSpin.setCount = function (count) {
                portalFSCount.setString(count + "");
            };
        },

        initController: function () {
            this._controller = new SlotController(this);
        },

        updateGoldenTime: function (data) {
            if (!data.enabled) {
                this.goldenTime.stopAllActions();
                this.goldenTime.visible = false;
                return;
            }

            if (data.remainingTime <= 0) {
                this.goldenTime.stopAllActions();
                this.goldenTime.visible = false;
                return;
            }

            this.goldenTime.visible = true;
            this.goldenTime.setXLabel("x" + data.multiplier);
            var remainingTime = data.remainingTime;
            var hours = Math.floor(remainingTime / 3600);
            hours = hours < 10 ? ("0" + hours) : hours;
            var minutes = Math.floor((remainingTime % 3600) / 60);
            minutes = minutes < 10 ? ("0" + minutes) : minutes;
            var seconds = remainingTime % 60;
            seconds = seconds < 10 ? ("0" + seconds) : seconds;

            this.goldenTime.setTimeLabel(hours + ":" + minutes + ":" + seconds);

            var thiz = this;
            var delay = new cc.DelayTime(1);
            var func = new cc.CallFunc(function () {
                data.remainingTime = data.remainingTime - 1;
                thiz.updateGoldenTime(data);
            });
            this.goldenTime.stopAllActions();
            this.goldenTime.runAction(new cc.Sequence(delay, func));
        },

        initButton: function () {
            var homeBtn = new ccui.Button("slotwomenagent_home_btn.png", "slotwomenagent_home_btn.png", "", ccui.Widget.PLIST_TEXTURE);
            homeBtn.setPosition(93, cc.winSize.height - 70);
            this.gameLayer.addChild(homeBtn);

            var sandboxBtn = new ccui.Button("slotwomenagent_sandbox_btn.png", "", "", ccui.Widget.PLIST_TEXTURE);
            sandboxBtn.setPosition(480, cc.winSize.height - 140);
            sandboxBtn.setZoomScale(0);
            this.sandboxBtn = sandboxBtn;
            this.gameLayer.addChild(sandboxBtn);

            // var sandboxText = new cc.LabelTTF("TRAIL PLAY", cc.SlotWomenAgentRes.font.UVNThangVu, 35);
            // sandboxText.setAnchorPoint(cc.p(0.5, 0.5));
            // sandboxText.setPosition(sandboxBtn.width / 2, sandboxBtn.height / 2);
            // this.sandboxText = sandboxText;
            // sandboxText.enableStroke(cc.color("#000000"), 2);
            // this.sandboxBtn.addChild(sandboxText);

            var casualBtn = new ccui.Button("slotwomenagent_icon_casualmark.png", "", "", ccui.Widget.PLIST_TEXTURE);
            casualBtn.setPosition(80, 75);
            this.gameLayer.addChild(casualBtn);

            var autoRollBtn = new ccui.Button("slotwomenagent_auto_roll_btn.png", "", "", ccui.Widget.PLIST_TEXTURE);
            autoRollBtn.setZoomScale(0);
            autoRollBtn.setPosition(1360, 80);
            this.gameLayer.addChild(autoRollBtn);
            this.autoRollBtn = autoRollBtn;

            // var autoRollLabel = new cc.LabelBMFont("QUAY\n\nTỰ ĐỘNG", cc.SlotWomenAgentRes.font.Bay_Buom_Text_Stroke);
            // var autoRollLabel = new cc.LabelTTF("QUAY\nTỰ ĐỘNG", cc.SlotWomenAgentRes.font.UVNThangVu, 38);
            // var autoRollLabel = new cc.LabelTTF(MultiLanguage.getTextByKey("AUTO_ROLL_TITLE"), cc.SlotWomenAgentRes.font.UVNThangVu, 38);
            // autoRollLabel.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            // autoRollLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            // autoRollLabel.enableStroke(cc.color(0, 0, 0, 255), 2);
            // // autoRollLabel.setLineHeight(45);
            // autoRollLabel.setPosition(autoRollBtn.x, autoRollBtn.y + 10);
            // // autoRollLabel.setScale(0.5);
            // // autoRollLabel.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
            // this.gameLayer.addChild(autoRollLabel, 1);
            // this.autoRollLabel = autoRollLabel;

            //quay nhanh
            // var fastRollBtn = new ccui.Button("bg_button_quaynhanh.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // fastRollBtn.setZoomScale(0);
            // fastRollBtn.setPosition(1580, 75);
            // this.gameLayer.addChild(fastRollBtn);
            // this.fastRollBtn = fastRollBtn;
            //
            // var icon_fast_roll = new cc.Sprite("#icon_quay_nhanh_off.png");
            // icon_fast_roll.setPosition(fastRollBtn.x, fastRollBtn.y);
            // this.gameLayer.addChild(icon_fast_roll, 1);
            // this.icon_fast_roll = icon_fast_roll;

            var rollSprite = new cc.Sprite("#slotwomenagent_roll_btn.png");
            rollSprite.setPosition(cc.winSize.width - 150, rollSprite.height / 2);
            this.gameLayer.addChild(rollSprite);

            var rollBtn = new ccui.Widget();
            rollBtn.touchEnabled = true;
            rollBtn.setContentSize(200, 300);
            rollBtn.setPosition(rollSprite.x, rollBtn.height / 2);
            this.gameLayer.addChild(rollBtn);

            // var rollBtn = new ccui.Button("slotwomenagent_roll_btn.png", "", "", ccui.Widget.PLIST_TEXTURE);
            // rollBtn.setZoomScale(0);
            // rollBtn.setPosition(cc.winSize.width - 200, rollBtn.height / 2);
            // this.gameLayer.addChild(rollBtn);

            // var rollSpine = sp.SkeletonAnimation.createWithJsonFile("res/SlotWomenAgent/spine/effect_spin.json", "res/SlotWomenAgent/spine/effect_spin.atlas");
            // rollSpine.setPosition(rollSprite.x + 10, rollSprite.y - 60);
            // rollSpine.setCompleteListener(function () {
            //     if (thiz.state === SlotState.ROLLING) {
            //         rollSpine.setAnimation(0, "animation", false);
            //     }
            // });
            //
            // this.gameLayer.addChild(rollSpine);
            // this.rollSpine = rollSpine;

            // var rollSprite = new cc.Sprite("res/SlotWomenAgent/slotwomenagent_btn_roll.png");
            // rollSprite.setPosition(cc.winSize.width - 200, rollSprite.height / 2 + 20);
            // this.gameLayer.addChild(rollSprite);

            var infoBtn = new ccui.Button("slotwomenagent_icon_info.png", "", "", ccui.Widget.PLIST_TEXTURE);
            infoBtn.setPosition(cc.winSize.width - 550, cc.winSize.height - 160);
            this.gameLayer.addChild(infoBtn);

            var rankingBtn = new ccui.Button("slotwomenagent_icon_ranking.png", "", "", ccui.Widget.PLIST_TEXTURE);
            rankingBtn.setPosition(infoBtn.x + 130, infoBtn.y);
            this.gameLayer.addChild(rankingBtn);

            var settingBtn = new ccui.Button("slotwomenagent_icon_setting.png", "", "", ccui.Widget.PLIST_TEXTURE);
            settingBtn.setPosition(rankingBtn.x + 130, rankingBtn.y);
            this.gameLayer.addChild(settingBtn);

            var x2Btn = new cc.Node();
            x2Btn.setContentSize(88, 67);
            x2Btn.setAnchorPoint(cc.p(0.5, 0.5));
            x2Btn.setPosition(1219, 102);
            x2Btn.visible = false;
            this.gameLayer.addChild(x2Btn);
            this.x2Btn = x2Btn;

            // var x2Sprite = new cc.Sprite("#slotwomenagent_x2_btn.png");
            // x2Sprite.setPosition(x2Btn.width / 2, x2Btn.height / 2);
            // x2Btn.addChild(x2Sprite);

            var thiz = this;

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,

                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    if (!target.visible)
                        return false;

                    if (thiz.state !== SlotState.IDLE)
                        return;

                    var p = target.convertToNodeSpace(touch.getLocation());

                    if (cc.rectContainsPoint(cc.rect(0, 0, target.width, target.height), p)) {
                        // thiz.showX2Game();
                        return true;
                    }
                    return false;
                }
            }, x2Btn);

            rollBtn.addClickEventListener(function () {
                thiz.onQuayBtnClick();
            });

            autoRollBtn.addClickEventListener(function () {
                if (!thiz.isSandboxMode) {
                    thiz.toggleAutoSpin();
                } else {
                    thiz.showError(0, MultiLanguage.getTextByKey("NOT_SUPPORT_TRIAL_PLAY"))
                }
                if (!thiz.musicSetting.getDisabled())
                    SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);
            });

            // fastRollBtn.addClickEventListener(function () {
            //     thiz.toggleFastRoll();
            //
            //     if (!thiz.musicSetting.getDisabled())
            //         SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);
            // });

            casualBtn.addClickEventListener(function () {
                cc.log("SHOW REWARD DIALOG");
                thiz.showDialog(new RewardDialog(thiz.betLevel));
                if (!thiz.musicSetting.getDisabled())
                    SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);
            });

            rankingBtn.addClickEventListener(function () {
                thiz.showDialog(new RankingDialog());
                if (!thiz.musicSetting.getDisabled())
                    SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);
            });

            infoBtn.addClickEventListener(function () {
                thiz.showDialog(new HistoryDialog());
                if (!thiz.musicSetting.getDisabled()) {
                    SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);
                }
            });

            settingBtn.addClickEventListener(function () {
                thiz.settingPanel.visible = !thiz.settingPanel.visible;
                if (!thiz.musicSetting.getDisabled())
                    SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);
            });

            sandboxBtn.addClickEventListener(function () {
                thiz.toggleSandboxMode();
                if (!thiz.musicSetting.getDisabled())
                    SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);
            });

            homeBtn.addClickEventListener(function () {
                if (thiz.state !== SlotState.IDLE) {
                    thiz._pendingBack = true;
                    return;
                }
                if (!thiz.musicSetting.getDisabled())
                    SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);
                // cc.log("GOTOHOME-------------");
                SlotWomenAgent.SlotClient.getInstance().closeSocket();
                //Hide all Minigame
                MiniGameNavigator.hideAll();
                SlotWomenAgentSoundPlayer.stopSound("theme_hauvuong");
                SlotWomenAgentSoundPlayer.stopSound("spin");
                thiz.autoSpin = false;
                thiz.isRunningMHV = false;
                SceneNavigator.goToHomeScene();
            });
        },

        initCharacter: function () {
            // var wukong = sp.SkeletonAnimation.createWithJsonFile("res/SlotWomenAgent/spine/wukong.json", "res/SlotWomenAgent/spine/wukong.atlas");
            // wukong.setPosition(230, cc.winSize.height / 2 - 350);
            // wukong.setScale(1);
            // wukong.setAnimation(0, "animation", true);
            var agent = new cc.Sprite("res/SlotWomenAgent/agent.png");
            agent.setPosition(190, cc.winSize.height / 2 - 80);
            // wukong.setScale(1);
            this.gameLayer.addChild(agent);

            var lancan = new cc.Sprite("res/SlotWomenAgent/lancan.png");
            lancan.setPosition(150, 240);
            this.gameLayer.addChild(lancan);

            // var peach = sp.SkeletonAnimation.createWithJsonFile("res/SlotWomenAgent/spine/effect_peach.json", "res/SlotWomenAgent/spine/effect_peach.atlas");
            // peach.setPosition(cc.winSize.width - 200, 150);
            // peach.setScale(1);
            // peach.setAnimation(0, "animation", true);
            // this.gameLayer.addChild(peach);
        },

        toggleAutoSpin: function () {
            this.autoSpin = !this.autoSpin;
            // this.autoRollLabel.setString(this.autoSpin ? MultiLanguage.getTextByKey("AUTO_ROLL_TITLE_OFF") : MultiLanguage.getTextByKey("AUTO_ROLL_TITLE"));
            if (this.autoSpin && this.state === SlotState.IDLE)
                this.onQuayBtnClick();

            cc.GlobalSlotWomenAgent.AutoSpin = this.autoSpin;
        },

        toggleFastRoll: function () {
            this.fastRoll = !this.fastRoll;
            this.icon_fast_roll.setSpriteFrame(this.fastRoll ? "icon_quay_nhanh_on.png" : "icon_quay_nhanh_off.png");
            cc.GlobalSlotWomenAgent.FastRoll = this.fastRoll;
        },

        setCredit: function (value) {
            var money = value["1"];
            var bet = value["2"];
            if (isNaN(money) || isNaN(bet))
                return;
            var thiz = this;
            this._pendingCredit = function () {
                thiz.creditLabel.stopAllActions();
                SlotWomenAgent.runActionNumber(thiz.creditLabel, cc.GlobalSlotWomenAgent.PlayerGold, thiz._oldCreditValue);
                thiz._oldCreditValue = cc.GlobalSlotWomenAgent.PlayerGold;

                thiz._pendingCredit = null;
            };

            if (bet < 0) {
                cc.GlobalSlotWomenAgent.PlayerGold = money;
                this._pendingCredit();
            } else if (bet === 0) {
                cc.GlobalSlotWomenAgent.PlayerGold = money;
                this._pendingCredit();
            } else {
                cc.GlobalSlotWomenAgent.PlayerGold = money;
            }

        },

        setSelectedLines: function (selectedLines) {

            if (selectedLines instanceof Array && selectedLines.length > 0) {
                this.selectedLines = selectedLines;
                this.lineLabel.setString(selectedLines.length);
                this.totalBetLabel.setString(cc.GlobalSlotWomenAgent.FormatGold(
                    this.allBetLevel[this.betLevel] * this.selectedLines.length));

                cc.GlobalSlotWomenAgent.SlotState.lines = this.selectedLines;
            }

        },

        onQuayBtnClick: function (cheatType) {
            if (!this.isRunningMHV) return;
            if (this.state !== SlotState.IDLE)
                return;

            // break wire line effect
            this.slotFrame.hideWireAndSymbolEffect();
            if (!this.musicSetting.getDisabled())
                SlotWomenAgentSoundPlayer.playSound("spin_button_press", false);

            //start rolling
            this.setState(SlotState.ROLLING);

            if (this.portalFreeSpinCount) {
                this.setPortalFreeSpinCount(this.portalFreeSpinCount - 1);
                this.portalFreeSpin.visible = true;
                cc.GlobalSlotWomenAgent.FreeSpinGame.enabled = true;
                cc.GlobalSlotWomenAgent.FreeSpinGame.count++;
            } else if (this.freeSpinCount) {
                this.setFreeSpinCount(this.freeSpinCount - 1);
                this.freeSpinNode.visible = true;
                cc.GlobalSlotWomenAgent.FreeSpinGame.enabled = true;
                cc.GlobalSlotWomenAgent.FreeSpinGame.count++;
            }

            if (!this.musicSetting.getDisabled())
                SlotWomenAgentSoundPlayer.playSound("spin", false);

            this.setTotalWin(0);
            this.x2Btn.visible = false;
            var thiz = this;
            // if (thiz.freeSpinCount)
            //     thiz.setFreeSpinCount(thiz.freeSpinCount - 1);
            for (var i = 0; i < this.slotFrame.column; i++) {
                setTimeout(function (index) {
                    if (thiz.state === SlotState.ROLLING) {
                        thiz.slotFrame.setRolling(true, index);
                    }
                }, i * 500, i);
            }

            this._isWaitingResult = true;

            this._rollTime = Date.now();
            var fn = this._controller.sendRollRequest;
            // var fn = this._controller.sendCheatBonusRequest;
            switch (cheatType) {
                case 1:
                    fn = this._controller.sendCheatBonusRequest;
                    break;
                case 2:
                    fn = this._controller.sendCheatFSRequest;
                    break;
            }
            this.isSandboxMode && (fn = this._controller.sendSandBoxRollRequest);
            fn(this.betLevel, this.selectedLines, (this.cheatTF) ? this.cheatTF.getString() : null,
                cc.GlobalSlotWomenAgent.FreeSpinGame.enabled || this.autoSpin);
            // fn(this.betLevel, this.selectedLines, null, cc.GlobalSlotWomenAgent.FreeSpinGame.enabled || this.autoSpin);

            if (this.rollTimeout) {
                clearTimeout(this.rollTimeout);
                this.rollTimeout = null;
            }
            this.rollTimeout = setTimeout(function () {
                for (var i = 0; i < 5; i++)
                    thiz.slotFrame.setRolling(false, i);
                thiz.setState(SlotState.IDLE);
                thiz._isWaitingResult = false;
            }, 8000);
        },

        showX2Game: function () {
            if (this.state !== SlotState.IDLE
                && this.state !== SlotState.SHOWING_X2)
                return;

            this.setState(SlotState.SHOWING_X2);
            var node = new X2Popup(cc.GlobalSlotWomenAgent.pendingX2Value, cc.GlobalSlotWomenAgent.pendingX2Base);
            node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 48);
            this.gameLayer.addChild(node, 5);

            node.setExitCallback(function (winAmount) {
                winAmount = winAmount || 0;
                this.setState(SlotState.IDLE);
                cc.GlobalSlotWomenAgent.totalRewardValue += winAmount;
                this.setTotalWin(cc.GlobalSlotWomenAgent.totalRewardValue, true, null, true);
                this.x2Btn.visible = false;
            }, this);
        },

        updateSlotResult: function (result) {
            if (this._isWaitingResult) {
                if (this.rollTimeout) {
                    clearTimeout(this.rollTimeout);
                    this.rollTimeout = null;
                }
                var thiz = this;
                var timeout = Math.max(this._rollTime + 500 * this.slotFrame.column + 1000 - Date.now(), 0);
                setTimeout(function () {
                    thiz.onRollResult(result);
                    thiz._isWaitingResult = false;
                }, timeout);
                cc.GlobalSlotWomenAgent.pendingX2 = result["x2"];
            }
        },

        rewardCallback: function (totalResult, result) {
            // cc.log("rewardCallback");
            var thiz = this;
            // var showTotalCoinWinAction = new cc.CallFunc(function () {
            //     var hideEffect = [2, 3, 4].indexOf(result["wt"]) !== -1; // skip effect if winType = 2,3,4
            //     var jackpotValue = 0;
            //     if (result["wt"] === 5)
            //         jackpotValue += result["jc"];
            //     thiz.setTotalWin(totalResult["total_coin"], hideEffect, jackpotValue);
            //     //thiz.x2Btn.visible = !!totalResult["total_coin"];
            // });
            // var delay1 = new cc.DelayTime(totalResult["total_coin"] ? 3 : 0);

            var effectLayer = new cc.LayerColor(cc.color(0, 0, 0, 200));
            effectLayer.visible = false;
            thiz.gameLayer.addChild(effectLayer, 420);

            var showBonusAction = new cc.CallFunc(function () {
                // cc.log("SHOW BONUS ACTION");
                if (!thiz.musicSetting.getDisabled())
                    SlotWomenAgentSoundPlayer.playSound("bonus", false);
                thiz.hideAllDialog();
                effectLayer.visible = true;
                // tnkEffect.visible = false;
                var effect_win_bonus = sp.SkeletonAnimation.createWithJsonFile('res/SlotWomenAgent/spine/win_bonus.json', 'res/SlotWomenAgent/spine/win_bonus.atlas');
                effect_win_bonus.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 800);
                effectLayer.addChild(effect_win_bonus);
                effect_win_bonus.setAnimation(0, "animation", false);
                effect_win_bonus.setCompleteListener(function () {
                    setTimeout(function () {
                        effectLayer.removeFromParent();
                        thiz.showBonusGame();
                    }, 0);
                });
                showBonusAction.release();
            });

            showBonusAction.retain();

            var showFreeSpinAction = new cc.CallFunc(function () {
                // thiz.freeSpinCount += totalResult["free_spin"];
                // thiz.setFreeSpinCount(thiz.freeSpinCount);
                showFreeSpinAction.release();
                if (!thiz.musicSetting.getDisabled())
                    SlotWomenAgentSoundPlayer.playSound("freespin_xuathien", false);
                thiz.setState(SlotState.SHOWING_REWARD);
                if (thiz._pendingFS)
                    thiz._pendingFS();
                if (thiz._pendingPFS)
                    thiz._pendingPFS();
                effectLayer.visible = true;
                // tnkEffect.visible = false;
                var effect_win_freespin = sp.SkeletonAnimation.createWithJsonFile('res/SlotWomenAgent/spine/win_freespin.json', 'res/SlotWomenAgent/spine/win_freespin.atlas');
                effect_win_freespin.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 700);
                effectLayer.addChild(effect_win_freespin);
                // effect_win_freespin.setSkin("qmp");
                effect_win_freespin.setAnimation(0, "animation", false);

                // var label = new cc.LabelBMFont("+" + totalResult["free_spin_count"] + " LƯỢT QUAY", cc.SlotWomenAgentRes.font.Dialog_Title);
                var label = new cc.LabelTTF("+" + totalResult["free_spin_count"] + " SPIN", "Arial", 25);
                label.setScale(2);
                label.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 350);
                effectLayer.addChild(label);

                effect_win_freespin.setCompleteListener(function () {
                    setTimeout(function () {
                        label.removeFromParent();
                        // if (totalResult["bonus"]) {
                        //     thiz.runAction(showBonusAction);
                        //     return;
                        // }
                        // showBonusAction.release();
                        // thiz.state = SlotState.IDLE;
                        thiz.setState(SlotState.IDLE);
                        effectLayer.removeFromParent();

                        if (thiz.autoSpin || thiz.freeSpinCount)
                            thiz.onQuayBtnClick();
                    }, 0);
                });
            });
            showFreeSpinAction.retain();

            var finishAction = new cc.CallFunc(function () {
                thiz.safeRemove(effectLayer);

                if (thiz._pendingFS)
                    thiz._pendingFS();
                if (thiz._pendingPFS)
                    thiz._pendingPFS();

                if (thiz.state !== SlotState.SHOWING_FS_RESULT)
                    thiz.setState(SlotState.IDLE);

                if (thiz.autoSpin || thiz.freeSpinCount)
                    thiz.onQuayBtnClick();

                finishAction.release();
            });
            finishAction.retain();

            // show effect bonus + freeSpin
            var afterAction = new cc.CallFunc(function () {
                var chainSequence = function () {
                    var chainAction = null;
                    if (totalResult["free_spin"] && totalResult["bonus"]) {
                        chainAction = showBonusAction;
                        showFreeSpinAction.release();
                        finishAction.release();
                        cc.GlobalSlotWomenAgent.pendingFSReward = totalResult["free_spin"];
                    } else if (totalResult["free_spin"]) {
                        chainAction = showFreeSpinAction;
                        showBonusAction.release();
                    }
                    else if (totalResult["bonus"]) {
                        chainAction = showBonusAction;
                        showFreeSpinAction.release();
                        finishAction.release();
                    } else {
                        chainAction = finishAction;
                        showFreeSpinAction.release();
                        showBonusAction.release();
                    }
                    thiz.runAction(chainAction);
                };
                chainSequence();
            });

            // var sequence = [showTotalCoinWinAction, delay1, afterAction];
            // thiz.runAction(new cc.Sequence(sequence));
            thiz.runAction(afterAction);
        },

        onRollResult: function (result) {
            //stop rolling
            var slotFrame = this.slotFrame;
            slotFrame.setResult(result["1"]);
            cc.GlobalSlotWomenAgent.lastResult = result["1"];
            for (var i = 0; i < this.slotFrame.column; i++) {
                setTimeout(function (index) {
                    slotFrame.setRolling(false, index);
                }, i * 500, i);
            }
            var thiz = this;

            setTimeout(function () {
                thiz.setState(SlotState.SHOWING_REWARD);

                var effectLayer = new cc.LayerColor(cc.color(0, 0, 0, 200));
                effectLayer.visible = false;
                thiz.gameLayer.addChild(effectLayer, 420);


                // show total Money
                var showTotalCoinWinAction = function () {
                    // var hideEffect = [2, 3, 4].indexOf(result["wt"]) !== -1; // skip effect if winType = 2,3,4
                    var jackpotValue = 0;
                    if (result["wt"] === 5)
                        jackpotValue += result["jc"];
                    // thiz.setTotalWin(result["total_coin"], hideEffect, jackpotValue);
                    thiz.setTotalWin(result["total_coin"], false, jackpotValue);
                    //thiz.x2Btn.visible = !!totalResult["total_coin"];
                };

                // show Trúng line -> bonus + fs
                var chainSequence = function () {
                    thiz.safeRemove(effectLayer);
                    // params : reward lines , free spin, bonus game
                    var showLineReward = cc.callFunc(function () {
                        var totalWin = 0;
                        // slotFrame.showReward(true, result["2"], result["free_spin"], result["bonus"], function (shownLine) {
                        slotFrame.showReward(thiz.fastRoll, result["2"], result["free_spin"], result["bonus"], function (shownLine) {
                            if (shownLine.type === 2) {
                                if (!thiz.musicSetting.getDisabled())
                                    SlotWomenAgentSoundPlayer.playSound("win_small", false);
                                totalWin += shownLine.amount;
                                thiz.setTotalWin(totalWin, true, null, null, true);
                            }
                        }, function (totalResult) {
                            thiz.rewardCallback(totalResult, result);
                        }, result);
                    });
                    // thiz.runAction(new cc.sequence(showTotalCoinWinAction, showLineReward));
                    thiz.runAction(showLineReward);

                    // cc.log("------ portalFreeSpinCount ------: " + thiz.portalFreeSpinCount
                    //     + "\n ------ freeSpinCount ------: " + thiz.freeSpinCount
                    //     + "\n ------ Global freeSpinCount------: " + cc.GlobalSlotWomenAgent.FreeSpinGame.count);

                    // allow skip if not FreeSpin & Bonus & JP & autoSpin & portalFreeSpinCount & freeSpinCount
                    if (!result["free_spin"]
                        && !result["bonus"]
                        && result["wt"] !== 5
                        && !thiz.autoSpin
                        && (thiz.portalFreeSpinCount === 0 || thiz.portalFreeSpinCount === undefined)
                        && (thiz.freeSpinCount === 0 || thiz.freeSpinCount === undefined)
                        && (cc.GlobalSlotWomenAgent.FreeSpinGame.count === 0 || cc.GlobalSlotWomenAgent.FreeSpinGame.count === undefined)) {
                        // cc.log("------ free_spin ------: " + result["free_spin"]
                        //     + "\n ------ bonus ------: " + result["bonus"]
                        //     + "\n ------ portalFreeSpinCount ------: " + thiz.portalFreeSpinCount
                        //     + "\n ------ freeSpinCount ------: " + thiz.freeSpinCount
                        //     + "\n ------ Global freeSpinCount------: " + cc.GlobalSlotWomenAgent.FreeSpinGame.count);
                        thiz.setState(SlotState.IDLE);
                    }
                };

                // show spine win + total Money -> trúng line -> bonus + fs
                var showBigWinAction = new cc.CallFunc(function () {
                    var winType = result["wt"];
                    if ([2, 3, 4, 5].indexOf(winType) !== -1) {
                        // var label = new cc.LabelBMFont("", cc.SlotWomenAgentRes.font.Total_Reward_Font);
                        var label = new cc.LabelTTF("", "Arial", 30);
                        label.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 240);
                        var rewardValue = result["total_coin"] * thiz.allBetLevel[thiz.betLevel];
                        if (result["jc"] > 0)
                            rewardValue = result["jc"];
                        SlotWomenAgent.runActionNumber(label, rewardValue);
                        effectLayer.addChild(label);
                        // effect.setScale(0.8);
                    }

                    showTotalCoinWinAction();

                    switch (winType) {
                        case 2:
                            // cc.log("case2");
                            if (!thiz.musicSetting.getDisabled())
                                SlotWomenAgentSoundPlayer.playSound("win_medium", false);
                            effectLayer.visible = true;
                            var effect_win_rich = sp.SkeletonAnimation.createWithJsonFile('res/SlotWomenAgent/spine/win_rich.json', 'res/SlotWomenAgent/spine/win_rich.atlas');
                            effect_win_rich.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 800);
                            effectLayer.addChild(effect_win_rich);
                            effect_win_rich.setAnimation(0, "animation", false);
                            effect_win_rich.setCompleteListener(function () {
                                // effect_win_big.setScale(1);
                                chainSequence();
                            });

                            break;
                        case 3:
                        case 4:
                            // cc.log("case34");
                            if (!thiz.musicSetting.getDisabled())
                                SlotWomenAgentSoundPlayer.playSound("win_large", false);
                            effectLayer.visible = true;
                            var effect_win_big = sp.SkeletonAnimation.createWithJsonFile('res/SlotWomenAgent/spine/win_big.json', 'res/SlotWomenAgent/spine/win_big.atlas');
                            effect_win_big.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 800);
                            effectLayer.addChild(effect_win_big);
                            effect_win_big.setAnimation(0, "animation", false);
                            effect_win_big.setCompleteListener(function () {
                                // effect_win_big.setScale(1);
                                chainSequence();
                            });
                            // effect.setAnimation(0, "act_giauto", false);
                            // effect.setCompleteListener(function () {
                            //     effect.setScale(1);
                            //     chainSequence();
                            // });
                            break;
                        case 5:
                            // cc.log("case5");
                            effectLayer.visible = true;
                            if (!thiz.musicSetting.getDisabled())
                                SlotWomenAgentSoundPlayer.playSound("jackpot_xuathien", false);
                            // thiz.totalRewardLabel.setString(cc.GlobalSlotWomenAgent.FormatGold(rewardValue));
                            var effect_win_jackpot = sp.SkeletonAnimation.createWithJsonFile('res/SlotWomenAgent/spine/win_jackpot.json', 'res/SlotWomenAgent/spine/win_jackpot.atlas');
                            effect_win_jackpot.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 800);
                            effectLayer.addChild(effect_win_jackpot);
                            effect_win_jackpot.setAnimation(0, "animation", false);
                            effect_win_jackpot.setCompleteListener(function () {
                                // effect_win_big.setScale(1);
                                if (!thiz.musicSetting.getDisabled())
                                    SlotWomenAgentSoundPlayer.playSound("jackpot_ketthuc", false);
                                chainSequence();
                            });

                            // effect.setAnimation(0, "act_jackpot", false);
                            // thiz.totalRewardLabel.setString(cc.GlobalSlotWomenAgent.FormatGold(rewardValue));
                            // effect.setCompleteListener(function () {
                            //     effect.setScale(1);
                            //     chainSequence();
                            // });
                            break;
                        default:
                            chainSequence();
                            break;
                    }
                });

                thiz.runAction(showBigWinAction);

            }, 500 * (slotFrame.column - 1));
        },

        showError: function (code, msg) {
            this._super.apply(this, arguments);
            if (code === 1) {
                this.autoSpin && this.toggleAutoSpin();
            }
        },

        setBetLevel: function (betId, noRequest) {

            if (~[0, 1, 2].indexOf(betId)) {
                this.betLevel = betId;
                this.betLevelLabel.setString(cc.GlobalSlotWomenAgent.FormatGold(this.allBetLevel[betId]));
                this.totalBetLabel.setString(cc.GlobalSlotWomenAgent.FormatGold(this.allBetLevel[betId] * this.selectedLines.length));
                this._setJackPotLabel(this.jackpotValues[this.betLevel]);

                if (!noRequest)
                    this._controller.sendSetBetLevelRequest(betId);

                cc.GlobalSlotWomenAgent.SlotState.betLevel = this.betLevel;

                this.slotFrame.setBetType(betId);
            }

        },

        updateBetAmount: function (allBetLevel) {
            this.allBetLevel = allBetLevel;
            this.betLevelLabel.setString(cc.GlobalSlotWomenAgent.FormatGold(this.allBetLevel[this.betLevel]));
            this.totalBetLabel.setString(cc.GlobalSlotWomenAgent.FormatGold(this.allBetLevel[this.betLevel] * this.selectedLines.length));
        },

        updateJackpot: function (jackpotObjs) {
            for (var i = 0; i < jackpotObjs.length; i++) {
                this.jackpotValues[jackpotObjs[i]["betId"]] = jackpotObjs[i]["jackpotValue"];
            }
            if (!this.isSandboxMode)
                this._setJackPotLabel(this.jackpotValues[this.betLevel]);
        },

        updateSandboxJackpot: function (jackpotValue) {
            this._setJackPotLabel(jackpotValue);
        },

        _setJackPotLabel: function (value) {
            this.jackpotLabel.stopAllActions();
            SlotWomenAgent.runActionNumber(this.jackpotLabel, value, this._oldJackpotValue);
            this._oldJackpotValue = value;

            if (this.isSandboxMode)
                cc.GlobalSlotWomenAgent.sandboxJackpot = value;
        },

        setFreeSpinCount: function (count) {
            count = count || 0;
            this.freeSpinCount = count;
            // this.freeSpinCountLabel.setString(count);
            // this.freeSpin.setVisible(count > 0);
            this.freeSpinNode.setCount(count);
            this.freeSpinNode.visible = count > 0;
            if (this.freeSpinCount > 0 && this.slotFrame.visible)
                this.onQuayBtnClick();
        },

        setPendingPortalFreeSpinCount: function (count) {
            var thiz = this;
            cc.GlobalSlotWomenAgent.PortalFreeSpinCount = count;
            this._pendingPFS = function () {
                thiz.setPortalFreeSpinCount(count);
                thiz._pendingPFS = null;
                if (count <= 0) {
                    // show complete freespin
                    thiz.showCompleteFreeSpinDialog();
                }
            };

            if (this.state === SlotState.IDLE)
                this._pendingPFS();
        },

        setPortalFreeSpinCount: function (count) {
            this.portalFreeSpin.setCount(count);
            this.portalFreeSpin.visible = count > 0;
            this.portalFreeSpinCount = count;
            if (this.portalFreeSpinCount > 0 && this.slotFrame.visible)
                this.onQuayBtnClick();
        },

        setPendingFreeSpinCount: function (count) {
            var thiz = this;
            cc.GlobalSlotWomenAgent.FreeSpinCount = count;
            this._pendingFS = function () {
                thiz.setFreeSpinCount(count);
                thiz._pendingFS = null;
                if (count <= 0) {
                    // show complete freespin
                    thiz.showCompleteFreeSpinDialog();
                }
            }
        },

        stopRolling: function () {
            this.setState(SlotState.IDLE);
            for (var i = 0; i < this.slotFrame.column; i++) {
                this.slotFrame.setRolling(false, i);
            }
        },

        configLine: function (lines) {
            SlotWomenAgent.Lines && this.slotFrame.setWires(lines);
        },

        setTotalWin: function (value, hideEffect, jackpotValue, isRaw, skipFSReward) {
            if (!isRaw)
                value *= this.allBetLevel[this.betLevel];
            jackpotValue = jackpotValue || 0;

            cc.GlobalSlotWomenAgent.totalRewardValue = value + jackpotValue;
            if (value === 0) {
                this.totalRewardLabel.setString(cc.GlobalSlotWomenAgent.FormatGold(value));
            } else if (value > 0) {

                // free spin game
                if (!skipFSReward && cc.GlobalSlotWomenAgent.FreeSpinGame.enabled)
                    cc.GlobalSlotWomenAgent.FreeSpinGame.reward += value;

                if (hideEffect) {
                    // this.totalRewardLabel.setString(cc.GlobalSlotWomenAgent.FormatGold(value + jackpotValue));
                } else {
                    // var bg = new ccui.Scale9Sprite("slotwomenagent_total_reward_bg.png", cc.rect(160, 10, 2, 2));
                    // var bg = new cc.Sprite("#slotwomenagent_total_reward_bg.png");
                    // // bg.setPreferredSize(cc.size(828, 193));
                    // bg.setPosition(993, cc.winSize.height / 2);
                    // this.gameLayer.addChild(bg, 430);

                    var totalLabel = new cc.LabelBMFont(cc.GlobalSlotWomenAgent.FormatGold(value + jackpotValue), jackpotValue > 0 ? cc.SlotWomenAgentRes.font.RewardJackpotFont : cc.SlotWomenAgentRes.font.RewardNormalFont);
                    totalLabel.setPosition(1030, cc.winSize.height / 2);
                    this.gameLayer.addChild(totalLabel, 431);

                    // var decorator = new cc.Sprite("#slotwomenagent_total_reward_decorator.png");
                    // decorator.setPosition(986, cc.winSize.height / 2 + 42);
                    // this.gameLayer.addChild(decorator, 100);

                    var moveAction = new cc.MoveTo(0.6, this.totalRewardLabel.getPosition());
                    var scaleAction = new cc.ScaleTo(0.6, 0.1);
                    var action = new cc.Spawn(moveAction, scaleAction);
                    var clearAction = new cc.CallFunc(function () {
                        // thiz.safeRemove(bg);
                        // thiz.safeRemove(decorator);
                    });
                    var thiz = this;
                    var callFunc = new cc.CallFunc(function () {
                        thiz.safeRemove(totalLabel);
                        thiz.totalRewardLabel.setString(cc.GlobalSlotWomenAgent.FormatGold(value + jackpotValue));
                    });
                    var delayAction = new cc.DelayTime(2);

                    totalLabel.runAction(new cc.Sequence(delayAction, clearAction, action, callFunc));
                }
            }
        },

        switchToSandbox: function (coin) {
            this.isSandboxMode = true;
            this.sandboxBtn.loadTextureNormal("slotwomenagent_sandbox_off_btn.png", ccui.Widget.PLIST_TEXTURE);
            // this.sandboxText.setString("REAL PLAY");
            // this.sandboxText.setPosition(this.sandboxBtn.width / 2, this.sandboxBtn.height / 2);
            this.sandboxSprite.visible = true;
            cc.GlobalSlotWomenAgent.isSandboxMode = true;
            this.setCredit(coin);
        },

        quitSandbox: function () {
            if (!this.isSandboxMode)
                return;
            this.isSandboxMode = false; // return to normal mode
            this.sandboxBtn.loadTextureNormal("slotwomenagent_sandbox_btn.png", ccui.Widget.PLIST_TEXTURE);
            // this.sandboxText.setString("TRAIL PLAY");
            // this.sandboxText.setPosition(this.sandboxBtn.width / 2, this.sandboxBtn.height / 2);
            this.sandboxSprite.visible = false;
            cc.GlobalSlotWomenAgent.isSandboxMode = false;
            cc.GlobalSlotWomenAgent.sandboxJackpot = undefined
        },

        setSession: function (sessionId) {
            this.sessionLabel.setString(sessionId ? ("#" + sessionId) : "");
            cc.GlobalSlotWomenAgent.sessionId = sessionId;
        },

        toggleSandboxMode: function () {
            if (this.state !== SlotState.IDLE)
                return;

            if (!this.isSandboxMode)
                this._controller.sendSandboxRequest(this.betLevel);
            else {
                this._controller.sendGetBalanceRequest();
                this.quitSandbox();
                this._setJackPotLabel(this.jackpotValues[this.betLevel]); // return old jackpot
            }
        },

        toggleLinesSelect: function () {

            if (this.selectedLines.length < SlotWomenAgent.Lines.length) {
                this.setSelectedLines(this.selectedLines.concat([this.selectedLines.length + 1]));
                return;
            }
            this.setSelectedLines([1]);

        },

        setState: function (state) {
            this.state = state;
            var thiz = this;
            if (state === SlotState.IDLE) {
                if (this._pendingCredit)
                    this._pendingCredit();

                if (cc.GlobalSlotWomenAgent.pendingX2) {
                    this.setState(SlotState.SHOWING_X2);
                    cc.GlobalSlotWomenAgent.pendingX2 = undefined;
                    setTimeout(function () {
                        // thiz.showX2Game();
                    }, 2000);
                    return;
                }

                if (this._pendingBack) {
                    this._pendingBack = false;
                    SlotWomenAgent.SlotClient.getInstance().closeSocket();
                    //Hide all Minigame
                    MiniGameNavigator.hideAll();
                    SlotWomenAgentSoundPlayer.stopSound("theme_hauvuong");
                    SlotWomenAgentSoundPlayer.stopSound("spin");
                    this.autoSpin = false;
                    this.isRunningMHV = false;
                    SceneNavigator.goToHomeScene();
                    return;
                }

                if (this.freeSpinCount || this.autoSpin || this.portalFreeSpinCount) {
                    this.onQuayBtnClick();
                }
            }

            // // roll animation
            // if (state === SlotState.ROLLING)
            //     this.rollSpine.setAnimation(0, "animation", false);
            // else
            //     this.rollSpine.clearTracks();
        },

        showCompleteFreeSpinDialog: function () {
            // if (this.portalFreeSpinCount || this.freeSpinCount)
            //     return;
            // this.setState(SlotState.SHOWING_FS_RESULT);
            cc.log(cc.GlobalSlotWomenAgent.FreeSpinGame.count, cc.GlobalSlotWomenAgent.FreeSpinGame.reward);
            // var d = new CompleteFreeSpinDialog(cc.GlobalSlotWomenAgent.FreeSpinGame.count, cc.GlobalSlotWomenAgent.FreeSpinGame.reward);
            var d = new CompleteFreeSpinDialog(3, 3600);
            var thiz = this;
            d.setExitCallback(function () {
                thiz.setState(SlotState.IDLE);
            });
            this.showDialog(d);

            // reset freespin game
            cc.GlobalSlotWomenAgent.FreeSpinGame = {
                enabled: false,
                count: 0,
                reward: 0
            };
        },

        setPotentialDoubleAmount: function (amount, baseAmount) {
            cc.GlobalSlotWomenAgent.pendingX2Base = baseAmount;
            cc.GlobalSlotWomenAgent.pendingX2Value = amount;
        },

        showBonusGame: function () {
            // cc.log("SHOW BONUS GAME");
            cc.director.replaceScene(new SlotWomenAgent.BonusScene(this.betLevel, this.isSandboxMode));
            SlotWomenAgentSoundPlayer.stopSound("theme_hauvuong");
        },

        _performPendingFSAction: function () {
            if (!cc.GlobalSlotWomenAgent.pendingFSReward)
                return;

            var thiz = this;
            var effectLayer = new cc.LayerColor(cc.color(0, 0, 0, 200));
            this.gameLayer.addChild(effectLayer, 420);

            // background effect
            // var effect = sp.SkeletonAnimation.createWithJsonFile('res/SlotWomenAgent/spine/tnk_win.json', 'res/SlotWomenAgent/spine/tnk_win.atlas');
            // effect.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 200);
            // effectLayer.addChild(effect);
            // effect.setAnimation(0, "act_quaymienphi_15lan", true);

            var effect = sp.SkeletonAnimation.createWithJsonFile('res/SlotWomenAgent/spine/win_freespin.json', 'res/SlotWomenAgent/spine/win_freespin.atlas');
            effect.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 750);
            effectLayer.addChild(effect);
            effect.setSkin("qmp");

            thiz.setState(SlotState.SHOWING_REWARD);
            if (this._pendingFS)
                this._pendingFS();
            effect.setAnimation(0, "animation", false);
            var label = new cc.LabelBMFont("+" + cc.GlobalSlotWomenAgent.pendingFSReward + " SPIN", cc.SlotWomenAgentRes.font.Room_Name);
            label.setScale(2);
            label.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 350);
            effectLayer.addChild(label);
            effect.setCompleteListener(function () {
                setTimeout(function () {
                    thiz.setState(SlotState.IDLE);
                    effectLayer.removeFromParent();

                    if (thiz.autoSpin || thiz.freeSpinCount)
                        thiz.onQuayBtnClick();
                }, 0);
            });

            cc.GlobalSlotWomenAgent.pendingFSReward = undefined;
        },

        onReconnect: function () {
            if (this.isSandboxMode)
                this.toggleSandboxMode();

            // reset freespin game
            cc.GlobalSlotWomenAgent.FreeSpinGame = {
                enabled: false,
                count: 0,
                reward: 0
            };

            this.stopRolling();
            this.setBetLevel(cc.GlobalSlotWomenAgent.SlotState.betLevel || 0);
        },

        safeRemove: function (node) {
            setTimeout(function () {
                node.removeFromParent();
            }, 1);
        },

        updateUserChangeMoney: function (eventName, money) {
            if (this.creditLabel) {
                this.creditLabel.stopAllActions();
                SlotWomenAgent.runActionNumber(this.creditLabel, money, cc.GlobalSlotWomenAgent.PlayerGold);
                cc.GlobalSlotWomenAgent.PlayerGold = money;
            }
        }
    });

    SlotWomenAgent.SlotState = SlotState;
    SlotWomenAgent.SlotScene = SlotScene;
})();
