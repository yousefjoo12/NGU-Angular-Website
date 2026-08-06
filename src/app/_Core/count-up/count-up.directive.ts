import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Animates a number counting up from 0 to [countTo] once it enters the
 * viewport. Used for the Home page statistics band.
 *
 * Usage: <span class="stat-number" appCountUp [countTo]="4500" suffix="+"></span>
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private hasRun = false;

  @Input({ required: true }) countTo!: number;
  @Input() countDuration = 1600;
  @Input() suffix = '';

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.textContent = `0${this.suffix}`;

    if (typeof IntersectionObserver === 'undefined') {
      node.textContent = `${this.countTo}${this.suffix}`;
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !this.hasRun) {
            this.hasRun = true;
            this.animate(node);
            this.observer?.unobserve(node);
          }
        }
      },
      { threshold: 0.4 },
    );

    this.observer.observe(node);
  }

  private animate(node: HTMLElement): void {
    const start = performance.now();
    const from = 0;
    const to = this.countTo;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / this.countDuration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(from + (to - from) * eased);
      node.textContent = `${value.toLocaleString()}${this.suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
