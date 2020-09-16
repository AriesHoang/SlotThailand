var SlotMaya = SlotMaya || {};

(function () {
    var BaseScene = SlotMaya.BaseScene;
    var SettingItem = SlotMaya.SettingItem;
    var FreeSpinNode = SlotMaya.FreeSpinNode;
    var HistoryDialog = SlotMaya.HistoryDialog;
    var RankingDialog = SlotMaya.RankingDialog;
    var CompleteFreeSpinDialog = SlotMaya.CompleteFreeSpinDialog;
    var SelectLineDialog = SlotMaya.SelectLineDialog;
    var RewardDialog = SlotMaya.RewardDialog;

    var SlotState = SlotState || {};
    SlotState.IDLE = 0;
    SlotState.ROLLING = 1;
    SlotState.SHOWING_REWARD = 2;
    SlotState.SHOWING_FS_RESULT = 3;

    var SlotScene = BaseScene.extend({
        ctor: function (row, column) {
            row = row || 3;
            column = column || 5;
            this._super.apply(this, arguments);
            this.state = SlotState.IDLE;
            this.autoSpin = false;
            this._isWaitingResult = false;
            this.allBetLevel = [1000, 10000, 100000];
            this.betLevel = 0;
            this.freeSpinCount = 0;
            this.jackpotValues = [0, 0, 0];
            this.isSandboxMode = false;
            this.betID = 0;

            var gameLayer = new cc.Node();
            this.addChild(gameLayer);
            this.gameLayer = gameLayer;

            var thiz = this;

            this.dialogLayer.hideDialogCallback = function () {
                this.visible = false;
                gameLayer.visible = true;
                thiz.slotFrame.setSymbolVisible(true);
                this.currentDialog = null;
                thiz.sandboxSprite.visible = thiz.isSandboxMode;
                thiz.toogleCharacter(true, thiz.betId);
            };

            this.dialogLayer.setOpacity(0);

            this.initBackground();

            var slotFrame = new SlotMaya.WiredSlotFrame(row, column);
            SlotMaya.Lines && slotFrame.setWires(SlotMaya.Lines);
            this.slotFrame = slotFrame;
            slotFrame.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 35);
            this.gameLayer.addChild(slotFrame);
            if (cc.GlobalSlotMaya.lastResult)
                slotFrame.setResult(cc.GlobalSlotMaya.lastResult);

            // var logo_quyThuong = new cc.Sprite("#slotkhaihoi_quythuong.png");
            // logo_quyThuong.setPosition(cc.winSize.width / 2 - 20, cc.winSize.height - 40);
            // this.gameLayer.addChild(logo_quyThuong, 3);

            this.initCharacter();
            this.initGUI();
            this.initButton();

            var defaultLines = [];
            for (var i = 0; i < 20; i++)
                defaultLines.push(i + 1);

            this.isRunningKhaiHoi = true;

            this.setSelectedLines(cc.GlobalSlotMaya.SlotState.lines || defaultLines);
            this.setFreeSpinCount(0);
            thiz.setBetLevel(cc.GlobalSlotMaya.SlotState.betLevel || 0,
                isNaN(cc.GlobalSlotMaya.SlotState.betLevel) || cc.GlobalSlotMaya.isSandboxMode);
            this.setTotalWin(cc.GlobalSlotMaya.totalRewardValue || 0, true, null, true, true);
            this.setCredit(cc.GlobalSlotMaya.PlayerGold);

            // this.initCheatLayer();

            this._performPendingFSAction();
            this.setSession(cc.GlobalSlotMaya.sessionId);
            if (cc.GlobalSlotMaya.FreeSpinCount)
                this.setFreeSpinCount(cc.GlobalSlotMaya.FreeSpinCount);
            if (cc.GlobalSlotMaya.PortalFreeSpinCount)
                this.setPortalFreeSpinCount(cc.GlobalSlotMaya.PortalFreeSpinCount);
            else if (cc.GlobalSlotMaya.FreeSpinGame.enabled && cc.GlobalSlotMaya.FreeSpinCount === 0)
                this.showCompleteFreeSpinDialog();

            if (cc.GlobalSlotMaya.AutoSpin)
                this.toggleAutoSpin();

            if (cc.GlobalSlotMaya.isSandboxMode) {
                this.switchToSandbox(cc.GlobalSlotMaya.PlayerSandboxGold);
                //this._setJackPotLabel(cc.GlobalSlotMaya.sandboxJackpot);
            }
            //Update tiền khi chơi minigame
            GlobalEvent.getInstance().addListener("onUpdateUserChangeMoney", this.updateUserChangeMoney, this);

            SlotMayaFloatButton.getInstance().show(this);
            //Hide all minigame
            MiniGameNavigator.hideAll();
            // SlotMayaMiniGameNavigator.hideAll();

            SlotMayaSoundPlayer.playSound("theme_khaihoi", true);

            // this.testShowLine();

            // track
            // if (cc.sys.isNative === cc.sys.ANDROID) {
            //     jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "logEventFirebase", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "add_payment_info", "Chơi game Candy", "Chơi game Candy");
            // }
            // else if (cc.sys.os === cc.sys.OS_IOS)
            //     jsb.reflection.callStaticMethod("AppController", "logEventWithName:withName:withText:", "add_payment_info", "Chơi game Candy", "Chơi game Candy");
        },

        testShowLine: function () {
            // for (var i = 1; i < 2; i++) {
            // var wireNode = new cc.Sprite("res/SlotMaya/payline/payline_19.png");
            // wireNode.setPosition(-80, -35);
            // wireNode.setPosition(-85, 155);
            // wireNode.setPosition(-70, -295);
            // wireNode.setPosition(-80, 20);
            // wireNode.setPosition(-85, -125);
            // wireNode.setPosition(-85, 85);
            // wireNode.setPosition(-80, -175);
            // wireNode.setPosition(-55, -60);
            // wireNode.setPosition(-85, -110);
            // wireNode.setPosition(-45, -65);
            // wireNode.setPosition(85, -75);
            // wireNode.setPosition(85, -60);
            // wireNode.setPosition(85, -60);
            // wireNode.setPosition(80, -60);
            // wireNode.setPosition(30, -150);
            // wireNode.setPosition(80, 85);
            // wireNode.setPosition(85, -160);
            // wireNode.setPosition(85, -10);
            // wireNode.setPosition(80, -60);
            // wireNode.setPosition(90, -105);

            // this.slotFrame.addChild(wireNode, 100);
            // }
        },

        initCheatLayer: function () {
            var bg = new cc.LayerColor(cc.color(0, 0, 0, 255), 440, 90);
            bg.setPosition(371, 915);
            this.addChild(bg);

            var cheatTF = new ccui.TextField("result", "Arial", 60);
            cheatTF.setAnchorPoint(cc.p(0, 0));
            cheatTF.setTouchSize(cc.size(440, 90));
            cheatTF.setTextAreaSize(cc.size(440, 90));
            cheatTF.setPosition(bg.getPosition());
            this.addChild(cheatTF);
            this.cheatTF = cheatTF;
        },

        initBackground: function () {
            //background
            var background = new cc.Sprite("res/SlotMaya/main_background.png");
            cc.GlobalSlotMaya.scaleBackground(background);
            background.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.addChild(background, -1);
        },

        showDialog: function (dialog, keepGame) {
            var res = this._super.apply(this, arguments);
            dialog.setPosition(this.slotFrame.getPosition());
            this.slotFrame.setSymbolVisible((!res) || (keepGame === true));
            this.sandboxSprite.visible = false;
            this.toogleCharacter(false, this.betId);
            return res;
        },

        initGUI: function () {

            var jackpotLabel = new cc.LabelBMFont("0", cc.SlotMayaRes.font.Jackpot_Font);
            // jackpotLabel.setScale(0.8);
            jackpotLabel.setPosition(cc.winSize.width / 2 - 20, cc.winSize.height - 200);
            this.gameLayer.addChild(jackpotLabel);
            this.jackpotLabel = jackpotLabel;

            var settingPanel = new ccui.Scale9Sprite("slotmaya_setting_panel.png", cc.rect(10, 10, 2, 2));
            settingPanel.setPreferredSize(cc.size(75, 170));
            settingPanel.setAnchorPoint(cc.p(0.5, 0.5));
            settingPanel.setPosition(1755, cc.winSize.height - 230);
            settingPanel.visible = false;
            this.settingPanel = settingPanel;
            this.gameLayer.addChild(settingPanel, 3);

            var soundSetting = new SettingItem("slotmaya_setting_sound.png", 1);
            soundSetting.setPosition(38, 85);
            this.soundSetting = soundSetting;
            settingPanel.addChild(soundSetting);

            var musicSetting = new SettingItem("slotmaya_setting_music.png", 2);
            musicSetting.setPosition(soundSetting.x, soundSetting.y - 50);
            this.musicSetting = musicSetting;
            settingPanel.addChild(musicSetting);


            // var creditBg = new cc.Sprite("#slotkhaihoi_bg_credit.png");
            var creditBg = new cc.Sprite("#slotmaya_free_spin_bar.png");
            creditBg.setPosition(416, cc.winSize.height - 85);
            this.gameLayer.addChild(creditBg);

            var creditLabel = new cc.LabelBMFont("0", cc.SlotMayaRes.font.Session_Font);
            creditLabel.setPosition(creditBg.x, creditBg.y + 10);
            // creditLabel.setColor(cc.color("#000000"));
            this.gameLayer.addChild(creditLabel);
            this.creditLabel = creditLabel;

            var selectLineBtn = new ccui.Button("slotmaya_btn_dong.png", "", "", ccui.Widget.PLIST_TEXTURE);
            selectLineBtn.setPosition(291, 74);
            this.gameLayer.addChild(selectLineBtn);

            var btn_cuoc = new ccui.Button("slotmaya_btn_cuoc.png", "", "", ccui.Widget.PLIST_TEXTURE);
            btn_cuoc.setPosition(580, 74);
            this.gameLayer.addChild(btn_cuoc);

            //Add some new button
            var btn_tongdat = new cc.Sprite("#slotmaya_btn_tongdat.png");
            btn_tongdat.setPosition(880, 74);
            this.gameLayer.addChild(btn_tongdat);

            var btn_tongthang = new cc.Sprite("#slotmaya_btn_thang.png");
            btn_tongthang.setPosition(1200, 74);
            this.gameLayer.addChild(btn_tongthang);

            var lineLabel = new cc.LabelBMFont("20", cc.SlotMayaRes.font.Gentona_Number);
            lineLabel.setPosition(286, 85);
            this.gameLayer.addChild(lineLabel);
            this.lineLabel = lineLabel;

            var betLevelLabel = new cc.LabelBMFont("0", cc.SlotMayaRes.font.Gentona_Number);
            betLevelLabel.setPosition(580, lineLabel.y);
            this.gameLayer.addChild(betLevelLabel);
            this.betLevelLabel = betLevelLabel;

            var totalBetLabel = new cc.LabelBMFont("0", cc.SlotMayaRes.font.Gentona_Number);
            totalBetLabel.setPosition(880, lineLabel.y);
            this.gameLayer.addChild(totalBetLabel);
            this.totalBetLabel = totalBetLabel;

            var totalRewardLabel = new cc.LabelBMFont("0", cc.SlotMayaRes.font.Gentona_Number);
            totalRewardLabel.setPosition(1195, lineLabel.y);
            this.gameLayer.addChild(totalRewardLabel);
            this.totalRewardLabel = totalRewardLabel;

            var freeSpin = new cc.Sprite("#slotmaya_free_spin.png");
            freeSpin.setPosition(1888, cc.winSize.height / 2 - 217);
            freeSpin.visible = false;
            this.freeSpin = freeSpin;
            this.gameLayer.addChild(freeSpin, 2);

            var freeSpinNode = new FreeSpinNode();
            freeSpinNode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 410);
            this.gameLayer.addChild(freeSpinNode, 3);

            this.freeSpinNode = freeSpinNode;

            var freeSpinCountLabel = new cc.LabelBMFont("0", cc.SlotMayaRes.font.UVN_ThangVu);
            freeSpinCountLabel.setPosition(freeSpin.width / 2 + 4, freeSpin.height / 2 + 7);
            freeSpin.addChild(freeSpinCountLabel);
            this.freeSpinCountLabel = freeSpinCountLabel;

            // var sessionBg = new cc.Sprite("#slotkhaihoi_bg_session.png");
            var sessionBg = new cc.Sprite("#slotmaya_free_spin_bar.png");
            sessionBg.setPosition(cc.winSize.width - 433, cc.winSize.height - 94);
            this.gameLayer.addChild(sessionBg);

            var sessionLabel = new cc.LabelBMFont("#00000000000", cc.SlotMayaRes.font.Session_Font);
            sessionLabel.setPosition(sessionBg.x, sessionBg.y + 10);
            this.gameLayer.addChild(sessionLabel);
            this.sessionLabel = sessionLabel;

            var thiz = this;

            selectLineBtn.addClickEventListener(function () {
                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("button_click", false);
                if (!thiz.autoSpin) {
                    var d = new SelectLineDialog(thiz.selectedLines, thiz);
                    thiz.showDialog(d);
                } else {
                    thiz.showError(0, MultiLanguage.getTextByKey("AUTO_ROLL_CANT_USE"));
                }
            });

            btn_cuoc.addClickEventListener(function () {
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
                    SlotMayaSoundPlayer.playSound("button_click", false);
            });

            var sandboxSprite = new cc.Sprite("#slotmaya_sanbox_btn.png");
            sandboxSprite.setPosition(1022, 870);
            sandboxSprite.setVisible(false);
            this.gameLayer.addChild(sandboxSprite, 5);
            this.sandboxSprite = sandboxSprite;

            var goldenTimeSprite = new cc.Sprite("#slotmaya_golden_time.png");
            goldenTimeSprite.setPosition(1900, cc.winSize.height / 2 - 46);
            this.gameLayer.addChild(goldenTimeSprite);
            goldenTimeSprite.visible = false;
            this.goldenTimeSprite = goldenTimeSprite;

            var goldenTimeXLabel = new cc.LabelBMFont("X1", cc.SlotMayaRes.font.UVN_DUNGDAN_GOLDENTIME);
            goldenTimeXLabel.setPosition(goldenTimeSprite.width / 2, 140);
            goldenTimeXLabel.setScale(0.8);
            goldenTimeSprite.addChild(goldenTimeXLabel);
            this.goldenTimeXLabel = goldenTimeXLabel;

            var goldenTimeLabel = new cc.LabelBMFont("00:00:00", cc.SlotMayaRes.font.SVN_GENICA_GOLDENTIME);
            goldenTimeLabel.setScale(0.7);
            goldenTimeLabel.setPosition(goldenTimeSprite.width / 2, 90);
            goldenTimeSprite.addChild(goldenTimeLabel);
            this.goldenTimeLabel = goldenTimeLabel;

            var portalFreeSpin = new cc.Sprite("#slotmaya_free_spin.png");
            portalFreeSpin.setPosition(1888, cc.winSize.height / 2 - 217);
            this.gameLayer.addChild(portalFreeSpin);
            portalFreeSpin.visible = false;
            this.portalFreeSpin = portalFreeSpin;

            var portalFSCount = new cc.LabelBMFont("0", cc.SlotMayaRes.font.Gentona_Number);
            portalFSCount.setPosition(130, 90);
            portalFreeSpin.addChild(portalFSCount);

            portalFreeSpin.setCount = function (count) {
                portalFSCount.setString(count + "");
            };
        },

        initController: function () {
            this._controller = new SlotMaya.SlotController(this);
        },

        updateGoldenTime: function (data) {
            this.enabledGoldenTime = data.enabled;
            if (this.isSandboxMode) return;
            if (!data.enabled) {
                this.goldenTimeSprite.stopAllActions();
                this.goldenTimeSprite.visible = false;
                return;
            }

            if (data.remainingTime <= 0) {
                this.goldenTimeSprite.stopAllActions();
                this.goldenTimeSprite.visible = false;
                return;
            }

            this.goldenTimeSprite.visible = true;
            this.goldenTimeSprite.setSpriteFrame("slotmaya_golden_time.png");
            var remainingTime = data.remainingTime;
            var hours = Math.floor(remainingTime / 3600);
            hours = hours < 10 ? ("0" + hours) : hours;
            var minutes = Math.floor((remainingTime % 3600) / 60);
            minutes = minutes < 10 ? ("0" + minutes) : minutes;
            var seconds = remainingTime % 60;
            seconds = seconds < 10 ? ("0" + seconds) : seconds;

            this.goldenTimeXLabel.setString("X" + data.multiplier);
            this.goldenTimeLabel.setString(hours + ":" + minutes + ":" + seconds);

            var thiz = this;
            var delay = new cc.DelayTime(1);
            var func = new cc.CallFunc(function () {
                data.remainingTime = data.remainingTime - 1;
                thiz.updateGoldenTime(data);
            });
            this.goldenTimeSprite.stopAllActions();
            this.goldenTimeSprite.runAction(new cc.Sequence(delay, func));
        },

        initButton: function () {
            var homeBtn = new ccui.Button("slotmaya_home_btn.png", "", "", ccui.Widget.PLIST_TEXTURE);
            homeBtn.setPosition(100, cc.winSize.height - 100);
            this.gameLayer.addChild(homeBtn);

            var sandboxBtn = new ccui.Button("slotmaya_sanbox_btn.png", "", "", ccui.Widget.PLIST_TEXTURE);
            sandboxBtn.setPosition(420, cc.winSize.height - 170);
            this.sandboxBtn = sandboxBtn;
            this.gameLayer.addChild(sandboxBtn);

            var casualBtn = new ccui.Button("slotmaya_casual_mark.png", "", "", ccui.Widget.PLIST_TEXTURE);
            casualBtn.setPosition(78, 78);
            // casualBtn.setPosition(cc.winSize.width - 100, homeBtn.y);
            this.gameLayer.addChild(casualBtn);

            var autoRollBtn = new ccui.Button("slotmaya_auto_roll_btn_inactive.png", "", "", ccui.Widget.PLIST_TEXTURE);
            autoRollBtn.setPosition(1535, 72);
            this.gameLayer.addChild(autoRollBtn);
            this.autoRollBtn = autoRollBtn;

            var rollBtn = new ccui.Button("slotmaya_roll_btn.png", "", "", ccui.Widget.PLIST_TEXTURE);
            rollBtn.setPosition(1867, 114);
            // rollBtn.setScale(0.9);
            rollBtn.setZoomScale(0);
            this.gameLayer.addChild(rollBtn);

            // // var rollSpine = sp.SkeletonAnimation.createWithJsonFile("res/SlotMaya/spine/spine.json", "res/SlotMaya/spine/spine.atlas");
            // var rollSpine = new sp.SkeletonAnimation("res/SlotMaya/spine/spine.json", "res/SlotMaya/spine/spine.atlas");
            // rollSpine.setPosition(rollBtn.x + 4, rollBtn.y - 150);
            // rollSpine.setSkin("2");
            // // rollSpine.setScale(0.9);
            // rollSpine.setCompleteListener(function () {
            //     if (thiz.state === SlotState.ROLLING) {
            //         rollSpine.setAnimation(0, "animation", false);
            //         // rollBtn.visible = true;
            //     }
            // });
            // this.gameLayer.addChild(rollSpine);
            // this.rollSpine = rollSpine;

            var infoBtn = new ccui.Button("slotmaya_info_btn.png", "slotmaya_info_btn.png", "", ccui.Widget.PLIST_TEXTURE);
            infoBtn.setPosition(cc.winSize.width - 575, cc.winSize.height - 165);
            this.gameLayer.addChild(infoBtn);

            var rankingBtn = new ccui.Button("slotmaya_ranking_btn.png", "slotmaya_ranking_btn.png", "", ccui.Widget.PLIST_TEXTURE);
            rankingBtn.setPosition(infoBtn.x + 141, infoBtn.y);
            this.gameLayer.addChild(rankingBtn);

            var settingBtn = new ccui.Button("slotmaya_setting_btn.png", "slotmaya_setting_btn.png", "", ccui.Widget.PLIST_TEXTURE);
            settingBtn.setPosition(rankingBtn.x + 141, rankingBtn.y);
            this.gameLayer.addChild(settingBtn, 4);

            var thiz = this;
            rollBtn.addClickEventListener(function () {
                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("button_click", false);
                thiz.onQuayBtnClick();
                // rollBtn.visible = false;
            });

            homeBtn.addClickEventListener(function () {
                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("button_click", false);
                if (thiz.state !== SlotState.IDLE) {
                    thiz._pendingBack = true;
                    return;
                }
                // break wire line effect
                thiz.setState(SlotState.IDLE);
                thiz.slotFrame.hideWireAndSymbolEffect();

                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("button_click", false);
                SlotMaya.SlotClient.getInstance().closeSocket();
                MiniGameNavigator.hideAll();
                SlotMayaSoundPlayer.stopSound("theme_khaihoi");
                SlotMayaSoundPlayer.stopSound("spin");
                thiz.autoSpin = false;
                thiz.isRunningKhaiHoi = false;
                SceneNavigator.goToHomeScene();
                thiz.gameLayer.visible = false;
            });

            autoRollBtn.addClickEventListener(function () {
                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("button_click", false);
                if (!thiz.isSandboxMode)
                    thiz.toggleAutoSpin();
                else
                    thiz.showError(1, MultiLanguage.getTextByKey("AUTO_ROLL_CANT_USE"));
            });

            casualBtn.addClickEventListener(function () {
                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("button_click", false);
                thiz.showDialog(new RewardDialog(thiz.betLevel));
            });

            rankingBtn.addClickEventListener(function () {
                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("button_click", false);
                thiz.showDialog(new RankingDialog());
            });

            infoBtn.addClickEventListener(function () {
                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("button_click", false);
                var d = new HistoryDialog();
                thiz.showDialog(d);
            });

            settingBtn.addClickEventListener(function () {
                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("button_click", false);
                thiz.settingPanel.visible = !thiz.settingPanel.visible;
            });

            sandboxBtn.addClickEventListener(function () {
                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("button_click", false);
                thiz.toggleSandboxMode();
            });
        },

        initCharacter: function () {
            // var sa = sp.SkeletonAnimation.createWithJsonFile("res/SlotMaya/spine/liondance_boy.json", "res/SlotMaya/spine/liondance_boy.atlas");
            // sa.setScale(0.85);
            // sa.setPosition(cc.p(175, 100));
            // sa.setSkin("default");
            // sa.setAnimation(0, "animation", true);
            // this.gameLayer.addChild(sa);
            var effectLine = new cc.Sprite("res/SlotMaya/slotmaya_statude_effect.png");
            effectLine.setScale(0.8);
            effectLine.setPosition(190, 480);
            this.gameLayer.addChild(effectLine);
            effectLine.runAction(cc.sequence(cc.fadeOut(1), cc.delayTime(0.6), cc.fadeIn(1)).repeatForever());

            var buc = new cc.Sprite("res/SlotMaya/slotmaya_statude_buc.png");
            buc.setPosition(175, 250);
            this.gameLayer.addChild(buc);

            var statude = new cc.Sprite("res/SlotMaya/slotmaya_statude.png");
            statude.setScale(0.8);
            statude.setPosition(160, 500);
            statude.runAction(cc.sequence(cc.moveTo(1, cc.p(160, 490), 490), cc.delayTime(0.3), cc.moveTo(1, cc.p(160, 500), 500)).repeatForever());
            this.gameLayer.addChild(statude);

        },

        toggleAutoSpin: function () {
            this.autoSpin = !this.autoSpin;
            this.autoRollBtn.loadTextureNormal(this.autoSpin ? "slotmaya_auto_roll_btn.png" : "slotmaya_auto_roll_btn_inactive.png",
                ccui.Widget.PLIST_TEXTURE);
            if (this.autoSpin && this.state === SlotState.IDLE)
                this.onQuayBtnClick();

            cc.GlobalSlotMaya.AutoSpin = this.autoSpin;
        },

        setCredit: function (value, isSandbox) {
            isSandbox = !!isSandbox;
            this.isSandboxMode = !!this.isSandboxMode;
            if (isNaN(value) || (this.isSandboxMode !== isSandbox))
                return;
            var thiz = this;
            this._pendingCredit = function () {
                this.creditLabel.stopAllActions();
                SlotMaya.runActionNumber(this.creditLabel, value, 1);

                if (thiz.isSandboxMode) {
                    cc.GlobalSlotMaya.PlayerSandboxGold = value;
                }

                thiz._pendingCredit = null;
            };

            if (this.state === SlotState.IDLE)
                this._pendingCredit();
        },

        setCreditAfterRoll: function (value, isSandbox) {
            isSandbox = !!isSandbox;
            this.isSandboxMode = !!this.isSandboxMode;
            if (isNaN(value) || (this.isSandboxMode !== isSandbox))
                return;
            cc.GlobalSlotMaya.PlayerGold = value;
            this.creditLabel.stopAllActions();
            SlotMaya.runActionNumber(this.creditLabel, cc.GlobalSlotMaya.PlayerGold, 1);
        },

        setSelectedLines: function (selectedLines) {
            if (selectedLines instanceof Array && selectedLines.length > 0) {
                this.selectedLines = selectedLines;
                this.lineLabel.setString(selectedLines.length);
                this.totalBetLabel.setString(cc.GlobalSlotMaya.FormatGold(
                    this.allBetLevel[this.betLevel] * this.selectedLines.length));

                cc.GlobalSlotMaya.SlotState.lines = this.selectedLines;
            }
        },

        onQuayBtnClick: function (cheatType) {
            if (!this.isRunningKhaiHoi) return;
            if (this.state !== SlotState.IDLE)
                return;

            // break wire line effect
            this.slotFrame.hideWireAndSymbolEffect();

            //start rolling
            this.setState(SlotState.ROLLING);
            if (!this.musicSetting.getDisabled())
                SlotMayaSoundPlayer.playSound("spin", false);

            if (this.portalFreeSpinCount) {
                this.setPortalFreeSpinCount(this.portalFreeSpinCount - 1);
                this.portalFreeSpin.visible = true;
                cc.GlobalSlotMaya.FreeSpinGame.enabled = true;
                cc.GlobalSlotMaya.FreeSpinGame.count++;
            } else if (this.freeSpinCount) {
                this.setFreeSpinCount(this.freeSpinCount - 1);
                this.freeSpinNode.visible = true;
                cc.GlobalSlotMaya.FreeSpinGame.enabled = true;
                cc.GlobalSlotMaya.FreeSpinGame.count++;
            }

            this.setTotalWin(0);
            var thiz = this;
            for (var i = 0; i < this.slotFrame.column; i++) {
                setTimeout(function (index) {
                    if (thiz.state === SlotState.ROLLING) {
                        thiz.slotFrame.setRolling(true, index);
                    }
                }, i * 200, i);
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
            // fn(this.betLevel, this.selectedLines, this.cheatTF.getString());
            fn(this.betLevel, this.selectedLines, "");
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
            }
        },

        rewardCallback: function (totalResult, result) {
            cc.log("rewardCallBack");
            var thiz = this;
            var showTotalCoinWinAction = new cc.CallFunc(function () {
                var hideEffect = [2, 3, 4].indexOf(result["wt"]) !== -1; // skip effect if winType = 2,3,4
                // var jackpotValue = 0;
                // if (result["wt"] === 5)
                //     jackpotValue += result["jc"];
                // thiz.setTotalWin(totalResult["total_coin"], hideEffect, jackpotValue);
            });
            var delay1 = new cc.DelayTime(totalResult["total_coin"] ? 3 : 0);

            var effect_win = sp.SkeletonAnimation.createWithJsonFile('res/SlotMaya/spine/liondance_win.json', 'res/SlotMaya/spine/liondance_win.atlas');

            effect_win.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 200);

            var effect_win_layer = new cc.LayerColor(cc.color(0, 0, 0, 200));
            effect_win_layer.visible = false;

            thiz.addChild(effect_win_layer, 420);
            effect_win_layer.addChild(effect_win);


            var showBonusAction = new cc.CallFunc(function () {
                cc.log("SHOW BONUS WIN EFFECT");
                // if (!thiz.musicSetting.getDisabled())
                //     SlotMayaSoundPlayer.playSound("bonus", false);
                thiz.hideAllDialog();
                effect_win_layer.visible = true;
                effect_win.setSkin("Bonus");
                effect_win.setAnimation(0, "animation", false);
                effect_win.setCompleteListener(function () {
                    setTimeout(function () {
                        effect_win_layer.removeFromParent();
                        thiz.showBonusGame();
                    }, 0);
                });
                showBonusAction.release();
            });

            showBonusAction.retain();

            var showFreeSpinAction = new cc.CallFunc(function () {
                if (!thiz.musicSetting.getDisabled())
                    SlotMayaSoundPlayer.playSound("win_freespin", false);
                showFreeSpinAction.release();
                thiz.setState(SlotState.SHOWING_REWARD);
                if (thiz._pendingFS)
                    thiz._pendingFS();
                if (thiz._pendingPFS)
                    thiz._pendingPFS();
                effect_win_layer.visible = true;
                effect_win.setSkin("qmp");
                effect_win.setAnimation(0, "animation", false);
                cc.log(totalResult["free_spin"]);
                var label = new cc.LabelBMFont(totalResult["free_spin"] + " TURN", cc.SlotMayaRes.font.UVN_ThangVu);
                label.setScale(2);
                label.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 210);
                effect_win_layer.addChild(label);
                effect_win.setCompleteListener(function () {
                    setTimeout(function () {
                        label.removeFromParent();
                        thiz.setState(SlotState.IDLE);
                        effect_win_layer.removeFromParent();

                        if (thiz.autoSpin || thiz.freeSpinCount)
                            thiz.onQuayBtnClick();
                    }, 0);
                });
            });
            showFreeSpinAction.retain();

            var finishAction = new cc.CallFunc(function () {
                thiz.safeRemove(effect_win_layer);

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

            var afterAction = new cc.CallFunc(function () {
                var chainSequence = function () {
                    var chainAction = null;
                    cc.log(JSON.stringify(totalResult));
                    if (totalResult["free_spin"] && totalResult["bonus"]) {
                        chainAction = showBonusAction;
                        showFreeSpinAction.release();
                        cc.GlobalSlotMaya.pendingFSReward = totalResult["free_spin"];
                    } else if (totalResult["free_spin"]) {
                        chainAction = showFreeSpinAction;
                        showBonusAction.release();
                    }
                    else if (totalResult["bonus"]) {
                        chainAction = showBonusAction;
                        showFreeSpinAction.release();
                    } else {
                        chainAction = finishAction;
                        showFreeSpinAction.release();
                        showBonusAction.release();
                    }
                    thiz.runAction(chainAction);
                };
                chainSequence();
            });

            var sequence = [showTotalCoinWinAction, delay1, afterAction];
            thiz.runAction(new cc.Sequence(sequence));
        },

        onRollResult: function (result) {
            //stop rolling
            var slotFrame = this.slotFrame;
            slotFrame.setResult(result["1"]);
            cc.GlobalSlotMaya.lastResult = result["1"];
            for (var i = 0; i < this.slotFrame.column; i++) {
                setTimeout(function (index) {
                    slotFrame.setRolling(false, index);
                }, i * 500, i);
            }
            var thiz = this;

            setTimeout(function () {
                thiz.setState(SlotState.SHOWING_REWARD);
                var effect_win = new sp.SkeletonAnimation('res/SlotMaya/spine/liondance_win.json', 'res/SlotMaya/spine/liondance_win.atlas');

                effect_win.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 200);

                var effect_win_layer = new cc.Layer();
                effect_win_layer.visible = false;

                thiz.addChild(effect_win_layer, 420);
                effect_win_layer.addChild(effect_win);


                //Show Toltal Win
                var showTotalCoinWinAction = function () {
                    var jackpotValue = 0;
                    // if (result["wt"] === 5)
                    //     jackpotValue += result["jc"];
                    thiz.setTotalWin(result["total_coin"], false, jackpotValue);
                };

                var chainSequence = function () {
                    thiz.safeRemove(effect_win_layer);
                    var totalWin = 0;
                    // slotFrame.showReward(true, result["2"], function (shownLine) {
                    slotFrame.showReward(false, result["2"], function (shownLine) {
                        if (shownLine.type === 2) {
                            // if (!thiz.musicSetting.getDisabled())
                            //     SlotMayaSoundPlayer.playSound("smallWin", false);
                            totalWin += shownLine.amount;
                            thiz.setTotalWin(totalWin, true, null, null, true);
                        }
                    }, function (totalResult) {
                        thiz.rewardCallback(totalResult, result);
                    }, result);

                    if (!result["free_spin"]
                        && !result["bonus"]
                        && result["wt"] !== 5
                        && !thiz.autoSpin
                        && (thiz.portalFreeSpinCount === 0 || thiz.portalFreeSpinCount === undefined)
                        && (thiz.freeSpinCount === 0 || thiz.freeSpinCount === undefined)
                        && (cc.GlobalSlotMaya.FreeSpinGame.count === 0 || cc.GlobalSlotMaya.FreeSpinGame.count === undefined)) {
                        // cc.log("------ free_spin ------: " + result["free_spin"]
                        //     + "\n ------ bonus ------: " + result["bonus"]
                        //     + "\n ------ portalFreeSpinCount ------: " + thiz.portalFreeSpinCount
                        //     + "\n ------ freeSpinCount ------: " + thiz.freeSpinCount
                        //     + "\n ------ Global freeSpinCount------: " + cc.GlobalSlotMaya.FreeSpinGame.count);
                        thiz.setState(SlotState.IDLE);
                    }
                };

                var showBigWinAction = new cc.CallFunc(function () {
                    var winType = result["wt"];
                    if ([2, 3, 4, 5].indexOf(winType) !== -1) {
                        var label = new cc.LabelBMFont("", cc.SlotMayaRes.font.Total_Reward_Font);
                        label.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 310);

                        var rewardValue;
                        if (result["jc"] > 0)
                            rewardValue = result["jc"];
                        else
                            rewardValue = result["total_coin"] * thiz.allBetLevel[thiz.betLevel];

                        effect_win_layer.addChild(label);

                        // label.stopAllActions();
                        // SlotMaya.runActionNumber(label, rewardValue, 1);

                        // label.setString(cc.GlobalSlotMaya.FormatGold(rewardValue));
                        // effect_win_layer.setScale(0.8);
                    }

                    // if ([2, 3, 4, 5].indexOf(winType) === -1)
                    showTotalCoinWinAction();

                    // if (result["wt"] !== 5)
                    //     showTotalCoinWinAction();

                    switch (winType) {
                        case 2:
                            // cc.log("case2");
                            // if (!thiz.musicSetting.getDisabled())
                            //     SlotMayaSoundPlayer.playSound("mediumWin", false);
                            effect_win_layer.visible = true;
                            effect_win.setSkin("ThangLon");
                            effect_win.setAnimation(0, "animation", false);
                            effect_win.setCompleteListener(function () {
                                chainSequence();
                            });
                            break;
                        case 3:
                        case 4:
                            // cc.log("case34");
                            // if (!thiz.musicSetting.getDisabled())
                            //     SlotMayaSoundPlayer.playSound("largeWin", false);
                            effect_win_layer.visible = true;
                            effect_win.setSkin("giauto");
                            effect_win.setAnimation(0, "animation", false);
                            effect_win.setCompleteListener(function () {
                                chainSequence();
                            });
                            break;
                        case 5:
                            // cc.log("case5");
                            // if (!thiz.musicSetting.getDisabled())
                            //     SlotMayaSoundPlayer.playSound("jackpot", false);
                            effect_win_layer.visible = true;
                            effect_win.setSkin("nohu");
                            effect_win.setAnimation(0, "animation", false);
                            thiz.totalRewardLabel.setString(cc.GlobalSlotMaya.FormatGold(result["jc"]));
                            effect_win.setCompleteListener(function () {
                                chainSequence();
                            });
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
                this.betLevelLabel.setString(cc.GlobalSlotMaya.FormatGold(this.allBetLevel[betId]));
                this.totalBetLabel.setString(cc.GlobalSlotMaya.FormatGold(this.allBetLevel[betId] * this.selectedLines.length));
                this._setJackPotLabel(this.jackpotValues[this.betLevel]);

                if (!noRequest)
                    this._controller.sendSetBetLevelRequest(betId);

                cc.GlobalSlotMaya.SlotState.betLevel = this.betLevel;
                this.slotFrame.setBetType(betId);
            }
        },

        updateBetAmount: function (allBetLevel) {
            this.allBetLevel = allBetLevel;
            this.betLevelLabel.setString(cc.GlobalSlotMaya.FormatGold(this.allBetLevel[this.betLevel]));
            this.totalBetLabel.setString(cc.GlobalSlotMaya.FormatGold(this.allBetLevel[this.betLevel] * this.selectedLines.length));
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
            SlotMaya.runActionNumber(this.jackpotLabel, value);

            if (this.isSandboxMode)
                cc.GlobalSlotMaya.sandboxJackpot = value;
        },

        setFreeSpinCount: function (count) {
            count = count || 0;
            this.freeSpinCount = count;
            // this.freeSpinCountLabel.setString(count);
            // this.freeSpin.setVisible(count > 0);
            this.freeSpinNode.setCount(count);
            this.freeSpinNode.visible = count > 0;
            if (this.freeSpinCount > 0 && this.slotFrame.getSymbolVisible())
                this.onQuayBtnClick();
        },

        setPendingPortalFreeSpinCount: function (count) {
            var thiz = this;
            cc.GlobalSlotMaya.PortalFreeSpinCount = count;
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
            // this.portalFreeSpin.visible = true;
            this.portalFreeSpinCount = count;
            if (this.portalFreeSpinCount > 0 && this.slotFrame.visible)
                this.onQuayBtnClick();
        },

        setPendingFreeSpinCount: function (count) {
            var thiz = this;
            cc.GlobalSlotMaya.FreeSpinCount = count;
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
            SlotMaya.Lines && this.slotFrame.setWires(lines);
        },

        setTotalWin: function (value, hideEffect, jackpotValue, isRaw, skipFSReward) {
            if (!isRaw)
                value *= this.allBetLevel[this.betLevel];
            jackpotValue = jackpotValue || 0;

            cc.GlobalSlotMaya.totalRewardValue = value + jackpotValue;
            if (value === 0) {
                this.totalRewardLabel.setString(cc.GlobalSlotMaya.FormatGold(value));
            } else if (value > 0) {
                // free spin game
                if (!skipFSReward && cc.GlobalSlotMaya.FreeSpinGame.enabled)
                    cc.GlobalSlotMaya.FreeSpinGame.reward += value;

                if (hideEffect) {
                    this.totalRewardLabel.setString(cc.GlobalSlotMaya.FormatGold(value + jackpotValue));
                } else {
                    // var bg = new cc.Sprite("#slotkhaihoi_total_reward_bg.png");
                    // // bg.setPreferredSize(cc.size(828, 193));
                    // bg.setPosition(993, cc.winSize.height / 2 - 280);
                    // this.gameLayer.addChild(bg, 99);

                    var totalLabel = new cc.LabelBMFont(cc.GlobalSlotMaya.FormatGold(value + jackpotValue), cc.SlotMayaRes.font.Total_Reward_Font);
                    totalLabel.setPosition(1030, cc.winSize.height / 2 - 280);
                    this.gameLayer.addChild(totalLabel, 99);

                    var moveAction = new cc.MoveTo(0.6, this.totalRewardLabel.getPosition());
                    var scaleAction = new cc.ScaleTo(0.6, 0.1);
                    var action = new cc.Spawn(moveAction, scaleAction);
                    var clearAction = new cc.CallFunc(function () {
                        // bg.removeFromParent();
                    });
                    var thiz = this;
                    var callFunc = new cc.CallFunc(function () {
                        totalLabel.removeFromParent(true);
                        thiz.totalRewardLabel.setString(cc.GlobalSlotMaya.FormatGold(value + jackpotValue));
                    });
                    var delayAction = new cc.DelayTime(2);

                    totalLabel.runAction(new cc.Sequence(delayAction, clearAction, action, callFunc));
                }
            }
        },

        switchToSandbox: function (coin) {
            this.goldenTimeSprite.visible = false;
            this.isSandboxMode = true;
            this.sandboxBtn.loadTextureNormal("slotmaya_sanbox_off_btn.png", ccui.Widget.PLIST_TEXTURE);
            this.sandboxSprite.visible = true;
            cc.GlobalSlotMaya.isSandboxMode = true;
            this.setCredit(coin, true);
        },

        quitSandbox: function () {
            if (!this.isSandboxMode)
                return;
            this.isSandboxMode = false; // return to normal mode
            if (this.enabledGoldenTime)
                this.goldenTimeSprite.visible = true;
            this.sandboxBtn.loadTextureNormal("slotmaya_sanbox_btn.png", ccui.Widget.PLIST_TEXTURE);
            this.sandboxSprite.visible = false;
            cc.GlobalSlotMaya.isSandboxMode = false;
            cc.GlobalSlotMaya.sandboxJackpot = undefined;
        },

        setSession: function (sessionId) {
            // this._pendingCredit();
            this.sessionLabel.setString(sessionId ? ("#" + sessionId) : "");
            // this.sessionLabel.setString("#00000");
            cc.GlobalSlotMaya.sessionId = sessionId;
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

        setState: function (state) {
            this.state = state;
            if (state === SlotState.IDLE) {
                if (this._pendingCredit) {
                    this._pendingCredit();
                }

                if (this._pendingBack) {
                    this.gameLayer.visible = false;
                    this._pendingBack = false;
                    if (!this.musicSetting.getDisabled())
                        SlotMayaSoundPlayer.playSound("button_click", false);
                    SlotMaya.SlotClient.getInstance().closeSocket();
                    MiniGameNavigator.hideAll();
                    SlotMayaSoundPlayer.stopSound("theme_khaihoi");
                    SlotMayaSoundPlayer.stopSound("spin");
                    this.autoSpin = false;
                    this.isRunningKhaiHoi = false;
                    SceneNavigator.goToHomeScene();
                    return
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
            if (this.portalFreeSpinCount || this.freeSpinCount)
                return;

            // this.setState(SlotState.SHOWING_FS_RESULT);
            var d = new CompleteFreeSpinDialog(cc.GlobalSlotMaya.FreeSpinGame.count, cc.GlobalSlotMaya.FreeSpinGame.reward);
            var thiz = this;
            d.setExitCallback(function () {
                thiz.setState(SlotState.IDLE);
            });

            this.showDialog(d);

            // reset freespin game
            cc.GlobalSlotMaya.FreeSpinGame = {
                enabled: false,
                count: 0,
                reward: 0
            };
        },

        showBonusGame: function () {
            cc.log("SHOW BONUS GAME");
            cc.director.replaceScene(new SlotMaya.BonusScene(this.betLevel, this.isSandboxMode));
            SlotMayaSoundPlayer.stopSound("theme_khaihoi");
            SlotMayaSoundPlayer.stopSound("theme_khaihoi1");
        },

        _performPendingFSAction: function () {
            if (!cc.GlobalSlotMaya.pendingFSReward)
                return;

            var thiz = this;
            var effect_freespin = sp.SkeletonAnimation.createWithJsonFile('res/SlotMaya/spine/liondance_win.json', 'res/SlotMaya/spine/liondance_win.atlas');
            effect_freespin.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 500);
            var effectLayer_freespin = new cc.Layer();
            this.addChild(effectLayer_freespin, 420);
            effectLayer_freespin.addChild(effect_freespin);

            thiz.setState(SlotState.SHOWING_REWARD);
            if (this._pendingFS)
                this._pendingFS();

            effect_freespin.setSkin("qmp");
            effect_freespin.setAnimation(0, "animation", false);
            var label = new cc.LabelBMFont("+" + cc.GlobalSlotMaya.pendingFSReward + " TURN", cc.SlotMayaRes.font.Room_Name);
            label.setScale(2);
            label.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 210);
            effectLayer_freespin.addChild(label);
            effect_freespin.setCompleteListener(function () {
                setTimeout(function () {
                    thiz.setState(SlotState.IDLE);
                    effectLayer_freespin.removeFromParent();

                    if (thiz.autoSpin || thiz.freeSpinCount)
                        thiz.onQuayBtnClick();
                }, 0);
            });

            cc.GlobalSlotMaya.pendingFSReward = undefined;
        },

        onReconnect: function () {
            if (this.isSandboxMode)
                this.toggleSandboxMode();

            // reset freespin game
            cc.GlobalSlotMaya.FreeSpinGame = {
                enabled: false,
                count: 0,
                reward: 0
            };

            this.stopRolling();
            this.setBetLevel(cc.GlobalSlotMaya.SlotState.betLevel || 0);
        },

        safeRemove: function (node) {
            setTimeout(function () {
                node.removeFromParent();
            }, 1);
        },

        toogleCharacter: function (isShow, betID) {
            // if (betID != null)
            //     this._allCharacter[betID].visible = isShow;
        },

        updateUserChangeMoney: function (eventName, money) {
            cc.log(this.creditLabel);
            if (this.creditLabel) {
                this.creditLabel.stopAllActions();
                SlotMaya.runActionNumber(this.creditLabel, money);
                cc.GlobalSlotMaya.PlayerGold = money;
                // this.lobbyNode.setCredit(money);
            }
        }
    });

    SlotMaya.SlotState = SlotState;
    SlotMaya.SlotScene = SlotScene;
})();
