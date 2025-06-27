// Proyecto/src/app/services/auth.service.ts

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
  private apiUrl = 'http://localhost:3000/api/auth'; // URL base para autenticación
  private userProfileUrl = 'http://localhost:3000/api/user'; // URL base para perfil de usuario

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Incluir el token JWT
    });
  }

  // Método para el inicio de sesión
  login(credentials: { correo: string, contrasena: string }): Observable<LoginResponse> {
    // La API espera 'correo' y 'contrasena', no 'email' y 'password'
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          // Guarda el perfil del usuario también para acceso rápido
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      })
    );
  }

  // Método para el registro de usuarios
  register(userData: any): Observable<any> {
    // userData ya debe estar mapeado correctamente en el componente que llama a este servicio
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Métodos para la gestión del perfil de usuario
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.userProfileUrl}/profile`, { headers: this.getAuthHeaders() });
  }

  updateProfile(userData: any): Observable<any> {
    return this.http.put<any>(`${this.userProfileUrl}/profile`, userData, { headers: this.getAuthHeaders() });
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  // Método para obtener el usuario actual del localStorage
  getCurrentUser(): any | null {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }

  // Nuevo método para eliminar la cuenta del usuario autenticado
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.userProfileUrl}/profile`, { headers: this.getAuthHeaders() });
  }
}