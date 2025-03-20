// /src/app/components/Dialogs/TaskEditDialog.tsx
import React from 'react';
import { SelectedTask } from '../../types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '../../../context/LanguageContext';

// Renk seçimi için basit bir bileşen
const ColorPicker: React.FC<{
    value: string;
    onChange: (color: string) => void;
}> = ({ value, onChange }) => {
    // Dil hook'unu ekleyin
    const { t } = useLanguage();

    // Ön tanımlı renk seçenekleri
    const colorOptions = [
        { name: t("colors.purple"), value: "#6b21a8" }, // purple
        { name: t("colors.blue"), value: "#1f91dc" }, // blue
        { name: t("colors.green"), value: "#008000" }, // green
        { name: t("colors.red"), value: "#ff0000" }, // red
        { name: t("colors.orange"), value: "#ff7518" }, // orange
        { name: t("colors.yellow"), value: "#ffa500" }, // yellow
        { name: t("colors.pink"), value: "#ff00ff" }, // pink
        { name: t("colors.black"), value: "#000000" }, // black
    ];

    return (
        <div className="grid grid-cols-2 gap-2">
            {colorOptions.map((color) => (
                <div key={color.value} className="flex items-center">
                    <input
                        type="radio"
                        id={color.value}
                        name="taskColor"
                        value={color.value}
                        checked={value === color.value}
                        onChange={() => onChange(color.value)}
                        className="mr-2"
                    />
                    <label htmlFor={color.value} className="flex items-center">
                        <div
                            className="w-4 h-4 mr-2 rounded-full"
                            style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

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
    // Dil hook'unu kullan
    const { t } = useLanguage();

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('dialog.editTask')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">{t('dialog.taskTitle')}</Label>
                        <Input
                            id="title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">{t('dialog.taskDescription')}</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="points">{t('dialog.taskPoints')}</Label>
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
                            <Label htmlFor="dueDate">{t('dialog.dueDate')}</Label>
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

                    {/* Renk seçimi bölümü */}
                    <div className="grid gap-2">
                        <Label>{t('dialog.taskCardColor')}</Label>
                        <ColorPicker
                            value={selectedTask?.color || "#4c1d95"} // varsayılan indigo-900
                            onChange={(color) => {
                                if (selectedTask) {
                                    setSelectedTask({
                                        ...selectedTask,
                                        color
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>{t('button.cancel')}</Button>
                    <Button onClick={onSave}>{t('button.save')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TaskEditDialog;