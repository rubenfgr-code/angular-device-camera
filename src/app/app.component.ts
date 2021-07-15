import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { createWorker } from 'tesseract.js';

// declare const Buffer: typeof Buffer;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  timerId!: NodeJS.Timeout;

  @ViewChild('video') video!: ElementRef;
  @ViewChild('progress') progress!: ElementRef;

  ocrResult = 'Recognizing...';

  ngAfterViewInit() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        this.video.nativeElement.srcObject = mediaStream;
        this.video.nativeElement.onloadedmetadata = () =>
          this.video.nativeElement.play();
      })
      .catch((err) => console.log('Error:', err));
  }

  takePhoto = async () => {
    console.log(this.video.nativeElement);
    const canvas = document.createElement('canvas');
    canvas.height = this.video.nativeElement.videoHeight;
    canvas.width = this.video.nativeElement.videoWidth;
    canvas
      .getContext('2d')
      ?.drawImage(
        this.video.nativeElement,
        0,
        0,
        this.video.nativeElement.videoWidth,
        this.video.nativeElement.videoHeight
      );

    const worker = createWorker({
      logger: (m) => {
        const value = m.progress.toFixed(2);
        this.progress.nativeElement.style.width = `${value * 100}%`;
      },
    });

    await worker.load();
    await worker.loadLanguage('spa');
    await worker.initialize('spa');
    const { data } = await worker.recognize(canvas);

    if (data && data.text) {
      this.checkDNI(data.text);
    }

    await worker.terminate();
  };

  checkDNI(text: string) {
    const dnis = text.match(/(.*)([0-9]{8}[A-Z]{1})(.*)/);

    if (dnis && dnis.length > 3) {
      const dni = dnis[2];
      this.ocrResult = dni;
    } else {
      this.ocrResult = 'N/A';
    }

    /* const ABC = 'TRWAGMYFPDXBNJZSQVHLCKE';
    ABC.charAt(nifNumbers % 23); */
  }
}
