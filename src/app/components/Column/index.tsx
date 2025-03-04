import React from 'react';
import { ColumnData, Task } from '../../types';
import TaskCardComponent from '../TaskCard';
import { Typography } from "@/components/ui/typography";
import { kanbanColumnClass, columnHeaderClass } from "../KanbanBoard3/styles";

interface ColumnProps {
    columnId: string;
    column: ColumnData;
    onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => void;
    onEditClick: (task: Task, columnId: string) => void;
    onDeleteClick: (task: Task, columnId: string) => void;
    onTaskClick: (task: Task, columnId: string) => void;
    today: Date | null;
}

const Column: React.FC<ColumnProps> = ({
                                           columnId,
                                           column,
                                           onDrop,
                                           onDragStart,
                                           onEditClick,
                                           onDeleteClick,
                                           onTaskClick,
                                           today
                                       }) => {
    return (
        <div
            className={kanbanColumnClass}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, columnId)}
        >
            <Typography variant="h4" className={columnHeaderClass}>
                {column.title}
            </Typography>
            {column.items.map(task => (
                <TaskCardComponent
                    key={task.id}
                    task={task}
                    columnId={columnId}
                    onDragStart={onDragStart}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    onClick={onTaskClick}
                    today={today}
                />
            ))}
        </div>
    );
};

export default Column;