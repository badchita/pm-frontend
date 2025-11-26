import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private api = `${environment.url}/auth`;

  register(user: any): Observable<any> {
    return this.http.post(`${this.api}/register`, user);
  }
}
