// /src/app/components/Dialogs/TaskCompletionDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from '../../../context/LanguageContext';
import { Typography } from "@/components/ui/typography";

interface TaskCompletionDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
}

const TaskCompletionDialog: React.FC<TaskCompletionDialogProps> = ({
                                                                       open,
                                                                       onClose,
                                                                       onConfirm,
                                                                       taskTitle
                                                                   }) => {
    const { t } = useLanguage();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] text-center">
                <DialogHeader className="flex justify-center">
                    <DialogTitle className="sr-only">{t('dialog.completeTask')}</DialogTitle>
                    <DialogDescription className="text-center">
                        <Typography className="text-black text-base">
                            "{taskTitle}" {t('dialog.completeTaskConfirm')}
                        </Typography>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-center space-x-4 mt-4">
                    <Button variant="outline" onClick={onClose}>{t('button.cancel')}</Button>
                    <Button onClick={onConfirm}>{t('button.confirmCompletion')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TaskCompletionDialog;