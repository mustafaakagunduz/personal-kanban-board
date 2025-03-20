// /src/context/LanguageContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {useLocalStorage} from "@/src/app/hooks/useLocalStorage";

// Desteklenen diller
export type Language = 'tr' | 'en';

// Context için tip tanımı
type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

// Varsayılan context değerleri
const defaultContext: LanguageContextType = {
    language: 'tr',
    setLanguage: () => {},
    t: (key: string) => key,
};

// Context oluşturma
const LanguageContext = createContext<LanguageContextType>(defaultContext);

// Custom hook - dil context'ine kolay erişim için
export const useLanguage = () => useContext(LanguageContext);

// Props tipi
interface LanguageProviderProps {
    children: ReactNode;
}

// Çeviri dosyalarını tip güvenlikli şekilde tanımlama
type Translations = {
    [key: string]: string;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    // LocalStorage'dan dil tercihini alma
    const [language, setLanguage] = useLocalStorage<Language>('language', 'tr');
    const [translations, setTranslations] = useState<Translations>({});

    // Dil değiştiğinde çeviri dosyasını yükle
    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const response = await fetch(`/locales/${language}.json`);
                const data = await response.json();
                setTranslations(data);
            } catch (error) {
                console.error('Çeviri dosyası yüklenirken hata oluştu:', error);
                // Hata durumunda boş çeviri kullanmak yerine, varsayılan dile dönülebilir
                setTranslations({});
            }
        };

        loadTranslations();
    }, [language]);

    // Çeviri fonksiyonu
    const t = (key: string): string => {
        return translations[key] || key; // Çeviri yoksa anahtarı döndür
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;