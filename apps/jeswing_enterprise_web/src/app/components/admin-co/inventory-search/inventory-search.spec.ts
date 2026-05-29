import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventorySearch } from './inventory-search';

describe('InventorySearch', () => {
  let component: InventorySearch;
  let fixture: ComponentFixture<InventorySearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySearch],
    }).compileComponents();

    fixture = TestBed.createComponent(InventorySearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
