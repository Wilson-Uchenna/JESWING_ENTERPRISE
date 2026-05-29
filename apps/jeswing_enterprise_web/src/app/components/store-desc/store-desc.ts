import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRight, faArrowLeft, faCartShopping, faBars, faSearch, faUser, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
 
interface Product {
  id: number;
  name: string;
  price: string;
  tag?: string;
  tagColor?: string;
  gradient: string;
  icon: string;
}
 
interface Category {
  name: string;
  description: string;
  gradient: string;
  accentColor: string;
  span?: string;
}

@Component({
  selector: 'app-store-desc',
  imports: [CommonModule, RouterModule,RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './store-desc.html',
  styleUrl: './store-desc.scss',
})
export class StoreDesc {
  private router = inject(Router);

  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCartShopping = faCartShopping;
  faBars = faBars;
  faSearch = faSearch;
  faUser = faUser;
  faChevronRight = faChevronRight;

  activeSlide = signal(0);
  cartCount = signal(0);
 
  categories: Category[] = [
    {
      name: 'Stationery & Office',
      description: 'Premium desk tools and architect-quality organisation systems.',
      gradient: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
      accentColor: '#ff6200',
    },
    {
      name: 'Household Essentials',
      description: 'Curated home goods engineered for daily utility.',
      gradient: 'from-[#2d1b00] via-[#3d2800] to-[#1a1200]',
      accentColor: '#ffaa00',
    },
    {
      name: 'Industrial Packing',
      description: 'Heavy-duty materials rated for commercial logistics.',
      gradient: 'from-[#0d1b0d] via-[#1a2e1a] to-[#0a1a0a]',
      accentColor: '#4caf50',
    },
    {
      name: 'Technical Instruments',
      description: 'Precision measurement and calibration tools.',
      gradient: 'from-[#1a0d1a] via-[#2e1a2e] to-[#1a0d2e]',
      accentColor: '#9c27b0',
    },
  ];
 
  products: Product[] = [
    {
      id: 1,
      name: 'Precision Caliper Pro',
      price: '₦12,000',
      tag: 'BESTSELLER',
      tagColor: '#ff6200',
      gradient: 'from-[#1a1a2e] to-[#0f3460]',
      icon: '📐',
    },
    {
      id: 2,
      name: 'Eco-Seal Packing Tape',
      price: '₦2,500',
      gradient: 'from-[#2d1b00] to-[#1a1200]',
      icon: '📦',
    },
    {
      id: 3,
      name: 'Slate Series Notebook',
      price: '₦13,000',
      tag: 'NEW',
      tagColor: '#2196f3',
      gradient: 'from-[#0d1b2e] to-[#162040]',
      icon: '📓',
    },
    {
      id: 4,
      name: 'Glass Organiser Set',
      price: '₦11,000',
      gradient: 'from-[#1a1a1a] to-[#2d2d2d]',
      icon: '🏺',
    },
  ];
 
  brands = ['STEELCASE', 'MOLESKINE', 'ROTRING', 'TESA', 'METRIC', 'K-TOOL'];
 
  addToCart(product: Product): void {
    this.cartCount.update(c => c + 1);
  }
 
  nextSlide(): void {
    this.activeSlide.update(s => (s + 1) % this.products.length);
  }
 
  prevSlide(): void {
    this.activeSlide.update(s => (s - 1 + this.products.length) % this.products.length);
  }

  productNavigate() {
    this.router.navigate(['/products']);
  }

}
