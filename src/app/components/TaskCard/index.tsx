import React from 'react';
import { Task } from '../../types';
import { getDaysLeft, formatDate } from '../../utils/dateUtils';
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Gift, FileText, Clock } from 'lucide-react';
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
        // Yapılacaklar kolonunda - minimal bilgi
        if (columnId === 'todo') {
            return (
                <>
                    <div className="flex justify-between items-start mb-1">
                        <Typography variant="h5" className="pr-8 text-white">{task.title}</Typography>
                        {renderActionButtons()}
                    </div>

                    <div className="flex justify-between items-start mb-1">
                        <Typography variant="h5" className="pr-8 text-white">{task.description}</Typography>
                        {renderActionButtons()}
                    </div>


                    {/* Puanlar */}
                    <div className="mt-1">
                        <Typography className="text-white text-xs">
                            Puan: {task.points || 0}
                        </Typography>
                    </div>
                </>
            );
        }

        // Devam edenler kolonunda - kompakt görünüm
        else if (columnId === 'inProgress') {
            return (
                <>
                    <div className="flex justify-between items-start mb-1">
                        <Typography variant="h5" className="pr-8 text-white">{task.title}</Typography>
                        {renderActionButtons()}
                    </div>

                    {/* Notlar */}
                    {task.notes && (
                        <div className="flex items-center mb-1">
                            <FileText className="h-3 w-3 text-white mr-1" />
                            <Typography className="text-white text-xs truncate">{task.notes}</Typography>
                        </div>
                    )}

                    {/* Bitiş Tarihi ve kalan gün tek satırda */}
                    {task.dueDate && (
                        <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center text-white text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formattedDate}
                            </span>

                            {daysLeft !== null && (
                                <span className={cn(
                                    "text-xs px-1 py-0.5 rounded-sm font-medium",
                                    daysLeft < 0 ? "bg-red-900/50" :
                                        daysLeft <= 2 ? "bg-yellow-900/50" : "bg-green-900/50"
                                )}>
                                    {daysLeft < 0 ? `${Math.abs(daysLeft)}g gecikme` : `${daysLeft}g kaldı`}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Puan ve Ödül tek satırda */}
                    <div className="flex items-center justify-between mt-1">
                        <Typography className="text-white text-xs font-medium">
                            {task.points || 0} Puan
                        </Typography>

                        {task.reward && (
                            <div className="flex items-center">
                                <Gift className="h-3 w-3 text-white mr-1" />
                                <Typography className="text-white text-xs truncate max-w-[100px]">{task.reward}</Typography>
                            </div>
                        )}
                    </div>
                </>
            );
        }

        // Tamamlananlar kolonunda - minimal görünüm
        else if (columnId === 'done') {
            return (
                <>
                    <div className="flex justify-between items-start mb-1">
                        <Typography variant="h5" className="pr-8 text-white">{task.title}</Typography>
                        {renderActionButtons()}
                    </div>

                    {/* Puan ve ödül */}
                    <div className="flex items-center justify-between mt-1">
                        <Typography className="text-white text-xs">
                            Kazanılan: {task.points || 0} Puan
                        </Typography>


                    </div>

                    <div className="flex justify-between items-start mb-1">
                        <Typography variant="h5" className="pr-8 text-white">{task.description}</Typography>
                        {renderActionButtons()}
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

                {/* Tarih, kalan gün ve puan tek satırda */}
                <div className="flex items-center justify-between text-white text-xs mt-1">
                    {task.dueDate && (
                        <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {daysLeft !== null ?
                                <span className={daysLeft < 0 ? "text-red-400" : ""}>
                                    {daysLeft < 0 ? `${Math.abs(daysLeft)}g gecikme` : `${daysLeft}g kaldı`}
                                </span> :
                                formattedDate
                            }
                        </span>
                    )}

                    <span>Puan: {task.points || 0}</span>
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

    // Varsayılan renk değeri (indigo-900)
    const defaultColor = "#4c1d95";

    return (
        <Card
            className={taskCardClass}
            draggable
            onDragStart={(e) => onDragStart(e, task.id, columnId)}
            style={{ backgroundColor: task.color || defaultColor }}
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