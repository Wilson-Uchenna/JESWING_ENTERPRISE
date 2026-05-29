import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginLayout } from './login-layout';

describe('AuthLayout', () => {
  let component: LoginLayout;
  let fixture: ComponentFixture<LoginLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
