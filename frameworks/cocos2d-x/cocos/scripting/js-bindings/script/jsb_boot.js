cc.AsyncPool = function (srcObj, limit, iterator, onEnd, target) {
    var self = this;
    self._srcObj = srcObj;
    self._limit = limit;
    self._pool = [];
    self._iterator = iterator;
    self._iteratorTarget = target;
    self._onEnd = onEnd;
    self._onEndTarget = target;
    self._results = srcObj instanceof Array ? [] : {};
    self._isErr = false;
    cc.each(srcObj, function (value, index) {
        self._pool.push({index: index, value: value})
    });
    self.size = self._pool.length;
    self.finishedSize = 0;
    self._workingSize = 0;
    self._limit = self._limit || self.size;
    self.onIterator = function (iterator, target) {
        self._iterator =
            iterator;
        self._iteratorTarget = target
    };
    self.onEnd = function (endCb, endCbTarget) {
        self._onEnd = endCb;
        self._onEndTarget = endCbTarget
    };
    self._handleItem = function () {
        var self = this;
        if (self._pool.length == 0) return;
        if (self._workingSize >= self._limit) return;
        var item = self._pool.shift();
        var value = item.value, index = item.index;
        self._workingSize++;
        self._iterator.call(self._iteratorTarget, value, index, function (err) {
            if (self._isErr) return;
            self.finishedSize++;
            self._workingSize--;
            if (err) {
                self._isErr = true;
                if (self._onEnd) self._onEnd.call(self._onEndTarget,
                    err);
                return
            }
            var arr = Array.prototype.slice.call(arguments, 1);
            self._results[this.index] = arr[0];
            if (self.finishedSize === self.size) {
                if (self._onEnd) self._onEnd.call(self._onEndTarget, null, self._results);
                return
            }
            self._handleItem()
        }.bind(item), self)
    };
    self.flow = function () {
        var self = this;
        if (self._pool.length === 0) {
            if (self._onEnd) self._onEnd.call(self._onEndTarget, null, []);
            return
        }
        for (var i = 0; i < self._limit; i++) self._handleItem()
    }
};
cc.async = {
    series: function (tasks, cb, target) {
        var asyncPool = new cc.AsyncPool(tasks, 1, function (func, index, cb1) {
            func.call(target, cb1)
        }, cb, target);
        asyncPool.flow();
        return asyncPool
    }, parallel: function (tasks, cb, target) {
        var asyncPool = new cc.AsyncPool(tasks, 0, function (func, index, cb1) {
            func.call(target, cb1)
        }, cb, target);
        asyncPool.flow();
        return asyncPool
    }, waterfall: function (tasks, cb, target) {
        var args = [];
        var lastResults = [null];
        var asyncPool = new cc.AsyncPool(tasks, 1, function (func, index, cb1) {
            args.push(function (err) {
                args =
                    Array.prototype.slice.call(arguments, 1);
                if (tasks.length - 1 === index) lastResults = lastResults.concat(args);
                cb1.apply(null, arguments)
            });
            func.apply(target, args)
        }, function (err) {
            if (!cb) return;
            if (err) return cb.call(target, err);
            cb.apply(target, lastResults)
        });
        asyncPool.flow();
        return asyncPool
    }, map: function (tasks, iterator, callback, target) {
        var locIterator = iterator;
        if (typeof iterator === "object") {
            callback = iterator.cb;
            target = iterator.iteratorTarget;
            locIterator = iterator.iterator
        }
        var asyncPool = new cc.AsyncPool(tasks,
            0, locIterator, callback, target);
        asyncPool.flow();
        return asyncPool
    }, mapLimit: function (tasks, limit, iterator, cb, target) {
        var asyncPool = new cc.AsyncPool(tasks, limit, iterator, cb, target);
        asyncPool.flow();
        return asyncPool
    }
};
cc.path = {
    normalizeRE: /[^\.\/]+\/\.\.\//, join: function () {
        var l = arguments.length;
        var result = "";
        for (var i = 0; i < l; i++) result = (result + (result === "" ? "" : "/") + arguments[i]).replace(/(\/|\\\\)$/, "");
        return result
    }, extname: function (pathStr) {
        var temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(pathStr);
        return temp ? temp[1] : null
    }, mainFileName: function (fileName) {
        if (fileName) {
            var idx = fileName.lastIndexOf(".");
            if (idx !== -1) return fileName.substring(0, idx)
        }
        return fileName
    }, basename: function (pathStr, extname) {
        var index = pathStr.indexOf("?");
        if (index > 0) pathStr = pathStr.substring(0, index);
        var reg = /(\/|\\\\)([^(\/|\\\\)]+)$/g;
        var result = reg.exec(pathStr.replace(/(\/|\\\\)$/, ""));
        if (!result) return null;
        var baseName = result[2];
        if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() === extname.toLowerCase()) return baseName.substring(0, baseName.length - extname.length);
        return baseName
    }, dirname: function (pathStr) {
        return pathStr.replace(/((.*)(\/|\\|\\\\))?(.*?\..*$)?/, "$2")
    }, changeExtname: function (pathStr, extname) {
        extname = extname ||
            "";
        var index = pathStr.indexOf("?");
        var tempStr = "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index)
        }
        index = pathStr.lastIndexOf(".");
        if (index < 0) return pathStr + extname + tempStr;
        return pathStr.substring(0, index) + extname + tempStr
    }, changeBasename: function (pathStr, basename, isSameExt) {
        if (basename.indexOf(".") === 0) return this.changeExtname(pathStr, basename);
        var index = pathStr.indexOf("?");
        var tempStr = "";
        var ext = isSameExt ? this.extname(pathStr) : "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index)
        }
        index = pathStr.lastIndexOf("/");
        index = index <= 0 ? 0 : index + 1;
        return pathStr.substring(0, index) + basename + ext + tempStr
    }, _normalize: function (url) {
        var oldUrl = url = String(url);
        do {
            oldUrl = url;
            url = url.replace(this.normalizeRE, "")
        } while (oldUrl.length !== url.length);
        return url
    }
};
cc.loader = {
    _resPath: "", _audioPath: "", _register: {}, cache: {}, _langPathCache: {}, getXMLHttpRequest: function () {
        return new XMLHttpRequest
    }, _jsCache: {}, _getArgs4Js: function (args) {
        var a0 = args[0], a1 = args[1], a2 = args[2], results = ["", null, null];
        if (args.length === 1) results[1] = a0 instanceof Array ? a0 : [a0]; else if (args.length === 2) if (typeof a1 === "function") {
            results[1] = a0 instanceof Array ? a0 : [a0];
            results[2] = a1
        } else {
            results[0] = a0 || "";
            results[1] = a1 instanceof Array ? a1 : [a1]
        } else if (args.length === 3) {
            results[0] = a0 || "";
            results[1] =
                a1 instanceof Array ? a1 : [a1];
            results[2] = a2
        } else throw new Error("arguments error to load js!");
        return results
    }, loadJs: function (baseDir, jsList, cb) {
        var self = this, localJsCache = self._jsCache, args = self._getArgs4Js(arguments);
        baseDir = args[0];
        jsList = args[1];
        cb = args[2];
        var ccPath = cc.path;
        for (var i = 0, li = jsList.length; i < li; ++i) require(ccPath.join(baseDir, jsList[i]));
        if (cb) cb()
    }, loadJsWithImg: function (baseDir, jsList, cb) {
        this.loadJs.apply(this, arguments)
    }, loadTxt: function (url, cb) {
        cc.log("loadTxt url: " + url);
        cb(null, jsb.fileUtils.getStringFromFile(url))
    },
    loadJson: function (url, cb) {
        this.loadTxt(url, function (err, txt) {
            try {
                err ? cb(err) : cb(null, JSON.parse(txt))
            } catch (e) {
                throw e;
                cb("load json [" + url + "] failed : " + e)
            }
        })
    }, loadImg: function (url, option, cb) {
        var l = arguments.length;
        if (l == 2) cb = option;
        var cachedTex = cc.textureCache.getTextureForKey(url);
        if (cachedTex) cb && cb(null, cachedTex); else if (url.match(jsb.urlRegExp)) jsb.loadRemoteImg(url, function (succeed, tex) {
            if (succeed) cb && cb(null, tex); else cb && cb("Load image failed")
        }); else cc.textureCache._addImageAsync(url,
            function (tex) {
                if (tex instanceof cc.Texture2D) cb && cb(null, tex); else cb && cb("Load image failed")
            })
    }, loadBinary: function (url, cb) {
        cb(null, jsb.fileUtils.getDataFromFile(url))
    }, loadBinarySync: function (url) {
        return jsb.fileUtils.getDataFromFile(url)
    }, _loadResIterator: function (item, index, cb) {
        var self = this, url = null;
        var type = item.type;
        if (type) {
            type = "." + type.toLowerCase();
            url = item.src ? item.src : item.name + type
        } else {
            url = item;
            type = cc.path.extname(url)
        }
        var obj = self.cache[url];
        if (obj) return cb(null, obj);
        var loader =
            null;
        if (type) loader = self._register[type.toLowerCase()];
        if (!loader) {
            cc.error("loader for [" + type + "] not exists!");
            return cb()
        }
        var basePath = loader.getBasePath ? loader.getBasePath() : self.resPath;
        var realUrl = self.getUrl(basePath, url);
        loader.load(realUrl, url, item, function (err, data) {
            if (err) {
                cc.log(err);
                self.cache[url] = null;
                delete self.cache[url];
                cb()
            } else {
                self.cache[url] = data;
                cb(null, data)
            }
        })
    }, getUrl: function (basePath, url) {
        var self = this, langPathCache = self._langPathCache, path = cc.path;
        if (basePath !== undefined &&
            url === undefined) {
            url = basePath;
            var type = path.extname(url);
            type = type ? type.toLowerCase() : "";
            var loader = self._register[type];
            if (!loader) basePath = self.resPath; else basePath = loader.getBasePath ? loader.getBasePath() : self.resPath
        }
        url = cc.path.join(basePath || "", url);
        if (url.match(/[\/(\\\\)]lang[\/(\\\\)]/i)) {
            if (langPathCache[url]) return langPathCache[url];
            var extname = path.extname(url) || "";
            url = langPathCache[url] = url.substring(0, url.length - extname.length) + "_" + cc.sys.language + extname
        }
        return url
    }, load: function (resources,
                       option, loadCallback) {
        var self = this;
        var len = arguments.length;
        if (len === 0) throw new Error("arguments error!");
        if (len === 3) {
            if (typeof option === "function") if (typeof loadCallback === "function") option = {
                trigger: option,
                cb: loadCallback
            }; else option = {cb: option, cbTarget: loadCallback}
        } else if (len === 2) {
            if (typeof option === "function") option = {cb: option}
        } else if (len === 1) option = {};
        if (!(resources instanceof Array)) resources = [resources];
        var asyncPool = new cc.AsyncPool(resources, 0, function (value, index, AsyncPoolCallback, aPool) {
            self._loadResIterator(value,
                index, function (err) {
                    var arr = Array.prototype.slice.call(arguments, 1);
                    if (option.trigger) option.trigger.call(option.triggerTarget, arr[0], aPool.size, aPool.finishedSize);
                    AsyncPoolCallback(err, arr[0])
                })
        }, option.cb, option.cbTarget);
        asyncPool.flow();
        return asyncPool
    }, loadAliases: function (url, cb) {
        jsb.fileUtils.loadFilenameLookup(url);
        if (cb) cb()
    }, register: function (extNames, loader) {
        if (!extNames || !loader) return;
        var self = this;
        if (typeof extNames === "string") return this._register[extNames.trim().toLowerCase()] = loader;
        for (var i = 0, li = extNames.length; i < li; i++) self._register["." + extNames[i].trim().toLowerCase()] = loader
    }, getRes: function (url) {
        var cached = this.cache[url];
        if (cached) return cached;
        cc.log("getRes:" + url);
        cc.log("res length: " + url.length);
        var type = cc.path.extname(url);
        if (!type) return cc.log("cc.loader.getRes: Invalid url");
        var loader = this._register[type.toLowerCase()];
        if (!loader) return cc.log("cc.loader.getRes: loader for [" + type + "] not exists!");
        var basePath = loader.getBasePath ? loader.getBasePath() : this.resPath;
        var realUrl = this.getUrl(basePath, url);
        cc.log("realUrl:" + realUrl);
        return loader.load(realUrl,
            url)
    }, release: function (url) {
        var cache = this.cache;
        delete cache[url]
    }, releaseAll: function () {
        var locCache = this.cache;
        for (var key in locCache) delete locCache[key]
    }
};
cc.defineGetterSetter(cc.loader, "resPath", function () {
    return this._resPath
}, function (resPath) {
    this._resPath = resPath || "";
    jsb.fileUtils.addSearchPath(this._resPath)
});
cc.defineGetterSetter(cc.loader, "audioPath", function () {
    return this._audioPath
}, function (audioPath) {
    this._audioPath = audioPath || "";
    jsb.fileUtils.addSearchPath(this._audioPath)
});
cc.formatStr = function () {
    var args = arguments;
    var l = args.length;
    if (l < 1) return "";
    var REGEXP_NUM_OR_STR = /(%d)|(%s)/;
    var i = 1;
    var str = args[0];
    var hasSubstitution = typeof str === "string" && REGEXP_NUM_OR_STR.test(str);
    if (hasSubstitution) {
        var REGEXP_STR = /%s/;
        for (; i < l; ++i) {
            var arg = args[i];
            var regExpToTest = typeof arg === "number" ? REGEXP_NUM_OR_STR : REGEXP_STR;
            if (regExpToTest.test(str)) str = str.replace(regExpToTest, arg); else str += " " + arg
        }
    } else if (l > 1) for (; i < l; ++i) str += " " + args[i]; else str = "" + str;
    return str
};
cc.director = cc.Director.getInstance();
cc.director._actionManager = cc.director.getActionManager();
cc.director._scheduler = cc.director.getScheduler();
cc.winSize = cc.director.getWinSize();
cc.view = cc.director.getOpenGLView();
cc.view.getDevicePixelRatio = cc.view.getRetinaFactor;
cc.view.convertToLocationInView = function (tx, ty, relatedPos) {
    var _devicePixelRatio = cc.view.getDevicePixelRatio();
    return {
        x: _devicePixelRatio * (tx - relatedPos.left),
        y: _devicePixelRatio * (relatedPos.top + relatedPos.height - ty)
    }
};
cc.view.enableRetina = function (enabled) {
};
cc.view.isRetinaEnabled = function () {
    var sys = cc.sys;
    return sys.os == sys.OS_IOS || sys.os == sys.OS_OSX ? true : false
};
cc.view.adjustViewPort = function () {
};
cc.view.resizeWithBrowserSize = function () {
    return
};
cc.view.setResizeCallback = function () {
    return
};
cc.view.enableAutoFullScreen = function () {
    return
};
cc.view.isAutoFullScreenEnabled = function () {
    return true
};
cc.view._setDesignResolutionSize = cc.view.setDesignResolutionSize;
cc.view.setDesignResolutionSize = function (width, height, resolutionPolicy) {
    cc.view._setDesignResolutionSize(width, height, resolutionPolicy);
    cc.winSize = cc.director.getWinSize();
    cc.visibleRect.init()
};
cc.view.setRealPixelResolution = cc.view.setDesignResolutionSize;
cc.view.setResolutionPolicy = function (resolutionPolicy) {
    var size = cc.view.getDesignResolutionSize();
    cc.view.setDesignResolutionSize(size.width, size.height, resolutionPolicy)
};
cc.view.getCanvasSize = cc.view.getFrameSize;
cc.view.getVisibleSizeInPixel = cc.view.getVisibleSize;
cc.view.getVisibleOriginInPixel = cc.view.getVisibleOrigin;
cc.view.setContentTranslateLeftTop = function () {
    return
};
cc.view.getContentTranslateLeftTop = function () {
    return null
};
cc.view.setFrameZoomFactor = function () {
    return
};
cc.view.setOrientation = function () {
};
cc.DENSITYDPI_DEVICE = "device-dpi";
cc.DENSITYDPI_HIGH = "high-dpi";
cc.DENSITYDPI_MEDIUM = "medium-dpi";
cc.DENSITYDPI_LOW = "low-dpi";
cc.view.setTargetDensityDPI = function () {
};
cc.view.getTargetDensityDPI = function () {
    return cc.DENSITYDPI_DEVICE
};
cc.eventManager = cc.director.getEventDispatcher();
cc.audioEngine = cc.AudioEngine.getInstance();
cc.audioEngine.end = function () {
    this.stopMusic();
    this.stopAllEffects()
};
cc.audioEngine.features = {MULTI_CHANNEL: true, AUTOPLAY: true};
cc.configuration = cc.Configuration.getInstance();
cc.textureCache = cc.director.getTextureCache();
cc.TextureCache.prototype._addImageAsync = cc.TextureCache.prototype.addImageAsync;
cc.TextureCache.prototype.addImageAsync = function (url, cb, target) {
    var localTex = null;
    cc.loader.loadImg(url, function (err, tex) {
        if (err) tex = null;
        if (cb) cb.call(target, tex);
        localTex = tex
    });
    return localTex
};
cc.TextureCache.prototype._addImage = cc.TextureCache.prototype.addImage;
cc.TextureCache.prototype.addImage = function (url, cb, target) {
    if (typeof cb === "function") return this.addImageAsync(url, cb, target); else if (cb) return this._addImage(url, cb); else return this._addImage(url)
};
cc.shaderCache = cc.ShaderCache.getInstance();
cc.animationCache = cc.AnimationCache.getInstance();
cc.spriteFrameCache = cc.SpriteFrameCache.getInstance();
cc.plistParser = cc.PlistParser.getInstance();
cc.fileUtils = cc.FileUtils.getInstance();
cc.fileUtils.setPopupNotify(false);
cc.screen = {
    init: function () {
    }, fullScreen: function () {
        return true
    }, requestFullScreen: function (element, onFullScreenChange) {
        onFullScreenChange.call()
    }, exitFullScreen: function () {
        return false
    }, autoFullScreen: function (element, onFullScreenChange) {
        onFullScreenChange.call()
    }
};
jsb.fileUtils = cc.fileUtils;
delete cc.FileUtils;
delete cc.fileUtils;
jsb.reflection = {
    callStaticMethod: function () {
        cc.log("not supported on current platform")
    }
};
var _initSys = function () {
    cc.sys = window.sys || {};
    var sys = cc.sys;
    sys.LANGUAGE_ENGLISH = "en";
    sys.LANGUAGE_CHINESE = "zh";
    sys.LANGUAGE_FRENCH = "fr";
    sys.LANGUAGE_ITALIAN = "it";
    sys.LANGUAGE_GERMAN = "de";
    sys.LANGUAGE_SPANISH = "es";
    sys.LANGUAGE_DUTCH = "du";
    sys.LANGUAGE_RUSSIAN = "ru";
    sys.LANGUAGE_KOREAN = "ko";
    sys.LANGUAGE_JAPANESE = "ja";
    sys.LANGUAGE_HUNGARIAN = "hu";
    sys.LANGUAGE_PORTUGUESE = "pt";
    sys.LANGUAGE_ARABIC = "ar";
    sys.LANGUAGE_NORWEGIAN = "no";
    sys.LANGUAGE_POLISH = "pl";
    sys.LANGUAGE_TURKISH = "tr";
    sys.LANGUAGE_UKRAINIAN =
        "uk";
    sys.LANGUAGE_ROMANIAN = "ro";
    sys.LANGUAGE_BULGARIAN = "bg";
    sys.LANGUAGE_UNKNOWN = "unknown";
    sys.OS_IOS = "iOS";
    sys.OS_ANDROID = "Android";
    sys.OS_WINDOWS = "Windows";
    sys.OS_MARMALADE = "Marmalade";
    sys.OS_LINUX = "Linux";
    sys.OS_BADA = "Bada";
    sys.OS_BLACKBERRY = "Blackberry";
    sys.OS_OSX = "OS X";
    sys.OS_WP8 = "WP8";
    sys.OS_WINRT = "WINRT";
    sys.OS_UNKNOWN = "Unknown";
    sys.UNKNOWN = -1;
    sys.WIN32 = 0;
    sys.LINUX = 1;
    sys.MACOS = 2;
    sys.ANDROID = 3;
    sys.IPHONE = 4;
    sys.IPAD = 5;
    sys.BLACKBERRY = 6;
    sys.NACL = 7;
    sys.EMSCRIPTEN = 8;
    sys.TIZEN = 9;
    sys.WINRT = 10;
    sys.WP8 =
        11;
    sys.MOBILE_BROWSER = 100;
    sys.DESKTOP_BROWSER = 101;
    sys.BROWSER_TYPE_WECHAT = "wechat";
    sys.BROWSER_TYPE_ANDROID = "androidbrowser";
    sys.BROWSER_TYPE_IE = "ie";
    sys.BROWSER_TYPE_QQ = "qqbrowser";
    sys.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser";
    sys.BROWSER_TYPE_UC = "ucbrowser";
    sys.BROWSER_TYPE_360 = "360browser";
    sys.BROWSER_TYPE_BAIDU_APP = "baiduboxapp";
    sys.BROWSER_TYPE_BAIDU = "baidubrowser";
    sys.BROWSER_TYPE_MAXTHON = "maxthon";
    sys.BROWSER_TYPE_OPERA = "opera";
    sys.BROWSER_TYPE_OUPENG = "oupeng";
    sys.BROWSER_TYPE_MIUI = "miuibrowser";
    sys.BROWSER_TYPE_FIREFOX = "firefox";
    sys.BROWSER_TYPE_SAFARI = "safari";
    sys.BROWSER_TYPE_CHROME = "chrome";
    sys.BROWSER_TYPE_LIEBAO = "liebao";
    sys.BROWSER_TYPE_QZONE = "qzone";
    sys.BROWSER_TYPE_SOUGOU = "sogou";
    sys.BROWSER_TYPE_UNKNOWN = "unknown";
    sys.isNative = true;
    var platform = sys.platform = __getPlatform();
    sys.isMobile = platform === sys.ANDROID || platform === sys.IPAD || platform === sys.IPHONE || platform === sys.WP8 || platform === sys.TIZEN || platform === sys.BLACKBERRY ? true : false;
    sys._application = cc.Application.getInstance();
    sys.language =
        function () {
            var language = sys._application.getCurrentLanguage();
            switch (language) {
                case 0:
                    return sys.LANGUAGE_ENGLISH;
                case 1:
                    return sys.LANGUAGE_CHINESE;
                case 2:
                    return sys.LANGUAGE_FRENCH;
                case 3:
                    return sys.LANGUAGE_ITALIAN;
                case 4:
                    return sys.LANGUAGE_GERMAN;
                case 5:
                    return sys.LANGUAGE_SPANISH;
                case 6:
                    return sys.LANGUAGE_DUTCH;
                case 7:
                    return sys.LANGUAGE_RUSSIAN;
                case 8:
                    return sys.LANGUAGE_KOREAN;
                case 9:
                    return sys.LANGUAGE_JAPANESE;
                case 10:
                    return sys.LANGUAGE_HUNGARIAN;
                case 11:
                    return sys.LANGUAGE_PORTUGUESE;
                case 12:
                    return sys.LANGUAGE_ARABIC;
                case 13:
                    return sys.LANGUAGE_NORWEGIAN;
                case 14:
                    return sys.LANGUAGE_POLISH;
                case 15:
                    return sys.LANGUAGE_TURKISH;
                case 16:
                    return sys.LANGUAGE_UKRAINIAN;
                case 17:
                    return sys.LANGUAGE_ROMANIAN;
                case 18:
                    return sys.LANGUAGE_BULGARIAN;
                default:
                    return sys.LANGUAGE_ENGLISH
            }
        }();
    sys.os = __getOS();
    sys.browserType = null;
    sys.browserVersion = null;
    sys.windowPixelResolution = cc.view.getFrameSize();
    var capabilities = sys.capabilities = {"canvas": false, "opengl": true};
    if (sys.isMobile) {
        capabilities["accelerometer"] =
            true;
        capabilities["touches"] = true;
        if (platform === sys.WINRT || platform === sys.WP8) capabilities["keyboard"] = true
    } else {
        capabilities["keyboard"] = true;
        capabilities["mouse"] = true;
        if (platform === sys.WINRT || platform === sys.WP8) {
            capabilities["touches"] = true;
            capabilities["mouse"] = false
        }
    }
    sys.garbageCollect = function () {
        __jsc__.garbageCollect()
    };
    sys.dumpRoot = function () {
        __jsc__.dumpRoot()
    };
    sys.restartVM = function () {
        __restartVM()
    };
    sys.cleanScript = function (jsFile) {
        __cleanScript(jsFile)
    };
    sys.isObjectValid = function (obj) {
        return __isObjectValid(obj)
    };
    sys.dump = function () {
        var self = this;
        var str = "";
        str += "isMobile : " + self.isMobile + "\r\n";
        str += "language : " + self.language + "\r\n";
        str += "browserType : " + self.browserType + "\r\n";
        str += "capabilities : " + JSON.stringify(self.capabilities) + "\r\n";
        str += "os : " + self.os + "\r\n";
        str += "platform : " + self.platform + "\r\n";
        cc.log(str)
    };
    sys.openURL = function (url) {
        sys._application.openURL(url)
    };
    sys.now = function () {
        return Date.now()
    };
    if (window.JavascriptJavaBridge && cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection = new JavascriptJavaBridge;
        cc.sys.capabilities["keyboard"] = true
    } else if (window.JavaScriptObjCBridge && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX)) jsb.reflection = new JavaScriptObjCBridge
};
_initSys();
cc._initDebugSetting = function (mode) {
    var ccGame = cc.game;
    var bakLog = cc._cocosplayerLog || console.log || log;
    cc.log = cc.warn = cc.error = cc.assert = function () {
    };
    if (mode > ccGame.DEBUG_MODE_NONE) {
        console.log = function () {
            bakLog(cc.formatStr.apply(null, arguments))
        };
        console.error = function () {
            bakLog("ERROR :  " + cc.formatStr.apply(cc, arguments))
        };
        console.warn = function () {
            bakLog("WARN :  " + cc.formatStr.apply(cc, arguments))
        };
        cc.error = console.error;
        cc.assert = function (cond, msg) {
            if (!cond && msg) {
                var args = [];
                for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
                console.log("Assert: " + cc.formatStr.apply(cc, args))
            }
        };
        if (mode != ccGame.DEBUG_MODE_ERROR && mode != ccGame.DEBUG_MODE_ERROR_FOR_WEB_PAGE) cc.warn = console.warn;
        if (mode == ccGame.DEBUG_MODE_INFO || mode == ccGame.DEBUG_MODE_INFO_FOR_WEB_PAGE) cc.log = console.log
    }
};
cc._engineLoaded = false;
cc.initEngine = function (config, cb) {
    require("script/engine.js");
    cc._renderType = cc.game.RENDER_TYPE_OPENGL;
    cc._initDebugSetting(config[cc.game.CONFIG_KEY.debugMode]);
    cc._engineLoaded = true;
    cc.log(cc.ENGINE_VERSION);
    if (cb) cb()
};
cc.game = {
    DEBUG_MODE_NONE: 0,
    DEBUG_MODE_INFO: 1,
    DEBUG_MODE_WARN: 2,
    DEBUG_MODE_ERROR: 3,
    DEBUG_MODE_INFO_FOR_WEB_PAGE: 4,
    DEBUG_MODE_WARN_FOR_WEB_PAGE: 5,
    DEBUG_MODE_ERROR_FOR_WEB_PAGE: 6,
    EVENT_HIDE: "game_on_hide",
    EVENT_SHOW: "game_on_show",
    EVENT_RESIZE: "game_on_resize",
    RENDER_TYPE_CANVAS: 0,
    RENDER_TYPE_WEBGL: 1,
    RENDER_TYPE_OPENGL: 2,
    _eventHide: null,
    _eventShow: null,
    CONFIG_KEY: {
        width: "width",
        height: "height",
        engineDir: "engineDir",
        modules: "modules",
        debugMode: "debugMode",
        showFPS: "showFPS",
        frameRate: "frameRate",
        id: "id",
        renderMode: "renderMode",
        jsList: "jsList"
    },
    _paused: false,
    _prepareCalled: false,
    _prepared: false,
    _intervalId: null,
    config: null,
    onStart: null,
    onStop: null,
    setFrameRate: function (frameRate) {
        var self = this, config = self.config, CONFIG_KEY = self.CONFIG_KEY;
        config[CONFIG_KEY.frameRate] = frameRate;
        cc.director.setAnimationInterval(1 / frameRate)
    },
    step: function () {
        cc.director.mainLoop()
    },
    pause: function () {
        this._paused = true;
        cc.director.pause()
    },
    resume: function () {
        this._paused = false;
        cc.director.resume()
    },
    isPaused: function () {
        return this._paused
    },
    restart: function () {
        __restartVM()
    },
    end: function () {
        close()
    },
    prepare: function (cb) {
        var self = this, config = self.config, CONFIG_KEY = self.CONFIG_KEY;
        this._loadConfig();
        if (this._prepared) {
            if (cb) cb();
            return
        }
        if (this._prepareCalled) return;
        if (cc._engineLoaded) {
            this._prepareCalled = true;
            var jsList = config[CONFIG_KEY.jsList];
            if (jsList) cc.loader.loadJsWithImg(jsList, function (err) {
                if (err) throw new Error(err);
                self._prepared = true;
                if (cb) cb()
            }); else if (cb) cb();
            return
        }
        cc.initEngine(this.config, function () {
            self.prepare(cb)
        })
    },
    run: function (config, onStart) {
        if (typeof config === "function") cc.game.onStart = config; else {
            if (config) cc.game.config = config;
            if (typeof onStart === "function") cc.game.onStart = onStart
        }
        this.prepare(cc.game.onStart && cc.game.onStart.bind(cc.game))
    },
    _loadConfig: function () {
        if (this.config) this._initConfig(this.config); else try {
            var txt = jsb.fileUtils.getStringFromFile("project.json");
            var data = JSON.parse(txt);
            this._initConfig(data || {})
        } catch (e) {
            console.log("Failed to read or parse project.json");
            this._initConfig({})
        }
    },
    _initConfig: function (config) {
        var CONFIG_KEY = this.CONFIG_KEY;
        config[CONFIG_KEY.showFPS] = typeof config[CONFIG_KEY.showFPS] === "undefined" ? true : config[CONFIG_KEY.showFPS];
        config[CONFIG_KEY.engineDir] = config[CONFIG_KEY.engineDir] || "frameworks/cocos2d-html5";
        if (config[CONFIG_KEY.debugMode] == null) config[CONFIG_KEY.debugMode] = 0;
        config[CONFIG_KEY.frameRate] = config[CONFIG_KEY.frameRate] || 60;
        if (config[CONFIG_KEY.renderMode] == null) config[CONFIG_KEY.renderMode] = 0;
        this.config = config;
        cc.director.setDisplayStats(this.config[CONFIG_KEY.showFPS]);
        cc.director.setAnimationInterval(1 / this.config[CONFIG_KEY.frameRate])
    }
};
Function.prototype.bind = function (oThis) {
    if (!cc.isFunction(this)) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {
    }, fBound = function () {
        return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)))
    };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP;
    return fBound
};
jsb.urlRegExp = new RegExp("^" + "(?:(?:https?|ftp)://)" + "(?:\\S+(?::\\S*)?@)?" + "(?:" + "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" + "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" + "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" + "|" + "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" + "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" + "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" + "|" + "(?:localhost)" + ")" + "(?::\\d{2,5})?" + "(?:/\\S*)?" + "$", "i");
