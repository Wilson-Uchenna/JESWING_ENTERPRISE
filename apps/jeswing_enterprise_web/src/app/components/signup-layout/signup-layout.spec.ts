import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupLayout } from './signup-layout';

describe('SignupLayout', () => {
  let component: SignupLayout;
  let fixture: ComponentFixture<SignupLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
