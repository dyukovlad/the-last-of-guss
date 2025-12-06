/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { translations } from './translations';

export type Language = 'ru' | 'en';

export const useTranslation = (lang: Language = 'ru') => {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || lang;
  });

  useEffect(() => {
    localStorage.setItem('language', currentLang);
  }, [currentLang]);

  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let result: any = translations[currentLang as 'ru' | 'en'];

    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        return keyPath; // Return the key path if translation is not found
      }
    }

    return typeof result === 'string' ? result : keyPath;
  };

  const changeLanguage = (language: Language) => {
    setCurrentLang(language);
  };

  return { t, currentLang, changeLanguage };
};
