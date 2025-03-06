import React from 'react';
import { SelectedTask } from '../../types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { formatDate } from '../../utils/dateUtils';
import { Separator } from "@/components/ui/separator";

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
    // Debug bilgileri konsola yazdırma
    console.log("TaskDetails - Task:", task);

    // Bitiş tarihinin geçerli olup olmadığını kontrol et
    let formattedDueDate = '';
    if (task?.dueDate) {
        try {
            const dueDate = new Date(task.dueDate);
            if (!isNaN(dueDate.getTime())) {
                formattedDueDate = formatDate(dueDate);
                console.log("Formatted due date:", formattedDueDate);
            } else {
                console.error("Invalid date format:", task.dueDate);
                formattedDueDate = "Geçersiz tarih formatı";
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
                    <DialogTitle>Görev Detayları</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 my-2">
                    <Typography variant="h4">Görev Adı: {task?.title}</Typography>

                    <Separator />
                    <div>
                        <Typography variant="h5" className="mb-1">Açıklaması: {task?.description}</Typography>
                    </div>

                    <Separator />
                    <div>
                        <Typography>Puan: {task?.points || 0}</Typography>
                    </div>

                    <Separator />

                    {task?.dueDate && (
                        <div>
                            <Typography>
                                Bitiş Tarihi: {formattedDueDate}
                            </Typography>
                        </div>
                    )}

                    <Separator />

                    {task?.notes && (
                        <div>
                            <Typography variant="h5" className="mb-1">Notlar: {task.notes}</Typography>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>Kapat</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDetails;