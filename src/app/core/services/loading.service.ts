import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private count = signal(0);
  public isLoading = computed(() => this.count() > 0);

  show(): void {
    this.count.update(n => n + 1);
  }

  hide(): void {
    this.count.update(n => Math.max(0, this.count() - 1));
  }
}
