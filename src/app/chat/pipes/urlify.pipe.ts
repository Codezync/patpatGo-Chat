import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'urlify'
})

export class UrlifyPipe implements PipeTransform {

  transform(text: any): any {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url: string) {
      return '<a href="' + url + '">' + url + '</a>';
    });
  }
}
