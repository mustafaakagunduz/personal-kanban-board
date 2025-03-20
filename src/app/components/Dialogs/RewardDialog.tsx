// /src/app/components/Dialogs/RewardDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '../../../context/LanguageContext';

// Renk seçici bileşen
const ColorPicker: React.FC<{
    value: string;
    onChange: (color: string) => void;
}> = ({ value, onChange }) => {
    // Dil hook'unu kullan
    const { t } = useLanguage();

    // Ön tanımlı renk seçenekleri
    const colorOptions = [
        { name: t("colors.purple"), value: "#800080" }, // indigo-900
        { name: t("colors.blue"), value: "#1f91dc" }, // blue-800
        { name: t("colors.green"), value: "#008000" }, // green-800
        { name: t("colors.red"), value: "#ff0000" }, // red-800
        { name: t("colors.orange"), value: "#bd4f2b" }, // orange-800
        { name: t("colors.yellow"), value: "#ffa500" }, // yellow-800
        { name: t("colors.pink"), value: "#ff00ff" }, // pink-800
        { name: t("colors.black"), value: "#000000" }, // black
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
    // Dil hook'unu kullan
    const { t } = useLanguage();

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? t('dialog.editReward') : t('dialog.newReward')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">{t('dialog.rewardTitle')}</Label>
                        <Input
                            id="title"
                            value={reward.title}
                            onChange={(e) => setReward({ ...reward, title: e.target.value })}
                            autoFocus
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="points">{t('dialog.rewardPoints')}</Label>
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
                        <Label>{t('dialog.rewardCardColor')}</Label>
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
                    <Button variant="outline" onClick={onClose}>{t('button.cancel')}</Button>
                    <Button onClick={onSave}>
                        {isEditing ? t('button.save') : t('button.add')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RewardDialog;