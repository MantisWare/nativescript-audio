/**
* Provides options for the audio player.
*/
export interface AudioPlayerOptions {
  /**
   * Gets or sets the audio file url.
   */
  audioFile: string;

  /**
  * Get or sets the player to loop playback.
  */
  loop: boolean;

  /**
   * The callback when the currently playing audio file completes.
   */
  completeCallback?: () => void;

  /**
   * The callback when an error occurs with the audio player.
   */
  errorCallback?: (Error) => void;

  /**
   * The callback when the playback position is updated.
   */
  positionUpdateCallback?: (number) => void;
}

export interface AudioRecorderOptions {
  /**
   * Gets or sets the recorded file name.
   */
  filename: string;

  /**
   * Sets the source for recording ***ANDROID ONLY for now ***
   */
  source?: any;

  /**
   * Gets or set the max duration of the recording session.
   */
  maxDuration?: number;

  /**
   * Enable metering. Off by default.
   */
  metering?: boolean;

  /**
   * Format
   */
  format?: any;

  /**
   * Channels
   */
  channels?: any;

  /**
   * Sampling rate
   */
  sampleRate?: any;

  /**
   * Bit rate
   */
  bitRate?: any;

  /**
   * Encoding
   */
  encoder?: any;

  /**
   * Gets or sets the callback when an error occurs with the media recorder.
   * @returns {Object} An object containing the native values for the error callback.
   */
  errorCallback?: Function;

  /**
   * Gets or sets the callback to be invoked to communicate some info and/or warning about the media or its playback.
   * @returns {Object} An object containing the native values for the info callback.
   */
  infoCallback?: Function;
}


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

export declare class TNSPlayer {
    private _player;
    private _completeCallback;
    private _errorCallback;
    private _infoCallback;
    playFile(options: AudioPlayerOptions): Promise<any>;
    pause(): Promise<any>;
    resume(): void;
    seekTo(time: number): Promise<any>;
    play(): Promise<any>;
    dispose(): Promise<any>;
    isAudioPlaying(): boolean;
    getDuration(): Promise<number>;
    audioPlayerDidFinishPlayingSuccessfully(player?: any, flag?: boolean): void;
}
export declare class TNSRecorder {
    static ObjCProtocols: any[];
    private _recorder;
    private _recordingSession;
    static CAN_RECORD(): boolean;
    start(options: AudioRecorderOptions): Promise<any>;
    stop(): Promise<any>;
    dispose(): Promise<any>;
    isRecording(): any;
    getMeters(channel: number): any;
    audioRecorderDidFinishRecording(recorder: any, success: boolean): void;
}


