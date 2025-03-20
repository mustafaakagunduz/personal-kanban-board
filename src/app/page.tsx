// /src/app/page.tsx
"use client"
import dynamic from 'next/dynamic';
import { useLanguage } from '../context/LanguageContext';

const KanbanBoard3 = dynamic(() => import("./components/KanbanBoard3/index"), {
  ssr: false,
  loading: () => {
    // Dil hook'unu kullanma
    const { t } = useLanguage();
    return (
        <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 to-blue-800 flex items-center justify-center">
          <p className="text-white text-xl">{t('header.loading')}</p>
        </div>
    )
  }
});

export default function Home() {
  return (
      <div className="h-screen w-screen overflow-hidden">
        <KanbanBoard3 />
      </div>
  );
}