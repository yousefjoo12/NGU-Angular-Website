import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SchoolService } from '../../_Services/school.service';
import { School } from '../../_Interfaces/School';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar implements OnInit {
  private schoolService = inject(SchoolService);

  // حالة المكون باستخدام Signals
  schools = signal<School[]>([]);
  loading = signal<boolean>(true);
  dropdownOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.schoolService.getAllSchools().subscribe({
      next: (res: School[]) => {
        this.schools.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Load Schools Error:', err);
        this.loading.set(false);
      },
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen.update((val) => !val);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }
}
