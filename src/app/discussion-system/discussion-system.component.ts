import { Component, OnInit, Input } from '@angular/core';
import { User                     } from '../classes/user';
import { LocalStorageService      } from '../services/local-storage.service';
import { AuthService              } from '../services/auth.service';
import { Comments                 } from '../classes/comments';
import { DiscussionSystemService  } from '../services/discussion-system/discussion-system.service';

@Component({
  selector: 'app-discussion-system',
  templateUrl: './discussion-system.component.html',
  styleUrls: ['./discussion-system.component.css']
})



export class DiscussionSystemComponent implements OnInit {
  @Input()  course_id: string;
  comments = [
    {
      user: 'Manuel Ramos',
      avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
      comment: `Un proceso muy practico e interactivo para
                aprender lectura y escritura por medio de la adquicision de conocimiento por medio de la experiecia`
    },
    {
      user: 'Freddy Perez',
      avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
      comment: `Un proceso muy practico e interactivo para
                aprender lectura y escritura por medio de la adquicision de conocimiento por medio de la experiecia`
    },
    {
      user: 'Jessica Galicia',
      avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
      comment: `Un proceso muy practico e interactivo para
                aprender lectura y escritura por medio de la adquicision de conocimiento por medio de la experiecia`
    }

  ];

  currentUser:     User;
  loadingComments: boolean;

  constructor(
    private _discussionSystem: DiscussionSystemService,
    private _storage:          LocalStorageService,
    private _auth:             AuthService,
  ) {

    if (this._auth.isLoggedIn()) {

      const { userId, email, firstName, lastName } =  this._storage.getElement('user');
      this.currentUser = new User(email, null, null, firstName, lastName, userId);

    }

    this.loadingComments = false;

  }

  ngOnInit() {
    console.log(this.course_id);

  }

  addComment = (el: HTMLTextAreaElement) => {

    // if (el.value.trim() === '') {

    // } else {
    //   const x = {
    //     user:    this.currentUser.fullName().toString().trim(),
    //     avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
    //     comment: el.value.trim().toString()
    //   };
    //   this.comments.unshift(x);
    // }

    // el.value = '';
    const d = new Date();
    const av = 'https://material.angular.io/assets/img/examples/shiba1.jpg';

    const newComment = new Comments(this.course_id, this.currentUser._id, av, el.value, d);
    this._discussionSystem.addComment(newComment)
      .subscribe(
        val => console.log(val),
        err => console.log(err)
      );

  }

}
