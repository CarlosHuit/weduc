import { Component, OnInit, Input } from '@angular/core';
import { Subjects } from '../../classes/subjects';

@Component({
  selector: 'app-details-and-comments',
  templateUrl: './details-and-comments.component.html',
  styleUrls: ['./details-and-comments.component.css']
})
export class DetailsAndCommentsComponent implements OnInit {

  @Input() data:      Subjects;
  @Input() course_id: string;

  constructor() { }

  ngOnInit() {
  }

  genUrlImg = () => `/assets/img100X100/${this.data.title.toLowerCase()}-min.png`;

}
