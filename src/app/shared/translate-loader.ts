import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    // Map language codes to file names
    const langMap: { [key: string]: string } = {
      en: 'EN',
      ro: 'RO',
    };

    const fileName = langMap[lang.toLowerCase()] || 'EN';
    const url = `./assets/i18n/${fileName}.json`;
    console.log(
      'Loading translation for language:',
      lang,
      'mapped to file:',
      fileName,
      'URL:',
      url,
    );

    return this.http.get(url).pipe(
      tap({
        next: (translations) => {
          console.log(
            'Successfully loaded translations for',
            lang,
            ':',
            translations,
          );
        },
        error: (error) => {
          console.error('Error loading translations for', lang, ':', error);
        },
      }),
    );
  }
}

export function createCustomTranslateLoader(http: HttpClient) {
  return new CustomTranslateLoader(http);
}