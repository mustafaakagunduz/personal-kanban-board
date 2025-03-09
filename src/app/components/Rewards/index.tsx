import React from 'react';
import { Reward } from '../../types';
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { kanbanColumnClass, columnHeaderClass } from "../KanbanBoard3/styles";
import RewardCard from "@/src/app/components/RewardCard/RewardCard";

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
            <div className="flex justify-center items-center mb-4">
                <Typography variant="h4" className={columnHeaderClass}>
                    🏆 Ödüller 🏆
                </Typography>
            </div>

            <div className="flex flex-col gap-2">
                {rewards.map(reward => (
                    <RewardCard
                        key={reward.id}
                        reward={reward}
                        totalPoints={totalPoints}
                        onUseReward={onUseReward}
                        onEditReward={onEditReward}
                        onDeleteReward={onDeleteReward}
                    />
                ))}


            </div>
        </div>
    );
};

export default Rewards;