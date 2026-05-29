import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBell, faGear, faSearch, faFilter, faDownload,
  faArrowLeft, faArrowUpRightFromSquare,
  faArrowRight, faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { StockStatus, InventoryItem } from '../inventory/inventory';

interface SearchResult extends InventoryItem {
  subCategory: string;
  stockLevel: number; // 0-100 percent for bar
}

@Component({
  selector: 'app-inventory-search',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterModule],
  templateUrl: './inventory-search.html',
  styleUrl: './inventory-search.scss',
})
export class InventorySearchComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  // Icons
  faBell        = faBell;
  faGear        = faGear;
  faSearch      = faSearch;
  faFilter      = faFilter;
  faDownload    = faDownload;
  faArrowLeft   = faArrowLeft;
  faEdit        = faArrowUpRightFromSquare;
  faArrowRight  = faArrowRight;
  faChartLine   = faChartLine;

  searchQuery = signal('');

  // Mock dataset — swap with store/service call
  private allItems: SearchResult[] = [
    { skuId: 'IND-992',      productName: 'Industrial Grease X5',   subCategory: 'Lubricants & Chemical',  category: 'INDUSTRIAL', stockCount: 12,   unitPrice: 34.00, status: 'LOW STOCK',   stockLevel: 8  },
    { skuId: 'KS-IND-4001',  productName: 'Steel Conveyor Rollers', subCategory: 'Mechanical Components',  category: 'INDUSTRIAL', stockCount: 420,  unitPrice: 85.00, status: 'IN STOCK',    stockLevel: 72 },
    { skuId: 'KS-IND-4009',  productName: 'Zinc Plated Bolts M12',  subCategory: 'Fasteners',              category: 'INDUSTRIAL', stockCount: 1250, unitPrice: 0.15,  status: 'IN STOCK',    stockLevel: 88 },
    { skuId: 'PKG-IND-58',   productName: 'Heavy-Duty Woven Sacks', subCategory: 'Logistics Materials',   category: 'PACKING',    stockCount: 2000, unitPrice: 2.50,  status: 'IN STOCK',    stockLevel: 95 },
  ];

  results = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allItems;
    return this.allItems.filter(i =>
      i.productName.toLowerCase().includes(q) ||
      i.skuId.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.subCategory.toLowerCase().includes(q),
    );
  });

  alertCount = computed(() =>
    this.results().filter(i => i.status === 'LOW STOCK' || i.status === 'OUT OF STOCK').length
  );

  ngOnInit(): void {
    // Read query param if navigated from inventory page
    const q = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.searchQuery.set(q);
  }

  onSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.router.navigate([], {
        queryParams: { q: this.searchQuery() },
        queryParamsHandling: 'merge',
      });
    }
  }

  backToInventory(): void {
    this.router.navigate(['/admin/inventory']);
  }

  statusDot(status: StockStatus): string {
    return { 'IN STOCK': 'bg-emerald-400', 'LOW STOCK': 'bg-amber-400', 'OUT OF STOCK': 'bg-red-400' }[status];
  }

  statusText(status: StockStatus): string {
    return { 'IN STOCK': 'text-emerald-400', 'LOW STOCK': 'text-amber-400', 'OUT OF STOCK': 'text-red-400' }[status];
  }

  stockBarColor(item: SearchResult): string {
    if (item.stockLevel < 20) return '#ef4444';
    if (item.stockLevel < 50) return '#f59e0b';
    return '#ff6200';
  }

  formatStock(item: SearchResult): string {
    return item.stockCount >= 1000
      ? (item.stockCount / 1000).toFixed(item.stockCount % 1000 === 0 ? 0 : 1) + 'k Units'
      : item.stockCount + ' Units';
  }

  iconBg(category: string): string {
    const map: Record<string, string> = {
      INDUSTRIAL: 'bg-[#ff6200]/15 border-[#ff6200]/20',
      PACKING:    'bg-blue-500/15 border-blue-500/20',
      STATIONERY: 'bg-violet-500/15 border-violet-500/20',
      HOUSEHOLD:  'bg-emerald-500/15 border-emerald-500/20',
    };
    return map[category] ?? 'bg-white/5 border-white/10';
  }

  iconColor(category: string): string {
    const map: Record<string, string> = {
      INDUSTRIAL: '#ff6200', PACKING: '#60a5fa',
      STATIONERY: '#a78bfa', HOUSEHOLD: '#34d399',
    };
    return map[category] ?? '#ffffff40';
  }
}