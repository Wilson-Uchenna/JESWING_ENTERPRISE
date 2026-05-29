import { Component, inject } from '@angular/core';
import { CategoryStore } from '../../store/category.store';
import { Sidebar } from '../admin-co/sidebar/sidebar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [RouterModule, Sidebar],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
  standalone: true,
})
export class Admin {
  protected store = inject(CategoryStore);
}
