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
                <div className="text-gray-700 my-4 text-justify">
                    <p className="mb-4">
                        Kanban uygulaması hiçbir kişisel verinizi sunucularımıza kaydetmez veya üçüncü taraflarla
                        paylaşmaz.
                    </p>
                    <p className="mb-4">
                        Uygulamadaki tüm verileriniz (görevler, ödüller, ayarlar vb.) sadece kullandığınız tarayıcının
                        yerel depolama biriminde (Local Storage'sinde) saklanır ve cihazınızdan dışarı çıkmaz.
                    </p>
                    <p>
                        Tarayıcınızın "Local Storage"sini temizlediğinizde bu veriler silinecektir. İhtiyaç
                        duyarsanız verilerinizi yedeklemeniz önerilir.
                    </p>
                </div>
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#2D9596] to-[#265073] hover:from-[#249090] hover:to-[#1e405e] text-white cursor-pointer"
                    >
                        Anladım
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InfoDialog;