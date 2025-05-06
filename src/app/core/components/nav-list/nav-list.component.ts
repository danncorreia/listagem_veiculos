import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nav-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatSidenavModule],
  templateUrl: './nav-list.component.html',
  styleUrl: './nav-list.component.scss'
})
export class NavListComponent {
}
