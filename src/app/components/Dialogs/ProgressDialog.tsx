// /src/components/Dialogs/ProgressDialog.tsx
import React from 'react';
import { ProgressDetails, Task } from '../../types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from '../../utils/dateUtils';

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
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{task?.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="dueDate">Bitiş tarihini (takvime tıklayarak) seçiniz</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={progressDetails.dueDate}
                            min={today ? formatDate(today).split('/').reverse().join('-') : ''}
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


                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notlar</Label>
                        <Textarea
                            id="notes"
                            rows={4}
                            value={progressDetails.notes}
                            onChange={(e) => setProgressDetails({...progressDetails, notes: e.target.value})}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>İptal</Button>
                    <Button onClick={onSubmit}>Kaydet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProgressDialog;