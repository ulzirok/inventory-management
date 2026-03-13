import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
@Component({
  selector: 'app-header',
  imports: [Navbar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {

}
