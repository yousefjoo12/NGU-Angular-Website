import { Component, ChangeDetectionStrategy, inject, signal, effect, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, forkJoin, map, catchError, of, Observable } from 'rxjs';
import { SchoolService } from '../../_Services/school.service';
import { SchoolSection } from '../../_Interfaces/SchoolSection';

export interface SchoolDataState {
  loading: boolean;
  errorMessage: string;
  imageCoverURL: string;
  sections: SchoolSection[];
}

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './school.Component.html',
  styleUrls: ['./school.Component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolComponent {
  private route = inject(ActivatedRoute);
  private schoolService = inject(SchoolService);
  private titleService = inject(Title);

  // 1. تحديد القيمة الأولية المضمونة
  private initialSchoolState: SchoolDataState = {
    loading: true,
    errorMessage: '',
    imageCoverURL: '',
    sections: [],
  };

  // 2. تحويل الـ Stream إلى Signal بدون تعارض في الـ Overloads
  readonly state: Signal<SchoolDataState> = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id): Observable<SchoolDataState> => {
        if (!id) {
          return of({
            loading: false,
            errorMessage: 'Invalid school reference.',
            imageCoverURL: '',
            sections: [],
          });
        }

        return forkJoin({
          sections: this.schoolService.getSchoolById(id),
          detail: this.schoolService.getSchool(id),
        }).pipe(
          map(({ sections, detail }): SchoolDataState => {
            const activeSections = (sections || []).filter((s) => s.status);
            return {
              loading: false,
              errorMessage:
                activeSections.length === 0
                  ? 'No published content is available for this school yet.'
                  : '',
              imageCoverURL: detail?.imageCoverURL || '',
              sections: activeSections,
            };
          }),
          catchError((err): Observable<SchoolDataState> => {
            console.error('School load error:', err);
            return of({
              loading: false,
              errorMessage: 'We could not load this school right now. Please try again shortly.',
              imageCoverURL: '',
              sections: [],
            });
          }),
        );
      }),
    ),
    { initialValue: this.initialSchoolState },
  );

  // Signal للقسم المختار
  activeSection = signal<SchoolSection | null>(null);

  constructor() {
    effect(() => {
      const currentState = this.state();
      if (currentState.sections.length > 0) {
        const firstSection = currentState.sections[0];
        this.activeSection.set(firstSection);
        this.titleService.setTitle(`${firstSection.school} | NGU`);
      } else {
        this.activeSection.set(null);
      }
    });
  }

  selectSection(section: SchoolSection): void {
    this.activeSection.set(section);
  }

  trackBySectionId(_index: number, section: SchoolSection): number {
    return section.sec_Id;
  }
}
