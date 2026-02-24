import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Navbar } from '../../../shared/components/navbar/navbar/navbar';

@Component({
  selector: 'app-header',
  imports: [TranslateModule, Navbar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

}
