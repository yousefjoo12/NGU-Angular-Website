import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { AboutComponent } from './Components/about/about.component';
import { NotFound } from './not-found/not-found';
import { SchoolComponent } from './Components/school/school.Component';
import { Academics } from './Components/academics/academics'; // تأكد من ضبط المسار حسب مكان الملف لديك

export const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'academics', component: Academics, title: 'Academics' },
  { path: 'school/:id', component: SchoolComponent, title: 'School Details' },
  { path: 'contact', component: Contact, title: 'Contact' },
  { path: '**', component: NotFound, title: 'NotFound' },
];
