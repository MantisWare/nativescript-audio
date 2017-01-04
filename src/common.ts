import {AudioPlayerOptions, AudioRecorderOptions} from './options';

export interface TNSPlayerI {

  android?: any;
  ios?: any;

  /**
   * Loads and starts playing an audio file
   */
  playFile(options: AudioPlayerOptions): Promise<any>;

  /**
   * Play audio file.
   */
  play(): Promise<boolean>;

  /**
   * Pauses playing audio file.
   */
  pause(): Promise<boolean>;
  
  /**
   * Seeks to specific time.
   */
  seekTo(time: number): Promise<boolean>;

  /**
   * Stops playback and releases resources from the audio player.
   */
  dispose(): Promise<boolean>;

  /**
   * Check if the audio is actively playing.
   */
  isAudioPlaying(): boolean;

  /**
   * Get the duration of the audio file playing in seconds.
   */
  getDuration(): Promise<number>;
}

export interface TNSRecordI {
  /**
   * Starts the native audio recording control.
   */
  start(options: AudioRecorderOptions): Promise<any>;

  /**
  * Stops the native audio recording control.
  */
  stop(): Promise<any>;

  /**
   * Releases resources from the recorder.
   */
  dispose(): Promise<any>;
}
