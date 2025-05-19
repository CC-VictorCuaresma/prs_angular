import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // ← Esto es correcto aunque esté en negro
import { ZoneListComponent } from './components/zone-list/zone-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,     // ✅ DEBE ESTAR AQUÍ
    ZoneListComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-app';
}
