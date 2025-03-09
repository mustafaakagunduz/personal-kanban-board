import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpDialogProps {
    open: boolean;
    onClose: () => void;
}

type AccordionItemProps = {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    toggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, toggle }) => {
    return (
        <div className="border-b border-gray-200 last:border-0">
            <button
                className={cn(
                    "flex w-full justify-between items-center py-3 px-2 text-left rounded-md cursor-pointer transition-all duration-200",
                    "hover:bg-[#2D9596] group",
                    isOpen ? "bg-[#2D9596]" : ""
                )}
                onClick={toggle}
            >
                <h3 className={cn(
                    "text-lg font-semibold",
                    isOpen ? "text-white" : "text-gray-800 group-hover:text-white"
                )}>{title}</h3>
                <ChevronDown
                    className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        isOpen ? "text-white transform rotate-180" : "text-gray-500 group-hover:text-white"
                    )}
                />
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out px-2",
                    isOpen ? "max-h-96 pb-3" : "max-h-0"
                )}
            >
                <div className="text-gray-700 text-justify">{children}</div>
            </div>
        </div>
    );
};

const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose }) => {
    // Akordeon durumları için state
    const [openSection, setOpenSection] = useState<string | null>("görevleri-yönetme");

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border-0 max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">🧭 Kanban'ı Keşfedin! </DialogTitle>
                </DialogHeader>
                <div className="text-gray-700 my-4">
                    <AccordionItem
                        title="🎯 Görevleri Yönetme"
                        isOpen={openSection === "görevleri-yönetme"}
                        toggle={() => toggleSection("görevleri-yönetme")}
                    >
                        <p className="mb-3">
                            <span className="font-medium text-[#2D9596]">"Yeni Görev"</span> butonu ile hayallerinizi
                            ve hedeflerinizi kolayca listeye ekleyin! ✍️
                        </p>
                        <p className="mb-3">
                            Görevlerinizi <span className="font-medium text-[#2D9596]">sürükle & bırak</span> yöntemiyle
                            ilerleme durumuna göre taşıyabilir, son tarih belirleyebilirsiniz. 🔄
                        </p>
                    </AccordionItem>
                    <AccordionItem
                        title="📋 Günlük Yapılacaklar"
                        isOpen={openSection === "gunluk-yapilacaklar"}
                        toggle={() => toggleSection("gunluk-yapilacaklar")}
                    >
                        <p className="mb-3">
                            <span className="font-medium text-[#2D9596]">"Bugün Yapacaklarım"</span> özelliği ile günlük görevlerinizi kolayca takip edebilirsiniz! 🗓️
                        </p>

                        <ul className="list-disc pl-5 mb-3 space-y-2">
                            <li>Farklı öncelik seviyelerinde (yüksek 🔴, orta 🟠, düşük 🟢) görevler ekleyebilirsiniz</li>
                            <li>Görevleri tamamlandı olarak işaretleyebilir veya silebilirsiniz</li>


                        </ul>
                        <p className="mb-3">
                            Günlük yapacaklarınızı planlayarak, gününüzü daha verimli hale getirin ve hiçbir görevi atlamadığınızdan emin olun! ✅
                        </p>
                    </AccordionItem>
                    <AccordionItem
                        title="📅 Takvim Özellikleri"
                        isOpen={openSection === "sürükle-bırak"}
                        toggle={() => toggleSection("sürükle-bırak")}
                    >
                        <p className="mb-3">
                            Sol üstteki takvim ile bugünü görebilir, istediğiniz güne tıklayarak
                            hemen o güne özel görev oluşturabilirsiniz! 🗓️
                        </p>
                        <p className="mb-3">
                            <span className="text-red-500 font-medium">Kırmızı noktalar</span> o gün son tarihi olan görevlerinizi
                            gösterir. Merak ettiğiniz tarihin üzerine fareyle gelerek hangi görevler olduğunu
                            görebilirsiniz. 👀
                        </p>
                    </AccordionItem>

                    <AccordionItem
                        title="🎁 Kendinizi Ödüllendirin"
                        isOpen={openSection === "ödül-sistemi"}
                        toggle={() => toggleSection("ödül-sistemi")}
                    >
                        <p className="mb-3">
                            Görevlerinizi tamamladıkça puanlar kazanın ve bu puanlarla kendinize
                            küçük ödüller verin! 🏆
                        </p>
                        <p className="mb-3">
                            Sağ üstte biriken puanlarınızı görebilir, <span className="font-medium text-[#2D9596]">
                            "Yeni Ödül"</span> butonu ile kendinize motivasyon ödülleri ekleyebilirsiniz. 💰
                        </p>
                        <p className="mb-3">
                            Yeterli puanı topladığınızda <span className="font-medium text-green-500">"Kullan"</span> butonu
                            aktif olur - kendinizi şımartmanın tam zamanı! 💫
                        </p>
                    </AccordionItem>

                    <AccordionItem
                        title="🎨 Kişiselleştirme"
                        isOpen={openSection === "özelleştirme"}
                        toggle={() => toggleSection("özelleştirme")}
                    >
                        <p className="mb-3">
                            Kendinize özel bir çalışma alanı yaratın! Görev ve ödül kartlarınızın renklerini değiştirin,
                            Kanban tahtanızı sevdiğiniz renklerle süsleyin. 🌈
                        </p>
                        <p className="mb-3">
                            Favori renk kombinasyonlarınızı kaydederek her zaman size ilham veren bir ortamda
                            çalışabilirsiniz! ✨
                        </p>
                    </AccordionItem>

                    <AccordionItem
                        title="📬 İletişim"
                        isOpen={openSection === "iletişim"}
                        toggle={() => toggleSection("iletişim")}
                    >
                        <p className="mb-3">
                            Fikir ve önerileriniz değerli! Benimle aşağıdaki kanallardan iletişime geçebilirsiniz: 📝
                        </p>
                        <p className="mb-3">
                            📧 E-mail: <span className="font-medium">akagunduzmustafa00@gmail.com</span>
                        </p>
                        <p className="mb-3">
                            🔗 LinkedIn: <a href="https://www.linkedin.com/in/mustafa-akagunduz/" target="_blank"
                                           rel="noopener noreferrer"
                                           className="text-blue-500 hover:underline font-medium">linkedin.com/in/mustafa-akagunduz/</a>
                        </p>
                    </AccordionItem>
                </div>
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#2D9596] to-[#265073] hover:from-[#249090] hover:to-[#1e405e] text-white cursor-pointer"
                    >
                        Harika, Anladım! 👍
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HelpDialog;