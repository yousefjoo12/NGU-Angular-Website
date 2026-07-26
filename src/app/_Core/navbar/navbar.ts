import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SchoolService } from '../../_Services/school.Service';
import { School } from '../../_Interfaces/School';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent implements OnInit {
  schools: School[] = [];

  constructor(private schoolService: SchoolService) {}

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.schoolService.getAllSchools().subscribe({
      next: (data) => {
        this.schools = data;
      },
      error: (err) => {
        console.error('Error loading schools', err);
      },
    });
  }
}
