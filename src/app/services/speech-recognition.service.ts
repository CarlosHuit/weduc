import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable({
  providedIn: 'root'
})

export class SpeechRecognitionService {

  speechRecognition: any;
  term = '';

  recognition: SpeechRecognition;

  constructor(private zone: NgZone) { }

  record(): Observable<string> {

    return Observable.create(observer => {

      const { webkitSpeechRecognition }: IWindow = <IWindow>window;
      this.speechRecognition = new webkitSpeechRecognition();

      this.speechRecognition.lang = 'es_US';
      // this.speechRecognition.lang = 'es-ES';
      this.speechRecognition.interimResults = false;
      this.speechRecognition.maxAlternatives = 1;
      this.speechRecognition.continuous = false;



      this.speechRecognition.onresult = (ev) => {


        if (ev.results) {


          const result = ev.results[ev.resultIndex];
          const transcript = result[0].transcript;

          if (result.isFinal) {

            if (result[0].confidence < 0.3) {

              const resultErr = 'Resultado no confiable, vuelva a intentarlo.';

            } else {

              this.term = transcript;

            }

          }
        }

        this.zone.run(() => { observer.next(this.term); });

      };

      this.speechRecognition.onerror = (err) => this.zone.run(x => observer.error(err));

      this.speechRecognition.onend = e => this.zone.run(() => {


        const noMatch = this.term === '' ? this.zone.run(w => observer.next('no-match')) : false;
        observer.complete(e);

      });

      this.speechRecognition.onnomatch = (ev) => console.log('Speech not recognised');

      // this.speechRecognition.onspeechend = e   => this.stopRecognition();



      this.speechRecognition.start();
      (window as any).addEventListener('beforeunload', e => this.abortRecognition());

    });

  }


  startRecognition(): Observable<string> {

    return Observable.create(( observer: {
      next?:     (value: string) => void,
      error?:    (error: SpeechRecognitionError) => void,
      complete?: (ev: Event) => void,
    }) => {


      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-US';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.speechRecognition.maxAlternatives = 1;



      this.recognition.onresult = this.onRecognitionResult;


      this.recognition.onend = (e: Event) => {
        this.zone.run(x => {

          if (this.term === '') {
            this.zone.run(w => observer.next('no-match'));
          }

          observer.complete(e);

        });
      };


      this.recognition.onerror = (err: SpeechRecognitionError) => {

        this.zone.run(x => observer.error(err));

      };


      this.recognition.onnomatch = (ev: SpeechRecognitionEvent) => {
        console.log('Speech not Recognised');
      };


      this.recognition.start();

      window.addEventListener('beforeunload', (e: BeforeUnloadEvent) => this.abortRecognition());

    });


  }

  onRecognitionResult = (ev: SpeechRecognitionEvent) => {

    if (ev.results) {

      const result = ev.results[ev.resultIndex];
      const transcription = result[0].transcript;

      if (result.isFinal) {

        if (result[0].confidence < 0.3) {

          const err = 'No Secure Confidence';

        } else {

          this.term = transcription;

        }

      }

    }

  }

  stopRecognition     = () => this.speechRecognition.stop();
  abortRecognition  = () => this.speechRecognition.abort();
  DestroySpeechObject = () => this.speechRecognition.stop();

}
