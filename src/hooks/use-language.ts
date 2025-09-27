'use client';
import { useContext } from 'react';
import { LanguageContext } from '@/components/providers/language-provider';

export type Language = 'id' | 'en';

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
