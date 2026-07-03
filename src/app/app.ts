import { Component, signal } from '@angular/core';
import { Home } from './components/home/home';
import { RouterLink, RouterOutlet, Home } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
