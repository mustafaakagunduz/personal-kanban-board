// /src/components/Dialogs/HelpDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HelpDialogProps {
    open: boolean;
    onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border-0 max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">Nasıl Kullanılır?</DialogTitle>
                </DialogHeader>
                <div className="text-gray-700 my-4 text-justify">
                    <h3 className="text-lg font-semibold mb-2">Görevleri Yönetme</h3>
                    <p className="mb-3">
                        Bu içeriği daha sonra kendi ihtiyaçlarınıza göre düzenleyebilirsiniz. Kullanıcılara uygulamanın
                        nasıl kullanılacağına dair bilgiler verebilirsiniz.
                    </p>

                    <h3 className="text-lg font-semibold mb-2 mt-4">Sürükle & Bırak</h3>
                    <p className="mb-3">
                        Görevleri kolonlar arasında taşımak için sürükle & bırak özelliğini kullanabilirsiniz.
                    </p>

                    <h3 className="text-lg font-semibold mb-2 mt-4">Ödül Sistemi</h3>
                    <p className="mb-3">
                        Görevleri tamamladıkça puan kazanır ve bu puanları ödüller için kullanabilirsiniz.
                    </p>
                </div>
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
                    >
                        Anladım
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HelpDialog;