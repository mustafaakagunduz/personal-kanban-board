// /src/app/components/Dialogs/PrivacyDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Database } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface InfoDialogProps {
    open: boolean;
    onClose: () => void;
}

const PrivacyDialog: React.FC<InfoDialogProps> = ({ open, onClose }) => {
    // Dil hook'unu kullan
    const { t } = useLanguage();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border-0 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Shield className="text-[#2D9596] h-5 w-5" /> {t('privacy.title')}
                    </DialogTitle>
                </DialogHeader>
                <div className="text-gray-700 my-4 space-y-4">
                    <div className="flex items-start gap-3">
                        <Lock className="text-[#2D9596] h-5 w-5 mt-1 flex-shrink-0" />
                        <p>
                            <span className="font-medium">{t('privacy.dataPrivacy')}</span>
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <Database className="text-[#2D9596] h-5 w-5 mt-1 flex-shrink-0" />
                        <p>
                            <span className="font-medium">{t('privacy.localStorage')}</span>
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="text-[#2D9596] h-5 w-5 mt-1 flex-shrink-0">⚠️</div>
                        <p>
                            <span className="font-medium">{t('privacy.warning')}</span>
                        </p>
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#2D9596] to-[#265073] hover:from-[#249090] hover:to-[#1e405e] text-white cursor-pointer"
                    >
                        {t('privacy.secure')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PrivacyDialog;