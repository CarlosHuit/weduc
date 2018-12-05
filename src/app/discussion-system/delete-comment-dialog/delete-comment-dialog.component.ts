import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogData } from '../discussion-system.component';

@Component({
  selector: 'app-delete-comment-dialog',
  templateUrl: './delete-comment-dialog.component.html',
  styleUrls: ['./delete-comment-dialog.component.css']
})
export class DeleteCommentDialogComponent {

  iconSelected: string;

  icons = ['man', 'woman'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public  dialogRef: MatDialogRef<DeleteCommentDialogComponent>,
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  genUrl = (icon) => `/assets/icon-user100X100/icon-${icon}.png`;

}
