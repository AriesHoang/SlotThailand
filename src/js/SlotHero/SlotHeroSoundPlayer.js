var SlotHeroSoundPlayer = SlotHeroSoundPlayer || {};
var SlotHero_s_sound_loop = SlotHero_s_sound_loop || {};

SlotHeroSoundPlayer._createURL = function (sound) {
    var soundUrl = "res/SlotHero/sound/" + sound + ".mp3";
    return soundUrl;
};

SlotHeroSoundPlayer._playSingleSound = function (sound, loop, cb) {
    if (cc.Global.GetSetting("sound", 0) === 1) {
        if (cb) {
            cb();
        }
        return;
    }

    var soundUrl = SlotHeroSoundPlayer._createURL(sound);

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

SlotHeroSoundPlayer._playMultiSound = function (soundList, index) {
    if (index >= soundList.length) {
        return;
    }

    var audio = SlotHeroSoundPlayer._playSingleSound(soundList[index], false, function () {
        SlotHeroSoundPlayer._playMultiSound(soundList, (index + 1));
    });
};

SlotHeroSoundPlayer.playSound = function (sound, loop) {
    if (cc.isArray(sound)) {
        if (sound.length == 1) {
            SoundPlayer._playSingleSound(sound[0], false);
        }
        SlotHeroSoundPlayer._playMultiSound(sound, 0);
    }
    else {
        var soundLoop = loop ? true : false;
        var soundID = SlotHeroSoundPlayer._playSingleSound(sound, soundLoop);
        if (soundLoop) {
            SlotHero_s_sound_loop[sound] = soundID;
        }
    }
};

SlotHeroSoundPlayer.stopSound = function (sound) {
    var soundId = SlotHero_s_sound_loop[sound];
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
            var soundUrl = SlotHeroSoundPlayer._createURL(sound);
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
    SlotHero_s_sound_loop[sound] = null;
};

SlotHeroSoundPlayer.playSoundLoop = function (sound) {
    cc.log("playSoundLoop");
    var soundID = SlotHeroSoundPlayer._playSingleSound(sound, true);
    return soundID;
};

SlotHeroSoundPlayer.stopSoundLoop = function (soundId) {
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

SlotHeroSoundPlayer.stopAllSound = function () {
    SlotHero_s_sound_loop = {};
    if (cc.sys.isNative) {
        jsb.AudioEngine.stopAll();
    }
    else {
        cc.audioEngine.stopAllEffects();
    }
};

