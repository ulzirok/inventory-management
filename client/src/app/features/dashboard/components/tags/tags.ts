import { ChangeDetectionStrategy, Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Tag } from '../../../search/models/search.interface';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tags',
  imports: [MatButtonModule, MatCardModule, CommonModule, TranslateModule],
  templateUrl: './tags.html',
  styleUrl: './tags.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tags {
  tags = input<Tag[]>([])
  searchByTag = output<string>();

  onSearchByTag(tagName: string) {
    this.searchByTag.emit(tagName);
  }
}
