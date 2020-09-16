"use strict";

/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var SystemPlugin = function () {
    var instance = null;
    var Clazz = cc.Class.extend({
        plugin: null,
        ctor: function ctor() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                //init
            }
        },

        getPackageName: function getPackageName() {
            return "com.loc.club";
        },

        getVersionName: function getVersionName() {
            return "1.0";
        },

        getDeviceUUID: function getDeviceUUID() {
            var uniqueId = localStorage.getItem("___uniqueId___");
            if (!uniqueId) {
                (function () {
                    var s4 = function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                    };

                    uniqueId = function () {
                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
                    }();
                    localStorage.setItem("___uniqueId___", uniqueId);
                })();
            }
            return uniqueId;
        },

        getDeviceUUIDWithKey: function getDeviceUUIDWithKey(key) {
            return this.getDeviceUUID();
        },

        buyIAPItem: function buyIAPItem(itemBundle) {},

        iOSInitStore: function iOSInitStore(itemList) {},

        //event
        // onBuyItemFinishAndroid : function (returnCode, signature, json) {
        //
        // },
        //
        // onBuyItemFinishIOS : function (returnCode, signature) {
        //
        // },
        //
        // onRegisterNotificationSuccess : function (deviceId, token) {
        //
        // },
        exitApp: function exitApp() {},
        enableMipmapTexture: function enableMipmapTexture(texture) {},
        showCallPhone: function showCallPhone(phoneNumber) {},
        androidRequestPermission: function androidRequestPermission(permissions, requestCode) {},
        androidCheckPermission: function androidCheckPermission(permission) {},
        startLaucher: function startLaucher() {},
        checkFileValidate: function checkFileValidate(file) {},
        showSMS: function showSMS(smsNumber, smsContent) {},
        getCarrierName: function getCarrierName() {},
        getPushNotificationToken: function getPushNotificationToken() {},
        downloadFile: function downloadFile(url, savePath, callback) {},
        showImagePicker: function showImagePicker(maxWidth, maxHeight, maxRatio) {
            if (maxWidth) {
                this._imagePickerMaxWidth = maxWidth;
                this._imagePickerMaxHeight = maxHeight;
            } else {
                this._imagePickerMaxWidth = 0;
                this._imagePickerMaxHeight = 0;
            }
            this._requireRatio = maxRatio;
            window.showImagePicker();
        },
        onTakeImageData: function onTakeImageData(base64Data) {
            cc.log(base64Data);
        }
    });

    Clazz.getInstance = function () {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };
    return Clazz;
}();

window._htmlProcressImageSelect = function (imgData) {
    var img = document.createElement("img");
    img.onload = function () {
        var requireRatio = SystemPlugin.getInstance()._requireRatio;
        if (requireRatio && requireRatio > 0) {
            var maxRatio = requireRatio > 1.0 / requireRatio ? requireRatio : 1.0 / requireRatio;
            var minRatio = requireRatio < 1.0 / requireRatio ? requireRatio : 1.0 / requireRatio;
            var imgRatio = img.width / img.height;
            if (imgRatio > maxRatio || imgRatio < minRatio) {
                SystemPlugin.getInstance().onTakeImageData("invalid_ratio");
                return;
            }
        }

        var MAX_WIDTH = SystemPlugin.getInstance()._imagePickerMaxWidth;
        var MAX_HEIGHT = SystemPlugin.getInstance()._imagePickerMaxHeight;
        if (!MAX_WIDTH) {
            MAX_WIDTH = img.width;
            MAX_HEIGHT = img.height;
        }
        var width = img.width;
        var height = img.height;

        var ratioX = MAX_WIDTH / width;
        var ratioY = MAX_HEIGHT / height;
        var ratio = ratioX < ratioY ? ratioX : ratioY;
        if (ratio < 1.0) {
            width *= ratio;
            height *= ratio;
        }

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        var newImage = document.createElement("img");
        newImage.onload = function () {
            var imgBitmap = new quyetnd.ImageBitmap(newImage);
            SystemPlugin.getInstance().onTakeImageData(imgBitmap);
        };
        newImage.src = ctx.canvas.toDataURL("image/jpeg");
    };
    img.src = imgData;
};
