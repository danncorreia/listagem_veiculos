import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavListComponent } from '../nav-list/nav-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    ToolbarComponent,
    RouterOutlet,
    MatSidenavModule,
    NavListComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  private layoutService = inject(LayoutService);
  private loadingService = inject(LoadingService);

  get isOppened() {
    return this.layoutService.isOppened();
  }

  get isMobile() {
    return this.layoutService.isMobile();
  }

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }
}
