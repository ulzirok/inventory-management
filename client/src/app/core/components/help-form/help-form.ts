import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    TranslateModule,
    MatSelectModule,
  ],
  templateUrl: './help-form.html',
  styleUrl: './help-form.scss',
})
export class HelpForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<HelpForm>);
  private dialogData = inject(MAT_DIALOG_DATA);
  
  form = this.fb.group({
    summary: ['', Validators.required],
    priority: ['Low', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;
    this.form.disable();
    
    const data = {
      ...this.form.value,
      link: window.location.href,
      inventoryId: this.dialogData?.inventoryId || null
    };
    
    this.dialogRef.close(data);
    this.form.reset();
  }

  close() {
    this.dialogRef.close();
  }
}
