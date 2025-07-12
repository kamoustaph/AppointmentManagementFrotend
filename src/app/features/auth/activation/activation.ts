import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth } from '../../../core/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],  
  templateUrl: './activation.html',
  styleUrl: './activation.css'
})
export class Activation {
  private fb = inject(FormBuilder);

  activationForm = this.fb.group({
    activationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  isLoading = false;

  constructor(
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.activationForm.patchValue({ activationCode: params['code'] });
      }
    });
  }

  onSubmit() {
    if (this.activationForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Code invalide',
        text: 'Veuillez entrer un code d\'activation valide (6 caractères exactement).',
      });
      return;
    }

    this.isLoading = true;
    const activationCode = this.activationForm.value.activationCode!;

    this.authService.activateAccount(activationCode).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Activation réussie!',
          text: 'Votre compte a été activé avec succès. Vous allez être redirigé vers la page de connexion.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          willClose: () => {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur d\'activation',
          text: error.error?.message || "Le code d'activation est invalide ou a expiré. Veuillez réessayer.",
        });
      }
    });
  }
}