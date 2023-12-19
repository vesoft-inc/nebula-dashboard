import { createContext } from 'react';

import { INTL_LOCALE_SELECT } from '../config';

export const LanguageContext = createContext({
  currentLocale: INTL_LOCALE_SELECT.EN_US.NAME,
  toggleLanguage: (locale: string) => {
    console.log('Select locale:', locale);
  },
});
