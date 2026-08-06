import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SchoolService } from '../_Services/school.service';
import { School } from '../_Interfaces/School';
import { RevealDirective } from '../_Core/reveal/reveal.directive';
import { CountUpDirective } from '../_Core/count-up/count-up.directive';

interface Pillar {
  icon: string;
  title: string;
  description: string;
}

interface TimelineStep {
  year: string;
  title: string;
  description: string;
}

interface NewsItem {
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, RevealDirective, CountUpDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private schoolService = inject(SchoolService);

  schools = signal<School[]>([]);
  loadingSchools = signal<boolean>(true);
  schoolsError = signal<boolean>(false);

  readonly stats = [
    { value: 8, suffix: '+', label: 'Academic Schools' },
    { value: 9000, suffix: '+', label: 'Students Enrolled' },
    { value: 250, suffix: '+', label: 'Faculty Members' },
    { value: 40, suffix: '+', label: 'Global Partnerships' },
  ];

  readonly pillars: Pillar[] = [
    {
      icon: 'fa-solid fa-graduation-cap',
      title: 'World-Class Faculty',
      description:
        'Learn from scholars and industry leaders who bring research, mentorship, and real-world expertise into every classroom.',
    },
    {
      icon: 'fa-solid fa-building-columns',
      title: 'Global Curriculum',
      description:
        'Programs benchmarked against leading international universities, built to prepare graduates for a connected world.',
    },
    {
      icon: 'fa-solid fa-people-group',
      title: 'Vibrant Community',
      description:
        'A campus culture of clubs, athletics, and student initiatives that turns university life into a formative experience.',
    },
    {
      icon: 'fa-solid fa-briefcase',
      title: 'Career Readiness',
      description:
        'Dedicated career services, internships, and industry partnerships that connect study to meaningful employment.',
    },
  ];

  readonly timeline: TimelineStep[] = [
    {
      year: 'Foundation',
      title: 'A New Standard for Egyptian Higher Education',
      description:
        'New Giza University was founded to bring an international academic model to Egypt, anchored in liberal arts thinking.',
    },
    {
      year: 'Growth',
      title: 'Expanding Schools & Research',
      description:
        'The university grew from its founding schools into a multidisciplinary institution spanning engineering, business, and the arts.',
    },
    {
      year: 'Global Reach',
      title: 'International Partnerships',
      description:
        'Strategic collaborations with universities abroad opened exchange programs and joint research opportunities for students.',
    },
    {
      year: 'Today',
      title: 'A Thriving Academic Community',
      description:
        'Thousands of students now study across NGU\u2019s schools, supported by modern campus facilities and a dedicated faculty.',
    },
  ];

  readonly news: NewsItem[] = [
    {
      date: 'Sep 2025',
      category: 'Admissions',
      title: 'Fall Semester Applications Now Open',
      excerpt:
        'Prospective students can now apply for the upcoming academic year across all NGU schools and programs.',
      image:
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
    },
    {
      date: 'Aug 2025',
      category: 'Research',
      title: 'Faculty Publish Award-Winning Research',
      excerpt:
        'NGU researchers were recognized at a regional conference for contributions to sustainable engineering.',
      image:
        'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?q=80&w=1200&auto=format&fit=crop',
    },
    {
      date: 'Jul 2025',
      category: 'Campus Life',
      title: 'New Student Innovation Hub Opens',
      excerpt:
        'A dedicated space for entrepreneurship and design thinking launched on campus this summer.',
      image:
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  constructor() {
    this.schoolService.getAllSchools().subscribe({
      next: (data) => {
        this.schools.set((data || []).filter((s) => s.status).slice(0, 6));
        this.loadingSchools.set(false);
      },
      error: (err) => {
        console.error('Error loading schools on Home:', err);
        this.loadingSchools.set(false);
        this.schoolsError.set(true);
      },
    });
  }

  trackBySchoolId(_index: number, school: School): number {
    return school.id;
  }
}
