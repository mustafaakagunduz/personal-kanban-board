// /src/components/KanbanBoard3/styles.tsx

// Bugün ve Puanım butonlarına benzer şeffaf stil için güncellenmiş kolon stili
export const kanbanColumnClass = "bg-white/10 backdrop-blur-sm p-4 min-h-[300px] max-h-[calc(100vh-180px)] flex-1 m-2 rounded-lg shadow-md overflow-y-auto transition-all duration-300 hover:bg-white/20";

// Görev kartı stili - şeffaf arka plan ve backdrop-blur ile yenilendi
export const taskCardClass = "mb-2 relative text-white rounded-lg border-0 backdrop-blur-sm transition-transform duration-200 hover:translate-y-[-2px] hover:shadow-lg";

// Kolon başlıkları için stil
export const columnHeaderClass = "mb-4 text-white font-bold transition-colors duration-200";