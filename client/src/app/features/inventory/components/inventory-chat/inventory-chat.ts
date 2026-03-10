import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MarkdownComponent } from 'ngx-markdown';
import { Comment } from '../../models/comment.interface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-chat',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MarkdownComponent,
    RouterLink,
    CommonModule
  ],
  templateUrl: './inventory-chat.html',
  styleUrl: './inventory-chat.scss',
})
export class InventoryChat implements OnInit {
  messages = input<Comment[]>([])
  sendMessage = output<string>()
  private fb = inject(FormBuilder);

  form!: FormGroup;
  
  ngOnInit(): void {
    this.form = this.fb.group({
      text: ['']
    })
  }
  
  send() {
    const text = this.form.value.text
    if(!text?.trim()) return
    this.sendMessage.emit(text)
    this.form.reset();
  }
}
