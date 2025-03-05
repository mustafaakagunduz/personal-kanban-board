// /src/components/Dialogs/RewardDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Renk seçici bileşen
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
                        id={`reward-${color.value}`}
                        name="rewardColor"
                        value={color.value}
                        checked={value === color.value}
                        onChange={() => onChange(color.value)}
                        className="mr-2"
                    />
                    <label htmlFor={`reward-${color.value}`} className="flex items-center">
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

interface RewardDialogProps {
    open: boolean;
    onClose: () => void;
    reward: { title: string; points: number | ''; color?: string };
    setReward: (reward: { title: string; points: number | ''; color?: string }) => void;
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

                    {/* Renk seçimi bölümü */}
                    <div className="grid gap-2">
                        <Label>Kart Rengi</Label>
                        <ColorPicker
                            value={reward.color || "#4c1d95"} // varsayılan indigo-900
                            onChange={(color) => setReward({
                                ...reward,
                                color
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