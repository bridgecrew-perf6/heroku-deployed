import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}


@Injectable()
export class AudioRecordService {


  private stream;
  private recorder;
  private interval;
  private startTime;
  private recorded = new Subject<RecordedAudioOutput>();
  private recordingTime = new Subject<string>();
  private getRecordingFailed = new Subject<string>();


  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this.recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this.recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this.getRecordingFailed.asObservable();
  }


  startRecording(): void {

    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this.recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      this.stream = s;
      this.record();
    }).catch(error => {
      this.getRecordingFailed.next();
    });

  }

  abortRecording(): void {
    this.stopMedia();
  }

  private record(): void {

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/webm'
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this.recordingTime.next(time);
      },
      1000
    );
  }

  private toString(value): void {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording(): void {

    if (this.recorder) {
      this.recorder.stop((blob) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.stopMedia();
          this.recorded.next({ blob, title: mp3Name });
        }
      }, () => {
        this.stopMedia();
        this.getRecordingFailed.next();
      });
    }
  }

  private stopMedia(): void {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }

}

