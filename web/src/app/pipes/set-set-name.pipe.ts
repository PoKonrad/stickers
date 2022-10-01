import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setSetName',
})
export class SetSetNamePipe implements PipeTransform {
  transform(value: string): string {
    if (value.endsWith('_nsfw')) {
      value = value.slice(0, -5);
    }

    return value.replace('_', ' ');
  }
}
