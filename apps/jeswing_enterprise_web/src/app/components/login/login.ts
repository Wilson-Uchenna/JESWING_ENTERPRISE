import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  currentSlide = signal(0);
  private interval: ReturnType<typeof setInterval> | null = null;
  private loginSubscription: Subscription | null = null; // ← store the subscription here
  showPassword = false;

  email = signal('');
  password = signal('');
  authStore = inject(AuthStore);
  router = inject(Router);

  readonly slides = [
    {
      image: '/carousel1.png',
      badge: '⭐ Top Quality',
      badgeClass: 'bg-orange-500 text-white',
      title: 'Organize your life with premium stationery.',
      description:
        'Discover our new collection of household essentials and office supplies.',
    },
    {
      image: '/mop.png',
      badge: '🧹 Home Essentials',
      badgeClass: 'bg-blue-500 text-white',
      title: 'Keep your home spotless, every day.',
      description:
        'Premium cleaning tools built for every corner of your home.',
    },
    {
      image: '/poster.png',
      badge: '🎨 Creative Studio',
      badgeClass: 'bg-yellow-500 text-black',
      title: 'Unleash your creativity with every stroke.',
      description:
        'From sketch pads to vibrant paints — everything an artist needs in one place.',
    },
  ];

  ngOnInit() {
    this.interval = setInterval(() => {
      this.currentSlide.update((current) => (current + 1) % this.slides.length);
    }, 4000);
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
  }

  login() {
    this.loginSubscription = this.authStore
      .login(this.email(), this.password())
      .subscribe({
        next: () => {
          console.log('login next fired, user:', this.authStore.currentUser());
          console.log('isAdmin:', this.authStore.isAdmin());
          // navigation happens here after successful login
          const user = this.authStore.currentUser();
          if (user?.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: () => {}, // error already handled in store via patchState
      });
  }
}
