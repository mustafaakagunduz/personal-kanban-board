// /src/components/TaskCard/index.tsx
import React from 'react';
import { Task } from '../../types';
import { getDaysLeft } from '../../utils/dateUtils';
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
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
    const daysLeft = task.dueDate ? getDaysLeft(task.dueDate, today) : null;

    return (
        <Card
            className={taskCardClass}
            draggable
            onDragStart={(e) => onDragStart(e, task.id, columnId)}
        >
            <CardContent
                onClick={() => onClick(task, columnId)}
                className="cursor-pointer py-2 px-3 relative"
            >
                <div className="flex justify-between items-start mb-1">
                    <Typography variant="h5" className="pr-8 text-white">{task.title}</Typography>
                    <div className="absolute right-2 top-2 flex space-x-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white h-6 w-6 p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditClick(task, columnId);
                            }}
                        >
                            <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white h-6 w-6 p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick(task, columnId);
                            }}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
                <Typography className="text-white text-sm">{task.description}</Typography>
                <div className="mt-1">
                    <Typography className="text-white text-xs">
                        Puan: {task.points || 0}
                    </Typography>
                    {daysLeft !== null && (
                        <Typography className={cn(daysLeft < 0 ? "text-destructive" : "text-white", "text-xs")}>
                            {daysLeft < 0 ? 'Gecikme: ' : 'Kalan: '}
                            {Math.abs(daysLeft)} gün
                        </Typography>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskCardComponent;