// /src/components/TaskCard/index.tsx
import React from 'react';
import { Task } from '../../types';
import { getDaysLeft } from '../../utils/dateUtils';
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';
import { cn } from "@/lib/utils";
import { taskCardClass } from "../KanbanBoard3/styles";

interface TaskCardProps {
    task: Task;
    columnId: string;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => void;
    onMenuOpen: (e: React.MouseEvent<HTMLElement>, task: Task, columnId: string) => void;
    onClick: (task: Task, columnId: string) => void;
    today: Date | null;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({
    task,
    columnId,
    onDragStart,
    onMenuOpen,
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
                className="cursor-pointer py-2 px-3 relative" // padding'i azalttım
            >
                <div className="flex justify-between items-start mb-1"> {/* margin-bottom'u azalttım */}
                    <Typography variant="h5" className="pr-8 text-white">{task.title}</Typography> {/* h4'ten h5'e değiştirerek başlık boyutunu küçülttüm */}
                    <div className="absolute right-2 top-2"> {/* position'ı ayarladım ve tek bir buton olduğu için flex-col kaldırıldı */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white h-6 w-6 p-0" /* buton boyutunu küçülttüm */
                            onClick={(e) => {
                                e.stopPropagation();
                                // Burada event'i olduğu gibi bırakarak düğmenin konumunu dropdown için referans noktası yapıyoruz
                                onMenuOpen(e, task, columnId);
                            }}
                        >
                            <Edit className="h-3 w-3" /> {/* ikon boyutunu küçülttüm */}
                        </Button>
                    </div>
                </div>
                <Typography className="text-white text-sm">{task.description}</Typography> {/* yazı boyutunu küçülttüm */}
                <div className="mt-1"> {/* margin'i azalttım */}
                    <Typography className="text-white text-xs"> {/* yazı boyutunu küçülttüm */}
                        Puan: {task.points || 0}
                    </Typography>
                    {daysLeft !== null && (
                        <Typography className={cn(daysLeft < 0 ? "text-destructive" : "text-white", "text-xs")}> {/* yazı boyutunu küçülttüm */}
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