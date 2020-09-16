var SlotZodiac = SlotZodiac || {};
(function () {
    var Dialog = SlotZodiac.Dialog;
    var SelectLineObject = SlotZodiac.SelectLineObject;

    SlotZodiac.SelectLineDialog = Dialog.extend({
        ctor: function (selectedLines, target, width, height) {
            width = width || 1315;
            height = height || 703;
            this._super.call(this, width, height);
            // this.setTitle("");
            var bg_selectedLine = new cc.Sprite("res/SlotZodiac/slotmaya_dialog_bg.png");
            bg_selectedLine.setPosition(this.width / 2, this.height / 2 + 80);
            // bg_selectedLine.setScale(0.9);
            // bg_selectedLine.setScale(1, 1.03);
            this.addChild(bg_selectedLine);

            var index = 1;
            this.selectedLines = selectedLines || [];
            this._target = target;
            this.allBtn = [];
            var baseX = 238;
            var baseY = 480;
            for (var r = 0; r < 4; r++) {
                for (var c = 0; c < 5; c++) {
                    var btn = new SelectLineObject(index);
                    btn.setSelected(this.selectedLines.indexOf(index) !== -1);
                    btn.setPosition(baseX + c * 202, baseY - r * 116);
                    this.addChild(btn);
                    this.allBtn.push(btn);
                    index++;
                }
            }

            var dongChanBtn = new ccui.Button("slotmaya_chooseline_btn_evenline.png", "", "", ccui.Widget.PLIST_TEXTURE);
            dongChanBtn.setPosition(211, 0);
            this.addChild(dongChanBtn);

            // var lblDongChan = new cc.LabelTTF("Even line", "Arial", 30);
            // lblDongChan.setPosition(dongChanBtn);
            // this.addChild(lblDongChan);

            var dongLeBtn = new ccui.Button("slotmaya_chooseline_btn_oddline.png", "", "", ccui.Widget.PLIST_TEXTURE);
            dongLeBtn.setPosition(511, dongChanBtn.y);
            this.addChild(dongLeBtn);

            // var lblDongLe = new cc.LabelTTF("Odd line", "Arial", 30);
            // lblDongLe.setPosition(dongLeBtn);
            // this.addChild(lblDongLe);

            var boChonBtn = new ccui.Button("slotmaya_chooseline_btn_deselect.png", "", "", ccui.Widget.PLIST_TEXTURE);
            boChonBtn.setPosition(817, dongChanBtn.y);
            this.addChild(boChonBtn);

            // var lblBoChon = new cc.LabelTTF("Deselect", "Arial", 30);
            // lblBoChon.setPosition(boChonBtn);
            // this.addChild(lblBoChon);

            var chonTatBtn = new ccui.Button("slotmaya_chooseline_btn_all.png", "", "", ccui.Widget.PLIST_TEXTURE);
            chonTatBtn.setPosition(1111, dongChanBtn.y);
            this.addChild(chonTatBtn);

            // var lblChonTatCa = new cc.LabelTTF("All", "Arial", 30);
            // lblChonTatCa.setPosition(chonTatBtn);
            // this.addChild(lblChonTatCa);

            var thiz = this;
            dongChanBtn.addClickEventListener(function () {
                thiz.selectChanLe(true);
            });

            dongLeBtn.addClickEventListener(function () {
                thiz.selectChanLe(false);
            });

            chonTatBtn.addClickEventListener(function () {
                thiz.selectAll();
            });

            boChonBtn.addClickEventListener(function () {
                thiz.selectAll(true);
            });

            // this.setTitle("DÒNG ĐẶT CƯỢC");
            this.setLogo();
        },

        initBackground: function () {

        },

        setLogo: function () {
            var logotitle = new cc.Sprite("#slotmaya_selectedline_title.png");
            logotitle.setPosition(this.width / 2, this.height - 120);
            this.addChild(logotitle);
        },
        hide: function () {
            this.selectedLines = [];
            for (var i = 0; i < this.allBtn.length; i++) {
                this.allBtn[i].getSelected() && this.selectedLines.push(this.allBtn[i].value);
            }
            if (this.selectedLines.length > 0) {
                if (this._target && this._target.setSelectedLines)
                    this._target.setSelectedLines(this.selectedLines);
                this._super.apply(this, arguments);
            } else {
                cc.log("At least one line must be selected");
            }
        },

        selectChanLe: function (isChan) {
            for (var i = 0; i < this.allBtn.length; i++) {
                this.allBtn[i].setSelected((this.allBtn[i].value % 2) ^ isChan);
            }
        },

        selectAll: function (disabled) {
            for (var i = 0; i < this.allBtn.length; i++) {
                this.allBtn[i].setSelected(!disabled);
            }
            if (disabled) {
                this.allBtn[0].setSelected(true);
            }
        }
    });
})();
