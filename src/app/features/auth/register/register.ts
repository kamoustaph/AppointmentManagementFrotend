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
  styleUrl: './register.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  roles: Role[] = [];
  hidePassword = true;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.authService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        if (this.roles.length > 0) {
          this.registerForm.patchValue({ role: this.roles[0] });
        }
      },
      error: (error) => {
        console.error('Failed to load roles', error);
        this.errorMessage = 'Impossible de charger les rôles. Veuillez réessayer.';
      }
    });
  }

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: [null as Role | null, Validators.required]
  });

  onSubmit() {
    this.errorMessage = null;
    
    if (this.registerForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    const selectedRole = this.registerForm.value.role;
    if (!selectedRole) {
      this.errorMessage = 'Veuillez sélectionner un rôle.';
      return;
    }

    const formData: RegistrationData = {
      username: this.registerForm.value.username!,
      name: this.registerForm.value.name!,
      phone: this.registerForm.value.phone!,
      password: this.registerForm.value.password!,
      roleName: selectedRole.name 
    };

    this.authService.register(formData).subscribe({
      next: () => {
        this.router.navigate(['/activation']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Registration failed', error);
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription.';
        
        if (error.status === 400) {
          this.errorMessage = 'Données invalides. Vérifiez les informations saisies.';
        } else if (error.status === 409) {
          this.errorMessage = 'Cet email est déjà utilisé.';
        }
      }
    });
  }

  getRoleDisplay(role: Role): string {
    switch(role.name) {
      case ERole.ADMIN: return 'Administrateur';
      case ERole.MEDECIN: return 'Médecin';
      case ERole.DOCTEUR: return 'Docteur';
      case ERole.SECRETAIRE: return 'Secrétaire';
      default: return role.name;
    }
  }
}
