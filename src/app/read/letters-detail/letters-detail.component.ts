import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpeechSynthesisService } from 'src/app/services/speech-synthesis.service';


@Component({
  selector: 'app-letters-detail',
  templateUrl: './letters-detail.component.html',
  styleUrls: ['./letters-detail.component.css']
})
export class LettersDetailComponent implements OnInit, OnDestroy {

  letterParam: string;
  letters: string[];
  letter: string;

  constructor(
    private _route: ActivatedRoute,
    private _speech: SpeechSynthesisService
  ) {
    this.letterParam = this._route.snapshot.paramMap.get('letter');
    this.letters     = this.setValues(this.letterParam);
  }

  ngOnInit() {

  }

  setValues = (letter: string) => {

    const t = [];

    t.push(letter.toUpperCase());
    t.push(letter.toLowerCase());

    this.letter = t[0];

    return t;
  }

  ngOnDestroy() { }

  listen = () => {
    const t = JSON.parse(localStorage.getItem('letter_sounds'))[this.letterParam.toLowerCase()];
    const type = this.letter === this.letter.toLowerCase() ? 'minúscula' : 'mayúscula';
    const msg = `Esta es la letra: ... ${t} ... ${type}`;
    this._speech.speak(msg);
  }

}
