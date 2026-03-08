import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-inventory-chat',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MarkdownComponent
  ],
  templateUrl: './inventory-chat.html',
  styleUrl: './inventory-chat.scss',
})
export class InventoryChat implements OnInit {
  private fb = inject(FormBuilder);

  form!: FormGroup;
  
  ngOnInit(): void {
    this.form = this.fb.group({
      text: ['']
    })
  }
}
