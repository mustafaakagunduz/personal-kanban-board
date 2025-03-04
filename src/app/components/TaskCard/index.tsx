import React from 'react';
import { Task } from '../../types';
import { getDaysLeft, formatDate } from '../../utils/dateUtils';
import { Card, CardContent } from "@/components/ui/card";
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
    // Debug bilgileri konsola yazdırma
    console.log(`Task ID: ${task.id}, DueDate: ${task.dueDate}, Today:`, today);

    // Bitiş tarihinin geçerli olup olmadığını kontrol et
    let validDueDate = false;
    let formattedDate = '';

    try {
        if (task.dueDate) {
            const date = new Date(task.dueDate);
            formattedDate = formatDate(date);
            validDueDate = !isNaN(date.getTime());
            console.log(`Task ${task.id} date validation: ${validDueDate}, formatted: ${formattedDate}`);
        }
    } catch (error) {
        console.error(`Error formatting date for task ${task.id}:`, error);
    }

    // Kalan günleri hesapla
    const daysLeft = React.useMemo(() => {
        if (!task.dueDate || !today || !validDueDate) return null;
        try {
            return getDaysLeft(task.dueDate, today);
        } catch (error) {
            console.error(`Error calculating days left for task ${task.id}:`, error);
            return null;
        }
    }, [task.dueDate, today, validDueDate, task.id]);

    console.log(`Days Left for task ${task.id}: ${daysLeft}`);

    // Koşullu render işlevi
    const renderContent = () => {
        // Yapılacaklar kolonunda - başlık, açıklama ve puan göster
        if (columnId === 'todo') {
            return (
                <>
                    <div className="flex justify-between items-start mb-1">
                        <Typography variant="h5" className="pr-8 text-white">{task.title}</Typography>
                        {renderActionButtons()}
                    </div>
                    <Typography className="text-white text-sm">{task.description}</Typography>
                    <div className="mt-1">
                        <Typography className="text-white text-xs">
                            Puan: {task.points || 0}
                        </Typography>
                    </div>
                </>
            );
        }

        // Devam edenler kolonunda - başlık, notlar, bitiş tarihi ve ödül göster
        else if (columnId === 'inProgress') {
            return (
                <>
                    <div className="flex justify-between items-start mb-1">
                        <Typography variant="h5" className="pr-8 text-white">{task.title}</Typography>
                        {renderActionButtons()}
                    </div>

                    {/* Notlar */}
                    {task.notes && (
                        <div className="flex items-center mt-1">
                            <FileText className="h-3 w-3 text-white mr-1" />
                            <Typography className="text-white text-xs line-clamp-1">{task.notes}</Typography>
                        </div>
                    )}

                    {/* Bitiş Tarihi - formatDate hatası olsa bile tarihi göster */}
                    {task.dueDate && (
                        <div className="flex items-center mt-1">
                            <Calendar className="h-3 w-3 text-white mr-1" />
                            <Typography className="text-white text-xs">
                                {validDueDate ? `Bitiş: ${formattedDate}` : `Bitiş: ${task.dueDate}`}
                                {daysLeft !== null && (
                                    <span className={daysLeft < 0 ? "text-destructive" : ""}>
                                        {" "}({daysLeft < 0 ? 'Gecikme: ' : 'Kalan: '}
                                        {Math.abs(daysLeft)} gün)
                                    </span>
                                )}
                            </Typography>
                        </div>
                    )}

                    {/* Ödül */}
                    {task.reward && (
                        <div className="flex items-center mt-1">
                            <Gift className="h-3 w-3 text-white mr-1" />
                            <Typography className="text-white text-xs line-clamp-1">{task.reward}</Typography>
                        </div>
                    )}

                    {/* Puanlar */}
                    <div className="mt-1">
                        <Typography className="text-white text-xs">
                            Puan: {task.points || 0}
                        </Typography>
                    </div>
                </>
            );
        }

        // Tamamlananlar kolonunda - başlık, açıklama, puanlar ve ödül göster
        else if (columnId === 'done') {
            return (
                <>
                    <div className="flex justify-between items-start mb-1">
                        <Typography variant="h5" className="pr-8 text-white">{task.title}</Typography>
                        {renderActionButtons()}
                    </div>
                    <Typography className="text-white text-sm">{task.description}</Typography>
                    <div className="mt-1">
                        <Typography className="text-white text-xs">
                            Kazanılan: {task.points || 0} Puan
                        </Typography>

                        {task.reward && (
                            <div className="flex items-center mt-1">
                                <Gift className="h-3 w-3 text-white mr-1" />
                                <Typography className="text-white text-xs">{task.reward}</Typography>
                            </div>
                        )}
                    </div>
                </>
            );
        }

        // Varsayılan görünüm (diğer tüm durumlar için)
        return (
            <>
                <div className="flex justify-between items-start mb-1">
                    <Typography variant="h5" className="pr-8 text-white">{task.title}</Typography>
                    {renderActionButtons()}
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
            </>
        );
    };

    // Düzenleme ve silme butonlarını oluşturan yardımcı işlev
    const renderActionButtons = () => {
        return (
            <div className="absolute right-2 top-2 flex space-x-1">
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
                {renderContent()}
            </CardContent>
        </Card>
    );
};

export default TaskCardComponent;