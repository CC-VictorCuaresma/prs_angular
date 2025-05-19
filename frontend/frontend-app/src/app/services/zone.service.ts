import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Zone {
  _id?: string;  // id de la zona (auto-generado por MongoDB)
  name: string;
  description: string;
  officeId: string;
  status?: string;  // Esto puede ser opcional si no es obligatorio al crear
 dateRecord?: string; // Esto puede ser opcional si no es necesario al crear
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private apiUrl = 'https://curly-space-broccoli-r97qwr4946g3x77r-8080.app.github.dev/api/v1/zonas';

  constructor(private http: HttpClient) {}

  // Obtener todas las zonas
  getAllZones(): Observable<Zone[]> {
    return this.http.get<ApiResponse<Zone[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  // Obtener zonas activas
  getActiveZones(): Observable<Zone[]> {
return this.http.get<any>(`${this.apiUrl}/active`).pipe(
  map(response => {
    console.log('Respuesta del backend:', response); // MUY IMPORTANTE
    return response.data.map((item: any) => ({
      _id: item.zoneId,
      name: item.name || item.nombre,
      description: item.description || item.descripción,
      officeId: item.officeId || item['ID de oficina'],
      status: item.status || item.estado,
      dateRecord: item.dateRecord
    }));
  })
);
  }


  // Obtener una zona por su id
  getZoneById(id: string): Observable<Zone> {
    return this.http.get<ApiResponse<Zone>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  // Crear una nueva zona
  createZone(zone: Partial<Zone>): Observable<Zone> {
    // Asegurarse de que `status` y `dateRecordts` son proporcionados
    const zoneData = {
      ...zone,
      status: zone.status || 'ACTIVE',  // Si no se pasa, asigna 'ACTIVE'
      dateRecordts: zone.dateRecord || new Date().toISOString()  // Asigna la fecha actual si no está presente
    };

    return this.http.post<ApiResponse<Zone>>(`${this.apiUrl}`, zoneData)
      .pipe(map(response => response.data));
  }

  // Actualizar una zona
  updateZone(id: string, zone: Zone): Observable<Zone>{
    return this.http.put<ApiResponse<Zone>>(`${this.apiUrl}/${id}`, zone)
      .pipe(map(response => response.data));
  }

  // Eliminar una zona
  deleteZone(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Activar una zona
  activateZone(id: string): Observable<Zone> {
    return this.http.patch<ApiResponse<Zone>>(`${this.apiUrl}/${id}/activate`, {})
      .pipe(map(response => response.data));
  }

  // Desactivar una zona
  desactivateZone(id: string): Observable<Zone> {
    return this.http.patch<ApiResponse<Zone>>(`${this.apiUrl}/${id}/desactivate`, {})
      .pipe(map(response => response.data));
  }
}
