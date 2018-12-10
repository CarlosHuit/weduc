import { Component, OnInit, Input } from '@angular/core';
import { Subjects             } from '../../classes/subjects';
import { Router               } from '@angular/router';
import { MatSnackBar          } from '@angular/material';
import { DetectMobileService  } from '../../services/detect-mobile.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css']
})
export class CardDetailsComponent implements OnInit {

  @Input() data:      Subjects;

  constructor(
    private router:    Router,
    private snackBar:  MatSnackBar,
    private _mobile:   DetectMobileService
  ) { }

  ngOnInit() {
  }

  genUrlImg = () => `/assets/img100X100/${this.data.title.toLowerCase()}-min.png`;

  redirect = (courseName: string, name: string) => {

    if (name.toLowerCase() === 'lectura') {

      this.router.navigateByUrl('lectura/abecedario');

    } else {

      this.showError(`${courseName} no se encuentra disponible por el momento.`);

    }

  }

  isMobile = () => {
    return this._mobile.isMobile();
  }

  showError(message) {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

}
