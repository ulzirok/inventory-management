import { Injectable, signal } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class LoaderService {
  private loading = signal(false);
  public isLoading = this.loading.asReadonly();
  
  show() {
    this.loading.set(true);
  }
  hide() {
    this.loading.set(false);
  }
}