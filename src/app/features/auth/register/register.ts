import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ERole } from '../../../core/models/role.model';
import { Role } from '../../../core/models/role.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import { Auth } from '../../../core/services/auth';

export interface RegistrationData {
  username: string;
  name: string;
  phone: string;
  password: string;
  roleName: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '600ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  roles: Role[] = [];
  hidePassword = true;
  errorMessage: string | null = null;

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: [null as Role | null, Validators.required],
  });

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.authService.getRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
        if (this.roles.length > 0) {
          this.registerForm.patchValue({ role: this.roles[0] });
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to load roles', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les rôles. Veuillez réessayer.',
        });
      },
    });
  }

  onSubmit() {
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulaire invalide',
        text: 'Veuillez remplir tous les champs correctement.',
      });
      return;
    }

    const selectedRole = this.registerForm.value.role;
    if (!selectedRole) {
      Swal.fire({
        icon: 'error',
        title: 'Rôle manquant',
        text: 'Veuillez sélectionner un rôle.',
      });
      return;
    }

    const formData: RegistrationData = {
      username: this.registerForm.value.username || '',
      name: this.registerForm.value.name || '',
      phone: this.registerForm.value.phone || '',
      password: this.registerForm.value.password || '',
      roleName: selectedRole.name,
    };

    this.authService.register(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie!',
          text: 'Votre compte a été créé avec succès. Vous allez être redirigé vers la page d\'activation.',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
          willClose: () => {
            this.router.navigate(['/activation']);
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Registration failed', error);
        
        let errorMessage = "Une erreur est survenue lors de l'inscription.";
        if (error.status === 400) {
          errorMessage = 'Données invalides. Vérifiez les informations saisies.';
        } else if (error.status === 409) {
          errorMessage = 'Cet email est déjà utilisé.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Erreur d\'inscription',
          text: errorMessage,
        });
      },
    });
  }

  getRoleDisplay(role: Role): string {
    switch (role.name) {
      case ERole.ADMIN:
        return 'Administrateur';
      case ERole.MEDECIN:
        return 'Médecin';
      case ERole.DOCTEUR:
        return 'Docteur';
      case ERole.SECRETAIRE:
        return 'Secrétaire';
      default:
        return role.name;
    }
  }
}