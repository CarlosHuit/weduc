import { Component    } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store        } from '@ngxs/store';
import { Navigate     } from '@ngxs/router-plugin';


@Component({
  selector: 'app-icons-user-dialog',
  templateUrl: './icons-user-dialog.component.html',
  styleUrls: ['./icons-user-dialog.component.css']
})
export class IconsUserDialogComponent {

  iconSelected: string;

  icons = ['man', 'woman'];

  constructor(
    public  dialogRef: MatDialogRef<IconsUserDialogComponent>,
    private store:     Store
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
    this.store.dispatch( new Navigate(['/']) );
  }

  genUrl = (icon: string) => `/assets/icon-user100X100/icon-${icon}.png`;

}
