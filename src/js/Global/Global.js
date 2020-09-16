
String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
};
var cc = cc || {};
cc.Global = cc.Global || {};
cc.Global.NumberFormat1 = function (number) {
    var pret = Math.abs(number).toString();
    if (pret.length > 3) {
        for (var i = pret.length - 3; i > 0; i -= 3) {
            pret = pret.insertAt(i, ".");
        }
    }
    if (number < 0) {
        return "-" + pret;
    }
    return pret;
};

cc.Global.isLogin = false;

var Number_Format_Type = ["", "K", "M", "B"];
cc.Global.NumberFormat2 = function (number) {
    var i = 0;
    while (number >= 1000) {
        number = Math.floor(number / 1000);
        i++;
    }
    return (number.toString() + Number_Format_Type[i]);
};

cc.Global.NumberFromString = function (str) {
    var numberText = str.replace(/[.,]/g, '');
    if (numberText && cc.Global.IsNumber(numberText)) {
        return parseInt(numberText);
    }
    return null;
};
cc.Global.stringShortener = function (str, leng) {
    if (str.length > leng) str = str.substring(0, leng - 3) + "...";
    return str;
};
cc.Global.NumberFormatWithPadding = function (number, size) {
    if (size == undefined) {
        size = 2;
    }
    if (number < 0) {
        return number.toString();
    }
    var str = number.toString();
    while (str.length < size) {
        str = "0" + str;
    }
    return str;
};

cc.Global.DateToString = function (d) {
    var timeString = cc.Global.NumberFormatWithPadding(d.getDate()) + "/" +
        cc.Global.NumberFormatWithPadding(d.getMonth() + 1) + "/" +
        (1900 + d.getYear()).toString() + " " +
        cc.Global.NumberFormatWithPadding(d.getHours()) + ":" +
        cc.Global.NumberFormatWithPadding(d.getMinutes()) + ":" +
        cc.Global.NumberFormatWithPadding(d.getSeconds());
    return timeString;
};

cc.res = cc.res || {};
cc.res.font = cc.res.font || {};
if (cc.sys.isNative) {
    cc.res.font.Myriad_Pro_Regular = "res/Fonts/Myriad_Pro_Regular.ttf";
    cc.res.font.Myriad_Pro_Bold = "res/Fonts/Myriad_Pro_Bold.ttf";
    cc.res.font.Arial_Bold = "res/Fonts/Arial_Bold.ttf";
}
else {
    cc.res.font.Myriad_Pro_Regular = "Myriad_Pro_Regular";
    cc.res.font.Myriad_Pro_Bold = "Myriad_Pro_Bold";
    cc.res.font.Arial_Bold = "Arial_Bold";
}

// cc.res.sound = cc.res.sound || {};
// if (cc.sys.isNative) {
//     cc.res.font.Myriad_Pro_Regular = "res/Fonts/Myriad_Pro_Regular.ttf";
//     cc.res.font.Myriad_Pro_Bold = "res/Fonts/Myriad_Pro_Bold.ttf";
// }
// else {
//     cc.res.font.Myriad_Pro_Regular = "Myriad_Pro_Regular";
//     cc.res.font.Myriad_Pro_Bold = "Myriad_Pro_Bold";
// }


var GameType = GameType || {};
GameType.GAME_Jackpot = 1;
GameType.GAME_MiniPoker = 2;
GameType.GAME_CaoThap = 3;
GameType.GAME_VongQuay = 10;
GameType.GAME_TaiXiu = 5;

GameType.Game_Slot1 = 101;
GameType.Game_Slot2 = 102;
GameType.Game_Slot3 = 103;
GameType.Game_Slot4 = 104;
GameType.Game_Slot5 = 105;

var PlayerMe = PlayerMe || {};
PlayerMe.username = "";
PlayerMe.displayName = "";
PlayerMe.password = "";
PlayerMe.phoneNumber = "";
PlayerMe.userId = "";
PlayerMe.gold = 0;
PlayerMe.exp = 0;
PlayerMe.vipExp = 0;
PlayerMe.avatar = "";
PlayerMe.spin = 0;
PlayerMe.token = "";
PlayerMe.messageCount = 0;
PlayerMe.missionCount = 0;
PlayerMe.vipLevel = 0;
PlayerMe.vipPoint = 0;
PlayerMe.vipName = "";
PlayerMe.userType = 0; // normal user
PlayerMe.SFS = PlayerMe.SFS || {};

var GameConfig = GameConfig || {};
GameConfig.email = "slotgame@gmail.com";
GameConfig.hotline = "01234567897";
GameConfig.fanpage = "";
GameConfig.broadcastMessage = [];
GameConfig.DeviceIDKey = "";

cc.Global.GetSetting = function (setting, defaultValue) {
    var value = cc.sys.localStorage.getItem(setting);
    if (value !== undefined) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return defaultValue;
};

cc.Global.SetSetting = function (setting, value) {
    cc.sys.localStorage.setItem(setting, value);
};

// var ApplicationConfig = ApplicationConfig || {};
// (function () {
//     if(cc.sys.isNative){
//         if(cc.sys.os === cc.sys.OS_IOS){
//             ApplicationConfig.PLATFORM = 1;
//         }
//         else if(cc.sys.os === cc.sys.OS_ANDROID){
//             ApplicationConfig.PLATFORM = 2;
//         }
//         else if(cc.sys.os === cc.sys.OS_WINRT){
//             ApplicationConfig.PLATFORM = 3;
//         }
//         else if(cc.sys.os === cc.sys.OS_WINDOWS){
//             ApplicationConfig.PLATFORM = 3;
//         }
//         else{
//             ApplicationConfig.PLATFORM = 2;
//         }
//     }
//     else{
//         ApplicationConfig.PLATFORM = 4;
//     }
// })();

cc.Global.LoginMethod = "0";
// 1: Login Normal
cc.Global.LoginAcc = "1";
// 2: Login with Register
cc.Global.LoginReg = "2";
// 3: Login Facebook
cc.Global.LoginFb = "3";
// 4: Login Google
cc.Global.LoginGG = "4";
// 5: Login Mobile
cc.Global.LoginMobile = "5";

cc.Global.LoginByOpenID = false;

cc.Global.getLoginMethod = function () {
    return cc.sys.localStorage.getItem("loginMethod");
};

cc.Global.setLoginMethod = function (loginMethod) {
    cc.sys.localStorage.setItem("loginMethod", loginMethod);
};

cc.Global.getRememberAcc = function () {
    return cc.sys.localStorage.getItem("bRemember");
};

cc.Global.setRememberAcc = function (bFlag) {
    cc.sys.localStorage.setItem("bRemember", bFlag);
};

cc.Global.getSaveUsername = function () {
    return cc.sys.localStorage.getItem("username");
};

cc.Global.setSaveUsername = function (userName) {
    cc.sys.localStorage.setItem("username", userName);
};

cc.Global.getSavePassword = function () {
    return cc.sys.localStorage.getItem("password");
};

cc.Global.setSavePassword = function (passwords) {
    cc.sys.localStorage.setItem("password", passwords);
};

cc.Global.getTokenFB = function () {
    return cc.sys.localStorage.getItem("tokenFB");
};

cc.Global.setTokenFB = function (token) {
    cc.sys.localStorage.setItem("tokenFB", token);
};

cc.Global.getTokenGG = function () {
    return cc.sys.localStorage.getItem("tokenGG");
};

cc.Global.setTokenGG = function (token) {
    cc.sys.localStorage.setItem("tokenGG", token);
};

cc.Global.setToken = function (token) {
    cc.sys.localStorage.setItem("tokenNormal", token);
};

cc.Global.getToken = function () {
    return cc.sys.localStorage.getItem("tokenNormal");
};

cc.Global.getMobilePhone = function () {
    return cc.sys.localStorage.getItem("mobilePhone");
};

cc.Global.setMobilePhone = function (mobilePhone) {
    cc.sys.localStorage.setItem("mobilePhone", mobilePhone);
};

cc.Global.setOTPPhone = function (code) {
    cc.sys.localStorage.setItem("otpPhone", code);
};
cc.Global.getOTPPhone = function () {
    return cc.sys.localStorage.getItem("otpPhone");
};

cc.Global.clearAllSetting = function () {
    cc.Global.LoginMethod = "0";
    cc.sys.localStorage.setItem("KEY_LOGIN", 0);
    cc.sys.localStorage.setItem("accessToken", null);
    cc.Global.setLoginMethod("0");
    cc.Global.setSaveUsername("");
    cc.Global.setSavePassword("");
    if (!cc.Global.getRememberAcc()) {
        cc.Global.setSaveUsername("");
        cc.Global.setSavePassword("");
    }
    cc.Global.setTokenFB("");
    cc.Global.setTokenGG("");
    cc.Global.setMobilePhone("");
    PlayerMe.username = "";
    PlayerMe.displayName = "";
    PlayerMe.password = "";
    PlayerMe.phoneNumber = "";
    PlayerMe.userId = "";
    PlayerMe.gold = 0;
    PlayerMe.exp = 0;
    PlayerMe.vipExp = 0;
    PlayerMe.avatar = "";
    PlayerMe.spin = 0;
    PlayerMe.token = "";
    PlayerMe.messageCount = 0;
    PlayerMe.missionCount = 0;
    PlayerMe.vipLevel = 0;
    PlayerMe.vipPoint = 0;
    PlayerMe.vipName = "";
    PlayerMe.userType = 0;
};

cc.Global.bGetCaptcha = false;
cc.Global.captchaData = "";
cc.Global.getUrlCaptcha = function () {
    // cc.log("geturl captcha");
    var request = cc.loader.getXMLHttpRequest();
    request.open("GET", "http://207.148.74.112:8082/captcha/", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function () {
        // cc.log(request.readyState);
        if (request.readyState === 4 && (request.status >= 200 && request.status <= 207)) {
            //get status text
            // var httpStatus = request.statusText;
            // var httpText = request.responseText;

            // cc.log("httpStatus: " + httpStatus);
            var data = JSON.parse(request.responseText);
            // cc.log("responseText " + httpText + " " + JSON.stringify(data));
            cc.Global.captchaData = data;
            cc.Global.bGetCaptcha = true;
        }
    };
    request.send();
};

cc.Global.isVerify = false;
cc.Global.sendVerifyCaptcha = function (tokenCaptcha, captcha, callback) {
    // cc.log("verifyCaptcha: " + tokenCaptcha + " - captcha: " + captcha);
    var request = cc.loader.getXMLHttpRequest();
    request.open("POST", "http://207.148.74.112:8082/verify/", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    request.onreadystatechange = function () {
        if (request.readyState === 4 && (request.status >= 200 && request.status <= 207)) {
            // var httpStatus = request.statusText;
            // var httpText = request.responseText;

            // cc.log("httpStatus: " + httpStatus);
            var data = JSON.parse(request.responseText);
            // cc.log("responseText " + httpText + " - " + JSON.stringify(data));
            // cc.log(data["isVerify"]);
            // cc.Global.captchaData = data;
            cc.Global.isVerify = data["isVerify"];
            // cc.log("cc.Global.isVerify: " + cc.Global.isVerify);
            if (callback) {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }
    };
    request.send("token=" + tokenCaptcha + "&captcha=" + captcha);
};

cc.Global.IsNumber = function (str) {
    var numberText = str.replace(/[.,]/g, '');
    var re = new RegExp("^[0-9]+$");
    return re.test(numberText);
};

if (cc.sys.isNative) {
    ccui.Slider.prototype._ctor = function (barTextureName, normalBallTextureName, resType) {
        this.init();
        if (barTextureName) {
            this.loadBarTexture(barTextureName, resType);
        }
        if (normalBallTextureName) {
            this.loadSlidBallTextureNormal(normalBallTextureName, resType);
        }
    };
}

cc.Global.openURL = function (url) {
    if (cc.sys.isNative) {
        cc.Application.getInstance().openURL(url);
    }
    else {
        var win = window.open(url, '_blank');
        win.focus();
    }
};

if (cc.sys.isNative) {
    ModuleManager.getInstance().getReadyModule = function () {
        return [];
    };
}

var Support = Support || {};
Support.callCenter = "";
Support.chatBot = "";
Support.fanpage = "";
Support.supportPhone = "";


var luckyHelp = "";

var arrBadWord = arrBadWord || [];
var moneyConfig = moneyConfig || [];
var placeList = placeList || [];

cc.Global.mapListLevel1 = {};
cc.Global.mapListLevel2 = {};
cc.Global.mapListLevel3 = {};

cc.Global.bodauTiengViet = function (str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
};

cc.Global.dictionaryCardCaothap = {}
cc.Global.dictionaryCardCaothap[0] = "3♠";
cc.Global.dictionaryCardCaothap[1] = "4♠";
cc.Global.dictionaryCardCaothap[2] = "5♠";
cc.Global.dictionaryCardCaothap[3] = "6♠";
cc.Global.dictionaryCardCaothap[4] = "7♠";
cc.Global.dictionaryCardCaothap[5] = "8♠";
cc.Global.dictionaryCardCaothap[6] = "9♠";
cc.Global.dictionaryCardCaothap[7] = "10♠";
cc.Global.dictionaryCardCaothap[8] = "J♠";
cc.Global.dictionaryCardCaothap[9] = "Q♠";
cc.Global.dictionaryCardCaothap[10] = "K♠";
cc.Global.dictionaryCardCaothap[11] = "A♠";
cc.Global.dictionaryCardCaothap[12] = "2♠";

cc.Global.dictionaryCardCaothap[13] = "3♣";
cc.Global.dictionaryCardCaothap[14] = "4♣";
cc.Global.dictionaryCardCaothap[15] = "5♣";
cc.Global.dictionaryCardCaothap[16] = "6♣";
cc.Global.dictionaryCardCaothap[17] = "7♣";
cc.Global.dictionaryCardCaothap[18] = "8♣";
cc.Global.dictionaryCardCaothap[19] = "9♣";
cc.Global.dictionaryCardCaothap[20] = "10♣";
cc.Global.dictionaryCardCaothap[21] = "J♣";
cc.Global.dictionaryCardCaothap[22] = "Q♣";
cc.Global.dictionaryCardCaothap[23] = "K♣";
cc.Global.dictionaryCardCaothap[24] = "A♣";
cc.Global.dictionaryCardCaothap[25] = "2♣";

cc.Global.dictionaryCardCaothap[26] = "3♦";
cc.Global.dictionaryCardCaothap[27] = "4♦";
cc.Global.dictionaryCardCaothap[28] = "5♦";
cc.Global.dictionaryCardCaothap[29] = "6♦";
cc.Global.dictionaryCardCaothap[30] = "7♦";
cc.Global.dictionaryCardCaothap[31] = "8♦";
cc.Global.dictionaryCardCaothap[32] = "9♦";
cc.Global.dictionaryCardCaothap[33] = "10♦";
cc.Global.dictionaryCardCaothap[34] = "J♦";
cc.Global.dictionaryCardCaothap[35] = "Q♦";
cc.Global.dictionaryCardCaothap[36] = "K♦";
cc.Global.dictionaryCardCaothap[37] = "A♦";
cc.Global.dictionaryCardCaothap[38] = "2♦";

cc.Global.dictionaryCardCaothap[39] = "3♥";
cc.Global.dictionaryCardCaothap[40] = "4♥";
cc.Global.dictionaryCardCaothap[41] = "5♥";
cc.Global.dictionaryCardCaothap[42] = "6♥";
cc.Global.dictionaryCardCaothap[43] = "7♥";
cc.Global.dictionaryCardCaothap[44] = "8♥";
cc.Global.dictionaryCardCaothap[45] = "9♥";
cc.Global.dictionaryCardCaothap[46] = "10♥";
cc.Global.dictionaryCardCaothap[47] = "J♥";
cc.Global.dictionaryCardCaothap[48] = "Q♥";
cc.Global.dictionaryCardCaothap[49] = "K♥";
cc.Global.dictionaryCardCaothap[50] = "A♥";
cc.Global.dictionaryCardCaothap[51] = "2♥";

cc.Global.implementInfiniteScroll = function (view, callback) {
    var selector = function (target, event) {
        if (event === ccui.ScrollView.EVENT_BOUNCE_BOTTOM) {
            if (view.performingInfiniteScroll)
                return;

            // prevent repeated call
            view.performingInfiniteScroll = true;

            var delay = new cc.DelayTime(1);
            var resumeListening = new cc.CallFunc(function () {
                view.performingInfiniteScroll = false;
            });

            view.runAction(new cc.Sequence(delay, resumeListening));
            callback();
        }
    };
    ccui.ScrollView.prototype.addEventListener.call(view, selector);
};

// preset game data
// cc.Global.gameData = JSON.parse('[{"id":6,"name":"Women' +
//     ' Agent","gameUrl":"","iconUrl":"icon_slotgame_womenagent.png","isReady":true},{"id":7,"name":"Maya","gameUrl":"","iconUrl":"icon_slotgame_maya.png","isReady":true},{"id":8,"name":"Zodiac","gameUrl":"","iconUrl":"icon_slotgame_womenagent.png","isReady":true}, {"id":10,"name":"Aladdin","gameUrl":"","iconUrl":"icon_slotgame_hauvuong.png","isReady":true}, {"id":11,"name":"Hero","gameUrl":"","iconUrl":"icon_slotgame_keongot.png","isReady":true}]');
cc.Global.gameData = JSON.parse('[' +
    '{"id":6,"name":"Women Agent","gameUrl":"","iconUrl":"icon_slotgame_womenagent.png","isReady":true},' +
    '{"id":7,"name":"Maya","gameUrl":"","iconUrl":"icon_slotgame_maya.png","isReady":true},' +
    '{"id":8,"name":"Zodiac","gameUrl":"","iconUrl":"icon_slotgame_hauvuong.png","isReady":true}, ' +
    '{"id":9,"name":"Three Kingdom","gameUrl":"","iconUrl":"icon_slotgame_womenagent.png","isReady":true},' +
    '{"id":10,"name":"Aladin","gameUrl":"","iconUrl":"icon_slotgame_hauvuong.png","isReady":true},' +
    '{"id":11,"name":"Hero","gameUrl":"","iconUrl":"icon_slotgame_maya.png","isReady":true}'+
    ']'
);
cc.Global.JackpotGameListData = cc.Global.gameData;
cc.Global.GameLayerJackpotData = JSON.parse('[{"name":"100","money":0},{"name":"1000","money":0},{"name":"10000","money":0}]');
cc.Global.GameLayerJackpotId = 2;
cc.Global.GameLayerBigJackpotVisible = true;

cc.Global.REGISTER_USERNAME_INVALID = -1001;
cc.Global.REGISTER_PASSWORD_INVALID = -1002;
cc.Global.REGISTER_USERNAME_TAKEN = -1003;
cc.Global.REGISTER_ERROR = -1004;

cc.Global.LOGIN_USER_NO_REGISTER = -1101;
cc.Global.LOGIN_PASSWORD_WRONG = -1102;
cc.Global.LOGIN_USER_BANNED = -1103;
cc.Global.LOGIN_ERROR = -1104;

cc.Global.EXTERNALLOGIN_REQUIRE_USERNAME = -1301;
cc.Global.EXTERNALLOGIN_USERNAME_TAKEN = -1302;
cc.Global.EXTERNALLOGIN_USERNAME_INVALID = -1303;
cc.Global.EXTERNALLOGIN_REQUIRE_EMAIL_PERMISSION = -1304;
cc.Global.EXTERNALLOGIN_TOKEN_INVALID = -1305;
cc.Global.EXTERNALLOGIN_UNKOWN_ERROR = -1306;
cc.Global.EXTERNALLOGIN_PROVIDER_INVALID = -1307;
cc.Global.EXTERNALLOGIN_USER_BANNED = -1308;

cc.Global.PHONELOGIN_PHONE_NO_REGISTER = -1201;
cc.Global.PHONELOGIN_PHONE_NO_VERIFY = -1202;
cc.Global.PHONELOGIN_WRONG_OTP = -1203;
cc.Global.PHONELOGIN_USER_BANNED = -1204;

cc.Global.CAPTCHA_NOT_MATCH = 7;


cc.Global.GetErrorMessage = function (errorCode) {
    var message = "";
    switch (errorCode) {
        case cc.Global.REGISTER_USERNAME_INVALID:
            message = MultiLanguage.getTextByKey("REGISTER_USERNAME_INVALID");
            break;
        case cc.Global.REGISTER_PASSWORD_INVALID:
            message = MultiLanguage.getTextByKey("REGISTER_PASSWORD_INVALID");
            break;
        case cc.Global.REGISTER_USERNAME_TAKEN:
            message = MultiLanguage.getTextByKey("REGISTER_USERNAME_TAKEN");
            break;
        case cc.Global.REGISTER_ERROR:
            message = MultiLanguage.getTextByKey("REGISTER_ERROR");
            break;
        case cc.Global.LOGIN_USER_NO_REGISTER:
            message = MultiLanguage.getTextByKey("LOGIN_USER_NO_REGISTER");
            break;
        case cc.Global.LOGIN_PASSWORD_WRONG:
            message = MultiLanguage.getTextByKey("LOGIN_PASSWORD_WRONG");
            break;
        case cc.Global.LOGIN_USER_BANNED:
            message = MultiLanguage.getTextByKey("LOGIN_USER_BANNED");
            break;
        case cc.Global.LOGIN_ERROR:
            message = MultiLanguage.getTextByKey("LOGIN_ERROR");
            break;
        case cc.Global.EXTERNALLOGIN_REQUIRE_USERNAME:
            message = MultiLanguage.getTextByKey("EXTERNALLOGIN_REQUIRE_USERNAME");
            break;
        case cc.Global.EXTERNALLOGIN_USERNAME_TAKEN:
            message = MultiLanguage.getTextByKey("EXTERNALLOGIN_USERNAME_TAKEN");
            break;
        case cc.Global.EXTERNALLOGIN_USERNAME_INVALID:
            message = MultiLanguage.getTextByKey("EXTERNALLOGIN_USERNAME_INVALID");
            break;
        case cc.Global.EXTERNALLOGIN_REQUIRE_EMAIL_PERMISSION:
            message = MultiLanguage.getTextByKey("EXTERNALLOGIN_REQUIRE_EMAIL_PERMISSION");
            break;
        case cc.Global.EXTERNALLOGIN_TOKEN_INVALID:
            message = MultiLanguage.getTextByKey("EXTERNALLOGIN_TOKEN_INVALID");
            break;
        case cc.Global.EXTERNALLOGIN_UNKOWN_ERROR:
            message = MultiLanguage.getTextByKey("EXTERNALLOGIN_UNKOWN_ERROR");
            break;
        case cc.Global.EXTERNALLOGIN_PROVIDER_INVALID:
            message = MultiLanguage.getTextByKey("EXTERNALLOGIN_PROVIDER_INVALID");
            break;
        case cc.Global.EXTERNALLOGIN_USER_BANNED:
            message = MultiLanguage.getTextByKey("EXTERNALLOGIN_USER_BANNED");
            break;
        case cc.Global.PHONELOGIN_PHONE_NO_REGISTER:
            message = MultiLanguage.getTextByKey("PHONELOGIN_PHONE_NO_REGISTER");
            break;
        case cc.Global.PHONELOGIN_PHONE_NO_VERIFY:
            message = MultiLanguage.getTextByKey("PHONELOGIN_PHONE_NO_VERIFY");
            break;
        case cc.Global.PHONELOGIN_WRONG_OTP:
            message = MultiLanguage.getTextByKey("PHONELOGIN_WRONG_OTP");
            break;
        case cc.Global.PHONELOGIN_USER_BANNED:
            message = MultiLanguage.getTextByKey("PHONELOGIN_USER_BANNED");
            break;
        case cc.Global.CAPTCHA_NOT_MATCH:
            message = MultiLanguage.getTextByKey("CAPTCHA_NOT_MATCH");
        default:
            message = MultiLanguage.getTextByKey("UNKNOW_LOGIN_ERROR");
            break;
    }
    return message;
};

cc.Global.isShowLuckyDialog = true;

cc.Global.runActionNumber = function (label, targetValue, startValue, duration) {
    if (!label)
        return;

    duration = duration > 0 ? duration : 1;
    startValue = startValue || 0;

    label.setString(startValue);
    // label.runAction(new quyetnd.ActionNumber(duration, targetValue));
};
