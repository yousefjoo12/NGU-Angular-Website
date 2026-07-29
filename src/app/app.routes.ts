import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { AboutComponent } from './Components/about/about.component';
import { NotFound } from './not-found/not-found';
import { SchoolComponent } from './Components/school/school.Component';

export const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'school/:id', component: SchoolComponent, title: 'Academic' },
  { path: 'contact', component: Contact, title: 'Contact' },
  { path: '**', component: NotFound, title: 'NotFound' },
];
