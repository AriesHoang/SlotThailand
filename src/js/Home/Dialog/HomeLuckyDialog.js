var HomeLuckyDialog = BackButtonDialog.extend({
    ctor: function () {
        this._super();

        this._initButton();
        this._initBottomInfo();
        this._initWheel();

        this.initController();
        this._controller.sendGetItemRequest();
        this._controller.sendGetTimeBonusRequest();
        this.isSpinning = false;

        // this.setLoading(true);
    },
    initController: function () {
        this._controller = new HomeLuckyController(this);
    },

    _initWheel: function () {

        var wheelRight = new cc.Sprite("#bg_big_new.png");
        wheelRight.scale = 0.6;

        this.addChild(wheelRight);

        this.wheelRight = wheelRight;

        var spinRight = new cc.Sprite();
        spinRight.setPositionY = wheelRight.height * 0.65 / 2;
        this.addChild(spinRight);

        // var spinLeft = new cc.Sprite("#home_spin_arrow_1.png");
        var spinLeft = new cc.Sprite();
        spinLeft.setPosition(-237, 42);
        spinLeft.visible = false;
        this.addChild(spinLeft);

        var wheelLeft = new cc.Sprite("#bg_small_new.png");
        wheelLeft.scale = 0.6;
        this.addChild(wheelLeft);
        this.wheelLeft = wheelLeft;


        var roundCenterRight = new ccui.Button("btn_spin_vqmm_new.png", "", "", ccui.Widget.PLIST_TEXTURE);
        roundCenterRight.scale = 0.6;
        roundCenterRight.setPosition(spinRight.x, spinRight.y);
        this.roundCenterRight = roundCenterRight;
        this.addChild(roundCenterRight);

        var labelTurnNum = new cc.LabelTTF("00", cc.res.font.Arial_Bold, 40);
        labelTurnNum.color = cc.color("#700203");
        labelTurnNum.setPosition(roundCenterRight.x, roundCenterRight.y - 30);
        this.addChild(labelTurnNum);
        this.labelTurnNum1 = labelTurnNum;

        var thiz = this;
        roundCenterRight.addClickEventListener(function () {
            if (thiz.numBonus > 0) {
                // roundCenterRight.setTouchEnabled(false);
                // thiz.hideCaptcha(true);
                // thiz.getCaptchaLucky();
                thiz.checkResultAndSpin();
            }
            else
                thiz.showPopupFailResult();
        });

        var arrowRight = new cc.Sprite("#home_vpmm_arrow.png");
        arrowRight.setPosition(spinRight.x, this.wheelRight.height * 0.65 / 2 - 30);
        arrowRight.scale = 0.6;
        this.addChild(arrowRight);

        // var arrowLeft = new cc.Sprite("#home_icon_arrow_wheel.png");
        var arrowLeft = new cc.Sprite();
        arrowLeft.visible = false;
        arrowLeft.setPosition(spinLeft.x + 10, 215);
        this.addChild(arrowLeft);

        // var roundCenterLeft = new cc.Sprite("#home_icon_spin_lucky1.png");
        var roundCenterLeft = new cc.Sprite();
        roundCenterLeft.setPosition(spinLeft.x, spinLeft.y);
        roundCenterLeft.visible = false;
        this.addChild(roundCenterLeft);

        // var textTurnNum = new cc.Sprite("#home_turn_number_vi.png");
        var textTurnNum = new cc.Sprite();
        textTurnNum.setPosition(roundCenterLeft.x, roundCenterLeft.y + 20);
        textTurnNum.visible = false;
        this.addChild(textTurnNum);
        this._initCaptChaView();
        this.hideCaptcha(false);
    },

    _initCaptChaView: function () {
        this.captChaLucky = new ccui.Widget();
        this.captChaLucky.setContentSize(cc.size(550, 300));
        this.captChaLucky.setTouchEnabled(false);
        this.captChaLucky.setPosition(280, 150);
        this.addChild(this.captChaLucky);

        var bg_captcha = new ccui.Scale9Sprite("home_vqmm_bg_captcha.png");
        bg_captcha.setPreferredSize(cc.size(550, 300));
        this.captChaLucky.addChild(bg_captcha);

        var textNoticeCaptcha = new cc.LabelTTF("Nhập mã xác nhận:", "Arial", 30);
        textNoticeCaptcha.setPosition(0, 100);
        this.captChaLucky.addChild(textNoticeCaptcha);

        var lb_info = MultiLanguage.createLabelTTFFont("", cc.res.font.Myriad_Pro_Regular, 28);
        lb_info.setFontFillColor(cc.color(255, 255, 89));
        lb_info.setPosition(textNoticeCaptcha.x, textNoticeCaptcha.y - 40);
        this.captChaLucky.addChild(lb_info);
        this.lb_info = lb_info;

        // var inputFiled = new cc.Sprite("#home_dialog_luckytextbox.png");
        var inputFiled = new ccui.Scale9Sprite("home_dialog_luckytextbox.png", cc.rect(20, 20, 2, 2));
        inputFiled.setPreferredSize(cc.size(250, 70));
        inputFiled.setPosition(-130, 0);
        inputFiled.setScale(0.8);
        this.captChaLucky.addChild(inputFiled);

        var inputText = new MultiLanguage.createNewUITextField("", cc.size(160, 68),
            cc.res.font.Myriad_Pro_Regular, 25, cc.res.font.Myriad_Pro_Regular, 25);
        inputText.setPlaceHolderColor(cc.color(0, 0, 0, 153));
        // inputText.setTextColor(cc.color(0, 0, 0, 204));
        inputText.setAlignment(1);
        inputText.setPosition(inputFiled.x, inputText.y);
        inputText.setMaxLength(10);
        inputText.setText("");
        this.captChaLucky.addChild(inputText, 1);
        this.inputText = inputText;

        var btnRefreshCaptchaChuyenTien = new ccui.Button("icon_refesh.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnRefreshCaptchaChuyenTien.scale = 0.68;
        btnRefreshCaptchaChuyenTien.setName("btnRefesh");
        btnRefreshCaptchaChuyenTien.setPosition(inputText.x + inputText.width + 200, inputFiled.y);
        this.captChaLucky.addChild(btnRefreshCaptchaChuyenTien);
        var thiz = this;

        btnRefreshCaptchaChuyenTien.addClickEventListener(function () {
            thiz.getCaptchaLucky();
        });

        var btnQuayCaptcha = new ccui.Button("home_vqmm_spin_captcha.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnQuayCaptcha.setPosition(0, -100);
        btnQuayCaptcha.setScale(0.8);
        this.captChaLucky.addChild(btnQuayCaptcha);

        btnQuayCaptcha.addClickEventListener(function () {
            thiz.checkResultAndSpin();
        });
    },
    ivtTime: -1,
    getCaptchaLucky: function () {
        cc.Global.bGetCaptcha = false;
        cc.Global.getUrlCaptcha();
        clearInterval(this.ivtTime);
        if (this.captChaLucky.getChildByName("sprCaptcha"))
            this.captChaLucky.getChildByName("sprCaptcha").removeFromParent();
        var thiz = this;
        this.ivtTime = setInterval(function () {
            if (cc.Global.bGetCaptcha) {
                // cc.log("captchadata: " + JSON.stringify(cc.Global.captchaData));
                var url = cc.Global.captchaData.urlCaptcha;
                TextureDownloader.load(url, function (tex) {
                    cc.spriteFrameCache.addSpriteFrames(url, tex);
                    var sprite = new cc.Sprite(tex);
                    sprite.setName("sprCaptcha");
                    sprite.x = thiz.inputText.x + 220;
                    sprite.y = thiz.inputText.y;
                    sprite.scale = 60 / sprite.height;
                    thiz.sprite = sprite;
                    thiz.captChaLucky.addChild(sprite);
                });
                clearInterval(thiz.ivtTime);
            }
        }, 100);
    },
    checkResultAndSpin: function () {
        var thiz = this;
        // cc.Global.sendVerifyCaptcha(cc.Global.captchaData.token, thiz.inputText.getText(), function () {
        //     if (thiz.checkBeforeSend(thiz.inputText.getText())) {
        if (!thiz.isSpinning) {
            thiz._controller.sendGetResultLuckyRequest();
            thiz.isSpinning = true;
            // thiz.hideCaptcha(false);
        }
        // }
        // });
    },
    checkBeforeSend: function (captcha) {

        var validation = {
            isNotEmpty: function (str) {
                var pattern = /\S+/;
                return pattern.test(str);  // returns a boolean
            },
            isNumber: function (str) {
                var pattern = /^\d+$/;
                return pattern.test(str);  // returns a boolean
            }
        };
        var thiz = this;
        if (!validation.isNotEmpty(captcha)) {
            this.lb_info.setString(MultiLanguage.getTextByKey("Bạn chưa nhập mã captcha!!!"));
            return false;
        } else if (cc.Global.isVerify === false) {
            this.lb_info.setString(MultiLanguage.getTextByKey("Mã captcha không đúng!!!"));
            thiz.inputText.setText("");
            thiz.getCaptchaLucky();
            return false;
        }
        return true;
    },
    hideCaptcha: function (isShow) {
        this.captChaLucky.visible = isShow;
    },

    initItemsLeft: function (result) {

        var textShow = "";
        var leftData = {};
        //Iteminitlef
        for (var i = 0; i < result.length; i++) {
            textShow = cc.Global.NumberFormat2(result[i].amount);

            if (result[i].rewardType === "NOTHING") {
                textShow = MultiLanguage.getTextByKey("NOTHING");
            } else if (result[i].rewardType === "FREE_TURN") {
                textShow = MultiLanguage.getTextByKey("FREE_TURN");
            }
            // cc.log("Left: i: " + i + " -  text: " + textShow);
            leftData[i] = textShow;

            var _strColor = "#6D0300";
            var _borderColor = "#BE7878";
            _strColor = "#FFFFFF";

            var containerNode = new cc.Node();
            containerNode.setContentSize(cc.size(200, this.wheelLeft.height / 4 + 20));
            containerNode.setAnchorPoint(0.5, -84 / 112);
            containerNode.setPosition(this.wheelLeft.width / 2, this.wheelLeft.height / 2);

            containerNode.setRotation(360 / 8 * i + 22);

            var labelGameName = new cc.LabelTTF(textShow, cc.res.font.Myriad_Pro_Bold, 35, cc.size(200, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
            labelGameName.setAnchorPoint(0.5, 1);
            labelGameName.setFontFillColor(cc.color(_strColor));
            labelGameName.enableStroke(cc.color(_borderColor), 2);
            labelGameName.setPosition(containerNode.width / 2, containerNode.height * 0.75);
            containerNode.addChild(labelGameName);

            if (textShow === MultiLanguage.getTextByKey("NOTHING") || textShow === MultiLanguage.getTextByKey("FREE_TURN")) {
                labelGameName.y = containerNode.height * 0.75;
                // labelNumber.setRotation(90);
                labelGameName.setFontSize(30);
            }


            this.wheelLeft.addChild(containerNode);
        }

        this.leftData = leftData;
    },
    initItemRight: function (result) {

        var gameName = "";
        var numberTurn = "";
        var turn = "";
        var rightData = {};

        //Item
        // cc.log("result.length " + result.length)
        for (var i = 0; i < result.length; i++) {
            var containerNode = new cc.Node();
            containerNode.setContentSize(cc.size(200, this.wheelRight.height / 4 + 20));
            containerNode.setAnchorPoint(0.5, -84 / 112);
            containerNode.setPosition(this.wheelRight.width / 2, this.wheelRight.height / 2);

            containerNode.setRotation(360 / 12 * i + 15);
            // var colorLayer = new cc.LayerColor(cc.color(0, 0, 0, 100+(i*10)), containerNode.width, containerNode.height);
            // containerNode.addChild(colorLayer);

            if (result[i].rewardType === "NOTHING") {
                numberTurn = MultiLanguage.getTextByKey("NOTHING");
                gameName = "";
                turn = "";
                // gameName = result[i].gameName;
                // if (result[i].amount <= 0)
                //     numberTurn = "";
                // else
                //     numberTurn = (result[i].amount < 10 ? "0" : "") + result[i].amount;
                rightData[i] = numberTurn;
            }
            else if (result[i].rewardType === "FREE_TURN") {
                numberTurn = MultiLanguage.getTextByKey("FREE_TURN");
                gameName = "";
                turn = "";
                // gameName = result[i].gameName;
                // if (result[i].amount <= 0)
                //     numberTurn = "";
                // else
                //     numberTurn = (result[i].amount < 10 ? "0" : "") + result[i].amount;
                rightData[i] = numberTurn;
            } else {
                gameName = result[i].gameName;
                if (result[i].amount <= 0)
                    numberTurn = "";
                else
                    numberTurn = (result[i].amount < 10 ? "0" : "") + result[i].amount;

                turn = MultiLanguage.getTextByKey("FREE_SPIN");
                rightData[i] = gameName + " " + numberTurn + turn;
            }

            // cc.log("Right: i: " + i + " -  text: " + gameName + " " + numberTurn);

            var _strColor = "#6D0300";
            var _borderColor = "#BE7878";
            if (i % 2 == 0) {
                _strColor = "#FFFFFF";
                // _borderColor = "#6D0300";
            }
            var labelGameName = new cc.LabelTTF(gameName, cc.res.font.Myriad_Pro_Regular, 35, cc.size(200, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
            // if (gameName === "Mỹ hầu vương")
            //     labelGameName.setFontSize(30);
            labelGameName.setAnchorPoint(0.5, 1);
            labelGameName.setFontFillColor(cc.color(_strColor));
            labelGameName.enableStroke(cc.color(_borderColor), 2);
            labelGameName.setPosition(containerNode.width / 2, containerNode.height - 20);
            containerNode.addChild(labelGameName);

            var labelNumber = new cc.LabelTTF(numberTurn, cc.res.font.Myriad_Pro_Bold, 35, cc.size(200, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
            labelNumber.setFontFillColor(cc.color(_strColor));
            labelNumber.enableStroke(cc.color(_borderColor), 2);
            labelNumber.setPosition(containerNode.width / 2, labelGameName.y - labelGameName.height * 1.25);
            // if(numberTurn == "TRƯỢT" || numberTurn == "THÊM LƯỢT")
            //     labelNumber.y = containerNode.height/2;
            containerNode.addChild(labelNumber);

            var labelTurn = new cc.LabelTTF(turn, cc.res.font.Myriad_Pro_Regular, 25, cc.size(120, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
            labelTurn.setAnchorPoint(0.5, 1);
            labelTurn.setFontFillColor(cc.color(_strColor));
            labelTurn.enableStroke(cc.color(_borderColor), 2);
            labelTurn.setPosition(containerNode.width / 2, labelNumber.y - labelNumber.height/2);
            containerNode.addChild(labelTurn);

            if (numberTurn === MultiLanguage.getTextByKey("NOTHING") || numberTurn === MultiLanguage.getTextByKey("FREE_TURN")) {
                labelNumber.y = containerNode.height * 0.75;
                // labelNumber.setRotation(90);
                labelNumber.setFontSize(30);
            }

            this.wheelRight.addChild(containerNode);
            this.setLoading(false);
        }
        this.rightData = rightData;
    },
    _initButton: function () {
        // var btnHelp = new ccui.Button("home_dialog_button_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var btnHelp = new ccui.Button("", "", "", ccui.Widget.PLIST_TEXTURE);
        btnHelp.setPosition(-429, 242);
        this.addChild(btnHelp);

        var thiz = this;
        btnHelp.addClickEventListener(function () {
            if (!thiz.isSpinning) {
                var dialog = new HomeLuckyHelpDialog(cc.Global.luckyHelp || "");
                dialog.show();
            }
        });

        // var btnInfo = new ccui.Button("home_dialog_button_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var btnInfo = new ccui.Button("", "", "", ccui.Widget.PLIST_TEXTURE);
        btnInfo.setPosition(-329, 242);
        this.addChild(btnInfo);

        btnInfo.addClickEventListener(function () {
            // cc.log("History Lucky Dialog");
            if (!thiz.isSpinning) {
                var dialog = new HomeLuckyHistoryDialog();
                dialog.show();
            }
        });

        btnHelp.visible = false;
        btnInfo.visible = false;

    },
    _initBottomInfo: function () {
        // var bgTurnNum = new ccui.Scale9Sprite("home_bg_turn_lucky.png", cc.rect(30, 0, 2, 113));
        // bgTurnNum.setPreferredSize(cc.size(358, 113))
        var bgTurnNum = new cc.Sprite();
        bgTurnNum.setPosition(-50, -260);
        this.addChild(bgTurnNum);

        var labelTurn = MultiLanguage.createLabelTTFFont("BONUS_TURN", cc.res.font.Myriad_Pro_Regular, 35);
        labelTurn.setPosition(bgTurnNum.width / 2 - 60, bgTurnNum.height / 2);
        bgTurnNum.addChild(labelTurn);

        var labelNumTurn = new cc.LabelTTF("00", cc.res.font.Myriad_Pro_Regular, 50);
        labelNumTurn.setPosition(labelTurn.x + 140, labelTurn.y);
        bgTurnNum.addChild(labelNumTurn);
        this.labelTurnNum2 = labelNumTurn;


        // var bgTime = new cc.Sprite("#home_bg_timecount.png");
        var bgTime = new cc.Sprite();
        bgTime.setPosition(220, -228);
        this.addChild(bgTime);

        var labelTime = new cc.LabelTTF("00:00:00", cc.res.font.Myriad_Pro_Regular, 25);
        labelTime.color = cc.color(0, 0, 0);
        labelTime.setPosition(bgTime.width / 2, bgTime.height / 2 - 5);
        bgTime.addChild(labelTime);
        this.labelTime = labelTime;

        bgTurnNum.visible = false;
        labelTurn.visible = false;
        bgTime.visible = false;
        labelTime.visible = false;

        this.setCountDownTime(0);
    },
    setCountDownTime: function (value) {
        this.labelTime.stopAllActions();
        value = Math.floor(value);
        var thiz = this;
        var delay = new cc.DelayTime(1);
        var count = new cc.CallFunc(function () {
            if (value <= 0) {
                thiz.labelTime.setString("00:00:00");
                thiz.labelTime.stopAllActions();

                setTimeout(function () {
                    thiz._waitCallBonus();
                }, 150);
                return;
            }
            if (value > 0)
                value--;

            var hours = Math.floor(value / 3600);
            var minutes = Math.floor((value / 60) % 60);
            var seconds = Math.floor(value % 60);

            thiz.labelTime.setString((hours < 10 ? "0" : "") + hours + ':' + (minutes < 10 ? "0" : "") + minutes + ':' + (seconds < 10 ? "0" : "") + seconds);
        });

        this.labelTime.runAction(new cc.RepeatForever(new cc.Sequence(delay, count)));
    },
    _waitCallBonus: function () {
        this._controller.sendGetTimeBonusRequest();
    },
    showResult: function (indexLeft, indexRight) {
        cc.Global.isShowLuckyDialog = false;
        this.roundCenterRight.setTouchEnabled(true);
        this.wheelRight.setRotation(0);
        this.wheelLeft.setRotation(0);
        //Spin Right
        var spinNumberR = Math.floor(360 / 12 * (indexRight + 0.5));
        var angleR = spinNumberR + 12 * 360;
        var actionR = new cc.RotateBy(8, (-1) * angleR);
        var easeR = new cc.EaseSineOut(actionR);

        //Spin Left
        var spinNumberL = Math.floor(360 / 8 * (indexLeft + 0.5));
        var angleL = spinNumberL + 8 * (-360);
        var actionL = new cc.RotateBy(8, (-1) * angleL);
        var easeL = new cc.EaseSineOut(actionL);

        var thiz = this;
        var completeAction = new cc.CallFunc(function () {
            var result = new HomeLuckyResultDialog(thiz.leftData[indexLeft], thiz.rightData[indexRight]);
            result.showWithAnimationScale();
            thiz.isSpinning = false;
        });

        if (easeR > easeL) {
            this.wheelRight.runAction(easeR, completeAction);
            this.wheelLeft.runAction(new cc.Sequence(easeL));
        } else {
            this.wheelLeft.runAction(new cc.Sequence(easeL, completeAction));
            this.wheelRight.runAction(easeR);
        }


    },
    showBonus: function (numBonus, timeCount) {
        this.setCountDownTime(timeCount / 1000);
        this.labelTurnNum1.setString(numBonus < 9 ? "0" + numBonus.toString() : numBonus.toString());
        this.labelTurnNum2.setString(numBonus.toString());
        this.numBonus = numBonus;
    },
    setHelp: function (helpData) {
        // this.helpString = helpData;
    },
    showPopupFailResult: function () {
        this.isSpinning = false;
        this.showPopup(MultiLanguage.getTextByKey("CAN_NOT_SPIN"));
    },
    showPopup: function (content) {
        this.isSpinning = false;
        var popup = new HomeNotifyPopup();
        popup.showNotification(content);
    },
});
