import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

interface SalesData {
  day: string;
  revenue: number;
  expenses: number;
}

@Component({
  selector: 'app-sales-chart',
  imports: [],
  templateUrl: './sales-chart.html',
  styleUrl: './sales-chart.scss',
})
export class SalesChart implements AfterViewInit, OnDestroy {
  @ViewChild('chartRef') chartRef!: ElementRef<SVGElement>;

  private platformId = inject(PLATFORM_ID);
  private resizeObserver?: ResizeObserver;

  readonly data: SalesData[] = [
    { day: 'MON', revenue: 3200, expenses: 1200 },
    { day: 'TUE', revenue: 5100, expenses: 1800 },
    { day: 'WED', revenue: 4200, expenses: 1500 },
    { day: 'THU', revenue: 6300, expenses: 2100 },
    { day: 'FRI', revenue: 4700, expenses: 1600 },
    { day: 'SAT', revenue: 3600, expenses: 1300 },
    { day: 'SUN', revenue: 5500, expenses: 1900 },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadD3AndDraw();
  }

  private async loadD3AndDraw(): Promise<void> {
    // Dynamically import d3 — add to your package.json: "d3": "^7.0.0"
    const d3 = await import('d3');
    setTimeout(() => this.draw(d3));


    this.resizeObserver = new ResizeObserver(() => this.draw(d3));
    this.resizeObserver.observe(this.chartRef.nativeElement.parentElement!);
  }

  private draw(d3: typeof import('d3')): void {
    const svgEl = this.chartRef.nativeElement;
    const containerWidth = svgEl.parentElement!.clientWidth;

    // Guard — element not laid out yet, bail out
    if (containerWidth === 0) return;
    const totalW = containerWidth - 40;
    const totalH = 160;
    const margin = { top: 10, right: 8, bottom: 24, left: 8 };
    const W = totalW - margin.left - margin.right;
    const H = totalH - margin.top - margin.bottom;
    // Clear previous render
    d3.select(svgEl).selectAll('*').remove();

    const svg = d3
      .select(svgEl)
      .attr('width', totalW)
      .attr('height', totalH)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x0 = d3
      .scaleBand()
      .domain(this.data.map((d) => d.day))
      .range([0, W])
      .padding(0.28);

    const x1 = d3
      .scaleBand()
      .domain(['revenue', 'expenses'])
      .range([0, x0.bandwidth()])
      .padding(0.06);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.revenue)! * 1.1])
      .range([H, 0]);

    const rx = 4;
    const colors: Record<string, string> = {
      revenue: '#ff6200',
      expenses: 'rgba(255,255,255,0.12)',
    };

    const grp = svg
      .selectAll<SVGGElement, SalesData>('.grp')
      .data(this.data)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${x0(d.day)},0)`);

    (['revenue', 'expenses'] as const).forEach((key) => {
      grp.each(function (d) {
        const g = d3.select(this);
        const bw = x1.bandwidth();
        const bx = x1(key)!;
        const by = y(d[key]);
        const bh = H - y(d[key]);

        // Top-rounded rect
        g.append('rect')
          .attr('x', bx)
          .attr('y', by)
          .attr('width', bw)
          .attr('height', bh)
          .attr('rx', rx)
          .attr('ry', rx)
          .attr('fill', colors[key]);

        // Square-bottom fill
        if (bh > rx) {
          g.append('rect')
            .attr('x', bx)
            .attr('y', by + rx)
            .attr('width', bw)
            .attr('height', bh - rx)
            .attr('fill', colors[key]);
        }
      });
    });

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${H})`)
      .call(d3.axisBottom(x0).tickSize(0))
      .call((g) => g.select('.domain').remove())
      .selectAll<SVGTextElement, string>('text')
      .style('fill', (d) => (d === 'THU' ? '#ffffff' : '#4a5568'))
      .style('font-weight', (d) => (d === 'THU' ? '700' : '400'))
      .style('font-family', 'Rajdhani, sans-serif')
      .style('font-size', '11px')
      .attr('dy', '1.4em');
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
