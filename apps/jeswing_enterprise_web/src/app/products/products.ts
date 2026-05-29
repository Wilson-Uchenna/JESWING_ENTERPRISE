import { Component, signal, computed, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCartShopping,
  faChevronLeft,
  faChevronRight,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { Product, ProductStore } from '../store/product.store';
import { CategoryStore } from '../store/category.store';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetail } from '../components/product-detail/product-detail';
import { CartStore } from '../store/cart.store';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, ProductDetail],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  constructor() {
    
  }

  protected store = inject(ProductStore);
  protected catStore = inject(CategoryStore);
  protected cartStore = inject(CartStore);
   private route = inject(ActivatedRoute);
  private router = inject(Router);

  @Output() productSelected = new EventEmitter<Product>();

  faCartShopping = faCartShopping;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faEye = faEye;

  // Sidebar filters
  selectedCategoryId = signal<string | number | null>(null);

  readonly priceLimit = signal(100000); // fixed max
  maxPrice = signal(100000);
  selectedBrands = signal<string[]>(['Stellar Ware']);
  hoveredProduct = signal<string | null>(null);
  selectedProduct = signal<Product | null>(null);

  // Pagination
  currentPage = signal(1);
  totalPages = 8;
  itemsPerPage = 6;

  categories = computed(() => this.catStore.categories() ?? []);

  products = computed(() => this.store.products());

  ngOnInit(): void {
    if (this.categories().length === 0) {
      this.catStore.loadCategories?.();
    }

    if (this.products().length === 0) {
      this.store.loadProducts?.();
    }
    console.log('Products initialized. Categories:', this.categories());
    console.log('Products initialized. Products:', this.products());
  }

  brands = ['EcoClean Pro', 'PureHome', 'Stellar Ware'];

  openDetail(product: Product): void {
    this.store.selectProduct(product);
    // Update URL with query param (no page reload)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { product: product.id },
      queryParamsHandling: 'merge',
    });
  }

  closeDetail(): void {
    this.store.selectProduct(null);
    // Remove query param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  filteredProducts = computed(() => {
    return this.products().filter((p) => {
      const catId = this.selectedCategoryId();
      const catMatch = catId === null || p.categoryId === catId; // ✅ null = no filter
      const priceMatch = p.price <= this.maxPrice();
      console.log('Products: ', this.products());
      return catMatch && priceMatch;
    });
  });

  productCountByCategory = computed(() => {
    const products = this.products();
    return this.categories().reduce(
      (acc, cat) => {
        acc[cat.id] = products.filter((p) => p.categoryId === cat.id).length;
        return acc;
      },
      {} as Record<string | number, number>,
    );
  });

  // parent.component.ts


  // Get count for a specific category
  getProductCount(categoryId: string | number): number {
    return this.productCountByCategory()[categoryId] ?? 0;
  }
  pagedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredProducts().slice(start, start + this.itemsPerPage);
  });

  totalShowing = computed(() => {
    const total = this.filteredProducts().length;
    const start = (this.currentPage() - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage() * this.itemsPerPage, total);
    return { start, end, total };
  });

  get visiblePages(): (number | string)[] {
    return [1, 2, 3, '...', 8];
  }

  selectCategory(name: string): void {
    this.selectedCategoryId.set(
      this.categories()?.find((c) => c.name === name)?.id ?? null,
    );
    this.currentPage.set(1);
  }

  toggleBrand(brand: string): void {
    this.selectedBrands.update((brands) =>
      brands.includes(brand)
        ? brands.filter((b) => b !== brand)
        : [...brands, brand],
    );
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands().includes(brand);
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') this.currentPage.set(page);
  }

  prevPage(): void {
    if (this.currentPage() > 1) this.currentPage.update((p) => p - 1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages)
      this.currentPage.update((p) => p + 1);
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    // TODO: wire to CartStore
    this.cartStore.addToCart(product);
    console.log('Added to cart:', product.name);
  }

  quickView(product: Product): void {
    // TODO: open quick view modal
    this.openDetail(product);
    console.log('Quick view:', product.name);
  }
}
