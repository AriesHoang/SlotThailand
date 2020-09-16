var SlotWomenAgentSoundPlayer = SlotWomenAgentSoundPlayer || {};
var SlotWomenAgent_s_sound_loop = SlotWomenAgent_s_sound_loop || {};

SlotWomenAgentSoundPlayer._createURL = function (sound) {
    var soundUrl = "res/SlotWomenAgent/sound/" + sound + ".mp3";
    return soundUrl;
};

SlotWomenAgentSoundPlayer._playSingleSound = function (sound, loop, cb) {
    if (cc.Global.GetSetting("sound", 0) === 1) {
        if (cb) {
            cb();
        }
        return;
    }

    var soundUrl = SlotWomenAgentSoundPlayer._createURL(sound);

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

SlotWomenAgentSoundPlayer._playMultiSound = function (soundList, index) {
    if (index >= soundList.length) {
        return;
    }

    var audio = SlotWomenAgentSoundPlayer._playSingleSound(soundList[index], false, function () {
        SlotWomenAgentSoundPlayer._playMultiSound(soundList, (index + 1));
    });
};

SlotWomenAgentSoundPlayer.playSound = function (sound, loop) {
    if (cc.isArray(sound)) {
        if (sound.length == 1) {
            SoundPlayer._playSingleSound(sound[0], false);
        }
        SlotWomenAgentSoundPlayer._playMultiSound(sound, 0);
    }
    else {
        var soundLoop = loop ? true : false;
        var soundID = SlotWomenAgentSoundPlayer._playSingleSound(sound, soundLoop);
        if (soundLoop) {
            SlotWomenAgent_s_sound_loop[sound] = soundID;
        }
    }
};

SlotWomenAgentSoundPlayer.stopSound = function (sound) {
    var soundId = SlotWomenAgent_s_sound_loop[sound];
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
            var soundUrl = SlotWomenAgentSoundPlayer._createURL(sound);
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
    SlotWomenAgent_s_sound_loop[sound] = null;
};

SlotWomenAgentSoundPlayer.playSoundLoop = function (sound) {
    cc.log("playSoundLoop");
    var soundID = SlotWomenAgentSoundPlayer._playSingleSound(sound, true);
    return soundID;
};

SlotWomenAgentSoundPlayer.stopSoundLoop = function (soundId) {
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

SlotWomenAgentSoundPlayer.stopAllSound = function () {
    SlotWomenAgent_s_sound_loop = {};
    if (cc.sys.isNative) {
        jsb.AudioEngine.stopAll();
    }
    else {
        cc.audioEngine.stopAllEffects();
    }
};

