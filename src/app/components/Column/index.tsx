// /src/app/components/Column/index.tsx
import React, { useMemo } from 'react';
import { ColumnData, Task } from '../../types';
import TaskCardComponent from '../TaskCard';
import TaskSortableWrapper from '../TaskSortableWrapper';
import { Typography } from "@/components/ui/typography";
import { kanbanColumnClass, columnHeaderClass } from "../KanbanBoard3/styles";
import { getDaysLeft } from '../../utils/dateUtils';
import { useLanguage } from '../../../context/LanguageContext';

// DND Kit imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';

interface ColumnProps {
    columnId: string;
    column: ColumnData;
    onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => void;
    onEditClick: (task: Task, columnId: string) => void;
    onDeleteClick: (task: Task, columnId: string) => void;
    onTaskClick: (task: Task, columnId: string) => void;
    today: Date | null;
    onReorderTasks?: (columnId: string, reorderedTasks: Task[]) => void;
}

const Column: React.FC<ColumnProps> = ({
                                           columnId,
                                           column,
                                           onDrop,
                                           onDragStart,
                                           onEditClick,
                                           onDeleteClick,
                                           onTaskClick,
                                           today,
                                           onReorderTasks
                                       }) => {
    // Dil hook'unu kullan
    const { t } = useLanguage();

    // DnD Kit sensors for sortable items
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Sort tasks based on deadline for the inProgress column
    const sortedItems = useMemo(() => {
        if (columnId !== 'inProgress' || !today) {
            return column.items;
        }

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
    }, [column.items, columnId, today]);

    // Handle drag end event for todo column reordering
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id && onReorderTasks) {
            const oldIndex = sortedItems.findIndex(task => task.id === active.id);
            const newIndex = sortedItems.findIndex(task => task.id === over.id);

            const reorderedTasks = arrayMove(sortedItems, oldIndex, newIndex);
            onReorderTasks(columnId, reorderedTasks);
        }
    };

    // Render tasks with or without drag-and-drop sorting
    const renderTasks = () => {
        // Only use DnD Kit sorting for todo column
        if (columnId === 'todo' && onReorderTasks) {
            return (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sortedItems.map(task => task.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {sortedItems.map(task => (
                                <TaskSortableWrapper
                                    key={task.id}
                                    id={task.id}
                                >
                                    <TaskCardComponent
                                        task={task}
                                        columnId={columnId}
                                        onDragStart={onDragStart}
                                        onEditClick={onEditClick}
                                        onDeleteClick={onDeleteClick}
                                        onClick={onTaskClick}
                                        today={today}
                                    />
                                </TaskSortableWrapper>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            );
        }

        // Regular rendering for other columns
        return (
            <div className="space-y-3">
                {sortedItems.map(task => (
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

    return (
        <div
            className={kanbanColumnClass}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, columnId)}
        >
            <Typography variant="h4" className={`${columnHeaderClass} text-center`}>
                {column.title}
            </Typography>
            {renderTasks()}
        </div>
    );
};

export default Column;