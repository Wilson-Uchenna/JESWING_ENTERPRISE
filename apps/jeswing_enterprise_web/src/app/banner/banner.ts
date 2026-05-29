import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-banner',
  imports: [RouterLink, RouterModule],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
  
})
export class Banner {}
