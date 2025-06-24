import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    rut: string;
    regionId: number;
    comunaId: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private userProfileUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  login(credentials: { correo: string, contrasena: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.userProfileUrl}/profile`, { headers: this.getAuthHeaders() });
  }

  updateProfile(userData: any): Observable<any> {
    return this.http.put<any>(`${this.userProfileUrl}/profile`, userData, { headers: this.getAuthHeaders() });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): any | null {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }

  // Nuevo método para eliminar la cuenta del usuario autenticado
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.userProfileUrl}/profile`, { headers: this.getAuthHeaders() });
  }
}