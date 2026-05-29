import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faThLarge,
  faBoxes,
  faUsers,
  faChartLine,
  faReceipt,
  faCog,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-profile',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  faThLarge = faThLarge;
  faBoxes = faBoxes;
  faUsers = faUsers;
  faChartLine = faChartLine;
  faCog = faCog;
  faReceipt = faReceipt;
  faSignOutAlt = faSignOutAlt;
  authstore = inject(AuthStore);
  router = inject(Router);

  isLoggedIn = this.authstore.isLoggedIn;
  currentUser = this.authstore.currentUser;
  

  showLogoutModal = false;

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  confirmLogout() {
    this.authstore.logout();
    this.showLogoutModal = false;
    this.router.navigate(['/login']);
  }
}
