
var SlotMaya = SlotMaya || {};

(function () {
    var SelectLineObject = cc.Node.extend({
        ctor : function (v) {
            this._super();
            var btn = new ccui.Button("slotmaya_line_1.png", "", "", ccui.Widget.PLIST_TEXTURE);
            btn.setZoomScale(0);
            this.addChild(btn);
            this.btn = btn;

            this.setValue(v);
            this.setSelected(false,true);

            var thiz = this;
            btn.addClickEventListener(function () {
                thiz.toggleSelected();
            });
        },

        setValue : function (v) {
            if (v < 1 || v > 20 || v!==Math.round(v))
                throw "Invalid value";
            this._value = v;
            this.btn.loadTextureNormal("slotmaya_line_" + v + ".png",ccui.Widget.PLIST_TEXTURE);
        },

        getValue : function () {
            return this._value;
        },

        setSelected : function (selected,disableAnimation) {
            selected = !!selected; // force boolean
            this._selected = selected;
            var act = new cc.FadeTo(disableAnimation ? 0 : 0.2, selected ? 255 : 128);
            this.stopAllActions();
            this.btn.runAction(act);
        },

        getSelected : function () {
            return this._selected;
        },

        toggleSelected : function () {
            this.setSelected(!this.getSelected());
        }
    });

    // export getters/setters
    (function () {
        var proto = SelectLineObject.prototype;
        cc.defineGetterSetter(proto, "value", proto.getValue, proto.setValue);
    })();

    SlotMaya.SelectLineObject = SelectLineObject;
})();
