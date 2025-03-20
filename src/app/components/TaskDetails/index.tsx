// /src/app/components/TaskDetails/index.tsx (TaskDetails Başlık Sorunu Düzeltmesi)
import React from 'react';
import { SelectedTask } from '../../types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { formatDate } from '../../utils/dateUtils';
import { Separator } from "@/components/ui/separator";
import { useLanguage } from '../../../context/LanguageContext';

interface TaskDetailsProps {
    open: boolean;
    onClose: () => void;
    task: SelectedTask | null;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
                                                     open,
                                                     onClose,
                                                     task
                                                 }) => {
    // Dil hook'unu kullan
    const { t, language } = useLanguage();

    // Bitiş tarihinin geçerli olup olmadığını kontrol et
    let formattedDueDate = '';
    if (task?.dueDate) {
        try {
            const dueDate = new Date(task.dueDate);
            if (!isNaN(dueDate.getTime())) {
                formattedDueDate = formatDate(dueDate, language);
            } else {
                console.error("Invalid date format:", task.dueDate);
                formattedDueDate = t('taskCard.invalidDate');
            }
        } catch (error) {
            console.error("Error formatting date:", error);
            formattedDueDate = task.dueDate; // Hiç değilse ham veriyi göster
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('dialog.taskDetails')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 my-2">
                    <Typography variant="h4">{t('dialog.taskTitle')}: {task?.title}</Typography>

                    <Separator />
                    <div>
                        <Typography variant="h5" className="mb-1">{t('dialog.taskDescription')}: {task?.description}</Typography>
                    </div>

                    <Separator />
                    <div>
                        <Typography>{t('taskCard.points')}: {task?.points || 0}</Typography>
                    </div>

                    <Separator />

                    {task?.dueDate && (
                        <div>
                            <Typography>
                                {t('dialog.dueDate')}: {formattedDueDate}
                            </Typography>
                        </div>
                    )}

                    <Separator />

                    {task?.notes && (
                        <div>
                            <Typography variant="h5" className="mb-1">{t('taskCard.notes')}: {task.notes}</Typography>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>{t('button.close')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDetails;