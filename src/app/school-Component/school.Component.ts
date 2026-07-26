import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { SchoolService } from '../_Services/school.Service';
import { SchoolSection } from '../_Interfaces/SchoolSection';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css'],
})
export class SchoolComponent implements OnInit {
  schoolId!: number;
  sections: SchoolSection[] = [];
  activeSection: SchoolSection | null = null;
  safeContent: SafeHtml = '';

  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private schoolService: SchoolService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.errorMessage = 'Invalid school reference.';
        this.loading = false;
        return;
      }
      this.schoolId = id;
      this.fetchSchool(id);
    });
  }

  private fetchSchool(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.schoolService.getSchoolById(id).subscribe({
      next: (data) => {
        // Keep only active sections, preserve the order returned by the API
        this.sections = (data || []).filter((s) => s.status);

        if (this.sections.length === 0) {
          this.errorMessage = 'No published content is available for this school yet.';
          this.loading = false;
          return;
        }

        this.selectSection(this.sections[0]);
        this.titleService.setTitle(`${this.sections[0].school} | NGU`);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'We could not load this school right now. Please try again shortly.';
        this.loading = false;
      },
    });
  }

  selectSection(section: SchoolSection): void {
    this.activeSection = section;
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(section.content_School || '');
  }

  trackBySectionId(_index: number, section: SchoolSection): number {
    return section.sec_Id;
  }
}
