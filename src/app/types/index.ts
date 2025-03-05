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

export interface SelectedTask extends Task {
    columnId: string;
    columnStatus?: string;
}

export interface NewTaskForm {
    title: string;
    description: string;
    column: string;
    points: number | '';
}