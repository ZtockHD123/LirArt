import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // Cambia la URL base para apuntar a tu propio backend
  private backendApiUrl = 'http://localhost:3000/api/proxy'; // Asume que tu backend corre en el puerto 3000

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el listado de todas las regiones de Chile a través del proxy del backend.
   * @returns Una promesa con un array de objetos de región.
   */
  async getRegions(): Promise<any[]> {
    const observable = this.http.get<any[]>(`${this.backendApiUrl}/regiones`).pipe(
      map(data => data || [])
    );
    return await lastValueFrom(observable);
  }

  /**
   * Obtiene el listado de comunas para una región específica a través del proxy del backend.
   * @param regionCode El código de la región (ej. '05', '13').
   * @returns Una promesa con un array de objetos de comuna.
   */
  async getComunasByRegion(regionCode: string): Promise<any[]> {
    const observable = this.http.get<any[]>(`${this.backendApiUrl}/regiones/${regionCode}/comunas`).pipe(
      map(data => data || [])
    );
    return await lastValueFrom(observable);
  }
}