// /src/components/KanbanBoard/index.tsx
"use client"

import React, { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Column from '../Column';
import Rewards from '../Rewards';
import TaskDialog from '../Dialogs/TaskDialog';
import ProgressDialog from '../Dialogs/ProgressDialog';
import TaskEditDialog from '../Dialogs/TaskEditDialog';
import CelebrationDialog from '../Dialogs/CelebrationDialog';
import TaskDetails from '../TaskDetails';
import RewardDialog from '../Dialogs/RewardDialog';
import { formatDate, getTodayStart } from '../../utils/dateUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import CalendarDialog from '../Dialogs/CalendarDialog';
import { Calendar } from 'lucide-react';
import {
    Task,
    Reward,
    Columns,
    SelectedTask,
    NewTaskForm,
    ProgressDetails
} from '../../types';
import { Typography } from "@/components/ui/typography";
import { Palette } from 'lucide-react';
import ColorPickerDialog from "@/app/components/Dialogs/ColorPickerDialog";

const KanbanBoard3: React.FC = () => {
    // Local storage hooks
    const [columns, setColumns] = useLocalStorage<Columns>('kanbanData', {
        todo: { title: 'Yapılacaklar', items: [] },
        inProgress: { title: 'Devam Edenler', items: [] },
        done: { title: 'Tamamlananlar', items: [] }
    });

    const [rewards, setRewards] = useLocalStorage<Reward[]>('rewards', [
        { id: '1', title: 'Netflix Premium (1 Ay)', points: 100 },
        { id: '2', title: '2 Saat Extra Mola', points: 50 },
        { id: '3', title: 'Erken Çıkış Hakkı', points: 75 },
    ]);

    const [totalPoints, setTotalPoints] = useLocalStorage<number>('totalPoints', 0);
    const [calendarDialogOpen, setCalendarDialogOpen] = useState<boolean>(false);

    //colors:
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [bgColorStart, setBgColorStart] = useLocalStorage<string>("bgColorStart", "indigo-900");
    const [bgColorEnd, setBgColorEnd] = useLocalStorage<string>("bgColorEnd", "blue-800");

    // State
    const [today, setToday] = useState<Date | null>(null);
    const [newTask, setNewTask] = useState<NewTaskForm>({ title: '', description: '', column: '', points: '' });
    const [newReward, setNewReward] = useState<{ title: string, points: number | '' }>({ title: '', points: '' });
    const [progressDetails, setProgressDetails] = useState<ProgressDetails>({
        duration: '', reward: '', notes: '', dueDate: ''
    });
    // KanbanBoard3/index.tsx dosyasında
    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
    const [movingTask, setMovingTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
    const [selectedTaskDetails, setSelectedTaskDetails] = useState<SelectedTask | null>(null);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);
    const [currentReward, setCurrentReward] = useState<string>('');
    const [editTitle, setEditTitle] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    // Dialog states
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editDialog, setEditDialog] = useState<boolean>(false);
    const [newRewardDialog, setNewRewardDialog] = useState<boolean>(false);
    const [editRewardDialog, setEditRewardDialog] = useState<boolean>(false);
    const [openProgressDialog, setOpenProgressDialog] = useState<boolean>(false);
    const [rewardDialog, setRewardDialog] = useState<boolean>(false);
    const [taskDetailsDialog, setTaskDetailsDialog] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Initialize today's date
    useEffect(() => {
        setToday(getTodayStart());
    }, []);

    // Handler functions
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task, columnId: string): void => {
        event.stopPropagation();
        setSelectedTask({ ...task, columnId });
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setMenuOpen(true);
    };

    const handleTaskClick = (task: Task, columnId: string): void => {
        setSelectedTaskDetails({ ...task, columnStatus: columns[columnId].title, columnId });
        setTaskDetailsDialog(true);
    };

    const handleEditReward = (reward: Reward) => {
        setEditingReward(reward);
        setNewReward({ title: reward.title, points: reward.points });
        setEditRewardDialog(true);
    };

    const handleDeleteReward = (id: string) => {
        setRewards(prev => prev.filter(reward => reward.id !== id));
    };

    const handleDeleteTask = (): void => {
        if (!selectedTask) return;
        setColumns(prev => ({
            ...prev,
            [selectedTask.columnId]: {
                ...prev[selectedTask.columnId],
                items: prev[selectedTask.columnId].items.filter(item => item.id !== selectedTask.id)
            }
        }));
        setMenuOpen(false);
    };

    const handleEditClick = (): void => {
        if (!selectedTask) return;

        setEditTitle(selectedTask.title);
        setEditDescription(selectedTask.description || '');
        setEditDialog(true);
        setMenuOpen(false);
    };

    const handleEditSave = (): void => {
        if (!selectedTask || !editTitle.trim()) return;

        const updatedTask = {
            ...selectedTask,
            title: editTitle,
            description: editDescription.trim()
        };

        setColumns(prev => ({
            ...prev,
            [selectedTask.columnId]: {
                ...prev[selectedTask.columnId],
                items: prev[selectedTask.columnId].items.map(item =>
                    item.id === selectedTask.id ? updatedTask : item
                )
            }
        }));

        setEditDialog(false);
        setSelectedTask(null);
        setEditTitle('');
        setEditDescription('');
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string, sourceColumn: string): void => {
        e.dataTransfer.setData('taskId', id);
        e.dataTransfer.setData('sourceColumn', sourceColumn);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumn: string): void => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn');

        if (sourceColumn === targetColumn) return;

        const task = columns[sourceColumn].items.find(item => item.id === taskId);
        if (!task) return;

        setMovingTask(task);

        if (sourceColumn === 'todo' && targetColumn === 'inProgress') {
            setOpenProgressDialog(true);
        } else if (sourceColumn === 'inProgress' && targetColumn === 'done') {
            handleTaskCompletion(task, sourceColumn, targetColumn);
        } else {
            moveTask(sourceColumn, targetColumn, taskId);
        }
    };

    const handleTaskCompletion = (task: Task, sourceColumn: string, targetColumn: string) => {
        if (task.points) {
            setTotalPoints(prev => prev + task.points!);
        }
        setCurrentReward(task.reward || '');
        setRewardDialog(true);
        moveTask(sourceColumn, targetColumn, task.id, { reward: task.reward });
    };

    const handleAddTask = (): void => {
        if (!newTask.title || !newTask.column) return;

        const task: Task = {
            id: Math.random().toString(36).slice(2, 11),
            title: newTask.title,
            description: newTask.description,
            points: typeof newTask.points === 'number' ? newTask.points : 0
        };

        setColumns(prev => ({
            ...prev,
            [newTask.column]: {
                ...prev[newTask.column],
                items: [...prev[newTask.column].items, task]
            }
        }));

        setNewTask({ title: '', description: '', column: '', points: '' });
        setOpenDialog(false);
    };

    const handleProgressSubmit = (): void => {
        if (!movingTask) return;
        moveTask('todo', 'inProgress', movingTask.id, progressDetails);
        setOpenProgressDialog(false);
        setProgressDetails({ duration: '', reward: '', notes: '', dueDate: '' });
    };

    const moveTask = (sourceColumn: string, targetColumn: string, taskId: string, additionalData: Partial<Task> = {}): void => {
        const task = columns[sourceColumn].items.find(item => item.id === taskId);
        if (!task) return;

        const updatedTask = { ...task, ...additionalData };

        setColumns(prev => ({
            ...prev,
            [sourceColumn]: {
                ...prev[sourceColumn],
                items: prev[sourceColumn].items.filter(item => item.id !== taskId)
            },
            [targetColumn]: {
                ...prev[targetColumn],
                items: [...prev[targetColumn].items, updatedTask]
            }
        }));
    };

    const handleAddReward = () => {
        if (!newReward.title || typeof newReward.points !== 'number') return;

        const reward: Reward = {
            id: Math.random().toString(36).slice(2, 11),
            title: newReward.title,
            points: newReward.points
        };

        setRewards(prev => [...prev, reward]);
        setNewReward({ title: '', points: '' });
        setNewRewardDialog(false);
    };

    const handleEditRewardSave = () => {
        if (!editingReward || !newReward.title || typeof newReward.points !== 'number') return;

        setRewards(prev => prev.map(reward =>
            reward.id === editingReward.id
                ? { ...reward, title: newReward.title, points: newReward.points as number }
                : reward
        ));

        setEditRewardDialog(false);
        setEditingReward(null);
        setNewReward({ title: '', points: '' });
    };

    return (
        <div
            className="h-screen w-screen overflow-hidden"
            style={{
                background: `linear-gradient(to bottom right, ${bgColorStart}, ${bgColorEnd})`
            }}
        >
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between mb-6">
                    <div className="flex items-center">
                        {today ? (
                            <Button
                                variant="outline"
                                className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2"
                                onClick={() => setCalendarDialogOpen(true)}
                            >
                                <Calendar className="h-4 w-4 text-white"/>
                                <Typography variant="h5" className="text-white">
                                    Bugün: {formatDate(today)}
                                </Typography>
                            </Button>
                        ) : (
                            <Typography variant="h5" className="text-white">
                                Yükleniyor...
                            </Typography>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            className="text-white flex items-center gap-2"
                            onClick={() => setShowColorPicker(true)}
                        >
                            <Palette className="h-5 w-5"/>
                            <span>Kanban Rengini Seç</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2"

                        >

                            <Typography variant="h5" className="text-white">
                                Puanım: {totalPoints}
                            </Typography>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 h-full">
                    <div className="mb-4">
                        <Button
                            variant="secondary"
                            onClick={() => setOpenDialog(true)}
                            className="bg-white text-indigo-900 hover:bg-gray-100"
                        >
                            <Plus className="mr-2 h-4 w-4"/>
                            Yeni Görev
                        </Button>
                    </div>

                    <div className="flex gap-4 h-full overflow-auto">
                        {Object.entries(columns).map(([columnId, column]) => (
                            <Column
                                key={columnId}
                                columnId={columnId}
                                column={column}
                                onDrop={handleDrop}
                                onDragStart={handleDragStart}
                                onMenuOpen={handleMenuOpen}
                                onTaskClick={handleTaskClick}
                                today={today}
                            />
                        ))}

                        <Rewards
                            rewards={rewards}
                            totalPoints={totalPoints}
                            onAddClick={() => setNewRewardDialog(true)}
                            onUseReward={(points) => setTotalPoints(prev => prev - points)}
                            onEditReward={handleEditReward}
                            onDeleteReward={handleDeleteReward}
                        />
                    </div>
                </div>

                {/* Dropdown Menu for task actions */}
                {selectedTask && menuPosition && (
                    <DropdownMenu open={menuOpen} onOpenChange={(open) => {
                        setMenuOpen(open);
                        if (!open) setMenuPosition(null);
                    }}>
                        <DropdownMenuTrigger asChild>
                            <span className="hidden"/>
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
                            <DropdownMenuItem onClick={handleEditClick}>
                                Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDeleteTask}>
                                Sil
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {/* Dialogs */}
                <TaskDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    columns={Object.entries(columns).map(([id, column]) => ({id, title: column.title}))}
                    onAddTask={handleAddTask}
                />

                <ProgressDialog
                    open={openProgressDialog}
                    onClose={() => setOpenProgressDialog(false)}
                    task={movingTask}
                    progressDetails={progressDetails}
                    setProgressDetails={setProgressDetails}
                    onSubmit={handleProgressSubmit}
                    today={today}
                />

                <TaskEditDialog
                    open={editDialog}
                    onClose={() => setEditDialog(false)}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    editDescription={editDescription}
                    setEditDescription={setEditDescription}
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask}
                    onSave={handleEditSave}
                />

                <CelebrationDialog
                    open={rewardDialog}
                    onClose={() => setRewardDialog(false)}
                    rewardTitle={currentReward}
                />

                <RewardDialog
                    open={newRewardDialog}
                    onClose={() => setNewRewardDialog(false)}
                    reward={newReward}
                    setReward={setNewReward}
                    onSave={handleAddReward}
                    isEditing={false}
                />


                <CalendarDialog
                    open={calendarDialogOpen}
                    onClose={() => setCalendarDialogOpen(false)}
                    selectedDate={today || undefined}
                />

                <ColorPickerDialog
                    open={showColorPicker}
                    onClose={() => setShowColorPicker(false)}
                    startColor={bgColorStart}
                    endColor={bgColorEnd}
                    onStartColorChange={setBgColorStart}
                    onEndColorChange={setBgColorEnd}
                    onReset={() => {
                        setBgColorStart("#312e81");
                        setBgColorEnd("#1e40af");
                    }}
                />

                <RewardDialog
                    open={editRewardDialog}
                    onClose={() => {
                        setEditRewardDialog(false);
                        setEditingReward(null);
                        setNewReward({title: '', points: ''});
                    }}
                    reward={newReward}
                    setReward={setNewReward}
                    onSave={handleEditRewardSave}
                    isEditing={true}
                />

                <TaskDetails
                    open={taskDetailsDialog}
                    onClose={() => setTaskDetailsDialog(false)}
                    task={selectedTaskDetails}
                />


            </div>
        </div>
    );
};

export default KanbanBoard3;