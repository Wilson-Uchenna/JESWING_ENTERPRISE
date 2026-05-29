import { Component } from '@angular/core';
import { Banner } from '../../banner/banner';
import { CategoryShop } from '../../category-shop/category-shop';

@Component({
  selector: 'app-home',
  imports: [Banner, CategoryShop],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
