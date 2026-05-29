import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreDesc } from './store-desc';

describe('StoreDesc', () => {
  let component: StoreDesc;
  let fixture: ComponentFixture<StoreDesc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreDesc],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreDesc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
