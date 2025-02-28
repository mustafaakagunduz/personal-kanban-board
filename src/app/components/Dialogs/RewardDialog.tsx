// /src/components/Dialogs/RewardDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RewardDialogProps {
    open: boolean;
    onClose: () => void;
    reward: { title: string; points: number | '' };
    setReward: (reward: { title: string; points: number | '' }) => void;
    onSave: () => void;
    isEditing: boolean;
}

const RewardDialog: React.FC<RewardDialogProps> = ({
    open,
    onClose,
    reward,
    setReward,
    onSave,
    isEditing
}) => {
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Ödül Düzenle' : 'Yeni Ödül Ekle'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Ödül Başlığı</Label>
                        <Input
                            id="title"
                            value={reward.title}
                            onChange={(e) => setReward({ ...reward, title: e.target.value })}
                            autoFocus
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="points">Puan</Label>
                        <Input
                            id="points"
                            type="number"
                            value={reward.points}
                            onChange={(e) => setReward({
                                ...reward,
                                points: e.target.value === '' ? '' : Number(e.target.value)
                            })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>İptal</Button>
                    <Button onClick={onSave}>
                        {isEditing ? 'Kaydet' : 'Ekle'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RewardDialog;