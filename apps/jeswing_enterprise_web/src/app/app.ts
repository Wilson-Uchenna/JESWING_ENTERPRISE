import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from './store/auth.store';

@Component({
  imports: [ RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'jeswing_enterprise_web';
  authStore = inject(AuthStore)

  ngOnInit(): void {
    this.authStore.loadCurrentUser()
  }
}
