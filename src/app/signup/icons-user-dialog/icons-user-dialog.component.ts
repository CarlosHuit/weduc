import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogData } from '../signup.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-icons-user-dialog',
  templateUrl: './icons-user-dialog.component.html',
  styleUrls: ['./icons-user-dialog.component.css']
})
export class IconsUserDialogComponent {

  iconSelected: string;

  icons = ['man', 'woman'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public  dialogRef: MatDialogRef<IconsUserDialogComponent>,
    private _router:   Router
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
    this._router.navigateByUrl('/');
  }

  genUrl = (icon) => `/assets/icon-user100X100/icon-${icon}.png`;

}
