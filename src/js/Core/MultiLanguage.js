var MultiLanguage = MultiLanguage || {};
MultiLanguage._language = {};
var lang = cc.sys.localStorage.getItem('LANGUAGES');

if (lang == null) {
    lang = "en";
}
else if (lang !== "en") {
    cc.sys.localStorage.setItem('LANGUAGES', "en");
}
MultiLanguage._currentLanguage = lang;

MultiLanguage.getCurrentLanguages = function () {
    return MultiLanguage._currentLanguage;
};
MultiLanguage.getTextByKey = function (key) {
    var textData = MultiLanguage._language[key];
    if (textData) {
        var text = textData[MultiLanguage._currentLanguage];
        if (text) {
            return text;
        }
        return textData["en"]; //default vi
    }
    return key;
};

MultiLanguage.createLabelBMFont = function (keyText, fntFile, width, alignment, imageOffset) {
    var label = cc.Label.createWithBMFont(MultiLanguage.getTextByKey(keyText), fntFile, width, alignment, imageOffset);
    MultiLanguage.addChangeLanguageEventForLabel(keyText, label);
    return label;
};

MultiLanguage.createLabelTTFFont = function (keyText, fontName, fontSize, dimensions, hAlignment, vAlignment) {
    var label = new cc.LabelTTF(MultiLanguage.getTextByKey(keyText), fontName, fontSize, dimensions, hAlignment, vAlignment);
    MultiLanguage.addChangeLanguageEventForLabel(keyText, label);
    return label;
};

MultiLanguage.createNewUITextField = function (keyPlaceholder, size, fontName, arg3, arg4, arg5) {
    var textfield = new newui.TextField(size, fontName, arg3, arg4, arg5);
    textfield.setPlaceHolder(MultiLanguage.getTextByKey(keyPlaceholder));
    return textfield;
};

MultiLanguage.addChangeLanguageEventForLabel = function (keyText, label) {
    label._keyText = keyText;

    label.setKeyText = function (keyText) {
        label._keyText = keyText;
        label._onChangeLanguage();
    };

    if (label._onChangeLanguage === undefined) {
        label._onChangeLanguage = function () {
            label.setString(MultiLanguage.getTextByKey(label._keyText));
        };
    }

    MultiLanguage.addChangeLanguageEvent(label);

    var _onEnter = label.onEnter;
    label.onEnter = function () {
        _onEnter.apply(label, arguments);
        label._onChangeLanguage();
    };
};

MultiLanguage.addChangeLanguageEvent = function (target) {
    var _onEnter = target.onEnter;
    var _onExit = target.onExit;

    if (target._onChangeLanguage === undefined) {
        target._onChangeLanguage = function () {
            cc.log("onChangeLanguage");
        };
    }

    target.onEnter = function () {
        _onEnter.apply(target, arguments);
        GlobalEvent.getInstance().addListener("changeLanguage", target._onChangeLanguage, target);
    };

    target.onExit = function () {
        _onExit.apply(target, arguments);
        GlobalEvent.getInstance().removeListener(target);
    };
};

(function () {
    //init
    if (cc.sys.isNative) {
        MultiLanguage._language = JSON.parse(jsb.fileUtils.getStringFromFile("res/Data/Language.json"));
    }
    else {
       MultiLanguage._language = cc.loader.getRes("res/Data/Language.json");
        console.log("debug");
    }
})();
