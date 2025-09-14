import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Confirmation } from '../models/auth';
import { Session } from 'inspector';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit {
  @ViewChild('modal1') modalRef!: ElementRef<HTMLDialogElement>;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
 
  classSuccess = 'text-purple-700 text-lg';
  titleModal = 'Confirmación Exitosa';
  contentModal = 'El administrador deberá aprobar su cuenta para que pueda acceder al sistema.';

  confirmationForm!: FormGroup;
  errorMessage = '';

  ngOnInit(): void {
    const email = localStorage.getItem('current_user') || '';
    if (!email) {
      this.toLogin();
      return;
    }

    this.confirmationForm = this.fb.group({
      email: [email, [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  confirm() {
    this.errorMessage = '';

    if (this.confirmationForm.invalid) {
      this.errorMessage = 'Por favor, ingrese el código de confirmación.';
      return;
    }

    const confirmation: Confirmation = this.confirmationForm.getRawValue();

    this.authService.confirmation(confirmation).subscribe({
      next: (response: Session) => {
        // Mostrar modal
        this.modalRef.nativeElement.showModal();

        this.modalRef.nativeElement.addEventListener('close', () => {
          this.redirect(); 
        }, { once: true });
      },
      error: (error) => this.handleErrorConfirmation(error)
    });
  }

  redirect() {
        this.router.navigate(['/session/login']);
    }

  

  handleErrorConfirmation(error: any) {
    const errorCode: number = error?.error?.status;
    const msg = error?.error?.message || 'Ocurrió un error inesperado';

    switch (errorCode) {
      case 500:
          alert('Error en registro');
        break;
      default:
          alert(error);
        break;
    }
  }

  toLogin() {
    this.router.navigate(['/session/login']);
  }
}