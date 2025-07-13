import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { Breadcrumb } from '../../../core/services/breadcrumb';
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],  
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('hoverAnimation', [
      transition('normal => hover', [
        animate('200ms ease-in', style({ transform: 'translateY(-5px)' }))
      ]),
      transition('hover => normal', [
        animate('200ms ease-out', style({ transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class Dashboard implements OnInit {
  cards = [
    { 
      title: 'Appointments', 
      count: 124, 
      icon: 'bi bi-calendar-check',
      color: '#3f51b5'
    },
    { 
      title: 'Doctors', 
      count: 24, 
      icon: 'bi bi-person-badge',
      color: '#3f51b5'
    },
    { 
      title: 'Patients', 
      count: 356, 
      icon: 'bi bi-people',
      color: '#3f51b5'
    },
    { 
      title: 'Specialties', 
      count: 12, 
      icon: 'bi bi-heart-pulse',
      color: '#3f51b5'
    }
  ];

  hoverState: string[] = ['normal', 'normal', 'normal', 'normal'];

  constructor(private breadcrumbService: Breadcrumb) {}

 ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Dashboard', url: '/dashboard' }
    ]);
  }

  setHoverState(index: number, state: string) {
    this.hoverState[index] = state;
  }
}