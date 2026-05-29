import { Component, signal,  Output, EventEmitter, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faStar, faStarHalfAlt, faCartShopping, faHeart,
  faTruck, faLeaf, faShield, faMinus, faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {  Product, ProductStore } from '../../store/product.store';
import { CartStore } from '../../store/cart.store';
 
interface Feature {
  label: string;
  value: string;
  icon: any;
}

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private store = inject(ProductStore);
  private cartStore = inject(CartStore);
  
  product = computed(() => this.store.selectedProduct());
  
  @Output() closed = new EventEmitter<void>();
  @Output() addToCartEvent = new EventEmitter<{ product: Product; quantity: number }>();

  close(): void {
    this.store.selectProduct(null);
    this.closed.emit();
  }

  ngOnInit(): void {
    this.showProductInfo();
  }


  faStar         = faStar;
  faStarHalf     = faStarHalfAlt;
  faCartShopping = faCartShopping;
  faHeart        = faHeart;
  faTruck        = faTruck;
  faLeaf         = faLeaf;
  faShield       = faShield;
  faMinus        = faMinus;
  faPlus         = faPlus;
 
  quantity   = signal(1);
  isWishlisted = signal(false);
  addedToCart  = signal(false);
 
  
 
  features: Feature[] = [
    { label: 'Sustainability', value: '100% Recycled Metal', icon: this.faLeaf  },
    { label: 'Durability',     value: 'Lifetime Guarantee',  icon: this.faShield },
    { label: 'Delivery',       value: 'Priority Shipping',   icon: this.faTruck  },
  ];
 
  // stars = computed(() => {
  //   return [1, 2, 3, 4, 5].map(i => {
  //     if (i <= Math.floor(this.product.rating)) return 'full';
  //     if (i === Math.ceil(this.product.rating) && this.product.rating % 1 !== 0) return 'half';
  //     return 'empty';
  //   });
  // });
 
  // discount = computed(() =>
  //   Math.round((1 - this.product.price / this.product.originalPrice) * 100)
  // );
 
  increment(): void { this.quantity.update(q => q + 1); }
  decrement(): void { if (this.quantity() > 1) this.quantity.update(q => q - 1); }
 
  addToCart(): void {
    const p = this.product();
    if (!p) return;

    this.cartStore.addToCart(p);

    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 2000);
  }
 
  toggleWishlist(): void { this.isWishlisted.update(w => !w); }
  showProductInfo(): void {
    console.log('Product Info:', this.product());
  }

}
