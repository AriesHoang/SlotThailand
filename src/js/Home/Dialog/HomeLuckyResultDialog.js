var HomeLuckyResultDialog = IDialog.extend({
    ctor: function (leftResult, rightResult) {
        this._super();

        var bgTurnNum = new ccui.Scale9Sprite("disconnect_bg.png");
        // var bgTurnNum = new cc.Sprite("#disconnect_bg.png");
        bgTurnNum.setPreferredSize(cc.size(538, 224));
        // bgTurnNum.setScale(.8);
        this.addChild(bgTurnNum);

        var labelTurn = MultiLanguage.createLabelTTFFont("RESULT_RECEIVE", cc.res.font.Myriad_Pro_Bold, 26);
        labelTurn.setPosition(bgTurnNum.width / 2, bgTurnNum.height / 2 + 70);
        bgTurnNum.addChild(labelTurn);


        var centerText = MultiLanguage.getTextByKey("AND");
        var leftText = leftResult;
        var rightText = rightResult;

        var freeTurn = MultiLanguage.getTextByKey("FREE_TURN");
        var miss = MultiLanguage.getTextByKey("NOTHING");
        var goodluck = MultiLanguage.getTextByKey("GOODLUCK_NEXT_TURN");
        var getMoreTurn = MultiLanguage.getTextByKey("GET_MORE_TURN");
        var free = MultiLanguage.getTextByKey("FREE") + " ";
        var kcoin = " " + "tiền";

        if (leftResult === miss && rightResult === miss) {
            leftText = "";
            rightText = "";
            centerText = goodluck;
        }
        else if (leftResult === miss && rightResult !== miss) {
            centerText = (rightResult === freeTurn) ? getMoreTurn : (free + rightResult);
            rightText = "";
            leftText = "";
        } else if (leftResult !== miss && rightResult === miss) {
            centerText = (leftResult === freeTurn) ? getMoreTurn : (leftResult + kcoin);
            leftText = "";
            rightText = "";
        } else if (leftResult !== miss && rightResult !== miss) {
            if (leftResult === freeTurn && rightResult !== freeTurn) {
                leftText = getMoreTurn;
                rightText = free + rightResult;
            }
            else if (leftResult !== freeTurn && rightResult === freeTurn) {
                leftText = leftResult + kcoin;
                rightText = getMoreTurn;
            }
            else if (leftResult === freeTurn && rightResult === freeTurn) {
                leftText = "";
                rightText = "";
                centerText = getMoreTurn;
            }
            else if (leftResult !== freeTurn && rightResult !== freeTurn) {
                rightText = free + rightResult;
                leftText = leftResult + kcoin;
            }
        }


        var labelRightResult = new cc.LabelTTF(rightText, cc.res.font.Myriad_Pro_Regular, 27);
        labelRightResult.setPosition(labelTurn.x, labelTurn.y - 45);
        bgTurnNum.addChild(labelRightResult);


        var labelMissResult = new cc.LabelTTF(centerText, cc.res.font.Myriad_Pro_Regular, 27);
        labelMissResult.setPosition(labelRightResult.x, labelRightResult.y - 45);
        bgTurnNum.addChild(labelMissResult);

        var labelLeftResult = new cc.LabelTTF(leftText, cc.res.font.Myriad_Pro_Regular, 27);
        labelLeftResult.setPosition(labelMissResult.x, labelMissResult.y - 45);
        bgTurnNum.addChild(labelLeftResult);

        var btnClose = new ccui.Button("home_dialog_button_close.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnClose.setPosition(255, 100);
        this.addChild(btnClose);

        var thiz = this;
        btnClose.addClickEventListener(function () {
            thiz.hide();
        });
    }
})