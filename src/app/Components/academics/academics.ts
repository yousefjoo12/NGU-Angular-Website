import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SchoolService } from '../../_Services/school.service';
import { School } from '../../_Interfaces/School';

@Component({
  selector: 'app-academics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './academics.html',
  styleUrl: './academics.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Academics implements OnInit, OnDestroy {
  private schoolService = inject(SchoolService);

  schools = signal<School[]>([]);
  loading = signal<boolean>(true);

  // الفهرس الحالي للصورة المعروضة
  currentHeroIndex = signal<number>(0);
  private timerId: ReturnType<typeof setInterval> | null = null;

  // تجميع كل صور الغلاف المتاحة من الكليات
  heroImages = computed(() => {
    return this.schools()
      .map((s) => s.imageCoverURL)
      .filter((url): url is string => !!url && url.trim() !== '');
  });

  // الصورة النشطة حالياً
  activeHeroImage = computed(() => {
    const images = this.heroImages();
    if (images.length === 0) return '';
    return images[this.currentHeroIndex() % images.length];
  });

  ngOnInit(): void {
    this.loadSchools();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  loadSchools(): void {
    this.schoolService.getAllSchools().subscribe({
      next: (res: School[]) => {
        this.schools.set(res || []);
        this.loading.set(false);
        this.startAutoplay();
      },
      error: (err) => {
        console.error('Load Schools Error:', err);
        this.loading.set(false);
      },
    });
  }

  // التبديل التلقائي كل 5 ثوانٍ
  startAutoplay(): void {
    this.stopAutoplay();
    if (this.heroImages().length > 1) {
      this.timerId = setInterval(() => {
        this.currentHeroIndex.update((prev) => (prev + 1) % this.heroImages().length);
      }, 5000);
    }
  }

  stopAutoplay(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
