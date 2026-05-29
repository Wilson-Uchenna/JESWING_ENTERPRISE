import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginHeader } from '../login-header/login-header';

@Component({
  selector: 'app-login-layout',
  imports: [RouterOutlet, LoginHeader],
  standalone: true,
  templateUrl: './login-layout.html',
  styleUrl: './login-layout.scss',
})
export class LoginLayout {}
