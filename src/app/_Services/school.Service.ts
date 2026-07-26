import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { School } from '../_Interfaces/School';
import { SchoolSection } from '../_Interfaces/SchoolSection';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  constructor(private _http: HttpClient) {}
  private apiUrl = 'https://localhost:7069/api';

  getAllSchools(): Observable<School[]> {
    return this._http.get<School[]>(`${this.apiUrl}/School`);
  }

  getSchoolById(id: number): Observable<SchoolSection[]> {
    return this._http.get<SchoolSection[]>(
      `https://localhost:7069/api/School_Details/GetActiveSchoolDetailsById/${id}`,
    );
  }
}
