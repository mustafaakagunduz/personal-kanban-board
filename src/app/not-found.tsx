// /src/app/not-found.tsx
"use client"
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">{t('notFound.title')}</h1>
            <p className="mt-4">{t('notFound.description')}</p>
            <a href="/" className="mt-6 text-blue-500 hover:underline">
                {t('notFound.backToHome')}
            </a>
        </div>
    );
}