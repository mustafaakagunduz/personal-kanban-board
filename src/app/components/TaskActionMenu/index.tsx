// /src/components/TaskActionMenu/index.tsx
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2 } from 'lucide-react';
import { SelectedTask } from '../../types';

interface TaskActionMenuProps {
    open: boolean;
    menuPosition: { x: number, y: number } | null;
    selectedTask: SelectedTask | null;
    onOpenChange: (open: boolean) => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
    actionType?: 'edit' | 'delete' | null;
}

const TaskActionMenu: React.FC<TaskActionMenuProps> = ({
                                                           open,
                                                           menuPosition,
                                                           selectedTask,
                                                           onOpenChange,
                                                           onEditClick,
                                                           onDeleteClick,
                                                           actionType
                                                       }) => {
    // If we have an actionType specified, automatically trigger the corresponding action
    React.useEffect(() => {
        if (open && actionType) {
            if (actionType === 'edit') {
                onEditClick();
                onOpenChange(false);
            } else if (actionType === 'delete') {
                onDeleteClick();
                onOpenChange(false);
            }
        }
    }, [open, actionType, onEditClick, onDeleteClick, onOpenChange]);

    if (!selectedTask || !menuPosition) return null;

    // If a specific action type is passed, don't show the menu
    if (actionType) {
        return (
            <DropdownMenu open={false}>
                <DropdownMenuTrigger asChild>
                    <span className="hidden" />
                </DropdownMenuTrigger>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                <span className="hidden" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="z-50"
                align="start"
                style={{
                    position: 'fixed',
                    top: `${menuPosition.y}px`,
                    left: `${menuPosition.x}px`
                }}
            >
                <DropdownMenuItem className="flex items-center gap-2" onClick={onEditClick}>
                    <Edit className="h-4 w-4" />
                    Düzenle
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-destructive" onClick={onDeleteClick}>
                    <Trash2 className="h-4 w-4" />
                    Sil
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default TaskActionMenu;