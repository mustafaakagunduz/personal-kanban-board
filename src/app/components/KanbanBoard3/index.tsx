// /src/components/KanbanBoard/index.tsx
"use client"

import React, { useState, useEffect } from 'react';
import {
    Info,
    Calendar,
    Palette,
    Gift,
    ClipboardList,
    HelpCircle,
    CheckSquare
} from 'lucide-react';
import HelpDialog from '../Dialogs/HelpDialog';
import { Button } from "@/components/ui/button";
import Column from '../Column';
import Rewards from '../Rewards';
import TaskDialog from '../Dialogs/TaskDialog';
import ProgressDialog from '../Dialogs/ProgressDialog';
import TaskEditDialog from '../Dialogs/TaskEditDialog';
import CelebrationDialog from '../Dialogs/CelebrationDialog';
import TaskDetails from '../TaskDetails';
import RewardDialog from '../Dialogs/RewardDialog';
import DeleteConfirmationDialog from '../Dialogs/DeleteConfirmationDialog';
import DailyQuote from "@/src/app/components/DailyQuote/DailyQuote";
import { formatDate, getTodayStart } from '../../utils/dateUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import CalendarDialog from '../Dialogs/CalendarDialog';
import ColorPickerDialog from "@/src/app/components/Dialogs/ColorPickerDialog";
import { Typography } from "@/components/ui/typography";
import InfoDialog from '../Dialogs/InfoDialog';
import DailyToDoDialog from '../Dialogs/DailyToDoDialog';
import {
    Task,
    Reward,
    Columns,
    SelectedTask,
    NewTaskForm,
    ProgressDetails,
    ColumnData
} from '../../types';

const KanbanBoard3: React.FC = () => {
    // Local storage hooks
    const [columns, setColumns] = useLocalStorage<Columns>('kanbanData', {
        todo: { title: 'Yapılacaklar', items: [] },
        inProgress: { title: 'Devam Edenler', items: [] },
        done: { title: 'Tamamlananlar', items: [] }
    });

    const [rewards, setRewards] = useLocalStorage<Reward[]>('rewards', [
        { id: '1', title: 'Latte', points: 35 },
        { id: '2', title: 'Sinema', points: 100 },
        { id: '3', title: 'Pizza', points: 75 },
    ]);

    const [totalPoints, setTotalPoints] = useLocalStorage<number>('totalPoints', 0);
    const [calendarDialogOpen, setCalendarDialogOpen] = useState<boolean>(false);
    const [infoDialogOpen, setInfoDialogOpen] = useState<boolean>(false);
    //colors:
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [bgColorStart, setBgColorStart] = useLocalStorage<string>("bgColorStart", "#2D9596"); // Güzel bir yeşil-turkuaz
    const [bgColorEnd, setBgColorEnd] = useLocalStorage<string>("bgColorEnd", "#265073"); // Koyu mavi

    // Yeni eklenen state - DailyToDo için
    const [dailyToDoDialogOpen, setDailyToDoDialogOpen] = useState<boolean>(false);

    // State
    const [today, setToday] = useState<Date | null>(null);
    const [newTask, setNewTask] = useState<NewTaskForm>({
        title: '',
        description: '',
        column: 'todo',
        points: '',
        color: '#800080' // Varsayılan mor renk
    });
    const [newReward, setNewReward] = useState<{ title: string, points: number | '', color?: string }>({
        title: '',
        points: '',
        color: '#4c1d95' // Varsayılan renk
    });
    const [helpDialogOpen, setHelpDialogOpen] = useState<boolean>(false);
    const [progressDetails, setProgressDetails] = useState<ProgressDetails>({
        duration: '', reward: '', notes: '', dueDate: ''
    });
    const [movingTask, setMovingTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
    const [selectedTaskDetails, setSelectedTaskDetails] = useState<SelectedTask | null>(null);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);
    const [currentReward, setCurrentReward] = useState<string>('');
    const [completedTaskPoints, setCompletedTaskPoints] = useState<number>(0);

    const [editTitle, setEditTitle] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');

    // Dialog states
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editDialog, setEditDialog] = useState<boolean>(false);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<boolean>(false);
    const [newRewardDialog, setNewRewardDialog] = useState<boolean>(false);
    const [editRewardDialog, setEditRewardDialog] = useState<boolean>(false);
    const [openProgressDialog, setOpenProgressDialog] = useState<boolean>(false);
    const [rewardDialog, setRewardDialog] = useState<boolean>(false);
    const [taskDetailsDialog, setTaskDetailsDialog] = useState<boolean>(false);

    // Initialize today's date
    useEffect(() => {
        setToday(getTodayStart());
    }, []);

    // Handler functions
    const handleTaskClick = (task: Task, columnId: string): void => {
        setSelectedTaskDetails({ ...task, columnStatus: columns[columnId].title, columnId });
        setTaskDetailsDialog(true);
    };

    const handleEditTask = (task: Task, columnId: string): void => {
        setSelectedTask({ ...task, columnId });
        setEditTitle(task.title);
        setEditDescription(task.description || '');
        setEditDialog(true);
    };

    const handleDeleteClick = (task: Task, columnId: string): void => {
        setSelectedTask({ ...task, columnId });
        setDeleteConfirmDialog(true);
    };

    const handleEditReward = (reward: Reward) => {
        setEditingReward(reward);
        setNewReward({
            title: reward.title,
            points: reward.points,
            color: reward.color
        });
        setEditRewardDialog(true);
    };

    const handleDeleteReward = (id: string) => {
        setRewards(prev => prev.filter(reward => reward.id !== id));
    };

    const handleConfirmDeleteTask = (): void => {
        if (!selectedTask) return;
        setColumns(prev => ({
            ...prev,
            [selectedTask.columnId]: {
                ...prev[selectedTask.columnId],
                items: prev[selectedTask.columnId].items.filter(item => item.id !== selectedTask.id)
            }
        }));
        setDeleteConfirmDialog(false);
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
        const taskPoints = task.points || 0;
        if (taskPoints) {
            setTotalPoints(prev => prev + taskPoints);
        }
        setCurrentReward(task.reward || '');
        setCompletedTaskPoints(taskPoints);
        setRewardDialog(true);
        moveTask(sourceColumn, targetColumn, task.id, { reward: task.reward });
    };

    const handleAddTask = (): void => {
        if (!newTask.title) return;

        const task: Task = {
            id: Math.random().toString(36).slice(2, 11),
            title: newTask.title,
            description: newTask.description,
            points: typeof newTask.points === 'number' ? newTask.points : 0,
            color: newTask.color || "#800080" // Varsayılan renk
        };

        setColumns(prev => ({
            ...prev,
            todo: {
                ...prev.todo,
                items: [...prev.todo.items, task]
            }
        }));

        // Form verilerini sıfırla
        setNewTask({
            title: '',
            description: '',
            column: 'todo',
            points: '',
            color: '#800080' // Varsayılan rengi ekledik
        });
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
            points: newReward.points,
            color: newReward.color
        };

        setRewards(prev => [...prev, reward]);
        setNewReward({ title: '', points: '', color: '' });
        setNewRewardDialog(false);
    };

    const handleEditRewardSave = () => {
        if (!editingReward || !newReward.title || typeof newReward.points !== 'number') return;

        setRewards(prev => prev.map(reward =>
            reward.id === editingReward.id
                ? {
                    ...reward,
                    title: newReward.title,
                    points: newReward.points as number,
                    color: newReward.color
                }
                : reward
        ));

        setEditRewardDialog(false);
        setEditingReward(null);
        setNewReward({ title: '', points: '', color: '' });
    };

    // New function to handle date selection from calendar
    const handleCalendarDateSelect = (date: Date) => {
        // Format the date for the description
        const formattedDate = formatDate(date);

        // Pre-fill the task form with the selected date in the description
        setNewTask({
            ...newTask,
            description: `${formattedDate} 'e kadar..`,
            column: 'todo'
        });

        // Open the task dialog
        setOpenDialog(true);
    };

    return (
        <div
            className="h-screen w-screen overflow-y-auto"
            style={{
                background: `linear-gradient(to bottom right, ${bgColorStart}, ${bgColorEnd})`
            }}
        >
            <div className="p-6 flex flex-col min-h-screen">
                {/* Header Section - Fixed at top */}
                <div className="flex justify-between mb-6">
                    <div className="flex items-center gap-2">
                        {today ? (
                            <>
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

                                {/* Yeni buton: Bugün Yapacaklarım */}
                                <Button
                                    variant="outline"
                                    className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2"
                                    onClick={() => setDailyToDoDialogOpen(true)}
                                >
                                    <CheckSquare className="h-4 w-4 text-white"/>
                                    <Typography variant="h5" className="text-white">
                                        Bugün Yapacaklarım
                                    </Typography>
                                </Button>
                            </>
                        ) : (
                            <Typography variant="h5" className="text-white">
                                Yükleniyor...
                            </Typography>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                            onClick={() => setHelpDialogOpen(true)}
                        >
                            <HelpCircle className="h-5 w-5"/>
                            <span>Yardım</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                            onClick={() => setInfoDialogOpen(true)}
                        >
                            <Info className="h-5 w-5"/>
                            <span>Gizlilik</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
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

                {/* Main Content Section */}
                <div className="flex flex-col gap-4 flex-1 mb-6">
                    {/* Buttons Bar */}
                    <div className="mb-4 flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(true)}
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                        >
                            <ClipboardList className="mr-2 h-4 w-4"/>
                            Yeni Görev
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setNewRewardDialog(true)}
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                        >
                            <Gift className="mr-2 h-4 w-4"/>
                            Yeni Ödül
                        </Button>
                    </div>

                    {/* Columns Container - Columns içeren div */}
                    <div className="flex gap-4 flex-1 min-h-0">
                        {Object.entries(columns).map(([columnId, column]) => (
                            <Column
                                key={columnId}
                                columnId={columnId}
                                column={column as ColumnData}
                                onDrop={handleDrop}
                                onDragStart={handleDragStart}
                                onEditClick={handleEditTask}
                                onDeleteClick={handleDeleteClick}
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

                {/* Footer Section - Quote */}
                <div className="mt-auto pb-4">
                    {today && <DailyQuote date={today} />}
                </div>

                {/* Dialogs */}
                <HelpDialog
                    open={helpDialogOpen}
                    onClose={() => setHelpDialogOpen(false)}
                />
                <TaskDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    onAddTask={handleAddTask}
                />

                <InfoDialog
                    open={infoDialogOpen}
                    onClose={() => setInfoDialogOpen(false)}
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

                <DeleteConfirmationDialog
                    open={deleteConfirmDialog}
                    onClose={() => setDeleteConfirmDialog(false)}
                    onConfirm={handleConfirmDeleteTask}
                />

                <CelebrationDialog
                    open={rewardDialog}
                    onClose={() => setRewardDialog(false)}
                    rewardTitle={currentReward}
                    points={completedTaskPoints}
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
                    onSelectDate={handleCalendarDateSelect} // Add the new prop here
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
                        setNewReward({title: '', points: '', color: ''});
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

                {/* Yeni Dialog: Bugün Yapacaklarım */}
                <DailyToDoDialog
                    open={dailyToDoDialogOpen}
                    onClose={() => setDailyToDoDialogOpen(false)}
                    date={today}
                />
            </div>
        </div>
    );
};

export default KanbanBoard3;