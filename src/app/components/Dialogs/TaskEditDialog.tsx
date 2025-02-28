// /src/components/Dialogs/TaskEditDialog.tsx
import React from 'react';
import { SelectedTask } from '../../types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TaskEditDialogProps {
    open: boolean;
    onClose: () => void;
    editTitle: string;
    setEditTitle: (title: string) => void;
    editDescription: string;
    setEditDescription: (description: string) => void;
    selectedTask: SelectedTask | null;
    setSelectedTask: (task: SelectedTask | null) => void;
    onSave: () => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
    open,
    onClose,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    selectedTask,
    setSelectedTask,
    onSave
}) => {
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Görevi Düzenle</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Görev Başlığı</Label>
                        <Input
                            id="title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Görev Açıklaması</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="points">Puan</Label>
                        <Input
                            id="points"
                            type="number"
                            value={selectedTask?.points || 0}
                            onChange={(e) => {
                                if (selectedTask) {
                                    setSelectedTask({
                                        ...selectedTask,
                                        points: Number(e.target.value)
                                    });
                                }
                            }}
                        />
                    </div>
                    {selectedTask?.dueDate && (
                        <div className="grid gap-2">
                            <Label htmlFor="dueDate">Bitiş Tarihi</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={selectedTask.dueDate}
                                onChange={(e) => {
                                    if (selectedTask) {
                                        setSelectedTask({
                                            ...selectedTask,
                                            dueDate: e.target.value
                                        });
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>İptal</Button>
                    <Button onClick={onSave}>Kaydet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TaskEditDialog;