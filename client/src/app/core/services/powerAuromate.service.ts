import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PowerAutomateService {
  private http = inject(HttpClient);

  createTicket(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/power-automate/ticket`, data);
  }
}
