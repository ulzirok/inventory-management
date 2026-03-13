import { ChangeDetectionStrategy, Component, inject, input, OnChanges, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { Inventory } from '../../models/inventory.interface';

@Component({
  selector: 'app-inventory-access',
  imports: [MatRadioModule, ReactiveFormsModule, TranslateModule, MatButtonModule],
  templateUrl: './inventory-access.html',
  styleUrl: './inventory-access.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryAccess implements OnChanges {
  inventory = input<Inventory | null>(null);
  saveAccess = output<FormData>()
  private fb = inject(FormBuilder)
  form!: FormGroup
  
  ngOnChanges(): void {
    this.form = this.fb.group({
      isPublic: [this.inventory()?.isPublic]
    })
  }
  
  save() {
    if (this.form.invalid || !this.inventory()) return;
    const formData = new FormData();
    formData.append('isPublic', this.form.get('isPublic')?.value.toString());
    formData.append('version', this.inventory()!.version.toString());
    
    this.saveAccess.emit(formData)
  }
}
