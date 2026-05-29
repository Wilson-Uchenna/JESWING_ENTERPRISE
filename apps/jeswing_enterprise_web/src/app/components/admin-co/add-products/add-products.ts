import {
  Component,
  computed,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProductStore } from '../../../store/product.store';
import { faImage, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CategoryStore } from '../../../store/category.store';

@Component({
  selector: 'app-add-products',
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './add-products.html',
  styleUrl: './add-products.scss',
})
export class AddProducts implements OnInit {
  constructor(private router: Router) {}
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<{
    name: string;
    description: string;
    thumbnail: File | null;
    categoryId: string | number | null;
    price: number;
    stripePriceId: string | number;
  }>();
  protected store = inject(ProductStore);
  protected storecat = inject(CategoryStore);

  faXmark = faXmark;
  faImage = faImage;

  name = signal('');
  description = signal('');
  thumbnail: File | null = null;
  previewUrl = signal<string | null>(null);
  isDragging = signal(false);
  price = signal<number>(0);
  stripePriceId = signal<string | number>('');

  selectedCategoryId = signal<string | number | null>(null);
  selectFocused = false;

  // Computed from store - reactive, no manual loading needed
  categories = computed(() => this.storecat.categories?.() ?? []);

  ngOnInit(): void {
    // If categories aren't loaded yet, trigger load
    if (this.categories().length === 0) {
      this.storecat.loadCategories?.();
    }

    console.log('AddProducts initialized. Categories:', this.categories());
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    const categoryId = value === '' ? null : value;

    this.selectedCategoryId.set(categoryId);

    // Find category object and call store's selectCategory
    const category =
      this.categories().find((c) => String(c.id) === String(categoryId)) ||
      null;
    this.storecat.selectCategory(category);
  }

  getSelectedCategory(): Category | null {
    const id = this.selectedCategoryId();
    if (!id) return null;
    return this.categories().find((c) => String(c.id) === String(id)) || null;
  }

  getCategoryName(id: string | number | null): string {
    return this.categories().find((c) => c.id === id)?.name ?? '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.setFile(input.files[0]);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file?.type.startsWith('image/')) this.setFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  private setFile(file: File): void {
    this.thumbnail = file;
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  close(): void {
    this.store.closeModal();
    this.resetForm();
  }

  private resetForm(): void {
    this.name.set('');
    this.description.set('');
    this.price.set(0);
    this.thumbnail = null;
    this.previewUrl.set(null);
    this.selectedCategoryId.set(null);
    this.storecat.selectCategory(null);
  }

  submit(): void {
  if (!this.name().trim() || !this.selectedCategoryId()) return;
  //  const imageBase64 = this.previewUrl() || '';
  
  // Temporary placeholder until Stripe is integrated
  const tempStripePriceId = `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  this.store.createProduct(
    this.name().trim(), 
    this.description().trim(), 
    this.thumbnail, 
    this.price(),
    this.selectedCategoryId(),
    tempStripePriceId  // <-- required field
  );
  
  this.created.emit({
    name: this.name(),
    description: this.description(),
    thumbnail: this.thumbnail,
    categoryId: this.selectedCategoryId(),
    price: this.price(),
    stripePriceId: tempStripePriceId
  });
  
  this.resetForm();
}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
