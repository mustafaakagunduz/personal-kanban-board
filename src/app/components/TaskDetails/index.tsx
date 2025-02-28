// /src/components/TaskDetails/index.tsx
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
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Görev Detayları</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 my-2">
                    <Typography variant="h4">{task?.title}</Typography>

                    <Separator />
                    <div>
                        <Typography variant="h5" className="mb-1">{task?.description}</Typography>


                    </div>
                    <Separator />
                    <div>
                        <Typography>{task?.points || 0} Puan </Typography>
                    </div>
                    <Separator />

                    {task?.dueDate && (
                        <div>
                            <Typography>
                                Bitiş Tarihi: {formatDate(new Date(task.dueDate))}
                            </Typography>
                        </div>
                    )}
                    {task?.reward && (
                        <div>
                            <Typography>
                                Ödül: {task.reward}
                            </Typography>
                        </div>
                    )}
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