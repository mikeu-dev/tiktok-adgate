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
  const [storedLanguage, setStoredLanguage] = useLocalStorage<Language>('language', 'id');
  const [language, setLanguage] = useState<Language>('id'); // Default to 'id' on server and initial client render

  useEffect(() => {
    setLanguage(storedLanguage);
  }, [storedLanguage]);
  
  const handleSetLanguage = (lang: Language) => {
    setStoredLanguage(lang);
    setLanguage(lang);
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    const translationSet = translations[language] || translations.id;
    let translation = translationSet[key as keyof typeof idTranslations] || idTranslations[key as keyof typeof idTranslations] || key;

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
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
