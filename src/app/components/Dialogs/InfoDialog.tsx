// /src/components/Dialogs/InfoDialog.tsx
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

interface InfoDialogProps {
    open: boolean;
    onClose: () => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border-0 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">Gizlilik Bilgilendirmesi</DialogTitle>
                </DialogHeader>
                <div className="text-gray-700 my-4">
                    <p className="mb-4">
                        Kanban uygulaması hiçbir kişisel verinizi sunucularımıza kaydetmez veya üçüncü taraflarla paylaşmaz.
                    </p>
                    <p className="mb-4">
                        Uygulamadaki tüm verileriniz (görevler, ödüller, ayarlar vb.) sadece kullandığınız tarayıcının yerel depolama biriminde (Local Storage'ında) saklanır ve cihazınızdan dışarı çıkmaz.
                    </p>
                    <p>
                        Tarayıcı çerezlerinizi veya geçmişinizi temizlediğinizde bu veriler silinecektir. İhtiyaç duyarsanız verilerinizi yedeklemeniz önerilir.
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
                    >
                        Anladım
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InfoDialog;