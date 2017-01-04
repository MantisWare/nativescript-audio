var fs = require('file-system');
function fixPath(pathStr) {
    pathStr = pathStr.trim();
    return (pathStr.indexOf("~/") === 0) ? fs.path.join(fs.knownFolders.currentApp().path, pathStr.replace("~/", "")) : pathStr;
}
var TNSPlayer = (function () {
    function TNSPlayer() {
    }
    Object.defineProperty(TNSPlayer.prototype, "android", {
        get: function () {
            return this.player;
        },
        enumerable: true,
        configurable: true
    });
    TNSPlayer.prototype.playFile = function (options) {
        var _this = this;
        this.dispose().catch(function () { });
        return new Promise(function (resolve, reject) {
            _this.player = new android.media.MediaPlayer();
            _this.player.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
            _this.player.setDataSource(fixPath(options.audioFile));
            _this.player.prepareAsync();
            _this.player.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener({
                onCompletion: function (mp) {
                    if (options.loop) {
                        mp.seekTo(5);
                        mp.start();
                    }
                    if (options.completeCallback) {
                        options.completeCallback();
                    }
                }
            }));
            _this.player.setOnErrorListener(new android.media.MediaPlayer.OnErrorListener({
                onError: function (mp, what, extra) {
                    if (options.errorCallback) {
                        options.errorCallback(new Error("Audio playback error: " + what + "-" + extra));
                    }
                    _this.dispose();
                    return true;
                }
            }));
            if (options.positionUpdateCallback) {
            }
            _this.player.setOnPreparedListener(new android.media.MediaPlayer.OnPreparedListener({
                onPrepared: function (mp) {
                    mp.start();
                    resolve();
                }
            }));
        });
    };
    TNSPlayer.prototype.pause = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return resolve(_this.player.pause()); });
    };
    TNSPlayer.prototype.play = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return resolve(_this.player.start()); });
    };
    TNSPlayer.prototype.resume = function () {
        return this.play();
    };
    TNSPlayer.prototype.seekTo = function (time) {
        var _this = this;
        return new Promise(function (resolve, reject) { return resolve(_this.player.seekTo(time)); });
    };
    TNSPlayer.prototype.dispose = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.player && _this.player.release();
            _this.player = null;
            resolve();
        });
    };
    TNSPlayer.prototype.isAudioPlaying = function () {
        return this.player.isPlaying();
    };
    TNSPlayer.prototype.getDuration = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return resolve(_this.player.getDuration()); });
    };
    return TNSPlayer;
}());
exports.TNSPlayer = TNSPlayer;
//# sourceMappingURL=player.js.map