import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerSignUpModel, Register } from '../models/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm!: FormGroup;
  showPassword = false;
  errorMessage = '';
  loading = false;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      cui: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toLogin() {
    this.router.navigate(['/session/login']);
  }

  register() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
      return;
    }

    const password = this.registerForm.value.password;
    const passwordConfirm = this.registerForm.value.passwordConfirm;

    if (password !== passwordConfirm) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    const register: Register = {
      cui: this.registerForm.value.cui,
      email: this.registerForm.value.email,
      password: password,
    };

    this.authService.signUp(register).subscribe({
      next: (resp) => {
        this.loading = false;
        // Guardar temporalmente el email para confirmar después
        localStorage.setItem('current_user', register.email);
        this.router.navigate(['/session/confirmation']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Ocurrió un error al registrarse, intente nuevamente.';
      }
    });
  }
}