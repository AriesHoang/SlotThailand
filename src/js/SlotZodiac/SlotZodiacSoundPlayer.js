var SlotZodiacSoundPlayer = SlotZodiacSoundPlayer || {};
var SlotZodiac_s_sound_loop = SlotZodiac_s_sound_loop || {};

SlotZodiacSoundPlayer._createURL = function (sound) {
    var soundUrl = "res/SlotZodiac/sound/" + sound + ".mp3";
    return soundUrl;
};

SlotZodiacSoundPlayer._playSingleSound = function (sound, loop, cb) {
    if (cc.Global.GetSetting("sound", 0) === 1) {
        if (cb) {
            cb();
        }
        return;
    }

    var soundUrl = SlotZodiacSoundPlayer._createURL(sound);

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

SlotZodiacSoundPlayer._playMultiSound = function (soundList, index) {
    if (index >= soundList.length) {
        return;
    }

    var audio = SlotZodiacSoundPlayer._playSingleSound(soundList[index], false, function () {
        SlotZodiacSoundPlayer._playMultiSound(soundList, (index + 1));
    });
};

SlotZodiacSoundPlayer.playSound = function (sound, loop) {
    if (cc.isArray(sound)) {
        if (sound.length === 1) {
            SoundPlayer._playSingleSound(sound[0], false);
        }
        SlotZodiacSoundPlayer._playMultiSound(sound, 0);
    }
    else {
        var soundLoop = !!loop;
        var soundID = SlotZodiacSoundPlayer._playSingleSound(sound, soundLoop);
        if (soundLoop) {
            SlotZodiac_s_sound_loop[sound] = soundID;
        }
    }
};

SlotZodiacSoundPlayer.stopSound = function (sound) {
    var soundId = SlotZodiac_s_sound_loop[sound];
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
            var soundUrl = SlotZodiacSoundPlayer._createURL(sound);
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
    SlotZodiac_s_sound_loop[sound] = null;
};

SlotZodiacSoundPlayer.playSoundLoop = function (sound) {
    cc.log("playSoundLoop");
    var soundID = SlotZodiacSoundPlayer._playSingleSound(sound, true);
    return soundID;
};

SlotZodiacSoundPlayer.stopSoundLoop = function (soundId) {
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

SlotZodiacSoundPlayer.stopAllSound = function () {
    SlotZodiac_s_sound_loop = {};
    if (cc.sys.isNative) {
        jsb.AudioEngine.stopAll();
    }
    else {
        cc.audioEngine.stopAllEffects();
    }
};

