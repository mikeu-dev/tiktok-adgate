'use client';

import { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import idTranslations from '@/locales/id.json';
import enTranslations from '@/locales/en.json';

type Language = 'id' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  id: idTranslations,
  en: enTranslations,
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'id');

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    let translation = translations[language][key as keyof typeof idTranslations] || translations.id[key as keyof typeof idTranslations];

    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }

    return translation;
  }, [language]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
