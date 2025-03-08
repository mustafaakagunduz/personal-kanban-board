import React from 'react';
import { Reward } from '../../types';
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Gift } from 'lucide-react';
import { taskCardClass } from "../KanbanBoard3/styles";
import { cn } from "@/lib/utils";

interface RewardCardProps {
    reward: Reward;
    totalPoints: number;
    onUseReward: (points: number) => void;
    onEditReward: (reward: Reward) => void;
    onDeleteReward: (id: string) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({
                                                   reward,
                                                   totalPoints,
                                                   onUseReward,
                                                   onEditReward,
                                                   onDeleteReward
                                               }) => {
    // Varsayılan renk değeri (indigo-900)
    const defaultColor = "#4c1d95";

    // Düzenleme ve silme butonlarını oluşturan yardımcı işlev
    const renderActionButtons = () => {
        return (
            <div className="absolute right-2 top-2 flex space-x-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white h-6 w-6 p-0 hover:bg-white/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditReward(reward);
                    }}
                >
                    <Edit className="h-3 w-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white h-6 w-6 p-0 hover:bg-white/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteReward(reward.id);
                    }}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        );
    };

    return (
        <div
            className={cn(taskCardClass, "border-0 overflow-hidden")}
            style={{ backgroundColor: reward.color || defaultColor }}
        >
            <div className="cursor-pointer py-3 px-3 relative h-full min-h-[80px] flex flex-col">
                {renderActionButtons()}

                <div className="flex flex-col justify-between h-full">
                    <Typography variant="h5" className="font-bold text-white mb-2">
                        {reward.title}
                    </Typography>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center">
                            <Gift className="h-4 w-4 text-white/90 mr-1" />
                            <Typography className="text-white text-xs font-semibold">
                                {reward.points} Puan
                            </Typography>
                        </div>

                        <Button
                            size="sm"
                            variant={totalPoints >= reward.points ? "secondary" : "ghost"}
                            disabled={totalPoints < reward.points}
                            onClick={() => onUseReward(reward.points)}
                            className={cn(
                                "h-6 px-2 text-xs font-medium",
                                totalPoints < reward.points && "border border-white/30 text-white/50"
                            )}
                        >
                            Kullan
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardCard;