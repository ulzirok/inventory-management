import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatLabel, MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { FieldKey, Inventory, InventoryFieldsDto } from '../../models/inventory.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

const FIELD_KEYS: FieldKey[] = [
  'str1_label', 'str2_label', 'str3_label',
  'int1_label', 'int2_label', 'int3_label',
  'txt1_label', 'txt2_label', 'txt3_label',
  'bool1_label', 'bool2_label', 'bool3_label',
  'url1_label', 'url2_label', 'url3_label'
] as const;

@Component({
  selector: 'app-inventory-fields',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatLabel,
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './inventory-fields.html',
  styleUrl: './inventory-fields.scss',
})
export class InventoryFields {
  inventory = input<Inventory | null>(null)
  saveField = output<InventoryFieldsDto>()
  deleteField = output<InventoryFieldsDto>()
  
  private fb = inject(FormBuilder)
  
  showForm = signal(false);
  form = this.fb.group({
    slot: ['', Validators.required],
    label: ['', Validators.required],
  });
  existingFields = computed(() => {
    const inventory = this.inventory();
    if (!inventory) return [];
    return FIELD_KEYS
      .filter(key => inventory[key])
      .map(key => ({
        key,
        label: inventory[key] as string
      }));
  });
  availableSlots = computed(() => {
    const inventory = this.inventory();
    if (!inventory) return [];
    return FIELD_KEYS.filter(key => !inventory[key]);
  });
  
  openFieldForm() {
    this.showForm.set(true);
  }

  cancelFieldForm() {
    this.showForm.set(false);
    this.form.reset();
  }
  
  save() {
    if (this.form.invalid) return;
    this.form.disable();
    const { slot, label } = this.form.value;
    const payload: InventoryFieldsDto = {
      version: this.inventory()!.version
    };
    payload[slot as FieldKey] = label;

    this.saveField.emit(payload)
    this.cancelFieldForm();
    this.form.enable();
  }

  delete(slot: FieldKey) {
    this.form.disable();
    const payload: InventoryFieldsDto = {
      version: this.inventory()!.version
    };
    payload[slot] = null;

    this.deleteField.emit(payload)
    this.form.enable();
  }
}
