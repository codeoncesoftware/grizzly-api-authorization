import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'localizedDate',
    pure: false
})
export class LocalizedDatePipe implements PipeTransform {
    constructor() { }

    transform(value: any, pattern: string = 'longDate'): any {
        let datePipe: DatePipe;
        if (localStorage.getItem('grizzly-lang') === 'fr') {
            datePipe = new DatePipe('fr-FR');
        } else {
            datePipe = new DatePipe('en-US');
        }

        return datePipe.transform(value, pattern);
    }
}
