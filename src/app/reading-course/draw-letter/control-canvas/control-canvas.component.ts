import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AppState } from 'src/app/store/state/app.state';
import { Observable } from 'rxjs';
import { ReadingCourseState } from 'src/app/store/state/reading-course.state';
import { ConfigData, Preferences } from 'src/app/store/models/reading-course/draw-letter/reading-course-draw-letter.model';
import {
  ChangeLineWidthDL,
  ChangeLineColorDL,
  ToggleGuideLinesDL
} from 'src/app/store/actions/reading-course/reading-course-draw-letter.actions';


@Component({
  selector: 'app-control-canvas',
  templateUrl: './control-canvas.component.html',
  styleUrls: ['./control-canvas.component.css']
})
export class ControlCanvasComponent {


  @Select( AppState.isMobile )                     isMobile$: Observable<boolean>;
  @Select( AppState.queryMobileMatch )     queryMobileMatch$: Observable<boolean>;
  @Select( ReadingCourseState.dlConfigData )     configData$: Observable<ConfigData>;
  @Select( ReadingCourseState.dlPreferences )   preferences$: Observable<Preferences>;


  constructor( private store: Store ) { }

  changeColor = (color: string) => this.store.dispatch( new ChangeLineColorDL({color}) );
  changeWidth = (value: number) =>  this.store.dispatch( new ChangeLineWidthDL({lineWidth: value}));
  toggleGuideLines = () => this.store.dispatch( new ToggleGuideLinesDL() );

}
