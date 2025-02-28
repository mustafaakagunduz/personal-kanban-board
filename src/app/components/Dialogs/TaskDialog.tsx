// /src/components/Dialogs/TaskDialog.tsx
import React from 'react';
import { NewTaskForm } from '../../types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TaskDialogProps {
    open: boolean;
    onClose: () => void;
    newTask: NewTaskForm;
    setNewTask: (task: NewTaskForm) => void;
    onAddTask: () => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
                                                   open,
                                                   onClose,
                                                   newTask,
                                                   setNewTask,
                                                   onAddTask
                                               }) => {
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Yeni Görev Ekle</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Görev Başlığı</Label>
                        <Input
                            id="title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value, column: 'todo' })}
                            autoFocus
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Görev Açıklaması</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value, column: 'todo' })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="points">Puan</Label>
                        <Input
                            id="points"
                            type="number"
                            value={newTask.points}
                            onChange={(e) => setNewTask({
                                ...newTask,
                                points: e.target.value === '' ? '' : Number(e.target.value),
                                column: 'todo'
                            })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>İptal</Button>
                    <Button onClick={onAddTask}>Ekle</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDialog;