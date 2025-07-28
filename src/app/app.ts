import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTableModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('admin-panel');
}
