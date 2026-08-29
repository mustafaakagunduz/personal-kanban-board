// /src/app/components/Dialogs/AddProgressStepDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '../../../context/LanguageContext';
import Spinner from '../Spinner';

interface AddProgressStepDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (text: string) => void;
    loading?: boolean;
}

const AddProgressStepDialog: React.FC<AddProgressStepDialogProps> = ({ open, onClose, onSave, loading = false }) => {
    const { t } = useLanguage();
    const [text, setText] = useState('');

    useEffect(() => {
        if (open) setText('');
    }, [open]);

    const handleSave = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        onSave(trimmed);
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('dialog.addProgressStep')}</DialogTitle>
                </DialogHeader>
                <div className="py-2">
                    <Textarea
                        rows={3}
                        autoFocus
                        placeholder={t('dialog.progressStepPlaceholder')}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>{t('button.cancel')}</Button>
                    <Button onClick={handleSave} disabled={!text.trim() || loading}>
                        {loading && <Spinner className="mr-2" />}
                        {t('button.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddProgressStepDialog;
