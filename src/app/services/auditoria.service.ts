import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_BASE_URL}/auditoria`;

  getLogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}