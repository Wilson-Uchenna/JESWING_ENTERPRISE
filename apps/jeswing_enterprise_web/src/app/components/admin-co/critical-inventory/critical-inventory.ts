import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
type Severity = 'danger' | 'warn' | 'ok';
 
interface InventoryItem {
  name: string;
  sku: string;
  qty: number;
  severity: Severity;
  statusLabel: string;
  action?: string;
}

@Component({
  selector: 'app-critical-inventory',
  imports: [CommonModule],
  templateUrl: './critical-inventory.html',
  styleUrl: './critical-inventory.scss',
})
export class CriticalInventory {
  items: InventoryItem[] = [
    { name: 'Titanium Power Drill V2',  sku: 'ID: SKU-TOOL-08', qty: 12, severity: 'danger', statusLabel: 'Critical',  action: 'reorder' },
    { name: 'Graphite Industrial Case', sku: 'ID: SKU-CASE-11', qty: 25, severity: 'warn',   statusLabel: 'Low Stock', action: 'restock' },
    { name: 'Precision Sensor Kit',     sku: 'ID: SKU-SENS-04', qty: 52, severity: 'ok',     statusLabel: 'Stable' },
  ];
 
  severityClasses(severity: Severity) {
    return {
      danger: {
        border: 'border-red-500',
        bg: 'bg-red-500/5',
        qty: 'text-red-400',
        statusText: 'text-red-400/80',
      },
      warn: {
        border: 'border-amber-500',
        bg: 'bg-amber-500/5',
        qty: 'text-amber-400',
        statusText: 'text-amber-400/80',
      },
      ok: {
        border: 'border-emerald-500',
        bg: 'bg-emerald-500/5',
        qty: 'text-emerald-400',
        statusText: 'text-emerald-400/80',
      },
    }[severity];
  }
}
