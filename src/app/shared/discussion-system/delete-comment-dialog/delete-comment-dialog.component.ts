import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-comment-dialog',
  templateUrl: './delete-comment-dialog.component.html',
  styleUrls: ['./delete-comment-dialog.component.css']
})
export class DeleteCommentDialogComponent {

  constructor(public  dialogRef: MatDialogRef<DeleteCommentDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


}
