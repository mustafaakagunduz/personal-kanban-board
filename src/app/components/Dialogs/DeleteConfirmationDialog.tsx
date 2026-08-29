// /src/app/components/Dialogs/DeleteConfirmationDialog.tsx
import React from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from '../../../context/LanguageContext';
import Spinner from '../Spinner';

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    loading?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
                                                                               open,
                                                                               onClose,
                                                                               onConfirm,
                                                                               title,
                                                                               loading = false
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
                    <AlertDialogCancel onClick={onClose} disabled={loading}>{t('button.cancel')}</AlertDialogCancel>
                    <Button onClick={onConfirm} disabled={loading}>
                        {loading && <Spinner className="mr-2" />}
                        {t('button.confirm')}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmationDialog;