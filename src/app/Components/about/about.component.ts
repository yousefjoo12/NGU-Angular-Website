import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { AboutService } from '../../_Services/about.service';
import { About } from '../../_Interfaces/about';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, OnDestroy {
  // ==============================
  // DATA
  // ==============================

  abouts: About[] = [];

  activeAbout!: About;

  safeContent: SafeHtml = '';

  loading = true;

  errorMessage = '';

  // ==============================
  // HERO
  // ==============================

  currentHeroImage = '';

  heroImages: string[] = [];

  currentHeroIndex = 0;

  private heroInterval: any;

  constructor(
    private aboutService: AboutService,
    private sanitizer: DomSanitizer,
  ) {}

  // ==============================
  // INIT
  // ==============================

  ngOnInit(): void {
    this.loadAbout();
  }

  // ==============================
  // LOAD DATA
  // ==============================

  loadAbout(): void {
    this.loading = true;

    this.aboutService.getAllAbout().subscribe({
      next: (res) => {
        this.abouts = res.filter((x) => x.status).sort((a, b) => a.displayOrder - b.displayOrder);

        if (this.abouts.length > 0) {
          this.heroImages = this.abouts.map((x) => x.imageCoverURL).filter((x) => x);

          this.selectAbout(this.abouts[0]);

          this.startHeroSlider();
        }

        this.loading = false;
      },

      error: (err) => {
        console.error(err);

        this.errorMessage = 'Failed to load About information.';

        this.loading = false;
      },
    });
  }

  // ==============================
  // SELECT ITEM
  // ==============================

  selectAbout(item: About): void {
    this.activeAbout = item;

    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(item.about_Content || '');

    if (item.imageCoverURL) {
      this.currentHeroImage = item.imageCoverURL;

      this.currentHeroIndex = this.heroImages.indexOf(item.imageCoverURL);
    }
  }

  // ==============================
  // HERO SLIDER
  // ==============================

  startHeroSlider(): void {
    if (this.heroImages.length <= 1) return;

    this.heroInterval = setInterval(() => {
      this.currentHeroIndex++;

      if (this.currentHeroIndex >= this.heroImages.length) {
        this.currentHeroIndex = 0;
      }

      this.currentHeroImage = this.heroImages[this.currentHeroIndex];
    }, 5000);
  }

  // ==============================
  // TRACK BY
  // ==============================

  trackById(index: number, item: About): number {
    return item.id;
  }

  // ==============================
  // DESTROY
  // ==============================

  ngOnDestroy(): void {
    if (this.heroInterval) {
      clearInterval(this.heroInterval);
    }
  }
}
