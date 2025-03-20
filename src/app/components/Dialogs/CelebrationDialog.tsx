// /src/app/components/Dialogs/CelebrationDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useLanguage } from '../../../context/LanguageContext';

interface CelebrationDialogProps {
    open: boolean;
    onClose: () => void;
    rewardTitle: string;
    points?: number; // Add points as an optional prop
}

const CelebrationDialog: React.FC<CelebrationDialogProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 rewardTitle,
                                                                 points
                                                             }) => {
    // Dil hook'unu kullan
    const { t } = useLanguage();

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] text-center">
                <DialogHeader>
                    <DialogTitle className="text-center">{t('dialog.congratulations')}</DialogTitle>
                </DialogHeader>
                <br></br>
                {points !== undefined && (
                    <Typography variant="h5" className="mb-4 text-primary">
                        {t('dialog.pointsEarned').replace('{points}', points.toString())}
                    </Typography>
                )}
                <DialogFooter className="sm:justify-center">
                    <Button onClick={onClose}>
                        {t('button.ok')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CelebrationDialog;