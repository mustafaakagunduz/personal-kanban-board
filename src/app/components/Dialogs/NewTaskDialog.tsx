// /src/app/components/Dialogs/NewTaskDialog.tsx
import React, {useState} from 'react';
import { NewTaskForm } from '../../types';
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

const NewTaskDialog: React.FC<TaskDialogProps> = ({
                                                   open,
                                                   onClose,
                                                   newTask,
                                                   setNewTask,
                                                   onAddTask
                                               }) => {
    // Dil hook'unu kullan
    const { t } = useLanguage();
    // NewTaskDialog bileşeninde useState ekleyelim
    const [pointsError, setPointsError] = useState<string | null>(null);
// NewTaskDialog bileşeninde onAddTask'i çağırmadan önce doğrulama yapalım
    const handleSubmit = () => {
        // Başlık boşsa işlemi iptal et
        if (!newTask.title) return;

        // Puan kontrolü (0 veya pozitif tam sayı olmalı)
        const points = newTask.points;
        if (points !== '' && (isNaN(Number(points)) || !Number.isInteger(Number(points)) || Number(points) < 0)) {
            setPointsError(t('dialog.positiveIntegerRequired'));
            return;
        }

        // Doğrulamalar geçildi, görev ekle
        onAddTask();
    };


    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('dialog.newTask')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">{t('dialog.taskTitle')}</Label>
                        <Input
                            id="title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value, column: 'todo' })}
                            autoFocus
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">{t('dialog.taskDescription')}</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value, column: 'todo' })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="points">{t('dialog.taskPoints')}</Label>

                        {pointsError && (
                            <div className="text-red-500 text-sm">{pointsError}</div>
                        )}
                        <Input
                            id="points"
                            type="number"
                            value={newTask.points}
                            min="0" // Minimum değeri 0 olarak değiştirdik
                            onKeyDown={(e) => {
                                // Harf tuşlarını engelle (sayısal tuşlar, backspace, delete, ok tuşları hariç)
                                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
                                const isNumber = /^[0-9]$/.test(e.key);

                                if (!isNumber && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value;

                                // Boş input kontrolü
                                if (value === '') {
                                    setPointsError(null);
                                    setNewTask({
                                        ...newTask,
                                        points: '',
                                        column: 'todo'
                                    });
                                    return;
                                }

                                // Sadece 0 veya pozitif tam sayı kontrolü
                                const numValue = Number(value);
                                if (isNaN(numValue) || !Number.isInteger(numValue) || numValue < 0) {
                                    setPointsError(t('dialog.positiveIntegerRequired'));
                                    return;
                                }

                                // Geçerli değer
                                setPointsError(null);
                                setNewTask({
                                    ...newTask,
                                    points: numValue,
                                    column: 'todo'
                                });
                            }}
                        />
                    </div>

                    {/* Renk seçimi bölümü */}
                    <div className="grid gap-2">
                        <Label>{t('dialog.taskCardColor')}</Label>
                        <ColorPicker
                            value={newTask.color || "#6b21a8"} // varsayılan mor renk
                            onChange={(color) => setNewTask({
                                ...newTask,
                                color,
                                column: 'todo'
                            })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>{t('button.cancel')}</Button>
                    <Button onClick={handleSubmit}>{t('button.add')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewTaskDialog;