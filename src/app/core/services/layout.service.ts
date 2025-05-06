import { Injectable, signal, Signal } from "@angular/core";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private oppened = signal(!this.isMobile());

    toggle() {
      this.oppened.set(!this.oppened());
    }

    isOppened(): boolean {
      return this.oppened();
    }

    isMobile(): boolean {
      return window.matchMedia("(max-width: 768px)").matches;
    }
}
