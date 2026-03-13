import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ItemCreateData, ItemDto } from '../../models/item.interface';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCreate implements OnInit {
  private fb = inject(FormBuilder)
  private dialogRef = inject(MatDialogRef<ItemCreate>)
  data = inject < ItemCreateData>(MAT_DIALOG_DATA);
  
  form = this.fb.group({})
  isEditMode = signal(false);
  currentVersion = signal<number>(0);
  
  ngOnInit(): void {
    const item = this.data.item;
    this.isEditMode.set(!!item);
    
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
    
    if (this.isEditMode() && item) {
      this.currentVersion.set(item.version);
      this.form.patchValue(item)
    }
  }
  
  save() {
    if (this.form.invalid) return
    const result = {
      ...this.form.value,
      version: this.currentVersion(),
    } as any
    if (this.isEditMode() && this.data.item) {
      result.id = this.data.item.id
    } 
    this.dialogRef.close(result)
  }
  
  close() {
    this.dialogRef.close()
  }
}
