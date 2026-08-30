// /src/app/components/TaskCard/TaskCard.tsx
import React from 'react';
import { Task } from '../../types';
import { getDaysLeft, formatDate, safeParseDate } from '../../utils/dateUtils';
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { taskCardClass } from "../KanbanBoard3/styles";
import { useLanguage } from '../../../context/LanguageContext';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskCardProps {
    task: Task;
    columnId: string;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => void;
    onEditClick: (task: Task, columnId: string) => void;
    onDeleteClick: (task: Task, columnId: string) => void;
    onClick: (task: Task, columnId: string) => void;
    onAddStepClick?: (task: Task) => void;
    today: Date | null;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({
                                                        task,
                                                        columnId,
                                                        onDragStart,
                                                        onEditClick,
                                                        onDeleteClick,
                                                        onClick,
                                                        onAddStepClick,
                                                        today
                                                    }) => {
    // Dil hook'unu kullan
    const { t } = useLanguage();

    // Parse date safely and get formatted date
    const { formattedDate, dueDate } = React.useMemo(() => {
        if (!task.dueDate) return { formattedDate: '', dueDate: null };

        const parsedDate = safeParseDate(task.dueDate);
        return {
            dueDate: parsedDate,
            formattedDate: parsedDate ? formatDate(parsedDate) : t('taskCard.invalidDate')
        };
    }, [task.dueDate, t]);

    // Tamamlanma tarihini biçimlendir
    const formattedCompletedDate = React.useMemo(() => {
        if (!task.completedAt) return '';
        const parsedDate = safeParseDate(task.completedAt);
        return parsedDate ? formatDate(parsedDate) : '';
    }, [task.completedAt]);

    // Calculate days left safely
    const daysLeft = React.useMemo(() => {
        if (!task.dueDate || !today) return null;
        return getDaysLeft(task.dueDate, today);
    }, [task.dueDate, today]);

    // İlerleme adımlarını eskiden yeniye sırala
    const sortedSteps = React.useMemo(() => {
        if (!task.steps || task.steps.length === 0) return [];
        return [...task.steps].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [task.steps]);

    const handleAddStepClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddStepClick?.(task);
    };

    // İsim soyisimden baş harfleri çıkar (örn. "Mustafa Akagündüz" -> "MA")
    const getInitials = (name: string): string => {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return '';
        const first = parts[0][0] || '';
        const last = parts.length > 1 ? parts[parts.length - 1][0] || '' : '';
        return (first + last).toLocaleUpperCase('tr-TR');
    };

    // Conditional render function
    const renderContent = () => {
        // Todo column - minimal info
        if (columnId === 'todo') {
            return (
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <Typography variant="h5" className="font-bold text-white mb-2">{task.title}</Typography>
                        {task.description && (
                            <Typography className="text-white/90 text-sm mb-2">{task.description}</Typography>
                        )}
                    </div>
                </div>
            );
        }

        else if (columnId === 'inProgress') {
            return (
                <div className="flex flex-col h-full justify-between pb-1">
                    <div className="pr-9">
                        <Typography variant="h5" className="font-bold text-white mb-2">{task.title}</Typography>


                    </div>

                    <div className="mt-auto">
                        {/* Due date and days left */}
                        {task.dueDate && (
                            <div className="flex items-center mb-2">
                        <span className="flex items-center text-white/90 text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formattedDate}
                        </span>

                                {daysLeft !== null && (
                                    <span className={cn(
                                        "ml-2 text-xs px-1 py-0.5 rounded-sm font-medium",
                                        daysLeft < 0 ? "bg-red-900/50" :
                                            daysLeft <= 2 ? "bg-yellow-900/50" : "bg-green-900/50"
                                    )}>
                                {daysLeft < 0
                                    ? t('taskCard.daysOverdue').replace('{days}', Math.abs(daysLeft).toString())
                                    : t('taskCard.daysLeft').replace('{days}', daysLeft.toString())
                                }
                            </span>
                                )}
                            </div>
                        )}

                        {/* Progress steps - only for inProgress column */}
                        {sortedSteps.length > 0 && (
                            <ul className="mt-1 space-y-1">
                                {sortedSteps.map(step => (
                                    <li key={step.id} className="text-white/90 text-xs flex items-center">
                                        <span className="mr-1.5 h-1 w-1 rounded-full bg-white/60 flex-shrink-0" />
                                        <span>{step.text}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                </div>
            );
        }

        // Done column - minimal view
        else if (columnId === 'done') {
            return (
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <Typography variant="h5" className="font-bold text-white mb-2 line-through opacity-90">{task.title}</Typography>
                        {task.description && (
                            <Typography className="text-white/80 text-sm mb-2">{task.description}</Typography>
                        )}
                    </div>

                    <div className="mt-auto">
                        {/* Completion date */}
                        {formattedCompletedDate && (
                            <div className="flex items-center text-white/80 text-xs mb-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                {t('taskCard.completedOn').replace('{date}', formattedCompletedDate)}
                            </div>
                        )}

                    </div>
                </div>
            );
        }

        // Default view (for all other cases)
        return (
            <div className="flex flex-col h-full justify-between">
                <div>
                    <Typography variant="h5" className="font-bold text-white mb-2">{task.title}</Typography>
                </div>

                {/* Date, days left and assignee */}
                <div className="flex items-center justify-between text-white text-xs mt-auto">
                    {task.dueDate && (
                        <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {daysLeft !== null ?
                                <span className={daysLeft < 0 ? "text-red-400" : ""}>
                                    {daysLeft < 0
                                        ? t('taskCard.daysOverdue').replace('{days}', Math.abs(daysLeft).toString())
                                        : t('taskCard.daysLeft').replace('{days}', daysLeft.toString())
                                    }
                                </span> :
                                formattedDate
                            }
                        </span>
                    )}
                </div>
            </div>
        );
    };

    // Improved function for delete button - simplified logic
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDeleteClick(task, columnId);
    };

    // Improved function for edit button
    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEditClick(task, columnId);
    };

    // Improved function for card click
    const handleCardClick = (e: React.MouseEvent) => {
        // Only trigger card click if the event wasn't handled by buttons
        if (!(e.target instanceof Element &&
            (e.target.closest('button') ||
                e.target.tagName === 'BUTTON' ||
                e.target.parentElement?.tagName === 'BUTTON'))) {
            onClick(task, columnId);
        }
    };

    // Default color (indigo-900)
    const defaultColor = "#4c1d95";

    return (
        <div
            className={cn(taskCardClass, "border-0 overflow-hidden")}
            draggable
            onDragStart={(e) => onDragStart(e, task.id, columnId)}
            style={{ backgroundColor: task.color ? `${task.color}` : `${defaultColor}` }}
        >
            <div
                onClick={handleCardClick}
                className="cursor-pointer pt-3 px-3 pb-8 relative h-full min-h-[80px] flex flex-col"
            >
                {/* Assignee avatar - positioned absolutely at top-right */}
                {task.assignee && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-semibold z-10">
                                {getInitials(task.assignee.name)}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>{task.assignee.name}</TooltipContent>
                    </Tooltip>
                )}

                {/* Action buttons - positioned absolutely at bottom-right */}
                <div className="absolute right-2 bottom-2 flex items-center space-x-1 z-10">
                    {/* Add progress step button - only for inProgress column */}
                    {columnId === 'inProgress' && onAddStepClick && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white h-6 w-6 p-0 rounded-full bg-white/10 hover:bg-white/20"
                                    onClick={handleAddStepClick}
                                    aria-label={t('taskCard.addProgressStep')}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t('taskCard.addProgressStep')}</TooltipContent>
                        </Tooltip>
                    )}

                    {/* Edit button - hide in "done" column */}
                    {columnId !== 'done' && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white h-6 w-6 p-0 hover:bg-white/10"
                                    onClick={handleEditClick}
                                    aria-label={t('dialog.editTask')}
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t('dialog.editTask')}</TooltipContent>
                        </Tooltip>
                    )}

                    {/* Delete button with improved styling and event handling */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white h-6 w-6 p-0 hover:bg-white/10"
                                onClick={handleDeleteClick}
                                aria-label={t('button.delete')}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('button.delete')}</TooltipContent>
                    </Tooltip>
                </div>

                {/* Task content */}
                {renderContent()}
            </div>
        </div>
    );
};

export default TaskCardComponent;