// /src/app/components/Dialogs/DeleteConfirmationDialog.tsx
import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '../../../context/LanguageContext';

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
                                                                               open,
                                                                               onClose,
                                                                               onConfirm,
                                                                               title
                                                                           }) => {
    // Dil hook'unu kullan
    const { t } = useLanguage();

    // Dialog başlığını ayarla - ya customTitle ya da çeviri
    const dialogTitle = title || t('dialog.deleteTask');

    return (
        <AlertDialog open={open} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('dialog.deleteConfirm')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>{t('button.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{t('button.confirm')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmationDialog;