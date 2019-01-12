import { Component, OnInit } from '@angular/core';
import { MatSnackBar    } from '@angular/material';
import { Select, Store  } from '@ngxs/store';
import { CoursesState   } from 'src/app/store/state/courses.state';
import { Observable  } from 'rxjs';
import { Course   } from '../../store/models/courses-state.model';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css']
})
export class CardDetailsComponent implements OnInit {

  course: Course;
  @Select(CoursesState.course)    course$:    Observable<Course>;
  @Select(CoursesState.isLoading) isLoading$: Observable<boolean>;
  constructor(
    private snackBar:  MatSnackBar,
    private store: Store
  ) { }

  ngOnInit() {
    this.course$.subscribe(course => this.course = course);
  }


  redirect = (courseName: string, name: string) => {

    if (name.toLowerCase() === 'lectura') {
      this.store.dispatch(new Navigate(['lectura/abecedario']));
    }

    if (name.toLowerCase() !== 'lectura') {
      this.showError(`${courseName} no se encuentra disponible por el momento.`);
    }

  }

  showError(message) {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

}
