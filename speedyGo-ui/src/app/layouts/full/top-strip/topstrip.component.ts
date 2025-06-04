import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-topstrip',
  imports: [TablerIconsModule, MatButtonModule, MatMenuModule],
  templateUrl: './topstrip.component.html',
  standalone: true
})
export class AppTopstripComponent {
    constructor() { }

}
