import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupHeader } from '../signup-header/signup-header';

@Component({
  selector: 'app-signup-layout',
  imports: [RouterOutlet, SignupHeader],
  templateUrl: './signup-layout.html',
  styleUrl: './signup-layout.scss',
})
export class SignupLayout {}
