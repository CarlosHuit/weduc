import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-well-done',
  templateUrl: './well-done.component.html',
  styleUrls: ['./well-done.component.css']
})
export class WellDoneComponent implements OnInit {

  activeHideDialog = false;

  constructor() { }

  ngOnInit() {

    // setTimeout(() => {
    //   this.activeHideDialog = true;
    // }, 2000);

    setTimeout(() => {
      console.log('Bien Hecho');
    }, 600);

  }



}
