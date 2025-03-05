// /src/components/Dialogs/TaskEditDialog.tsx
import React from 'react';
import { SelectedTask } from '../../types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Renk seçimi için basit bir bileşen
const ColorPicker: React.FC<{
    value: string;
    onChange: (color: string) => void;
}> = ({ value, onChange }) => {
    // Ön tanımlı renk seçenekleri
    const colorOptions = [
        { name: "Mor (Varsayılan)", value: "#800080" }, // indigo-900
        { name: "Mavi", value: "#1f91dc" }, // blue-800
        { name: "Yeşil", value: "#008000" }, // green-800
        { name: "Kırmızı", value: "#ff0000" }, // red-800
        { name: "Turuncu", value: "#bd4f2b" }, // orange-800
        { name: "Sarı", value: "#ffa500" }, // yellow-800
        { name: "Pembe", value: "#ff00ff" }, // pink-800
        { name: "Mor", value: "#6b21a8" }, // purple-800
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

                    {/* Yeni renk seçimi bölümü */}
                    <div className="grid gap-2">
                        <Label>Kart Rengi</Label>
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
                    <Button variant="outline" onClick={onClose}>İptal</Button>
                    <Button onClick={onSave}>Kaydet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TaskEditDialog;