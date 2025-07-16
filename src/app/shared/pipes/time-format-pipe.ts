import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

 transform(value: string): string {
    if (!value) return '';
    
    if (value.includes('h') && value.includes('min')) {
      return value;
    }
        if (value.includes(':')) {
      const [hours, minutes] = value.split(':');
      return `${hours}h${minutes}min`;
    }
        return value;
  }

}
