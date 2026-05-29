import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriticalInventory } from './critical-inventory';

describe('CriticalInventory', () => {
  let component: CriticalInventory;
  let fixture: ComponentFixture<CriticalInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriticalInventory],
    }).compileComponents();

    fixture = TestBed.createComponent(CriticalInventory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
