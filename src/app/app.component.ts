import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Prefer camera resolution nearest to 1280x720.
  constraints = { audio: true, video: { width: 1280, height: 720 } };

  constructor() {
    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then(function (mediaStream) {
        const video = document.querySelector('video');
        if (video) {
          video.srcObject = mediaStream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        }
      })
      .catch(function (err) {
        console.log(err.name + ': ' + err.message);
      }); // always check for errors at the end.
  }
}
