import React from 'react';
import { Reward } from '../../types';
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Gift } from 'lucide-react';
import { kanbanColumnClass, taskCardClass, columnHeaderClass } from "../KanbanBoard3/styles";
import { cn } from "@/lib/utils";

interface RewardsProps {
    rewards: Reward[];
    totalPoints: number;
    onAddClick: () => void;
    onUseReward: (points: number) => void;
    onEditReward: (reward: Reward) => void;
    onDeleteReward: (id: string) => void;
}

const Rewards: React.FC<RewardsProps> = ({
                                             rewards,
                                             totalPoints,
                                             onAddClick,
                                             onUseReward,
                                             onEditReward,
                                             onDeleteReward
                                         }) => {
    // Varsayılan renk değeri (indigo-900)
    const defaultColor = "#4c1d95";

    // Düzenleme ve silme butonlarını oluşturan yardımcı işlev
    const renderActionButtons = (reward: Reward) => {
        return (
            <div className="absolute right-2 top-2 flex space-x-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white h-6 w-6 p-0 hover:bg-white/10"
                    onClick={() => onEditReward(reward)}
                >
                    <Edit className="h-3 w-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white h-6 w-6 p-0 hover:bg-white/10"
                    onClick={() => onDeleteReward(reward.id)}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        );
    };

    return (
        <div className={kanbanColumnClass}>
            <div className="flex justify-center items-center mb-4">
                <Typography variant="h4" className={columnHeaderClass}>
                    Ödüller
                </Typography>
            </div>
            <div className="flex flex-col gap-2">
                {rewards.map(reward => (
                    <Card
                        key={reward.id}
                        className={cn(taskCardClass, "border-0 overflow-hidden")}
                        style={{ backgroundColor: reward.color || defaultColor }}
                    >
                        <div className="cursor-pointer py-3 px-3 relative h-full min-h-[80px] flex flex-col">
                            {renderActionButtons(reward)}

                            <div className="flex flex-col h-full justify-between">
                                <div className="mt-0 mb-1">
                                    <div
                                        className="font-bold text-white text-left pl-1"
                                        style={{
                                            fontSize: '1.5rem',
                                            lineHeight: '1.75rem',
                                            letterSpacing: '-0.02em',
                                            fontWeight: 700
                                        }}
                                    >
                                        {reward.title}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-0">
                                    <div className="flex items-center">
                                        <Gift className="h-4 w-4 text-white/90 mr-2 ml-1" />
                                        <div className="text-white font-semibold" style={{ fontSize: '0.875rem' }}>
                                            {reward.points} Puan
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant={totalPoints >= reward.points ? "secondary" : "ghost"}
                                        disabled={totalPoints < reward.points}
                                        onClick={() => onUseReward(reward.points)}
                                        className={cn(
                                            "h-9 px-4 text-base font-medium",
                                            totalPoints < reward.points && "border border-white/30 text-white/50"
                                        )}
                                        style={{
                                            fontSize: '0.95rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        Kullan
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Rewards;