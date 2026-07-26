import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Contact } from './contact/contact';
import { About } from './about/about.component';
import { NotFound } from './not-found/not-found';
import { SchoolComponent } from './school-Component/school.Component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, title: 'Home' },
  { path: 'about', component: About, title: 'About' },
  { path: 'contact', component: Contact, title: 'Contact' },
  { path: 'school/:id', component: SchoolComponent, title: 'Academic' },
  { path: '**', component: NotFound, title: 'NotFound' },
];
