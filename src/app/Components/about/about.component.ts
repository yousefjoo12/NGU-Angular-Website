import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  OnDestroy,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of, Observable } from 'rxjs';

import { AboutService } from '../../_Services/about.service';
import { About } from '../../_Interfaces/about';

export interface AboutDataState {
  loading: boolean;
  errorMessage: string;
  abouts: About[];
  heroImages: string[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnDestroy {
  private aboutService = inject(AboutService);

  // 1. القيمة الأولية المضمونة لتجنب أخطاء TypeScript Types
  private initialAboutState: AboutDataState = {
    loading: true,
    errorMessage: '',
    abouts: [],
    heroImages: [],
  };

  // 2. حالة البيانات الأساسية تحول لـ Signal
  readonly state: Signal<AboutDataState> = toSignal(
    this.aboutService.getAllAbout().pipe(
      map((res): AboutDataState => {
        const sorted = (res || [])
          .filter((x) => x.status)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        const images = sorted.map((x) => x.imageCoverURL).filter((x): x is string => !!x);

        return {
          loading: false,
          errorMessage: '',
          abouts: sorted,
          heroImages: images,
        };
      }),
      catchError((err): Observable<AboutDataState> => {
        console.error('Load About Error:', err);
        return of({
          loading: false,
          errorMessage: 'Failed to load About information.',
          abouts: [],
          heroImages: [],
        });
      }),
    ),
    { initialValue: this.initialAboutState },
  );

  // 3. Signals للـ Selected Item والـ Hero Image Slider
  activeAbout = signal<About | null>(null);
  currentHeroImage = signal<string>('');
  currentHeroIndex = signal<number>(0);

  private heroInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // تحديث العنصر النشط والـ Slider تلقائياً عند وصول البيانات
    effect(() => {
      const currentState = this.state();
      if (currentState.abouts.length > 0) {
        const firstItem = currentState.abouts[0];
        this.selectAbout(firstItem);

        if (currentState.heroImages.length > 1) {
          this.startHeroSlider(currentState.heroImages);
        }
      } else {
        this.activeAbout.set(null);
      }
    });
  }

  // اختيار عنصر من القائمة
  selectAbout(item: About): void {
    this.activeAbout.set(item);

    if (item.imageCoverURL) {
      this.currentHeroImage.set(item.imageCoverURL);
      const images = this.state().heroImages;
      const index = images.indexOf(item.imageCoverURL);
      if (index !== -1) {
        this.currentHeroIndex.set(index);
      }
    }
  }

  // تشغيل السلايدر
  private startHeroSlider(images: string[]): void {
    this.stopHeroSlider();

    this.heroInterval = setInterval(() => {
      const nextIndex = (this.currentHeroIndex() + 1) % images.length;
      this.currentHeroIndex.set(nextIndex);
      this.currentHeroImage.set(images[nextIndex]);
    }, 5000);
  }

  private stopHeroSlider(): void {
    if (this.heroInterval) {
      clearInterval(this.heroInterval);
      this.heroInterval = null;
    }
  }

  trackById(_index: number, item: About): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.stopHeroSlider();
  }
}
