var SlotAladdinSoundPlayer = SlotAladdinSoundPlayer || {};
var SlotAladdin_s_sound_loop = SlotAladdin_s_sound_loop || {};

SlotAladdinSoundPlayer._createURL = function (sound) {
    var soundUrl = "res/SlotAladdin/sound/" + sound + ".mp3";
    return soundUrl;
};

SlotAladdinSoundPlayer._playSingleSound = function (sound, loop, cb) {
    if (cc.Global.GetSetting("sound", 0) === 1) {
        if (cb) {
            cb();
        }
        return;
    }

    var soundUrl = SlotAladdinSoundPlayer._createURL(sound);

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

SlotAladdinSoundPlayer._playMultiSound = function (soundList, index) {
    if (index >= soundList.length) {
        return;
    }

    var audio = SlotAladdinSoundPlayer._playSingleSound(soundList[index], false, function () {
        SlotAladdinSoundPlayer._playMultiSound(soundList, (index + 1));
    });
};

SlotAladdinSoundPlayer.playSound = function (sound, loop) {
    if (cc.isArray(sound)) {
        if (sound.length == 1) {
            SoundPlayer._playSingleSound(sound[0], false);
        }
        SlotAladdinSoundPlayer._playMultiSound(sound, 0);
    }
    else {
        var soundLoop = loop ? true : false;
        var soundID = SlotAladdinSoundPlayer._playSingleSound(sound, soundLoop);
        if (soundLoop) {
            SlotAladdin_s_sound_loop[sound] = soundID;
        }
    }
};

SlotAladdinSoundPlayer.stopSound = function (sound) {
    var soundId = SlotAladdin_s_sound_loop[sound];
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
            var soundUrl = SlotAladdinSoundPlayer._createURL(sound);
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
    SlotAladdin_s_sound_loop[sound] = null;
};

SlotAladdinSoundPlayer.playSoundLoop = function (sound) {
    cc.log("playSoundLoop");
    var soundID = SlotAladdinSoundPlayer._playSingleSound(sound, true);
    return soundID;
};

SlotAladdinSoundPlayer.stopSoundLoop = function (soundId) {
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

SlotAladdinSoundPlayer.stopAllSound = function () {
    SlotAladdin_s_sound_loop = {};
    if (cc.sys.isNative) {
        jsb.AudioEngine.stopAll();
    }
    else {
        cc.audioEngine.stopAllEffects();
    }
};

