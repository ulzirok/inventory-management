import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-salesforce',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    TranslateModule,
  ],
  templateUrl: './salesforce.html',
  styleUrl: './salesforce.scss',
})
export class Salesforce implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<Salesforce>);
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  send() {
    if (this.form.invalid) return;
    this.form.disable();
    this.dialogRef.close(this.form.value);
    this.form.reset();
  }

  close() {
    this.dialogRef.close();
  }
}
