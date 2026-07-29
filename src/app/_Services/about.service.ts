import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { About } from '../_Interfaces/about';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private apiUrl = 'https://localhost:7069/api';

  constructor(private http: HttpClient) {}

  getAllAbout(): Observable<About[]> {
    return this.http.get<About[]>(`${this.apiUrl}/About/Active`);
  }

  getAboutById(id: number): Observable<About> {
    return this.http.get<About>(`${this.apiUrl}/About/${id}`);
  }
}
