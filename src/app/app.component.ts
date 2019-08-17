import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'enablement';

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // this.api.http.apiUrl = environment.apiUrl;
    if (environment.production) {
      document.addEventListener('keydown', (e) => {
        if (e.which === 123) {
          return false;
        }
      });
      document.addEventListener('contextmenu', e => {
        e.preventDefault();
      });
      this.initHomeRedirect();
    }
  }

  /**
   * Redirect to /home/dashboard view if user tries to navigate to /home url
   */
  private initHomeRedirect() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url == '/') { this.router.navigate(['/user'], { skipLocationChange: true }); }
      });
  }
}
