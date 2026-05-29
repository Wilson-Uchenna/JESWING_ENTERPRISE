import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAppleAlt, faUser, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { AuthStore } from '../../store/auth.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FontAwesomeModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  faAppleAlt= faAppleAlt
  faUser=faUser
  faBoxArchive=faBoxArchive
  showPassword = false

  firstName= signal('');
  lastName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  agreed = signal(false);

  authStore = inject(AuthStore);
  router = inject(Router);

  register() {
    if (!this.agreed()) return;
    if (this.password() !== this.confirmPassword()) return;

    this.authStore.register(
    this.firstName(),
    this.lastName(),
    this.email(),
    this.password()
  );
  this.router.navigate(['/'])
}
}
