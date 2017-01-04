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
