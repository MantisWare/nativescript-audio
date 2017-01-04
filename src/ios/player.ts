import { TNSPlayerI } from '../common';
import { AudioPlayerOptions } from '../options';
import fs = require('file-system');

function fixPath(pathStr: string) {
  pathStr = pathStr.trim()
  return (pathStr.indexOf("~/") === 0) ? fs.path.join(fs.knownFolders.currentApp().path, pathStr.replace("~/", "")) : pathStr;
}

export class TNSPlayer extends NSObject implements TNSPlayerI {
  private player: AVPlayer;

  get ios(): any {
    return this.player;
  }

  private _completeCallback: any;
  private _errorCallback: any;
  private _infoCallback: any;

  private _playResolve;
  private _playReject;

  public playFile(options: AudioPlayerOptions): Promise<any> {
    this.dispose().catch(() => { });
    return new Promise((resolve, reject) => {
      this._playReject = reject;
      this._playResolve = resolve;
      this._completeCallback = options.completeCallback;
      this._errorCallback = options.errorCallback;
      this._infoCallback = options.positionUpdateCallback;

      this.player = (<any>AVPlayer.alloc()).initWithURL(NSURL.URLWithString(fixPath(options.audioFile)));

      if (options.positionUpdateCallback)
        this.player.addPeriodicTimeObserverForIntervalQueueUsingBlock(CMTimeMakeWithSeconds(1, 1), null, time => options.positionUpdateCallback && options.positionUpdateCallback(CMTimeGetSeconds(time)));

      this.player.currentItem.addObserverForKeyPathOptionsContext(this, "status", NSKeyValueObservingOptions.Initial, null);

      this.player.play();
    });
  }

  observeValueForKeyPathOfObjectChangeContext(keypath: string, source: Object, change: any, context: Object) {
    if(this._playResolve && this._playReject && keypath == "status") {
      if(this.player.currentItem.status == AVPlayerItemStatus.ReadyToPlay) {
        this._playResolve();
        this._playResolve = this._playReject = null;
      }
      else if(this.player.currentItem.status == AVPlayerItemStatus.Failed) {
        this._playReject(this.player.error);
        this._playResolve = this._playReject = null;
      }
    }
  }

  public pause(): Promise<any> {
    return new Promise((resolve, reject) => resolve(<any>this.player.pause()));
  }

  public play(): Promise<any> {
    return new Promise((resolve, reject) => resolve(<any>this.player.play()));
  }

  public resume(): Promise<any> {
    return this.play();
  }

  public seekTo(time: number): Promise<any> {
    return Promise.reject(null);
  }

  public dispose(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.player) {
        this.player.pause();
        this.player.currentItem.removeObserverForKeyPath(this, "status");
        this.player.replaceCurrentItemWithPlayerItem(null);
      }
      this.player = null;
      resolve();
    });
  }

  public isAudioPlaying(): boolean {
    return (this.player.rate != 0) && (this.player.error == null);
  }

  public getDuration(): Promise<number> {
    return new Promise((resolve, reject) => resolve(this.player.currentItem.duration));
  }

  public audioPlayerDidFinishPlayingSuccessfully(player?: any, flag?: boolean) {
    if (flag && this._completeCallback) {
      this._completeCallback({ player, flag });
    }
    else if (!flag && this._errorCallback) {
      this._errorCallback({ player, flag });
    }
  }

  public get currentTime(): number {
    return CMTimeGetSeconds(this.player.currentTime());
  }
}
