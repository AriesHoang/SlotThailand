var HomePlaceProfileDialog = IDialog.extend({
        ctor: function (place,choosePlaceCallback) {
            this._super();
            this._choosePlaceCallback = choosePlaceCallback;

            var bg = new cc.Sprite("#home_bg_place_profile.png");
            this.addChild(bg);
            this.mTouch = cc.rect(-bg.width / 2, -bg.height / 2, bg.width, bg.height);

            this._initLabels();
            this._initGUI(place);
        },
        _initLabels: function () {
            var label1 = MultiLanguage.createLabelTTFFont("SELECT_NEW_PLACE", cc.res.font.Myriad_Pro_Regular, 25);
            label1.enableStroke(cc.color("#ff9600"), 2);
            label1.setPosition(0, 200);
            this.addChild(label1);

            var lbDiadiem = MultiLanguage.createLabelTTFFont("PLACE", cc.res.font.Myriad_Pro_Regular, 28);
            lbDiadiem.setPosition(0, 130);
            this.addChild(lbDiadiem);

            var lbChoosePlace = MultiLanguage.createLabelTTFFont("SELECT_NOW_PLACE", cc.res.font.Myriad_Pro_Regular, 28);
            lbChoosePlace.setFontFillColor(cc.color("#ffffff"));
            lbChoosePlace.setPosition(60, 50);
            this.addChild(lbChoosePlace);
        },
        _initGUI: function (place) {
            var iconNotify = new cc.Sprite("#home_icon_notify.png");
            iconNotify.setPosition(-120, 130);
            iconNotify.setScale(.6);
            this.addChild(iconNotify);

            var iconPlace = new cc.Sprite("#home_icon_place_profile.png");
            iconPlace.setPosition(-200, 0);
            iconPlace.setScale(.8);
            this.addChild(iconPlace);

            var placeBg = new ccui.Scale9Sprite("home_input_place.png", cc.rect(10, 0, 2, 26));
            placeBg.setPosition(30, -20);
            this.addChild(placeBg);


            var selectPlace = new ccui.Button("home_icon_find.png", "", "", ccui.Widget.PLIST_TEXTURE);
            selectPlace.setPosition(220, placeBg.y);
            this.addChild(selectPlace);

            var btnOK = new ccui.Button("home_btn_green.png", "", "", ccui.Widget.PLIST_TEXTURE);
            btnOK.setPosition(0, -130);
            this.addChild(btnOK);

            var iconCheck = new cc.Sprite("#home_icon_check.png");
            iconCheck.setPosition(30, btnOK.height / 2);
            btnOK.addChild(iconCheck);

            var lbOK = MultiLanguage.createLabelTTFFont("OK_BUTTON", cc.res.font.Myriad_Pro_Bold, 28);
            lbOK.enableStroke(cc.color("#000"), 1);
            lbOK.setPosition(btnOK.width / 2 + 20, btnOK.height / 2 - 5);
            btnOK.addChild(lbOK);

            btnOK.addClickEventListener(function () {
                var coutItem = cc.Global.placeList.length;

                for (var i = 0; i < coutItem; i++) {
                    if (cc.Global.bodauTiengViet(thiz.placeTF.getText()) === cc.Global.bodauTiengViet(cc.Global.placeList[i])) {
                        if (thiz._choosePlaceCallback){
                            thiz._choosePlaceCallback.call(null,cc.Global.placeList[i]);
                        }
                        break;
                    }
                }
                thiz.hide();
            });

            var placeTF = new MultiLanguage.createNewUITextField("TYPE_PLACE", cc.size(280, 25),
                cc.res.font.Myriad_Pro_Regular, 18, cc.res.font.Myriad_Pro_Regular, 18);
            placeTF.setPlaceHolderColor(cc.color(0, 0, 0, 153));
            placeTF.setTextColor(cc.color(0, 0, 0, 204));
            placeTF.setAlignment(1);
            placeTF.setPosition(placeBg.x + 1, placeBg.y - 3);
            this.addChild(placeTF);
            this.placeTF = placeTF;

            if (place && place.length > 0) {
                placeTF.setText((place === MultiLanguage.getTextByKey("PLACE_BUTTON") ) ? "" : place);
            }

            var bgListPlace = new cc.LayerColor(cc.color(255, 255, 255), 260, 280);
            bgListPlace.setPosition(placeTF.x - 20, -bgListPlace.height - 8);
            bgListPlace.setVisible(false);
            placeTF.addChild(bgListPlace);
            this.bgListPlace = bgListPlace;

            var thiz = this;
            var flag = false;

            var placeList = new newui.TableView(cc.size(260, 280), 1);
            placeList.setDirection(ccui.ScrollView.DIR_VERTICAL);
            placeList.setBounceEnabled(true);
            placeList.setAnchorPoint(cc.p(0.5, 0.5));
            placeList.setScrollBarEnabled(false);
            placeList.setPosition(30, -placeList.height / 2 - 40);
            placeList.visible = false;
            this.addChild(placeList);
            this.placeList = placeList;

            selectPlace.addClickEventListener(function () {
                thiz.placeList.visible = !thiz.placeList.visible;
                if (!thiz.placeList.visible) {
                    // bgListPlace.visible = false;
                    return;
                }

                thiz.placeList.removeAllItems();
                var text = thiz.placeTF.getText();
                var coutItem = cc.Global.placeList.length;

                if (text && text.length > 0) {
                    var textFilter = cc.Global.bodauTiengViet(text);
                    for (var i = 0; i < coutItem; i++) {
                        var itemText = cc.Global.bodauTiengViet(cc.Global.placeList[i]);
                        if (itemText.indexOf(textFilter) !== -1) {
                            var item = thiz._creatItemPlace(cc.Global.placeList[i]);
                            placeList.pushItem(item);
                        }
                    }
                }
                else {

                    for (var i = 0; i < coutItem; i++) {
                        var item = thiz._creatItemPlace(cc.Global.placeList[i]);
                        placeList.pushItem(item);
                    }
                }

                flag = !flag;
                bgListPlace.setVisible(flag);
            });
        },
        _creatItemPlace: function (place) {
            var bgItem = new ccui.Widget();
            bgItem.setContentSize(cc.size(260, 40));
            bgItem.setTouchEnabled(true);

            var layer = new cc.LayerColor(cc.color(230, 230, 230), 260, 39);
            bgItem.addChild(layer);

            var nameLabel = new cc.LabelTTF(place, cc.res.font.Myriad_Pro_Regular, 22);
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.color = cc.color("#000000");
            nameLabel.setPosition(20, bgItem.height / 2 - 4);
            bgItem.addChild(nameLabel);

            var thiz = this;
            bgItem.addClickEventListener(function () {
                thiz.placeTF.setText(place);
                thiz.bgListPlace.setVisible(false);
                thiz.placeList.visible = false;
            });

            return bgItem;
        },

        onEnter: function () {
            cc.Node.prototype.onEnter.call(this);
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    return true;
                }
            }, this);
            this._isShow = true;
        }

    })
;