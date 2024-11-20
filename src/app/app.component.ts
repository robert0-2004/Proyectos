import { Component } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { CartAppComponent } from './components/cart-app/cart-app.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CartAppComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = '3-car-app';
}
