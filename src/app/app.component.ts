import { Component, OnDestroy } from '@angular/core';
import { AudioRecordService } from './audio-record.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { catchError, map, observeOn, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  isRecording = false;
  recordedTime;
  blobUrl;
  blobTitle;
  blobfile;
  constructor(
    private audioRecordingService: AudioRecordService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
    ) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      // this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      // this.blobUrl = URL.createObjectURL(data.blob);

      const form = new FormData();
      form.append('blobfile', data.blob);
      form.append('blobtitle', data.title);
      this.http.post<any>('http://127.0.0.1:5000', form)
      .pipe(
        map(response => response),
        catchError(error => throwError(error))
      )
      .subscribe(
        (message) => {
          alert(message.status),
          this.blobUrl = message.url;
        }
      );
      // this.blobTitle = data.title;
      // saveAs(this.blobUrl, this.blobTitle);
    });
  }

  blobToFile(theBlob, fileName): void {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  startRecording(): void {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording(): void {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording(): void {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData(): void {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

}
