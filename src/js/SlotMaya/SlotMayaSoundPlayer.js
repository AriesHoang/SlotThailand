var SlotMayaSoundPlayer = SlotMayaSoundPlayer || {};
var SlotMaya_s_sound_loop = SlotMaya_s_sound_loop || {};

SlotMayaSoundPlayer._createURL = function (sound) {
    var soundUrl = "res/SlotMaya/sound/" + sound + ".mp3";
    return soundUrl;
};

SlotMayaSoundPlayer._playSingleSound = function (sound, loop, cb) {
    if (cc.Global.GetSetting("sound", 0) === 1) {
        if (cb) {
            cb();
        }
        return;
    }

    var soundUrl = SlotMayaSoundPlayer._createURL(sound);

    if (cc.sys.isNative) {
        var audio = jsb.AudioEngine.play2d(soundUrl, loop);
        if (cb) {
            jsb.AudioEngine.setFinishCallback(audio, function () {
                cb();
            });
        }
    }
    else {
        var audio = cc.audioEngine.playEffect(soundUrl, loop, cb);
    }
    return audio;
};

SlotMayaSoundPlayer._playMultiSound = function (soundList, index) {
    if (index >= soundList.length) {
        return;
    }

    var audio = SlotMayaSoundPlayer._playSingleSound(soundList[index], false, function () {
        SlotMayaSoundPlayer._playMultiSound(soundList, (index + 1));
    });
};

SlotMayaSoundPlayer.playSound = function (sound, loop) {
    if (cc.isArray(sound)) {
        if (sound.length === 1) {
            SoundPlayer._playSingleSound(sound[0], false);
        }
        SlotMayaSoundPlayer._playMultiSound(sound, 0);
    }
    else {
        var soundLoop = !!loop;
        var soundID = SlotMayaSoundPlayer._playSingleSound(sound, soundLoop);
        if (soundLoop) {
            SlotMaya_s_sound_loop[sound] = soundID;
        }
    }
};

SlotMayaSoundPlayer.stopSound = function (sound) {
    var soundId = SlotMaya_s_sound_loop[sound];
    if (soundId !== null && soundId !== undefined) {
        if (cc.sys.isNative) {
            jsb.AudioEngine.stop(soundId);
        }
        else {
            cc.audioEngine.stopEffect(soundId);
        }
    }
    else {
        if (!cc.sys.isNative) {
            //stop for web
            var soundUrl = SlotMayaSoundPlayer._createURL(sound);
            var ap = cc.audioEngine._audioPool;
            for (var p in ap) {
                var list = ap[p];
                for (var i = 0; i < list.length; i++) {
                    var sound = list[i];
                    if (sound.src.endsWith(soundUrl)) {
                        sound.stop();
                        return;
                    }
                }
            }
        }
    }
    SlotMaya_s_sound_loop[sound] = null;
};

SlotMayaSoundPlayer.playSoundLoop = function (sound) {
    cc.log("playSoundLoop");
    var soundID = SlotMayaSoundPlayer._playSingleSound(sound, true);
    return soundID;
};

SlotMayaSoundPlayer.stopSoundLoop = function (soundId) {
    if (soundId !== null && soundId !== undefined) {
        if (cc.sys.isNative) {
            cc.log("stopSoundLoop");
            jsb.AudioEngine.stop(soundId);
        }
        else {
            cc.audioEngine.stopEffect(soundId);
        }
    }
};

SlotMayaSoundPlayer.stopAllSound = function () {
    SlotMaya_s_sound_loop = {};
    if (cc.sys.isNative) {
        jsb.AudioEngine.stopAll();
    }
    else {
        cc.audioEngine.stopAllEffects();
    }
};

