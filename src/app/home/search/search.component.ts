import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() evsSearch = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  searchCourses = (str: string) => {
    this.evsSearch.emit(str);
  }

}
