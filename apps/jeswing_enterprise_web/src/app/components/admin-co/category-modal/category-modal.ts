import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faImage } from '@fortawesome/free-solid-svg-icons';
import { CategoryStore } from '../../../store/category.store';

@Component({
  selector: 'app-category-modal',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './category-modal.html',
  styleUrl: './category-modal.scss',
})
export class CategoryModal {
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<{
    name: string;
    description: string;
    thumbnail: File | null;
  }>();
  protected store = inject(CategoryStore);

  // ── Icons ──────────────────────────────────────────────────────────────────
  faXmark = faXmark;
  faImage = faImage;

  name = signal('');
  description = signal('');
  

  close(): void {
    this.store.closeModal();
    this.resetForm();
  }

  private resetForm(): void {
    this.name.set('');
    this.description.set('');
  }

  submit(): void {
    if (!this.name().trim()) return;
    this.store.createCategory(this.name().trim(), this.description().trim());
    this.resetForm();
  }
}
