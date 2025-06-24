// Proyecto/src/app/services/common.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs'; // Importa lastValueFrom
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl = 'YOUR_API_BASE_URL'; // **IMPORTANTE: Reemplaza con la URL base de tu API**

  constructor(private http: HttpClient) { }

  async getRegions(): Promise<any[]> {
    const observable = this.http.get<any[]>(`${this.apiUrl}/regions`).pipe(
      map(data => data || [])
    );
    return await lastValueFrom(observable); // Usar lastValueFrom
  }

  async getComunas(): Promise<any[]> {
    const observable = this.http.get<any[]>(`${this.apiUrl}/comunas`).pipe(
      map(data => data || [])
    );
    return await lastValueFrom(observable); // Usar lastValueFrom
  }
}