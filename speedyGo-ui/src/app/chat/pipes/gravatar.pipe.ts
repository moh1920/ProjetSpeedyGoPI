import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'gravatar'
})
export class GravatarPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
