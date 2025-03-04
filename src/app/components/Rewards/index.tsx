import React from 'react';
import { Reward } from '../../types';
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
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
    return (
        <div className={kanbanColumnClass}>
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h4" className={columnHeaderClass}>
                    Ödüller
                </Typography>
                {/* Buton KanbanBoard3'e taşındığı için burada kaldırıldı */}
            </div>
            <div className="flex flex-col gap-2">
                {rewards.map(reward => (
                    <Card key={reward.id} className={cn("border-0", taskCardClass)}>
                        <CardContent className="py-2 px-3 relative">
                            <div className="flex justify-between items-center">
                                <div>
                                    <Typography className="text-white font-medium">{reward.title}</Typography>
                                    <Typography className="text-white text-xs">{reward.points} Puan</Typography>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        disabled={totalPoints < reward.points}
                                        onClick={() => onUseReward(reward.points)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        Kullan
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-white h-6 w-6 p-0 hover:bg-white/10"
                                        onClick={() => onEditReward(reward)}
                                    >
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-white h-6 w-6 p-0 hover:bg-white/10"
                                        onClick={() => onDeleteReward(reward.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Rewards;