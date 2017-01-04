var fs = require('file-system');
function fixPath(pathStr) {
    pathStr = pathStr.trim();
    return (pathStr.indexOf("~/") === 0) ? fs.path.join(fs.knownFolders.currentApp().path, pathStr.replace("~/", "")) : pathStr;
}
var TNSPlayer = (function (_super) {
    __extends(TNSPlayer, _super);
    function TNSPlayer() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TNSPlayer.prototype, "ios", {
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
            _this._playReject = reject;
            _this._playResolve = resolve;
            _this._completeCallback = options.completeCallback;
            _this._errorCallback = options.errorCallback;
            _this._infoCallback = options.positionUpdateCallback;
            _this.player = AVPlayer.alloc().initWithURL(NSURL.URLWithString(fixPath(options.audioFile)));
            if (options.positionUpdateCallback)
                _this.player.addPeriodicTimeObserverForIntervalQueueUsingBlock(CMTimeMakeWithSeconds(1, 1), null, function (time) { return options.positionUpdateCallback && options.positionUpdateCallback(CMTimeGetSeconds(time)); });
            _this.player.currentItem.addObserverForKeyPathOptionsContext(_this, "status", 4, null);
            _this.player.play();
        });
    };
    TNSPlayer.prototype.observeValueForKeyPathOfObjectChangeContext = function (keypath, source, change, context) {
        if (this._playResolve && this._playReject && keypath == "status") {
            if (this.player.currentItem.status == 1) {
                this._playResolve();
                this._playResolve = this._playReject = null;
            }
            else if (this.player.currentItem.status == 2) {
                this._playReject(this.player.error);
                this._playResolve = this._playReject = null;
            }
        }
    };
    TNSPlayer.prototype.pause = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return resolve(_this.player.pause()); });
    };
    TNSPlayer.prototype.play = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return resolve(_this.player.play()); });
    };
    TNSPlayer.prototype.resume = function () {
        return this.play();
    };
    TNSPlayer.prototype.seekTo = function (time) {
        return Promise.reject(null);
    };
    TNSPlayer.prototype.dispose = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.player) {
                _this.player.pause();
                _this.player.currentItem.removeObserverForKeyPath(_this, "status");
                _this.player.replaceCurrentItemWithPlayerItem(null);
            }
            _this.player = null;
            resolve();
        });
    };
    TNSPlayer.prototype.isAudioPlaying = function () {
        return (this.player.rate != 0) && (this.player.error == null);
    };
    TNSPlayer.prototype.getDuration = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return resolve(_this.player.currentItem.duration); });
    };
    TNSPlayer.prototype.audioPlayerDidFinishPlayingSuccessfully = function (player, flag) {
        if (flag && this._completeCallback) {
            this._completeCallback({ player: player, flag: flag });
        }
        else if (!flag && this._errorCallback) {
            this._errorCallback({ player: player, flag: flag });
        }
    };
    Object.defineProperty(TNSPlayer.prototype, "currentTime", {
        get: function () {
            return CMTimeGetSeconds(this.player.currentTime());
        },
        enumerable: true,
        configurable: true
    });
    return TNSPlayer;
}(NSObject));
exports.TNSPlayer = TNSPlayer;
//# sourceMappingURL=player.js.map