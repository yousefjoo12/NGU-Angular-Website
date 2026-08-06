import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { AboutComponent } from './Components/about/about.component';
import { NotFound } from './not-found/not-found';
import { SchoolComponent } from './Components/school/school.Component';
import { Academics } from './Components/academics/academics';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'New Giza University' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'academics', component: Academics, title: 'Academics' },
  { path: 'school/:id', component: SchoolComponent, title: 'School Details' },
  { path: 'contact', component: Contact, title: 'Contact' },
  { path: '**', component: NotFound, title: 'Page Not Found' },
];
