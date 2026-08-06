import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RevealDirective } from '../_Core/reveal/reveal.directive';

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private fb = inject(FormBuilder);

  readonly contactInfo: ContactInfo[] = [
    {
      icon: 'fa-solid fa-location-dot',
      label: 'Campus Address',
      value: 'New Giza, Cairo-Alexandria Desert Road, Giza, Egypt',
      href: 'https://maps.google.com/?q=New+Giza+University',
    },
    {
      icon: 'fa-solid fa-phone',
      label: 'Phone',
      value: '+20 2 3854 0000',
      href: 'tel:+20238540000',
    },
    {
      icon: 'fa-solid fa-envelope',
      label: 'Email',
      value: 'info@ngu.edu.eg',
      href: 'mailto:info@ngu.edu.eg',
    },
    {
      icon: 'fa-regular fa-clock',
      label: 'Office Hours',
      value: 'Sunday \u2013 Thursday, 9:00 AM \u2013 5:00 PM',
    },
  ];

  readonly departments = [
    'Admissions',
    'Academic Affairs',
    'Student Services',
    'Careers & Alumni',
    'General Inquiry',
  ];

  submitted = signal(false);
  submitting = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['General Inquiry', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    // Simulated submission — wire to a real endpoint when available.
    setTimeout(() => {
      this.submitting.set(false);
      this.submitted.set(true);
      this.form.reset({ department: 'General Inquiry' });
    }, 900);
  }

  sendAnother(): void {
    this.submitted.set(false);
  }
}
