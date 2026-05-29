import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FontAwesomeModule,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import {
  faBoxArchive,
  faGears,
  faLineChart,
  faStore,
  faThLarge,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { AuthStore } from '../../../store/auth.store';
import { ProductStore } from '../../../store/product.store';
import { AddProducts } from '../add-products/add-products';

interface NavItem {
  label: string;
  icon: IconDefinition;
  route: string;
}
@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule, CommonModule, RouterModule, AddProducts],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  
  
  navItems: NavItem[] = [
    { label: 'DASHBOARD', icon: faThLarge, route: '/admin/dashboard' },
    { label: 'INVENTORY', icon: faBoxArchive, route: '/admin/inventory' },
    { label: 'ORDERS', icon: faStore, route: '/admin/orders' },
    { label: 'CUSTOMERS', icon: faUsers, route: '/admin/customers' }, // ← your route
    { label: 'ANALYTICS', icon: faLineChart, route: '/admin/analytics' },
    { label: 'SETTINGS', icon: faGears, route: '/admin/settings' },
  ];

  authstore = inject(AuthStore);
  productstore = inject(ProductStore);
  router = inject(Router);
  toast = signal<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false, message: '', type: 'success'
  });

   constructor() {
    // React to store changes automatically
    effect(() => {
      const error = this.productstore.error();
      if (error) {
        this.showToast(error, 'error');
      }
    });

    let wasSaving = false;
    effect(() => {
      const saving = this.productstore.saving();
      const error = this.productstore.error();
      
      if (wasSaving && !saving && !error) {
        this.showToast('Product created successfully!', 'success');
      }
      wasSaving = saving;
    });
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast.set({ show: true, message, type });
    setTimeout(() => this.toast.set({ ...this.toast(), show: false }), 3000);
  }


  showLogoutModal = false;
  showProductsModal = false;

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  openProductsModal() {
    this.productstore.openModal();
  }

  closeProductsModal() {
    this.productstore.closeModal();
  }

  confirmLogout() {
    this.authstore.logout();
    this.showLogoutModal = false;
    this.router.navigate(['/login']);
  }
}
