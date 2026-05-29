import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBell,
  faGear,
  faSearch,
  faChevronDown,
  faFilter,
  faDownload,
  faEllipsisV,
  faTriangleExclamation,
  faCircleExclamation,
  faTurnUp,
  faArrowRight,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';


export type StockStatus = 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
 
export interface InventoryItem {
  skuId: string;
  productName: string;
  category: string;
  stockCount: number;
  unitPrice: number;
  status: StockStatus;
  imageUrl?: string;
}
 
interface CriticalItem {
  name: string;
  sku: string;
  qty: number;
}
 
interface CategoryDist {
  label: string;
  percent: number;
  color: string;
}
@Component({
  selector: 'app-inventory',
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class Inventory implements AfterViewInit, OnDestroy {
  @ViewChild('chartRef') chartRef!: ElementRef<SVGElement>;
  // private router = inject(Router); 
 
  private platformId = inject(PLATFORM_ID);
  private resizeObserver?: ResizeObserver;
 
  // Icons
  faBell              = faBell;
  faGear              = faGear;
  faSearch            = faSearch;
  faChevronDown       = faChevronDown;
  faFilter            = faFilter;
  faDownload          = faDownload;
  faEllipsisV         = faEllipsisV;
  faTriangleExclamation = faTriangleExclamation;
  faCircleExclamation = faCircleExclamation;
  faTrendUp           = faTurnUp;
  faArrowRight = faArrowRight;
  faChartLine = faChartLine;
 
  // Search & filter
  searchQuery   = signal('');
  selectedCat   = signal('ALL CATEGORIES');
  categories    = ['ALL CATEGORIES', 'INDUSTRIAL', 'STATIONERY', 'HOUSEHOLD'];

  // Stats
  stats = [
    { label: 'TOTAL SKUS',       value: '1,284',   sub: '+12%',    subColor: '#ff6200', accent: 'border-white/10'          },
    { label: 'LOW STOCK ITEMS',  value: '42',       sub: '⚠',      subColor: '#f59e0b', accent: 'border-l-[#f59e0b]'       },
    { label: 'OUT OF STOCK',     value: '18',       sub: '!',       subColor: '#ef4444', accent: 'border-l-[#ef4444]'       },
    { label: 'INVENTORY VALUE',  value: '$245.8k',  sub: 'Real-time', subColor: '#60a5fa', accent: 'border-l-[#60a5fa]'    },
  ];
 
  // Category distribution
  categoryDist: CategoryDist[] = [
    { label: 'INDUSTRIAL',  percent: 55, color: '#ff6200' },
    { label: 'STATIONERY',  percent: 30, color: '#60a5fa' },
    { label: 'HOUSEHOLD',   percent: 15, color: '#6b7280' },
  ];
 
  // Critical items
  criticalItems: CriticalItem[] = [
    { name: 'Industrial Grease X5', sku: 'SKU: IND-992', qty: 2 },
    { name: 'Heavy Duty Staples',   sku: 'SKU: STA-042', qty: 5 },
  ];

  // Inventory table
  allItems: InventoryItem[] = [
    { skuId: 'KS-IND-4001', productName: 'Steel Conveyor Rollers',  category: 'INDUSTRIAL',  stockCount: 450,   unitPrice: 85.00,  status: 'IN STOCK'    },
    { skuId: 'KS-STA-2092', productName: 'Premium A4 Reams',        category: 'STATIONERY',  stockCount: 12,    unitPrice: 4.50,   status: 'LOW STOCK'   },
    { skuId: 'KS-HOU-0051', productName: 'Bio-Degrade Detergent',   category: 'HOUSEHOLD',   stockCount: 0,     unitPrice: 12.25,  status: 'OUT OF STOCK'},
    { skuId: 'KS-IND-4009', productName: 'Zinc Plated Bolts M12',   category: 'INDUSTRIAL',  stockCount: 1200,  unitPrice: 0.15,   status: 'IN STOCK'    },
    { skuId: 'KS-STA-1033', productName: 'Whiteboard Markers Set',  category: 'STATIONERY',  stockCount: 8,     unitPrice: 6.75,   status: 'LOW STOCK'   },
    { skuId: 'KS-IND-3017', productName: 'Industrial Grease X5',    category: 'INDUSTRIAL',  stockCount: 2,     unitPrice: 34.00,  status: 'LOW STOCK'   },
  ];
 
  filteredItems = computed(() => {
    const q   = this.searchQuery().toLowerCase();
    const cat = this.selectedCat();
    return this.allItems.filter(item => {
      const matchCat   = cat === 'ALL CATEGORIES' || item.category === cat;
      const matchSearch = !q || item.productName.toLowerCase().includes(q) || item.skuId.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  });
 
  // Chart data
  readonly chartData = [
    { day: 'MON', value: 320 },
    { day: 'TUE', value: 510 },
    { day: 'WED', value: 420 },
    { day: 'THU', value: 630 },
    { day: 'FRI', value: 470 },
    { day: 'SAT', value: 360 },
    { day: 'SUN', value: 550 },
  ];
 
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadD3();
  }
 
  private async loadD3(): Promise<void> {
    const d3 = await import('d3');
    setTimeout(() => this.drawChart(d3));
    this.resizeObserver = new ResizeObserver(() => this.drawChart(d3));
    this.resizeObserver.observe(this.chartRef.nativeElement.parentElement!);
  }

  private drawChart(d3: typeof import('d3')): void {
    const el = this.chartRef.nativeElement;
    const totalW = el.parentElement!.clientWidth;
    if (totalW === 0) return;
 
    const totalH = 140;
    const m = { top: 8, right: 8, bottom: 24, left: 8 };
    const W = totalW - m.left - m.right;
    const H = totalH - m.top - m.bottom;
 
    d3.select(el).selectAll('*').remove();
 
    const svg = d3.select(el)
      .attr('width', totalW).attr('height', totalH)
      .append('g').attr('transform', `translate(${m.left},${m.top})`);
 
    const x = d3.scaleBand().domain(this.chartData.map(d => d.day)).range([0, W]).padding(0.3);
    const y = d3.scaleLinear().domain([0, d3.max(this.chartData, d => d.value)! * 1.15]).range([H, 0]);
 
    const rx = 4;
    this.chartData.forEach(d => {
      const bx = x(d.day)!, by = y(d.value), bh = H - y(d.value), bw = x.bandwidth();
      // Ghost bar
      svg.append('rect').attr('x', bx).attr('y', 0).attr('width', bw).attr('height', H)
         .attr('fill', 'rgba(255,255,255,0.04)').attr('rx', rx);
      // Value bar (top-rounded)
      svg.append('rect').attr('x', bx).attr('y', by).attr('width', bw).attr('height', bh)
         .attr('fill', '#ff6200').attr('rx', rx);
      if (bh > rx)
        svg.append('rect').attr('x', bx).attr('y', by + rx).attr('width', bw).attr('height', bh - rx)
           .attr('fill', '#ff6200');
    });
 
    svg.append('g').attr('transform', `translate(0,${H})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .style('fill', '#4a5568').style('font-size', '10px');
  }

  statusClass(status: StockStatus): string {
    return {
      'IN STOCK':    'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      'LOW STOCK':   'bg-amber-500/15 text-amber-400 border-amber-500/20',
      'OUT OF STOCK':'bg-red-500/15 text-red-400 border-red-500/20',
    }[status];
  }
 
  stockCountClass(item: InventoryItem): string {
    if (item.status === 'OUT OF STOCK') return 'text-red-400 font-bold';
    if (item.status === 'LOW STOCK')    return 'text-amber-400 font-bold';
    return 'text-white font-semibold';
  }
 
  setCategory(cat: string): void { this.selectedCat.set(cat); }

//   onSearch(event: KeyboardEvent): void {
//   if (event.key === 'Enter' && this.searchQuery().trim()) {
//     this.router.navigate(['/admin/inventory/search'], {
//       queryParams: { q: this.searchQuery() },
//     });
//   }
// }
 
 results = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allItems;
    return this.allItems.filter(i =>
      i.productName.toLowerCase().includes(q)
    )
    });

alertCount = computed(() =>
    this.results().filter(i => i.status === 'LOW STOCK' || i.status === 'OUT OF STOCK').length
  );
 
  ngOnDestroy(): void { this.resizeObserver?.disconnect(); }

}
