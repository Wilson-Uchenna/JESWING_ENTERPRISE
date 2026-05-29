import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCubesStacked, faFilePen, faTableColumns, faChalkboard, faBroom, faBoxArchive, faCalculator, faPumpSoap } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-category-shop',
  imports: [FontAwesomeModule],
  templateUrl: './category-shop.html',
  styleUrl: './category-shop.scss',
})
export class CategoryShop {
  faCubesStacked= faCubesStacked
  faFilePen=faFilePen
  faTableColumns=faTableColumns
  faChalkBoard=faChalkboard
  faBroom=faBroom
  faCalculator=faCalculator
  faBoxArchive=faBoxArchive
  faPumpSoap=faPumpSoap
}
