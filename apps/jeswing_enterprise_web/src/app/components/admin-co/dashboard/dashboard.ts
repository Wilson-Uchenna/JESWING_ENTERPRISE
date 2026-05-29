import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Topbar } from '../topbar/topbar';

import { CategoryModal } from '../category-modal/category-modal';
import { StatCards } from '../stat-cards/stat-cards';
import { TopCategories } from '../top-categories/top-categories';
import { CriticalInventory } from '../critical-inventory/critical-inventory';
import { SalesChart } from '../sales-chart/sales-chart';
import { RecentOrders } from '../recent-orders/recent-orders';
import { CategoryStore } from '../../../store/category.store';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    Topbar,
    CategoryModal,
    StatCards,
    TopCategories,
    CriticalInventory,
    SalesChart,
    RecentOrders,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected store = inject(CategoryStore);
}
