import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Tag } from '../../../search/models/search.interface';

@Component({
  selector: 'app-tags',
  imports: [MatButtonModule],
  templateUrl: './tags.html',
  styleUrl: './tags.scss',
})
export class Tags {
  @Input() tags: Tag[] = [];
  @Output() searchByTag = new EventEmitter();

  onSearchByTag(tagName: string) {
    this.searchByTag.emit(tagName);
  }
}
