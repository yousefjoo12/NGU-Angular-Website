import { Component, OnDestroy, OnInit } from '@angular/core';
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
  abouts: About[] = [];

  activeAbout!: About;

  safeContent: SafeHtml = '';

  loading = true;

  errorMessage = '';

  currentHeroImage = '';

  constructor(
    private aboutService: AboutService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.loadAbout();
  }

  loadAbout(): void {
    this.loading = true;

    this.aboutService.getAllAbout().subscribe({
      next: (res) => {
        this.abouts = res.filter((x) => x.status).sort((a, b) => a.displayOrder - b.displayOrder);

        if (this.abouts.length > 0) {
          this.selectAbout(this.abouts[0]);
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

  selectAbout(item: About): void {
    this.activeAbout = item;

    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(item.about_Content || '');

    if (item.imageCoverURL) {
      console.log(item.imageCoverURL);

      this.currentHeroImage = item.imageCoverURL;
    } else {
      this.currentHeroImage = '';
    }
  }

  trackById(index: number, item: About): number {
    return item.id;
  }

  ngOnDestroy(): void {}
}
