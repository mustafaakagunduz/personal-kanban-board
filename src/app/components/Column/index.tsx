// /src/app/components/Column/index.tsx
import React, { useMemo } from 'react';
import { ColumnData, Task } from '../../types';
import TaskCardComponent from '../TaskCard';
import { Typography } from "@/components/ui/typography";
import { kanbanColumnClass, columnHeaderClass } from "../KanbanBoard3/styles";
import { getDaysLeft } from '../../utils/dateUtils';
import { useLanguage } from '../../../context/LanguageContext';

interface ColumnProps {
    columnId: string;
    column: ColumnData;
    onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => void;
    onEditClick: (task: Task, columnId: string) => void;
    onDeleteClick: (task: Task, columnId: string) => void;
    onTaskClick: (task: Task, columnId: string) => void;
    onAddStepClick?: (task: Task) => void;
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
                                           onAddStepClick,
                                           today
                                       }) => {
    // Dil hook'unu ekleyin
    const { t } = useLanguage();

    // Sort tasks based on deadline for the inProgress column, and on
    // completion date (newest first) for the done column
    const sortedItems = useMemo(() => {
        if (columnId === 'inProgress' && today) {
            try {
                return [...column.items].sort((taskA, taskB) => {
                    // Tasks without a due date should be at the bottom
                    if (!taskA.dueDate) return 1;
                    if (!taskB.dueDate) return -1;

                    // Calculate days left for each task
                    const daysLeftA = getDaysLeft(taskA.dueDate, today);
                    const daysLeftB = getDaysLeft(taskB.dueDate, today);

                    // Handle null values (invalid dates)
                    if (daysLeftA === null && daysLeftB === null) return 0;
                    if (daysLeftA === null) return 1;
                    if (daysLeftB === null) return -1;

                    // Sort by days left (ascending order - least days at top)
                    return daysLeftA - daysLeftB;
                });
            } catch (error) {
                console.error('Error sorting tasks:', error);
                return column.items; // Return unsorted if there's an error
            }
        }

        if (columnId === 'done') {
            try {
                return [...column.items].sort((taskA, taskB) => {
                    // Tasks without a completion date should be at the bottom
                    if (!taskA.completedAt && !taskB.completedAt) return 0;
                    if (!taskA.completedAt) return 1;
                    if (!taskB.completedAt) return -1;

                    // Sort by completion date (descending order - newest at top)
                    return new Date(taskB.completedAt).getTime() - new Date(taskA.completedAt).getTime();
                });
            } catch (error) {
                console.error('Error sorting tasks:', error);
                return column.items;
            }
        }

        return column.items;
    }, [column.items, columnId, today]);

    return (
        <div
            className={kanbanColumnClass}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, columnId)}
        >
            <Typography variant="h4" className={`${columnHeaderClass} text-center`}>
                {column.title}
            </Typography>
            {sortedItems.map(task => (
                <TaskCardComponent
                    key={task.id}
                    task={task}
                    columnId={columnId}
                    onDragStart={onDragStart}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    onClick={onTaskClick}
                    onAddStepClick={onAddStepClick}
                    today={today}
                />
            ))}
        </div>
    );
};

export default Column;