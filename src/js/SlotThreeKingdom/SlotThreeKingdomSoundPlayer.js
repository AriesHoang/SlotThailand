var SlotThreeKingdomSoundPlayer = SlotThreeKingdomSoundPlayer || {};
var SlotThreeKingdom_s_sound_loop = SlotThreeKingdom_s_sound_loop || {};

SlotThreeKingdomSoundPlayer._createURL = function (sound) {
    var soundUrl = "res/SlotThreeKingdom/sound/" + sound + ".mp3";
    return soundUrl;
};

SlotThreeKingdomSoundPlayer._playSingleSound = function (sound, loop, cb) {
    if (cc.Global.GetSetting("sound", 0) === 1) {
        if (cb) {
            cb();
        }
        return;
    }

    var soundUrl = SlotThreeKingdomSoundPlayer._createURL(sound);

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

SlotThreeKingdomSoundPlayer._playMultiSound = function (soundList, index) {
    if (index >= soundList.length) {
        return;
    }

    var audio = SlotThreeKingdomSoundPlayer._playSingleSound(soundList[index], false, function () {
        SlotThreeKingdomSoundPlayer._playMultiSound(soundList, (index + 1));
    });
};

SlotThreeKingdomSoundPlayer.playSound = function (sound, loop) {
    if (cc.isArray(sound)) {
        if (sound.length == 1) {
            SoundPlayer._playSingleSound(sound[0], false);
        }
        SlotThreeKingdomSoundPlayer._playMultiSound(sound, 0);
    }
    else {
        var soundLoop = loop ? true : false;
        var soundID = SlotThreeKingdomSoundPlayer._playSingleSound(sound, soundLoop);
        if (soundLoop) {
            SlotThreeKingdom_s_sound_loop[sound] = soundID;
        }
    }
};

SlotThreeKingdomSoundPlayer.stopSound = function (sound) {
    var soundId = SlotThreeKingdom_s_sound_loop[sound];
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
            var soundUrl = SlotThreeKingdomSoundPlayer._createURL(sound);
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
    SlotThreeKingdom_s_sound_loop[sound] = null;
};

SlotThreeKingdomSoundPlayer.playSoundLoop = function (sound) {
    cc.log("playSoundLoop");
    var soundID = SlotThreeKingdomSoundPlayer._playSingleSound(sound, true);
    return soundID;
};

SlotThreeKingdomSoundPlayer.stopSoundLoop = function (soundId) {
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

SlotThreeKingdomSoundPlayer.stopAllSound = function () {
    SlotThreeKingdom_s_sound_loop = {};
    if (cc.sys.isNative) {
        jsb.AudioEngine.stopAll();
    }
    else {
        cc.audioEngine.stopAllEffects();
    }
};

