/**
 * Created by VGA on 5/29/2017.
 */
var KingIDSDK = (function () {
    var instance = null;
    var className = "";
    // if (cc.sys.os === cc.sys.OS_IOS)
    //     className = "KingIDNativeSDK";
    // else if (cc.sys.os === cc.sys.OS_ANDROID)
    //     className = "anhvt/plugin/kingid/KingIDSDKPlugin";

    var Clazz = cc.Class.extend({

        ctor: function () {
            if (instance)
                throw "Can not create new instance of a singleton class";
            else {
                this._loginSuccessCallback = null;
                this._loginSuccessCallbackTarget = null;

                this._closeLoginFormCallBack = null;
                this._closeLoginFormCallBackTarget = null;

                this._logoutSuccessCallback = null;
                this._logoutSuccessCallbackTarget = null;

                this._paymentSuccessCallback = null;
                this._paymentSuccessCallbackTarget = null;

                this._getIAPListCallback = null;
                this._getIAPListCallbackTarget = null;

                this._getVipInformationCallback = null;
                this._getVipInformationCallbackTarget = null;

                this._getListVipPointCallback = null;
                this._getListVipPointCallbackTarget = null;

                this._enterPromotionCodeCallback = null;
                this._enterPromotionCodeCallbackTarget = null;

                this._getListAgencyCallback = null;
                this._getListAgencyCallbackTarget = null;
            }
        },

        jsReady: function () {
            var params = [className, "nativeJsReady"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");

            jsb.reflection.callStaticMethod.apply(this,params);
        },

        autoLogin: function (callback,target) {
            cc.log("autoLogin SDK");
            var params = [className, "nativeAutoLogin"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");

            jsb.reflection.callStaticMethod.apply(this,params);
            this._loginSuccessCallback = callback || this._loginSuccessCallback;
            this._loginSuccessCallbackTarget = target || this._loginSuccessCallbackTarget;
        },

        manualLogin: function (callback,target) {
            cc.log("manualLogin SDK");
            var params = [className, "nativeManualLogin"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");

            jsb.reflection.callStaticMethod.apply(this,params);
            this._loginSuccessCallback = callback || this._loginSuccessCallback;
            this._loginSuccessCallbackTarget = target || this._loginSuccessCallbackTarget;
        },

        logout: function (flag,callback,target) {
            var params = [className, "nativeLogout"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("(Z)V");
            else if(cc.sys.os === cc.sys.OS_IOS){
                params[1] = "nativeLogout:";
            }
            params.push(flag);

            jsb.reflection.callStaticMethod.apply(this,params);
            this._logoutSuccessCallback = callback || this._logoutSuccessCallback;
            this._logoutSuccessCallbackTarget = target || this._logoutSuccessCallbackTarget;
        },

        openFacebookFanpage: function () {
            if (cc.sys.isNative) {
                var params = [className, "nativeOpenFb"];
                if (cc.sys.os === cc.sys.OS_ANDROID)
                    params.push("(Ljava/lang/String;)V");
                else if(cc.sys.os === cc.sys.OS_IOS){
                    params[1] = "nativeOpenFbWithString:";
                }
                params.push(cc.Global.fanpage);
                jsb.reflection.callStaticMethod.apply(this,params);
            }
            else
                window.open(cc.Global.fanpage.replace("fb://page", "https://facebook.com"));
        },

        getListIAP: function (callback,target) {
            var params = [className, "nativeGetListIAP"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");
            
            jsb.reflection.callStaticMethod.apply(this,params);
            this._getIAPListCallback = callback || this._getIAPListCallback;
            this._getIAPListCallbackTarget = target || this._getIAPListCallbackTarget;
        },

        showUserInfo: function () {
            var params = [className, "nativeShowUserInfo"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");
            
            jsb.reflection.callStaticMethod.apply(this,params);
        },

        showFormTransactionHistory: function () {
            var params = [className, "nativeShowFormTransactionHistory"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");
                
            jsb.reflection.callStaticMethod.apply(this,params);
        },

        showFormFriends: function () {
            var params = [className, "nativeShowFormFriends"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");

            jsb.reflection.callStaticMethod.apply(this,params);
        },

        getAvatarLink: function (callback,target) {
            if (cc.sys.os === cc.sys.OS_IOS){
                this.getAvatarLinkIOS(callback,target);
                return;
            }
            var link = jsb.reflection.callStaticMethod(className, "nativeGetAvatarLink", "()Ljava/lang/String;");
            if (callback){
                callback.call(target,link);
            }
            return link;
        },

        getAvatarLinkIOS: function(callback,target) {
            jsb.reflection.callStaticMethod(className, "nativeGetAvatarLink");
            this._getAvatarLinkCallback = callback;
            this._getAvatarLinkCallbackTarget = target;
        },

        showViewListAgency: function () {
            var params = [className, "nativeShowViewListAgency"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");
            
            jsb.reflection.callStaticMethod.apply(this,params);
        },

        doTransfer :function (username) {
            var params = [className, "nativeDoTransfer"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("(Ljava/lang/String;)V");
            else if(cc.sys.os === cc.sys.OS_IOS){
                params[1] = "nativeDoTransfer:";
            }
            params.push(username);

            jsb.reflection.callStaticMethod.apply(this,params);
        },

        getVipInformation: function (callback,target) {
            var params = [className, "nativeGetVipInformation"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");
            
            jsb.reflection.callStaticMethod.apply(this,params);
            this._getVipInformationCallback = callback || this._getVipInformationCallback;
            this._getVipInformationCallbackTarget = target || this._getVipInformationCallbackTarget;
        },

        getListVipPoint: function (callback,target) {
            var params = [className, "nativeGetListVipPoint"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");
            
            jsb.reflection.callStaticMethod.apply(this,params);
            this._getListVipPointCallback = callback || this._getListVipPointCallback;
            this._getListVipPointCallbackTarget = target || this._getListVipPointCallbackTarget;
        },

        enterPromotionCode: function (giftCode,callback,target) {
            var params = [className, "nativeEnterPromotionCode"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("(Ljava/lang/String;)V");
            else if(cc.sys.os === cc.sys.OS_IOS){
                params[1] = "nativeEnterPromotionCode:";
            }
            params.push(giftCode);

            jsb.reflection.callStaticMethod.apply(this,params);
            this._enterPromotionCodeCallback = callback || this._enterPromotionCodeCallback;
            this._enterPromotionCodeCallbackTarget = target || this._enterPromotionCodeCallbackTarget;
        },

        getListAgency: function (callback,target) {
            var params = [className, "nativeGetListAgency"];
            if (cc.sys.os === cc.sys.OS_ANDROID)
                params.push("()V");
            
            jsb.reflection.callStaticMethod.apply(this,params);
            this._getListAgencyCallback = callback || this._getListAgencyCallback;
            this._getListAgencyCallbackTarget = target || this._getListAgencyCallbackTarget;
        },

        setLoginSuccessCallback: function (callback, target) {
            this._loginSuccessCallback = callback;
            this._loginSuccessCallbackTarget = target;
        },

        setCloseLoginFormCallback: function (callback, target) {
            this._closeLoginFormCallBack = callback;
            this._closeLoginFormCallBackTarget = target;
        },

        setLogoutSuccessCallback: function (callback, target) {
            this._logoutSuccessCallback = callback;
            this._logoutSuccessCallbackTarget = target;
        },

        setPaymentSuccessCallback: function (callback, target) {
            this._paymentSuccessCallback = callback;
            this._paymentSuccessCallbackTarget = target;
        },

        setGetIAPListCallback: function (callback, target) {
            this._getIAPListCallback = callback;
            this._getIAPListCallbackTarget = target;
        },

        setGetVipInformationCallback: function (callback, target) {
            this._getVipInformationCallback = callback;
            this._getVipInformationCallbackTarget = target;
        },

        setGetListVipPointCallback: function (callback, target) {
            this._getListVipPointCallback = callback;
            this._getListVipPointCallbackTarget = target;
        },

        setEnterPromotionCodeCallback: function (callback, target) {
            this._enterPromotionCodeCallback = callback;
            this._enterPromotionCodeCallbackTarget = target;
        },

        setGetListAgencyCallback: function (callback, target) {
            this._getListAgencyCallback = callback;
            this._getListAgencyCallbackTarget = target;
        },

        _onLoginSuccess: function (data) {
            cc.log("onLoginSuccess");
            cc.log(JSON.stringify(data));
            // if (!this._loginSuccessCallback)
            //     return;
            // this._loginSuccessCallback.call(this._loginSuccessCallbackTarget, data);
        },

        _onCloseLoginForm: function () {
            cc.log("onCloseLoginForm");
            if (!this._closeLoginFormCallBack)
                return;
            this._closeLoginFormCallBack.call(this._closeLoginFormCallBackTarget);
        },

        _onLogoutSuccess: function () {
            cc.log("onLogoutSuccess");
            if (!this._logoutSuccessCallback)
                return;
            this._logoutSuccessCallback.call(this._logoutSuccessCallbackTarget);
        },

        _onPaymentSuccess: function (data) {
            cc.log("onPaymentSuccess");
            cc.log(JSON.stringify(data));
            if (!this._paymentSuccessCallback)
                return;
            this._paymentSuccessCallback.call(this._paymentSuccessCallbackTarget, data);
        },

        _onGetAvatarLinkCallback: function(data){
            cc.log("onGetAvatarLink");
            if (!this._getAvatarLinkCallback)
                return;
            this._getAvatarLinkCallback.call(this._getAvatarLinkCallbackTarget, data);
        },

        _onGetIAPListCallback: function (isSuccess, result) {
            cc.log("onGetIAPListCallback : " + (isSuccess ? "Success" : "Failed"));
            cc.log(JSON.stringify(result));
            if (!this._getIAPListCallback)
                return;
            this._getIAPListCallback.apply(this._getIAPListCallbackTarget, arguments);
        },

        _onGetVipInformationCallback: function (isSuccess, result) {
            cc.log("onGetVipInformationCallback : " + (isSuccess ? "Success" : "Failed"));
            cc.log(JSON.stringify(result));
            if (!this._getVipInformationCallback)
                return;
            this._getVipInformationCallback.apply(this._getVipInformationCallbackTarget, arguments);
        },

        _onGetListVipPointCallback: function (isSuccess, result) {
            cc.log("onGetListVipPointCallback : " + (isSuccess ? "Success" : "Failed"));
            cc.log(JSON.stringify(result));
            if (!this._getListVipPointCallback)
                return;
            this._getListVipPointCallback.apply(this._getListVipPointCallbackTarget, arguments);
        },

        _onEnterPromotionCodeCallback: function (isSuccess, result) {
            cc.log("onEnterPromotionCodeCallback : " + (isSuccess ? "Success" : "Failed"));
            cc.log(JSON.stringify(result));
            if (!this._enterPromotionCodeCallback)
                return;
            this._enterPromotionCodeCallback.apply(this._enterPromotionCodeCallbackTarget, arguments);
        },

        _onGetListAgencyCallback: function (isSuccess, result) {
            cc.log("onGetListAgencyCallback : " + (isSuccess ? "Success" : "Failed"));
            cc.log(JSON.stringify(result));
            if (!this._getListAgencyCallback)
                return;
            this._getListAgencyCallback.apply(this._getListAgencyCallbackTarget, arguments);
        }

    });
    Clazz.getInstance = function () {
        if (!instance)
            instance = new Clazz();

        return instance;
    };

    return Clazz;
})();

//test
// (function () {
//     var fns = [
//         KingIDSDK.getInstance().autoLogin,
//         KingIDSDK.getInstance().manualLogin,
//         KingIDSDK.getInstance().getListIAP,
//         KingIDSDK.getInstance().showUserInfo,
//         KingIDSDK.getInstance().showFormTransactionHistory,
//         // KingIDSDK.getInstance().showFormFriends,
//         KingIDSDK.getInstance().getAvatarLink,
//         KingIDSDK.getInstance().showViewListAgency,
//         KingIDSDK.getInstance().getVipInformation,
//         KingIDSDK.getInstance().getListVipPoint,
//         KingIDSDK.getInstance().getListAgency
//     ];
//
//     var timeout = 4000;
//     for (var i = 0; i < fns.length; i++) {
//         setTimeout(function (fn) {
//             fn.call();
//         }, timeout += 1000, fns[i]);
//     }
// })();