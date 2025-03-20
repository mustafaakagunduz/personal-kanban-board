// /src/app/components/Dialogs/HelpDialog.tsx
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
import { useLanguage } from '../../../context/LanguageContext';

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
    // Dil hook'unu kullan
    const { t, language } = useLanguage();

    // Akordeon durumları için state
    const [openSection, setOpenSection] = useState<string | null>("görevleri-yönetme");

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    // HTML içeren metinleri güvenli bir şekilde render etme
    const renderHTML = (htmlString: string) => {
        return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border-0 max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">{t('dialog.help.title')}</DialogTitle>
                </DialogHeader>
                <div className="text-gray-700 my-4">
                    <AccordionItem
                        title={t('dialog.help.section1')}
                        isOpen={openSection === "görevleri-yönetme"}
                        toggle={() => toggleSection("görevleri-yönetme")}
                    >
                        {renderHTML(t('dialog.help.section1Text'))}
                    </AccordionItem>
                    <AccordionItem
                        title={t('dialog.help.section2')}
                        isOpen={openSection === "gunluk-yapilacaklar"}
                        toggle={() => toggleSection("gunluk-yapilacaklar")}
                    >
                        {renderHTML(t('dialog.help.section2Text'))}
                    </AccordionItem>
                    <AccordionItem
                        title={t('dialog.help.section3')}
                        isOpen={openSection === "sürükle-bırak"}
                        toggle={() => toggleSection("sürükle-bırak")}
                    >
                        {renderHTML(t('dialog.help.section3Text'))}
                    </AccordionItem>

                    <AccordionItem
                        title={t('dialog.help.section4')}
                        isOpen={openSection === "ödül-sistemi"}
                        toggle={() => toggleSection("ödül-sistemi")}
                    >
                        {renderHTML(t('dialog.help.section4Text'))}
                    </AccordionItem>

                    <AccordionItem
                        title={t('dialog.help.section5')}
                        isOpen={openSection === "özelleştirme"}
                        toggle={() => toggleSection("özelleştirme")}
                    >
                        {renderHTML(t('dialog.help.section5Text'))}
                    </AccordionItem>

                    <AccordionItem
                        title={t('dialog.help.section6')}
                        isOpen={openSection === "iletişim"}
                        toggle={() => toggleSection("iletişim")}
                    >
                        {renderHTML(t('dialog.help.section6Text'))}
                    </AccordionItem>
                </div>
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#2D9596] to-[#265073] hover:from-[#249090] hover:to-[#1e405e] text-white cursor-pointer"
                    >
                        {t('dialog.help.understand')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HelpDialog;