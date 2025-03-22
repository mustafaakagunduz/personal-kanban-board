// /src/types/index.ts
export interface Task {
    id: string;
    title: string;
    description: string;
    points?: number;
    duration?: string;
    reward?: string;
    notes?: string;
    dueDate?: string;
    color?: string;
}

export interface SelectedTask extends Task {
    columnId: string;
}

export interface Reward {
    id: string;
    title: string;
    points: number;
    color?: string; // Renk özelliğini ekledik
}

export interface ColumnData {
    title: string;
    items: Task[];
}

export interface Columns {
    [key: string]: ColumnData;
}

export interface ProgressDetails {
    duration: string;
    reward: string;
    notes: string;
    dueDate: string;
}

interface TodoItem {
    id: string;           // Benzersiz ID
    text: string;         // Görev metni
    completed: boolean;   // Tamamlanma durumu
    createdAt: string;    // Oluşturulma tarihi (ISO string)
    priority?: 'low' | 'medium' | 'high';  // Öncelik seviyesi
    timeEstimate?: number;  // Tahmini süre (dakika)
}

export interface SelectedTask extends Task {
    columnId: string;
    columnStatus?: string;
}

export interface NewTaskForm {
    title: string;
    description: string;
    column: string;
    points: number | '';
    color?: string; // Yeni task oluştururken renk seçimi için eklendi
}

export interface Board {
    id: string;
    name: string;
    createdAt: string; // ISO date string
}

export interface KanbanState {
    activeBoard: string; // The ID of the active board
    boards: Board[]; // List of all boards
    boardsData: {
        [boardId: string]: {
            columns: Columns;
            rewards: Reward[];
            totalPoints: number;
            bgColorStart: string;
            bgColorEnd: string;
        }
    };
}