"use client"
import dynamic from 'next/dynamic';

const KanbanBoard3 = dynamic(() => import("./components/KanbanBoard3/index"), {
  ssr: false,
  loading: () => <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 to-blue-800 flex items-center justify-center"><p className="text-white text-xl">Yükleniyor...</p></div>
});

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <KanbanBoard3 />
    </div>
  );
}