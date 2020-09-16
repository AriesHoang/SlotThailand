var HomeDownloadManager = (function () {
    var instance = null;
    var Clazz = cc.Class.extend({
        ctor: function () {
            if (instance)
                throw "Can't create instance of singleton class";

            this.allDownloadProgress = {};
            this.allListener = {};
            this._downloading = {};

            GlobalEvent.getInstance().addListener(cc.sys.isNative ? "onUpdateModule" : "onLoadModule", function (evtName, params) {
                var percent = Math.floor(params.current * 100 / params.target);
                this.allDownloadProgress[params.module] = {
                    progress: percent,
                    isDownloading: true
                };
                this.postDownloadStatus(params.module, percent, true);
            }, this);
        },

        downloadModule: function (module, finishCallback) {
            if (!module)
                return;

            if (this._downloading[module.getName()])
                return;

            var thiz = this;
            this._downloading[module.getName()] = true;

            var loadCallback = function () {
                thiz._downloading[module.getName()] = undefined;
                thiz.allDownloadProgress[module.getName()] = {
                    progress: 100,
                    isDownloading: false
                };

                thiz.postDownloadStatus(module.getName(), 100, false);

                cc.Global.SetSetting(module.getName() + "downloaded", true);

                if (typeof (finishCallback) === "function")
                    finishCallback();
            };

            // queue
            this.postDownloadStatus(module.getName(), 0, true);
            thiz.allDownloadProgress[module.getName()] = {
                progress: 0,
                isDownloading: true
            };

            if (cc.sys.isNative)
                module.updateModule(function () {
                    loadCallback();
                });
            else
                module.loadModule(function () {
                    loadCallback();
                });
        },

        getModuleStatus: function (moduleName) {
            var retVal = this.allDownloadProgress[moduleName] || {
                progress: 0,
                isDownloading: false
            };

            retVal.downloaded = cc.Global.GetSetting(moduleName + "downloaded", false);
            return retVal;
        },

        addDownloadStatusListener: function (moduleName, callback, target) {
            var moduleListener = this.allListener[moduleName];
            if (!moduleListener) {
                moduleListener = [];
                this.allListener[moduleName] = moduleListener;
            }
            for (var i = 0; i < moduleListener.length; i++) {
                var listener = moduleListener[i];
                if (listener.target === target)
                    return;
            }
            moduleListener.push({
                listener: callback,
                target: target
            });
        },

        postDownloadStatus: function (moduleName, progress, isDownloading) {
            var arr = this.allListener[moduleName];
            if (arr) {
                this.isBlocked = true;
                for (var i = 0; i < arr.length;) {
                    var target = arr[i];
                    if (target) {
                        target.listener.apply(target.target, [moduleName, progress, isDownloading]);
                    }
                    else {
                        arr.splice(i, 1);
                        continue;
                    }
                    i++;
                }
                this.isBlocked = false;
            }
        },

        removeListener: function (target) {
            for (var key in this.allListener) {
                if (!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for (var i = 0; i < arr.length;) {
                    if (arr[i] && arr[i].target === target) {
                        if (this.isBlocked) {
                            arr[i] = null;
                        }
                        else {
                            arr.splice(i, 1);
                            continue;
                        }
                    }
                    i++;
                }
            }
        }
    });

    Clazz.getInstance = function () {
        if (!instance)
            instance = new Clazz();
        return instance;
    };

    return Clazz;
})();