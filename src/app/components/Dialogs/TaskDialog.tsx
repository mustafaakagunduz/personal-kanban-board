import React from 'react';
import { NewTaskForm } from '../../types';
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
        { name: "Mor (Varsayılan)", value: "#800080" }, // purple
        { name: "Mavi", value: "#1f91dc" }, // blue
        { name: "Yeşil", value: "#008000" }, // green
        { name: "Kırmızı", value: "#ff0000" }, // red
        { name: "Turuncu", value: "#bd4f2b" }, // orange
        { name: "Sarı", value: "#ffa500" }, // yellow
        { name: "Pembe", value: "#ff00ff" }, // pink
        { name: "Koyu Mor", value: "#6b21a8" }, // deep purple
    ];

    return (
        <div className="grid grid-cols-2 gap-2">
            {colorOptions.map((color) => (
                <div key={color.value} className="flex items-center">
                    <input
                        type="radio"
                        id={`new-${color.value}`}
                        name="newTaskColor"
                        value={color.value}
                        checked={value === color.value}
                        onChange={() => onChange(color.value)}
                        className="mr-2"
                    />
                    <label htmlFor={`new-${color.value}`} className="flex items-center">
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

                    {/* Yeni renk seçimi bölümü */}
                    <div className="grid gap-2">
                        <Label>Kart Rengi</Label>
                        <ColorPicker
                            value={newTask.color || "#800080"} // varsayılan mor renk
                            onChange={(color) => setNewTask({
                                ...newTask,
                                color,
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