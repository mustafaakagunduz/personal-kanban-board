// /src/app/components/Dialogs/ProgressDialog.tsx (Takvim Sorunu Düzeltmesi)
import React, { useEffect } from 'react';
import { ProgressDetails, Task } from '../../types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, setDateInputLocale } from '../../utils/dateUtils';
import { useLanguage } from '../../../context/LanguageContext';

interface ProgressDialogProps {
    open: boolean;
    onClose: () => void;
    task: Task | null;
    progressDetails: ProgressDetails;
    setProgressDetails: (details: ProgressDetails) => void;
    onSubmit: () => void;
    today: Date | null;
}

const ProgressDialog: React.FC<ProgressDialogProps> = ({
                                                           open,
                                                           onClose,
                                                           task,
                                                           progressDetails,
                                                           setProgressDetails,
                                                           onSubmit,
                                                           today
                                                       }) => {
    // Dil hook'unu kullan
    const { t, language } = useLanguage();

    // Dialog açıldığında takvim bileşeninin diline göre ayarlanması
    useEffect(() => {
        if (open) {
            setDateInputLocale(language);
        }
    }, [open, language]);

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{task?.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="dueDate">{t('dialog.taskDueDate')}</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={progressDetails.dueDate}
                            min={today ? formatDate(today, language).split('/').reverse().join('-') : ''}
                            onChange={(e) => setProgressDetails({...progressDetails, dueDate: e.target.value})}
                            onKeyDown={(e) => {
                                // Takvim açma amacıyla kullanılan tuşlara izin ver
                                if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
                                    return;
                                }
                                // Diğer tüm klavye girişlerini engelle
                                e.preventDefault();
                            }}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">{t('taskCard.notes')}</Label>
                        <Textarea
                            id="notes"
                            rows={4}
                            value={progressDetails.notes}
                            onChange={(e) => setProgressDetails({...progressDetails, notes: e.target.value})}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>{t('button.cancel')}</Button>
                    <Button onClick={onSubmit}>{t('button.save')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProgressDialog;