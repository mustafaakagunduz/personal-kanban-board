// /src/app/components/ProgressSlider/ProgressSlider.tsx
import React, { useState, useEffect } from 'react';
import { Typography } from "@/components/ui/typography";
import { Task } from "@/src/app/types";
import { useLanguage } from "@/src/context/LanguageContext";
import { progressSliderClass } from "@/src/app/components/KanbanBoard3/styles";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from 'lucide-react';

interface ProgressSliderProps {
    task: Task;
    onProgressChange: (task: Task, progress: number) => void;
}

const ProgressSlider: React.FC<ProgressSliderProps> = ({ task, onProgressChange }) => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [hoverProgress, setHoverProgress] = useState<number | null>(null);

    // Mount animasyonu için useEffect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    const currentProgress = task.progress || 0;

    // Tüm sürükleme olaylarını durduran fonksiyonlar
    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Artırma ve azaltma işlemleri
    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newProgress = Math.min(100, currentProgress + 10);
        onProgressChange(task, newProgress);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newProgress = Math.max(0, currentProgress - 10);
        onProgressChange(task, newProgress);
    };

    // İlerleme çubuğuna tıklandığında
    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = Math.round((clickPosition / rect.width) * 100);

        onProgressChange(task, percentage);
    };

    // İlerleme çubuğu üzerinde hover
    const handleProgressBarHover = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const hoverPosition = e.clientX - rect.left;
        const percentage = Math.round((hoverPosition / rect.width) * 100);

        setHoverProgress(percentage);
    };

    // Bileşenin mount animasyonu için stil
    const animationStyle = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
    };

    return (
        <div
            className={progressSliderClass}
            style={animationStyle}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()}
            onDragStart={handleDragStart}
        >
            <div className="flex items-center justify-between mb-1">
                <Typography className="text-white text-xs font-medium">
                    {t('taskCard.progressStatus')}
                </Typography>
                <Typography className="text-white text-xs">
                    {hoverProgress !== null ? `${hoverProgress}%` : `${currentProgress}%`}
                </Typography>
            </div>

            <div className="flex items-center space-x-2">
                {/* Azaltma butonu */}
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 rounded-full bg-white/10 border-0 text-white hover:bg-white/20 p-0"
                    onClick={handleDecrement}
                    disabled={currentProgress <= 0}
                >
                    <Minus className="h-3 w-3" />
                </Button>

                {/* İlerleme çubuğu */}
                <div
                    className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer relative"
                    onClick={handleProgressBarClick}
                    onMouseMove={handleProgressBarHover}
                    onMouseLeave={() => setHoverProgress(null)}
                >
                    {/* Gerçek ilerleme */}
                    <div
                        className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-200"
                        style={{ width: `${currentProgress}%` }}
                    />

                    {/* Hover göstergesi */}
                    {hoverProgress !== null && (
                        <div
                            className="absolute top-0 left-0 h-full bg-white/50 rounded-full pointer-events-none"
                            style={{ width: `${hoverProgress}%` }}
                        />
                    )}
                </div>

                {/* Artırma butonu */}
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 rounded-full bg-white/10 border-0 text-white hover:bg-white/20 p-0"
                    onClick={handleIncrement}
                    disabled={currentProgress >= 100}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
};

export default ProgressSlider;