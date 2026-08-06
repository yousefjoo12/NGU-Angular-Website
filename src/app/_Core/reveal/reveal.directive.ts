import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Lightweight, reusable "reveal on scroll" directive.
 *
 * Usage: <section appReveal>...</section>
 *        <div appReveal [revealDelay]="120">...</div>
 *
 * Pairs with the `[appReveal]` / `.is-visible` CSS in styles.scss.
 * Uses IntersectionObserver so it's cheap even with many elements,
 * and unobserves itself once triggered.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  /** Optional stagger delay in milliseconds. */
  @Input() revealDelay = 0;

  ngOnInit(): void {
    const node = this.el.nativeElement;

    if (this.revealDelay) {
      node.style.transitionDelay = `${this.revealDelay}ms`;
    }

    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for environments without IO support (e.g. some SSR contexts).
      node.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.unobserve(node);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
