import { ChangeDetectionStrategy, Component, effect, inject, input, OnChanges, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Inventory } from '../../models/inventory.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import dayjs from 'dayjs';
import { TranslateModule } from '@ngx-translate/core';


export const generateRandom = (bits: number): string => {
  const max = Math.pow(2, bits);
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return (array[0] % max).toString();
};

export const generateFixedDigits = (digits: number): string => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

export const generateGuid = (): string => {
  return window.crypto.randomUUID();
};

@Component({
  selector: 'app-inventory-custom-id',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './inventory-custom-id.html',
  styleUrl: './inventory-custom-id.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryCustomId implements OnInit, OnChanges{
  inventory = input<Inventory | null>(null)
  saveCustomId = output<FormData>()
  
  private fb = inject(FormBuilder)
  
  form!: FormGroup;

  previews = {
    random: '',
    date: '',
    seq: '0001',
    guid: ''
  };

  ngOnInit() {
    this.form = this.fb.group({
      fixedText: ['ITEM-'],
      randomType: ['rand6'],
      dateType: ['year'],
      sequenceType: ['seq'],
      useGuid: [false]
    });
    
    this.form.get('randomType')?.valueChanges.subscribe(() => {
      this.generateNewRandom();
    });

    this.form.get('dateType')?.valueChanges.subscribe(() => {
      this.updateDatePreview();
    });
    
    this.form.get('useGuid')?.valueChanges.subscribe((val) => {
      if (val) this.previews.guid = generateGuid();
      else this.previews.guid = '';
    });

    this.generateNewRandom();
    this.updateDatePreview();
  }
  
  ngOnChanges(): void {
    const currentInventory = this.inventory();
    if (currentInventory && currentInventory.idFormat) {
      this.parseExistingFormat(currentInventory.idFormat);
    }
  }
  
  parseExistingFormat(format: string) {
    const tags: string[] = format.match(/\{\{(.*?)\}\}/g) || [];
    const fixedPart = format.split('{{')[0] || '';

    const hasDate = tags.find(t => t.includes('date') || t.includes('year'));
    const hasRand = tags.find(t => t.includes('rand'));
    const hasGuid = tags.includes('{{guid}}');

    if (!this.form) return;
    this.form.patchValue({
      fixedText: fixedPart,
      dateType: hasDate ? hasDate.replace(/[{}]/g, '') : 'year',
      randomType: hasRand ? hasRand.replace(/[{}]/g, '') : 'rand6',
      useGuid: hasGuid
    }, { emitEvent: true });
  }

  generateNewRandom() {
    const type = this.form.get('randomType')?.value;
    if (type === 'rand20') this.previews.random = generateRandom(20);
    if (type === 'rand32') this.previews.random = generateRandom(32);
    if (type === 'rand6') this.previews.random = generateFixedDigits(6);
    if (type === 'rand9') this.previews.random = generateFixedDigits(9);
  }

  updateDatePreview() {
    const type = this.form.get('dateType')?.value;
    this.previews.date = type === 'year'
      ? dayjs().format('YYYY')
      : dayjs().format('YYYY-MM-DD');
  }
  
  save() {
    if (this.form.invalid || !this.inventory()) return;
    
    const value = this.form.value;
    let format = `${value.fixedText}{{${value.dateType}}}-{{${value.sequenceType}}}-{{${value.randomType}}}`;
    if (value.useGuid) format += `-{{guid}}`;
    
    const formData = new FormData();
    formData.append('idFormat', format);
    formData.append('version', this.inventory()!.version.toString());
    
    this.saveCustomId.emit(formData)
  }
}
