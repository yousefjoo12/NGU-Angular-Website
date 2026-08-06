import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SchoolService } from '../../_Services/school.service';
import { School } from '../../_Interfaces/School';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  private schoolService = inject(SchoolService);

  readonly currentYear: number = new Date().getFullYear();

  schools = signal<School[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.schoolService.getAllSchools().subscribe({
      next: (data) => {
        this.schools.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading schools:', err);
        this.isLoading.set(false);
      },
    });
  }

  /** Strips the redundant "School of " prefix for a tidier footer list. */
  shortSchoolName(name: string): string {
    return name?.replace('School of ', '') ?? '';
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
