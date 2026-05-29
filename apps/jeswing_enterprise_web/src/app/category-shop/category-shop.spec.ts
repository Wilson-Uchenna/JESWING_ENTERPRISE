import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryShop } from './category-shop';

describe('CategoryShop', () => {
  let component: CategoryShop;
  let fixture: ComponentFixture<CategoryShop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryShop],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryShop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
