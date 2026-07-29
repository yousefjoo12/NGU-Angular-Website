import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class Navbar implements OnInit, OnDestroy {
  schools: School[] = [];

  dropdownOpen = false;

  loading = true;

  private subscription = new Subscription();

  constructor(private schoolService: SchoolService) {}

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    const sub = this.schoolService.getAllSchools().subscribe({
      next: (res: School[]) => {
        this.schools = res;

        this.loading = false;

        console.log('Navbar Schools:', this.schools);
      },

      error: (err) => {
        console.error('Load Schools Error:', err);

        this.loading = false;
      },
    });

    this.subscription.add(sub);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
