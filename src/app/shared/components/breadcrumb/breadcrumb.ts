import { Component } from '@angular/core';
import { Breadcrumb } from '../../../core/services/breadcrumb';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css'
})
export class BreadcrumbComponent {
breadcrumbs: {label: string, url: string, icon?: string}[] = [];

  constructor(private breadcrumbService: Breadcrumb) {
    this.breadcrumbService.getBreadcrumbs().subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
    });
}
}