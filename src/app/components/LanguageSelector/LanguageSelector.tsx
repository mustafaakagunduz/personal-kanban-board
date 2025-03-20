// /src/components/LanguageSelector/LanguageSelector.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useLanguage} from "@/src/context/LanguageContext";

const LanguageSelector: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                >
                    <Globe className="h-5 w-5" />
                    <span>{t('language')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => setLanguage('tr')}
                    className={language === 'tr' ? 'bg-indigo-100 dark:bg-indigo-900/20' : ''}
                >
                    {t('language.turkish')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-indigo-100 dark:bg-indigo-900/20' : ''}
                >
                    {t('language.english')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSelector;