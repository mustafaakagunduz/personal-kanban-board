// /src/types/index.ts

export interface Assignee {
    id: string;
    name: string;
    email: string;
}

export interface TaskStep {
    id: string;
    text: string;
    createdAt: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    duration?: string | null;
    notes?: string | null;
    dueDate?: string | null;
    color?: string | null;
    progress?: number | null;
    assigneeId?: string | null;
    assignee?: Assignee | null;
    steps?: TaskStep[];
}

export interface SelectedTask extends Task {
    columnId: string;
    columnStatus?: string;
}

export interface ColumnData {
    title: string;
    items: Task[];
}

export interface Columns {
    [key: string]: ColumnData;
}

export interface ProgressDetails {
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

export interface NewTaskForm {
    title: string;
    description: string;
    color?: string;
    assigneeId?: string;
}

export interface Board {
    id: string;
    name: string;
    order: number;
    teamId?: string | null;
    createdAt: string;
}

export interface CompanyColors {
    id: string;
    bgColorStart: string;
    bgColorEnd: string;
}

export interface TeamMemberInfo {
    id: string;
    name: string;
    email: string;
}
