import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { School } from '../_Interfaces/School';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  schools: School[] = [];
}
