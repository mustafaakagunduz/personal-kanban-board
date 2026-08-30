// /src/app/components/BoardSelector/index.tsx
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { PlusCircle, Trash2, Edit, Check, X, GripHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from '../../../context/LanguageContext';
import { Board } from '../../types';
import Spinner from '../Spinner';

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
    loading?: boolean;
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
    loading?: boolean;
    widthPx?: number;
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
                                                                 canDelete,
                                                                 loading = false,
                                                                 widthPx
                                                             }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: board.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(widthPx !== undefined && !isEditing ? { width: `${widthPx}px` } : {}),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            data-board-item="true"
            data-board-id={board.id}
            className={`flex items-center justify-between rounded-lg px-3 py-2 min-w-fit ${
                isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'
            }`}
        >
            <div className="flex items-center min-w-0">
                <div {...attributes} {...listeners} className="cursor-grab mr-1">
                    <GripHorizontal className="h-4 w-4 text-white" />
                </div>

                {!isEditing && (
                    <button
                        className="text-sm font-medium"
                        onClick={() => onBoardChange(board.id)}
                    >
                        {board.name}
                    </button>
                )}
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
                        disabled={loading}
                    >
                        {loading ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-white hover:bg-white/10"
                        onClick={() => setEditingBoard(null)}
                        disabled={loading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
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
                                                         onReorderBoards,
                                                         loading = false
                                                     }) => {
    const { t } = useLanguage();
    const [newBoardDialog, setNewBoardDialog] = useState(false);
    const [deleteBoardDialog, setDeleteBoardDialog] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
    const [newBoardName, setNewBoardName] = useState('');
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);
    const [editBoardName, setEditBoardName] = useState('');

    // Pano rozetlerinin bulundukları satırı boşluksuz dolduracak şekilde
    // genişliklerinin dinamik hesaplanması (tek panolu satırlar hariç)
    const boardRowRef = useRef<HTMLDivElement>(null);
    const naturalWidthsRef = useRef<Record<string, number>>({});
    const addButtonWidthRef = useRef<number>(0);
    const computedForKeyRef = useRef<string>('');
    const [stretchWidths, setStretchWidths] = useState<Record<string, number>>({});

    const boardsKey = boards.map(b => `${b.id}:${b.name}`).join('|');

    const computeRowWidths = useCallback(() => {
        const container = boardRowRef.current;
        if (!container) return;

        const natural = naturalWidthsRef.current;
        if (boards.some(b => natural[b.id] === undefined)) return;

        const computedStyle = window.getComputedStyle(container);
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
        const gap = parseFloat(computedStyle.columnGap || computedStyle.gap) || 0;
        const availableWidth = container.clientWidth - paddingLeft - paddingRight;
        const buttonWidth = addButtonWidthRef.current;

        const BUTTON_ID = '__add_board_button__';
        type RowItem = { id: string; width: number };
        const allItems: RowItem[] = [
            ...boards.map(b => ({ id: b.id, width: natural[b.id] })),
            { id: BUTTON_ID, width: buttonWidth },
        ];

        const rows: RowItem[][] = [];
        let currentRow: RowItem[] = [];
        let currentRowWidth = 0;

        allItems.forEach(item => {
            const additional = currentRow.length === 0 ? item.width : gap + item.width;
            if (currentRow.length > 0 && currentRowWidth + additional > availableWidth) {
                rows.push(currentRow);
                currentRow = [item];
                currentRowWidth = item.width;
            } else {
                currentRow.push(item);
                currentRowWidth += additional;
            }
        });
        if (currentRow.length > 0) rows.push(currentRow);

        const newWidths: Record<string, number> = {};
        rows.forEach(row => {
            const boardsInRow = row.filter(item => item.id !== BUTTON_ID);
            const buttonInRow = row.some(item => item.id === BUTTON_ID);

            if (boardsInRow.length > 1) {
                const targetBoardsTotal = availableWidth - (buttonInRow ? gap + buttonWidth : 0);
                const gapsAmongBoards = gap * (boardsInRow.length - 1);
                const targetContentWidth = Math.max(targetBoardsTotal - gapsAmongBoards, 0);
                const sumNatural = boardsInRow.reduce((sum, item) => sum + item.width, 0);

                boardsInRow.forEach(item => {
                    newWidths[item.id] = sumNatural > 0
                        ? (item.width / sumNatural) * targetContentWidth
                        : item.width;
                });
            } else {
                boardsInRow.forEach(item => {
                    newWidths[item.id] = item.width;
                });
            }
        });

        setStretchWidths(newWidths);
    }, [boards]);

    // Pano listesi (isim/sıra) değiştiğinde doğal genişlikleri yeniden ölçmek için sıfırla
    useLayoutEffect(() => {
        if (computedForKeyRef.current !== boardsKey) {
            setStretchWidths({});
        }
    }, [boardsKey]);

    // Doğal genişlikleri ölç ve satır genişliklerini hesapla
    useLayoutEffect(() => {
        if (computedForKeyRef.current === boardsKey) return;
        const container = boardRowRef.current;
        if (!container || Object.keys(stretchWidths).length > 0) return;

        container.querySelectorAll<HTMLElement>('[data-board-item]').forEach(el => {
            const id = el.getAttribute('data-board-id');
            if (id) naturalWidthsRef.current[id] = el.getBoundingClientRect().width;
        });
        const buttonEl = container.querySelector<HTMLElement>('[data-add-button]');
        if (buttonEl) addButtonWidthRef.current = buttonEl.getBoundingClientRect().width;

        computedForKeyRef.current = boardsKey;
        computeRowWidths();
    }, [boardsKey, stretchWidths, computeRowWidths]);

    // Konteyner boyutu değiştiğinde (pencere yeniden boyutlandırma vb.) yeniden hesapla
    useLayoutEffect(() => {
        const container = boardRowRef.current;
        if (!container) return;
        const observer = new ResizeObserver(() => computeRowWidths());
        observer.observe(container);
        return () => observer.disconnect();
    }, [computeRowWidths]);

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
            <div ref={boardRowRef} className="flex items-center flex-wrap gap-2 mb-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
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
                                loading={loading}
                                widthPx={stretchWidths[board.id]}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                <Button
                    variant="ghost"
                    data-add-button="true"
                    className="!h-10 !w-10 !p-0 bg-transparent text-green-500 hover:bg-transparent hover:text-green-600"
                    onClick={() => setNewBoardDialog(true)}
                    disabled={loading}
                >
                    <PlusCircle className="!h-8 !w-8" />
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
                        <Button variant="outline" onClick={() => setNewBoardDialog(false)} disabled={loading}>{t('button.cancel')}</Button>
                        <Button onClick={handleCreateBoard} disabled={loading}>
                            {loading && <Spinner className="mr-2" />}
                            {t('button.create')}
                        </Button>
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
                        <Button variant="outline" onClick={() => setDeleteBoardDialog(false)} disabled={loading}>{t('button.cancel')}</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={loading}>
                            {loading && <Spinner className="mr-2" />}
                            {t('button.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BoardSelector;