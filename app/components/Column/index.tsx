// /src/components/Column/index.tsx
import React from 'react';
import { ColumnData, Task } from '../../types';
import TaskCardComponent from '../TaskCard';
import { Typography } from "@/components/ui/typography";
import { kanbanColumnClass } from "../KanbanBoard3/styles";
import { cn } from "@/lib/utils";

interface ColumnProps {
    columnId: string;
    column: ColumnData;
    onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => void;
    onMenuOpen: (e: React.MouseEvent<HTMLElement>, task: Task, columnId: string) => void;
    onTaskClick: (task: Task, columnId: string) => void;
    today: Date | null;
}

const Column: React.FC<ColumnProps> = ({
    columnId,
    column,
    onDrop,
    onDragStart,
    onMenuOpen,
    onTaskClick,
    today
}) => {
    return (
        <div
            className={kanbanColumnClass}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, columnId)}
        >
            <Typography variant="h4" className="mb-4 text-indigo-900 font-bold">
                {column.title}
            </Typography>
            {column.items.map(task => (
                <TaskCardComponent
                    key={task.id}
                    task={task}
                    columnId={columnId}
                    onDragStart={onDragStart}
                    onMenuOpen={onMenuOpen}
                    onClick={onTaskClick}
                    today={today}
                />
            ))}
        </div>
    );
};

export default Column;