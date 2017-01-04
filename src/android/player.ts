import { TNSPlayerI } from '../common';
import { AudioPlayerOptions } from '../options';
import fs = require('file-system');

function fixPath(pathStr: string) {
  pathStr = pathStr.trim()
  return (pathStr.indexOf("~/") === 0) ? fs.path.join(fs.knownFolders.currentApp().path, pathStr.replace("~/", "")) : pathStr;
}

export class TNSPlayer implements TNSPlayerI {
  private player: android.media.MediaPlayer;

  get android(): any {
    return this.player;
  }

  public playFile(options: AudioPlayerOptions): Promise<any> {
    this.dispose().catch(() => { });
    return new Promise((resolve, reject) => {
      this.player = new android.media.MediaPlayer();

      this.player.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
      this.player.setDataSource(fixPath(options.audioFile));
      this.player.prepareAsync();

      // On Complete
      this.player.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener({
        onCompletion: (mp) => {

          if (options.loop) {
            mp.seekTo(5);
            mp.start();
          }

          if (options.completeCallback) {
            options.completeCallback();
          }

        }
      }));

      // On Error
      this.player.setOnErrorListener(new android.media.MediaPlayer.OnErrorListener({
        onError: (mp: any, what: number, extra: number) => {
          if (options.errorCallback) {
            options.errorCallback(new Error(`Audio playback error: ${what}-${extra}`));
          }
          this.dispose();
          return true;
        }
      }));

      // On Position Updated
      if (options.positionUpdateCallback) {
        
      }

      // On Prepared
      this.player.setOnPreparedListener(new android.media.MediaPlayer.OnPreparedListener({
        onPrepared: (mp) => {
          mp.start();
          resolve();
        }
      }));
    });
  }

  public pause(): Promise<any> {
    return new Promise((resolve, reject) => resolve(<any>this.player.pause()));
  }

  public play(): Promise<any> {
    return new Promise((resolve, reject) => resolve(<any>this.player.start()));
  }

  public resume(): Promise<any> {
    return this.play();
  }

  public seekTo(time: number): Promise<any> {
    return new Promise((resolve, reject) => resolve(<any>this.player.seekTo(time)));
  }

  public dispose(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.player && this.player.release();
        this.player = null;
        resolve();
    });
  }

  public isAudioPlaying(): boolean {
    return this.player.isPlaying();
  }

  public getDuration(): Promise<number> {
    return new Promise((resolve, reject) => resolve(this.player.getDuration()));
  }
}