import { NgModule } from '@angular/core';

import {

  MatToolbarModule,
  MatFormFieldModule,
  MatCardModule,
  MatSnackBarModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatMenuModule,
  MatListModule,
  MatExpansionModule,
  MatDividerModule,
  MatSidenavModule,
  MatSelectModule,
  MatDialogModule,
  MatOptionModule,
  MatTabsModule,
  MatCheckboxModule,
  MatSliderModule

} from '@angular/material';

const modules = [

  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatSnackBarModule,
  MatMenuModule,
  MatListModule,
  MatExpansionModule,
  MatDividerModule,
  MatSidenavModule,
  MatOptionModule,
  MatSelectModule,
  MatDialogModule,
  MatTabsModule,
  MatCheckboxModule,
  MatSliderModule

];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
