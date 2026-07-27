import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './_Core/footer/footer';
import { Navbar } from './_Core/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
