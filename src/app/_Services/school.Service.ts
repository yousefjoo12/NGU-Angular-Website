import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { School } from '../_Interfaces/School';
import { SchoolSection } from '../_Interfaces/SchoolSection';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7069/api';

  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(`${this.apiUrl}/School`);
  }

  getSchoolById(id: number): Observable<SchoolSection[]> {
    return this.http.get<SchoolSection[]>(
      `${this.apiUrl}/School_Details/GetActiveSchoolDetailsById/${id}`,
    );
  }

  getSchool(id: number): Observable<School> {
    return this.http.get<School>(`${this.apiUrl}/School/${id}`);
  }
}
