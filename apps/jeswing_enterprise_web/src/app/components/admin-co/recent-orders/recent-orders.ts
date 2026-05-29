import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Order {
  id: string;
  customer: string;
  initials: string;
  avatarClass: string;
  status: 'Delivered' | 'Processing' | 'Shipped';
  total: string;
}

@Component({
  selector: 'app-recent-orders',
  imports: [CommonModule],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.scss',
})
export class RecentOrders {
   orders: Order[] = [
    { id: '#KS-88293', customer: 'John Deeson',  initials: 'JD', avatarClass: 'bg-blue-600',   status: 'Delivered',  total: '$1,240.50' },
    { id: '#KS-88294', customer: 'Sarah Miller', initials: 'SM', avatarClass: 'bg-violet-600', status: 'Processing', total: '$492.80'   },
    { id: '#KS-88295', customer: 'Robert King',  initials: 'RK', avatarClass: 'bg-teal-600',   status: 'Shipped',    total: '$3,305.30' },
  ];
 
  statusDot(status: Order['status']): string {
    return { Delivered: 'bg-emerald-400', Processing: 'bg-amber-400', Shipped: 'bg-blue-400' }[status];
  }
 
  statusText(status: Order['status']): string {
    return { Delivered: 'text-emerald-400', Processing: 'text-amber-400', Shipped: 'text-blue-400' }[status];
  }
}
