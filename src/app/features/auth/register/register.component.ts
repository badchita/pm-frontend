import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    NzCardComponent,
    NzColDirective,
    NzInputModule,
    NzButtonComponent,
    ReactiveFormsModule,
    NzFormModule,
    NzTypographyComponent,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  private fb = inject(FormBuilder);

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
}
