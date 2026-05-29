import { Component, effect, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AuthStore } from "../../store/auth.store";
import { faCartShopping, faThLarge, faUser } from "@fortawesome/free-solid-svg-icons";
import { CartStore } from "../../store/cart.store";


@Component({
  selector: 'app-header',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  cartStore = inject(CartStore);
  previousCount = 0;
  isCartBouncing = signal(false);
  constructor() {
    effect(() => {
      const currentCount = this.cartStore.totalItems();
      if (currentCount && currentCount > this.previousCount) {
        this.isCartBouncing.set(true);
        setTimeout(() => this.isCartBouncing.set(false), 1000);
      }
      this.previousCount = currentCount;
      console.log('Cart Items:', this.cartStore.items());
    });
  }
  authStore = inject(AuthStore);
  

  router = inject(Router);

  faUser = faUser;
  faThLarge = faThLarge
  faCart = faCartShopping;

  isLoggedIn = this.authStore.isLoggedIn;
  currentUser = this.authStore.currentUser;
  isAdmin = this.authStore.isAdmin;
}