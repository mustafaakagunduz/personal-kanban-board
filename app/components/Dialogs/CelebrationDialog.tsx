// /src/components/Dialogs/CelebrationDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

interface CelebrationDialogProps {
    open: boolean;
    onClose: () => void;
    rewardTitle: string;
}

const CelebrationDialog: React.FC<CelebrationDialogProps> = ({
    open,
    onClose,
    rewardTitle
}) => {
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] text-center">
                <DialogHeader>
                    <DialogTitle className="text-center">🎉 Tebrikler! 🎉</DialogTitle>
                </DialogHeader>
                <Typography variant="h4" className="my-4">
                    [{rewardTitle}] kazandınız!
                </Typography>
                <DialogFooter className="sm:justify-center">
                    <Button onClick={onClose}>
                        Tamam
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CelebrationDialog;