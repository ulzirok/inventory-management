import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ItemCreateData } from '../../models/item.interface';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-item-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    TranslateModule,
    MatCheckboxModule
  ],
  templateUrl: './item-create.html',
  styleUrl: './item-create.scss',
})
export class ItemCreate implements OnInit {
  private fb = inject(FormBuilder)
  private dialogRef = inject(MatDialogRef<ItemCreate>)
  data = inject<ItemCreateData>(MAT_DIALOG_DATA)
  
  form = this.fb.group({})
  
  ngOnInit(): void {
    for (const field of this.data.activeFields) {
      const validators = []
      if (field.type === 'number') validators.push(Validators.min(0))
      
      this.form.addControl(
        field.columnDef,
        this.fb.control(
          field.type === 'boolean' ? false : null,
          validators
        ))
    }
  }
  
  save() {
    if (this.form.invalid) return
    this.form.disable();
    this.dialogRef.close(this.form.value)
  }
  
  close() {
    this.dialogRef.close()
  }
}
