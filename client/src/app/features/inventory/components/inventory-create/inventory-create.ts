import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Category, Tag } from '../../models/inventory.interface';
import { InventoryService } from '../../services/inventory.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../core/services/notification.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-inventory-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './inventory-create.html',
  styleUrl: './inventory-create.scss',
})
export class InventoryCreate {
  private fb = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  selectedTags = signal<Tag[]>([]);
  form!: FormGroup;
  selectedFile: File | null = null;
  tag = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  isEditMode = signal(false);
  inventoryId = signal<string | null>(null);
  currentVersion = signal<number>(0);

  public filteredTags$ = this.tag.valueChanges.pipe(
    startWith(''),
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(value =>
      this.inventoryService.getTags(value || '')
    )
  );

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.inventoryId.set(id);
    }
  }

  ngOnInit(): void {
    this.loadCategories();

    this.inventoryService.getCategories().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => this.categories.set(data));

    this.form = this.fb.group({
      categoryId: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: ['']
    });

    if (this.isEditMode()) {
      this.inventoryService.getById(this.inventoryId()!).subscribe(data => {
        this.currentVersion.set(data.version);
        this.form.patchValue({
          categoryId: data.categoryId,
          title: data.title,
          description: data.description
        });
        this.selectedTags.set(data.tags || []);
      });
    }

  }

  loadCategories() {
    this.inventoryService.getCategories().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      data => this.categories.set(data)
    );
  }

  addTag(tag: Tag) {
    if (!this.selectedTags().some(t => t.id === tag.id)) {
      this.selectedTags.update(tags => [...tags, tag]);
    }
    this.tag.setValue('');
  }

  addTagFromInput(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (!value) return;
    if (!this.selectedTags().some(t => t.name === value)) {
      const newTag: Tag = {
        id: 0,
        name: value
      };
      this.selectedTags.update(tags => [...tags, newTag]);
    }
    event.chipInput!.clear();
    this.tag.setValue('');
  }

  addTagOnBlur() {
    const value = this.tag.value?.trim();
    if (!value) return;

    if (!this.selectedTags().some(t => t.name === value)) {
      this.selectedTags.update(tags => [
        ...tags,
        { id: Date.now(), name: value }
      ]);
    }
    this.tag.setValue('');
  }

  removeTag(tag: Tag) {
    this.selectedTags.update(tags =>
      tags.filter(t => t.id !== tag.id)
    );
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  
  cancel() {
    const id = Number(this.inventoryId()!)
    this.router.navigate([`/inventory/${id}/details`]);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.form.disable();
    const formData = this.prepareFormData();
    this.isEditMode() ? this.updateInventory(formData) : this.createInventory(formData);
    
    this.tag.setValue('');
    this.selectedTags.set([]);
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.setErrors(null);
    });

  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    formData.append('categoryId', this.form.get('categoryId')?.value);
    formData.append('title', this.form.get('title')?.value);
    formData.append('description', this.form.get('description')?.value);
    if (this.isEditMode()) formData.append('version', this.currentVersion().toString());
    if (this.selectedFile) formData.append('image', this.selectedFile, this.selectedFile.name);
    const tagNames = this.selectedTags().map(t => t.name);
    tagNames.forEach(name => {
      formData.append('tags', name);
    });
    return formData;
  }

  private createInventory(formData: FormData) {
    this.inventoryService.create(formData).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.notificationService.success('Inventory created');
        this.router.navigate(['/inventory']);
        
        this.form.reset();
        this.form.enable();
      },
      error: (err) => this.form.enable()
    });
  }

  private updateInventory(formData: FormData) {
    const id = Number(this.inventoryId()!)
    
    this.inventoryService.update(id, formData).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.notificationService.success('Inventory updated');
        this.router.navigate([`/inventory/${id}/details`]);
      },
      error: (err) => this.form.enable()
    });
  }

}
