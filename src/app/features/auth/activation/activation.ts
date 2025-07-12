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
    RouterLink
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
  message = '';
  isError = false;

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
    if (this.activationForm.invalid) return;

    this.isLoading = true;
    this.message = '';
    this.isError = false;

    const activationCode = this.activationForm.value.activationCode!;

    this.authService.activateAccount(activationCode).subscribe({
      next: () => {
        this.message = 'Compte activé avec succès ! Redirection...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        this.message = error.message || "Erreur lors de l'activation. Veuillez réessayer.";
      }
    });
  }
}
