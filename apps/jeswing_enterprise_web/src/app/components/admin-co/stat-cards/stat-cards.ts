import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface StatCard {
  label: string;
  value: string;
  sub: string;
  badge: string;
  badgeClass: string;
}

@Component({
  selector: 'app-stat-cards',
  imports: [CommonModule],
  templateUrl: './stat-cards.html',
  styleUrl: './stat-cards.scss',
})
export class StatCards {
  cards: StatCard[] = [
    {
      label: 'Total Sales',
      value: '$124,592.00',
      sub: 'vs $118,204 last month',
      badge: '+8.2%',
      badgeClass: 'bg-emerald-500/15 text-emerald-400',
    },
    {
      label: 'Active Orders',
      value: '1,284',
      sub: 'Currently in processing',
      badge: 'Shipping',
      badgeClass: 'bg-blue-500/15 text-blue-400',
    },
    {
      label: 'New Customers',
      value: '156',
      sub: 'Acquisition growth high',
      badge: '+17.4%',
      badgeClass: 'bg-[#ff6200]/15 text-[#ff7a1f]',
    },
    {
      label: 'Low Stock Alerts',
      value: '18',
      sub: 'Requires immediate restock',
      badge: 'Critical',
      badgeClass: 'bg-red-500/15 text-red-400',
    },
  ];
}

