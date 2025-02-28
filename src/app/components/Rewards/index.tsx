// /src/components/Rewards/index.tsx
import React from 'react';
import { Reward } from '../../types';
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { kanbanColumnClass } from "../KanbanBoard3/styles";
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
                <Typography variant="h4" className="text-primary-800 font-bold">
                    Ödüller
                </Typography>
                <Button
                    variant="default"
                    size="sm"
                    onClick={onAddClick}
                >
                    Yeni Ödül
                </Button>
            </div>
            <div className="flex flex-col gap-2">
                {rewards.map(reward => (
                    <Card key={reward.id} className="bg-primary">
                        <CardContent className="py-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <Typography className="text-white font-medium">{reward.title}</Typography>
                                    <Typography className="text-white">{reward.points} Puan</Typography>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        disabled={totalPoints < reward.points}
                                        onClick={() => onUseReward(reward.points)}
                                    >
                                        Kullan
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-white h-8 w-8"
                                        onClick={() => onEditReward(reward)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-white h-8 w-8"
                                        onClick={() => onDeleteReward(reward.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
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