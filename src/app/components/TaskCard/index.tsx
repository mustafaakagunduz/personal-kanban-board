import React from 'react';
import { Task } from '../../types';
import { getDaysLeft, formatDate, safeParseDate } from '../../utils/dateUtils';
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Gift, FileText } from 'lucide-react';
import { cn } from "@/lib/utils";
import { taskCardClass } from "../KanbanBoard3/styles";

interface TaskCardProps {
    task: Task;
    columnId: string;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => void;
    onEditClick: (task: Task, columnId: string) => void;
    onDeleteClick: (task: Task, columnId: string) => void;
    onClick: (task: Task, columnId: string) => void;
    today: Date | null;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({
                                                        task,
                                                        columnId,
                                                        onDragStart,
                                                        onEditClick,
                                                        onDeleteClick,
                                                        onClick,
                                                        today
                                                    }) => {
    // Parse date safely and get formatted date
    const { formattedDate, dueDate } = React.useMemo(() => {
        if (!task.dueDate) return { formattedDate: '', dueDate: null };

        const parsedDate = safeParseDate(task.dueDate);
        return {
            dueDate: parsedDate,
            formattedDate: parsedDate ? formatDate(parsedDate) : 'Geçersiz tarih'
        };
    }, [task.dueDate]);

    // Calculate days left safely
    const daysLeft = React.useMemo(() => {
        if (!task.dueDate || !today) return null;
        return getDaysLeft(task.dueDate, today);
    }, [task.dueDate, today]);

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

                    {/* Points */}
                    <div className="mt-auto">
                        <Typography className="text-white text-xs font-semibold">
                            Puan: {task.points || 0}
                        </Typography>
                    </div>
                </div>
            );
        }

        // In progress column - compact view
        else if (columnId === 'inProgress') {
            return (
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <Typography variant="h5" className="font-bold text-white mb-2">{task.title}</Typography>

                        {/* Notes */}
                        {task.notes && (
                            <div className="flex items-center mb-2">
                                <FileText className="h-3 w-3 text-white/80 mr-1" />
                                <Typography className="text-white/90 text-xs">{task.notes}</Typography>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto">
                        {/* Due date and days left */}
                        {task.dueDate && (
                            <div className="flex items-center justify-between mb-2">
                                <span className="flex items-center text-white/90 text-xs">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formattedDate}
                                </span>

                                {daysLeft !== null && (
                                    <span className={cn(
                                        "text-xs px-1 py-0.5 rounded-sm font-medium",
                                        daysLeft < 0 ? "bg-red-900/50" :
                                            daysLeft <= 2 ? "bg-yellow-900/50" : "bg-green-900/50"
                                    )}>
                                        {daysLeft < 0 ? `${Math.abs(daysLeft)}g gecikme` : `${daysLeft} günün kaldı`}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Points and Reward */}
                        <div className="flex items-center justify-between">
                            <Typography className="text-white text-xs font-semibold">
                                {task.points || 0} Puan
                            </Typography>

                            {task.reward && (
                                <div className="flex items-center">
                                    <Gift className="h-3 w-3 text-white/80 mr-1" />
                                    <Typography className="text-white/90 text-xs truncate max-w-[100px]">{task.reward}</Typography>
                                </div>
                            )}
                        </div>
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

                    {/* Points */}
                    <div className="mt-auto">
                        <Typography className="text-white text-xs font-semibold">
                            Kazanılan: {task.points || 0} Puan
                        </Typography>
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

                {/* Date, days left and points */}
                <div className="flex items-center justify-between text-white text-xs mt-auto">
                    {task.dueDate && (
                        <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {daysLeft !== null ?
                                <span className={daysLeft < 0 ? "text-red-400" : ""}>
                                    {daysLeft < 0 ? `${Math.abs(daysLeft)}g gecikme` : `${daysLeft} günün kaldı`}
                                </span> :
                                formattedDate
                            }
                        </span>
                    )}

                    <span className="font-semibold">Puan: {task.points || 0}</span>
                </div>
            </div>
        );
    };

    // Helper function for action buttons
    const renderActionButtons = () => {
        return (
            <div className="absolute right-2 top-2 flex space-x-1">
                {/* Edit button - hide in "done" column */}
                {columnId !== 'done' && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white h-6 w-6 p-0 hover:bg-white/10"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditClick(task, columnId);
                        }}
                    >
                        <Edit className="h-3 w-3" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white h-6 w-6 p-0 hover:bg-white/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(task, columnId);
                    }}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        );
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
                onClick={() => onClick(task, columnId)}
                className="cursor-pointer py-3 px-3 relative h-full min-h-[80px] flex flex-col"
            >
                {renderActionButtons()}
                {renderContent()}
            </div>
        </div>
    );
};

export default TaskCardComponent;