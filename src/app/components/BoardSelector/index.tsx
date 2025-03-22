// /src/app/components/BoardSelector/index.tsx
import React, { useState } from 'react';
import { PlusCircle, Trash2, Edit, Check, X, GripHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from '../../../context/LanguageContext';
import { Board } from '../../types';

// DND Kit imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BoardSelectorProps {
    boards: Board[];
    activeBoard: string;
    onBoardChange: (boardId: string) => void;
    onCreateBoard: (name: string) => void;
    onDeleteBoard: (boardId: string) => void;
    onRenameBoard: (boardId: string, newName: string) => void;
    onReorderBoards?: (reorderedBoards: Board[]) => void;
}

// SortableBoardItem component
interface SortableBoardItemProps {
    board: Board;
    isActive: boolean;
    isEditing: boolean;
    editBoardName: string;
    setEditBoardName: (name: string) => void;
    onBoardChange: (boardId: string) => void;
    startEditing: (board: Board) => void;
    handleSaveEdit: (board: Board) => void;
    setEditingBoard: (board: Board | null) => void;
    handleDeleteClick: (board: Board) => void;
    canDelete: boolean;
}

// Sortable Board Item Component
const SortableBoardItem: React.FC<SortableBoardItemProps> = ({
                                                                 board,
                                                                 isActive,
                                                                 isEditing,
                                                                 editBoardName,
                                                                 setEditBoardName,
                                                                 onBoardChange,
                                                                 startEditing,
                                                                 handleSaveEdit,
                                                                 setEditingBoard,
                                                                 handleDeleteClick,
                                                                 canDelete
                                                             }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: board.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center rounded-lg px-3 py-2 min-w-fit ${
                isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'
            }`}
        >
            <div {...attributes} {...listeners} className="cursor-grab mr-1">
                <GripHorizontal className="h-4 w-4 text-white" />
            </div>

            {isEditing ? (
                <div className="flex items-center space-x-1">
                    <Input
                        value={editBoardName}
                        onChange={(e) => setEditBoardName(e.target.value)}
                        className="h-6 py-1 px-2 text-sm bg-white/20 border-0 text-white w-32"
                        autoFocus
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-white hover:bg-white/10"
                        onClick={() => handleSaveEdit(board)}
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-white hover:bg-white/10"
                        onClick={() => setEditingBoard(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <>
                    <button
                        className="text-sm font-medium mr-2"
                        onClick={() => onBoardChange(board.id)}
                    >
                        {board.name}
                    </button>

                    <div className="flex items-center space-x-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-white hover:bg-white/10"
                            onClick={() => startEditing(board)}
                        >
                            <Edit className="h-3 w-3" />
                        </Button>

                        {canDelete && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-white hover:bg-white/10"
                                onClick={() => handleDeleteClick(board)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

const BoardSelector: React.FC<BoardSelectorProps> = ({
                                                         boards,
                                                         activeBoard,
                                                         onBoardChange,
                                                         onCreateBoard,
                                                         onDeleteBoard,
                                                         onRenameBoard,
                                                         onReorderBoards
                                                     }) => {
    const { t } = useLanguage();
    const [newBoardDialog, setNewBoardDialog] = useState(false);
    const [deleteBoardDialog, setDeleteBoardDialog] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
    const [newBoardName, setNewBoardName] = useState('');
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);
    const [editBoardName, setEditBoardName] = useState('');

    // DnD Kit sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleCreateBoard = () => {
        if (newBoardName.trim()) {
            onCreateBoard(newBoardName.trim());
            setNewBoardName('');
            setNewBoardDialog(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (boardToDelete) {
            onDeleteBoard(boardToDelete.id);
            setDeleteBoardDialog(false);
            setBoardToDelete(null);
        }
    };

    const handleSaveEdit = (board: Board) => {
        if (editBoardName.trim() && editBoardName !== board.name) {
            onRenameBoard(board.id, editBoardName.trim());
        }
        setEditingBoard(null);
        setEditBoardName('');
    };

    const startEditing = (board: Board) => {
        setEditingBoard(board);
        setEditBoardName(board.name);
    };

    const handleDeleteClick = (board: Board) => {
        setBoardToDelete(board);
        setDeleteBoardDialog(true);
    };

    // Handle drag end event for reordering boards
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = boards.findIndex(board => board.id === active.id);
            const newIndex = boards.findIndex(board => board.id === over.id);

            if (onReorderBoards) {
                const reorderedBoards = arrayMove(boards, oldIndex, newIndex);
                onReorderBoards(reorderedBoards);
            }
        }
    };

    return (
        <>
            <div className="flex items-center space-x-2 mb-4 overflow-x-auto p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex space-x-2 flex-grow overflow-x-auto">
                        <SortableContext
                            items={boards.map(board => board.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            {boards.map(board => (
                                <SortableBoardItem
                                    key={board.id}
                                    board={board}
                                    isActive={board.id === activeBoard}
                                    isEditing={editingBoard?.id === board.id}
                                    editBoardName={editBoardName}
                                    setEditBoardName={setEditBoardName}
                                    onBoardChange={onBoardChange}
                                    startEditing={startEditing}
                                    handleSaveEdit={handleSaveEdit}
                                    setEditingBoard={setEditingBoard}
                                    handleDeleteClick={handleDeleteClick}
                                    canDelete={boards.length > 1}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </DndContext>

                <Button
                    variant="outline"
                    className="bg-white/10 border-0 text-white hover:bg-white/20 ml-auto flex-shrink-0"
                    onClick={() => setNewBoardDialog(true)}
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {t('board.new')}
                </Button>
            </div>

            {/* Create Board Dialog */}
            <Dialog open={newBoardDialog} onOpenChange={setNewBoardDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t('board.createNew')}</DialogTitle>
                        <DialogDescription>
                            {t('board.createDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                            placeholder={t('board.namePlaceholder')}
                            className="w-full"
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewBoardDialog(false)}>{t('button.cancel')}</Button>
                        <Button onClick={handleCreateBoard}>{t('button.create')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Board Dialog */}
            <Dialog open={deleteBoardDialog} onOpenChange={setDeleteBoardDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t('board.delete')}</DialogTitle>
                        <DialogDescription>
                            {t('board.deleteConfirm').replace('{boardName}', boardToDelete?.name || '')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteBoardDialog(false)}>{t('button.cancel')}</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>{t('button.delete')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BoardSelector;