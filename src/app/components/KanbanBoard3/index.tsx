// /src/app/components/KanbanBoard3/index.tsx
"use client"

import React, { useState, useEffect } from 'react';
import {
    Info,
    Calendar,
    Palette,
    Gift,
    ClipboardList,
    HelpCircle,
    CheckSquare,
    Globe
} from 'lucide-react';
import HelpDialog from '../Dialogs/HelpDialog';
import BoardSelector from '../BoardSelector';
import { Button } from "@/components/ui/button";
import Column from '../Column';
import Rewards from '../Rewards';
import NewTaskDialog from '../Dialogs/NewTaskDialog';
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
import PrivacyDialog from '../Dialogs/PrivacyDialog';
import DailyToDoDialog from '../Dialogs/DailyToDoDialog';
import LanguageSelector from '@/src/app/components/LanguageSelector/LanguageSelector';
import { useLanguage } from '../../../context/LanguageContext';
import TaskCompletionDialog from '../Dialogs/TaskCompletionDialog';
import {
    Task,
    Reward,
    Columns,
    SelectedTask,
    NewTaskForm,
    ProgressDetails,
    ColumnData,
    Board,
    KanbanState
} from '../../types';

// Use this function from dateUtils instead of defining it locally
import { getDateInFuture } from "../../utils/dateUtils";

const KanbanBoard3: React.FC = () => {
    // Dil hook'unu kullan
    const { t } = useLanguage();

    // Örnek görevler
    const sampleTasks = {
        todo: {
            title: t('column.todo'),
            items: [
                {
                    id: 'todo-1',
                    title: 'Haftalık raporu hazırla',
                    description: 'Pazartesi toplantısı için satış raporunu hazırla ve sunum dosyasını oluştur.',
                    points: 30,
                    color: '#6b21a8' // Mor
                },
                {
                    id: 'todo-2',
                    title: 'E-postaları yanıtla',
                    description: 'Müşterilerden gelen acil e-postaları yanıtla ve takip işlemlerini gerçekleştir.',
                    points: 15,
                    color: '#1f91dc' // Mavi
                },
                {
                    id: 'todo-3',
                    title: 'Proje planını güncelle',
                    description: 'Yeni isteklere göre proje planını güncelle ve takım üyelerine bilgi ver.',
                    points: 25,
                    color: '#008000' // Yeşil
                }
            ]
        },
        inProgress: {
            title: t('column.inProgress'),
            items: [
                {
                    id: 'progress-1',
                    title: 'Web sitesi tasarımı',
                    description: 'Ana sayfa ve ürün sayfaları için yeni tasarım öğelerini oluştur.',
                    points: 45,
                    duration: '3 gün',
                    notes: 'Mobil uyumluluk önemli',
                    dueDate: getDateInFuture(3),
                    color: '#ff7518' // Turuncu
                },
                {
                    id: 'progress-2',
                    title: 'API entegrasyonu',
                    description: 'Ödeme sistemini yeni API ile entegre et ve test senaryolarını çalıştır.',
                    points: 60,
                    duration: '5 gün',
                    notes: 'Dokümantasyon güncellenmeli',
                    dueDate: getDateInFuture(5),
                    color: '#ff0000' // Kırmızı
                },
                {
                    id: 'progress-3',
                    title: 'Müşteri araştırması',
                    description: 'Müşteri geri bildirimlerini analiz et ve iyileştirme önerileri hazırla.',
                    points: 35,
                    duration: '2 gün',
                    reward: '',
                    notes: 'Yönetim ekibine sunum yapılacak',
                    dueDate: getDateInFuture(2),
                    color: '#ffa500' // Sarı
                }
            ]
        },
        done: {
            title: t('column.done'),
            items: [
                {
                    id: 'done-1',
                    title: 'Bütçe planlaması',
                    description: 'Q2 için departman bütçesini hazırla ve onaya gönder.',
                    points: 40,
                    color: '#ff00ff' // Pembe
                },
                {
                    id: 'done-2',
                    title: 'Ekip toplantısı',
                    description: 'Haftalık ekip toplantısını düzenle ve notları paylaş.',
                    points: 20,
                    color: '#000000' // Siyah
                }
            ]
        }
    };

    // Default rewards
    const defaultRewards = [
        { id: '1', title: 'Latte', points: 35, color: '#6b21a8' },
        { id: '2', title: 'Sinema', points: 100, color: '#1f91dc' },
        { id: '3', title: 'Pizza', points: 75, color: '#008000' },
        { id: '4', title: 'Kitap', points: 50, color: '#ff7518' },
    ];

    // Multiple Kanban boards state
    const [kanbanState, setKanbanState] = useLocalStorage<KanbanState>('kanbanState', {
        activeBoard: 'default-board',
        boards: [
            {
                id: 'default-board',
                name: t('board.defaultName'),
                createdAt: new Date().toISOString()
            }
        ],
        boardsData: {
            'default-board': {
                columns: sampleTasks,
                rewards: defaultRewards,
                totalPoints: 150,
                bgColorStart: "#2D9596",
                bgColorEnd: "#265073"
            }
        }
    });

    // Get the active board's data
    const activeBoard = kanbanState.activeBoard;
    const activeBoardData = kanbanState.boardsData[activeBoard];

    // Helper functions to update board data
    const updateColumns = (newColumns: Columns) => {
        setKanbanState(prev => ({
            ...prev,
            boardsData: {
                ...prev.boardsData,
                [activeBoard]: {
                    ...prev.boardsData[activeBoard],
                    columns: newColumns
                }
            }
        }));
    };

    const updateRewards = (newRewards: Reward[]) => {
        setKanbanState(prev => ({
            ...prev,
            boardsData: {
                ...prev.boardsData,
                [activeBoard]: {
                    ...prev.boardsData[activeBoard],
                    rewards: newRewards
                }
            }
        }));
    };

    const updateTotalPoints = (newTotalPoints: number) => {
        setKanbanState(prev => ({
            ...prev,
            boardsData: {
                ...prev.boardsData,
                [activeBoard]: {
                    ...prev.boardsData[activeBoard],
                    totalPoints: newTotalPoints
                }
            }
        }));
    };

    const updateBgColors = (start: string, end: string) => {
        setKanbanState(prev => ({
            ...prev,
            boardsData: {
                ...prev.boardsData,
                [activeBoard]: {
                    ...prev.boardsData[activeBoard],
                    bgColorStart: start,
                    bgColorEnd: end
                }
            }
        }));
    };

    // Board management functions
    const handleBoardChange = (boardId: string) => {
        setKanbanState(prev => ({
            ...prev,
            activeBoard: boardId
        }));
    };

    const handleCreateBoard = (name: string) => {
        const newBoardId = `board-${Date.now()}`;

        setKanbanState(prev => ({
            ...prev,
            activeBoard: newBoardId,
            boards: [
                ...prev.boards,
                {
                    id: newBoardId,
                    name: name,
                    createdAt: new Date().toISOString()
                }
            ],
            boardsData: {
                ...prev.boardsData,
                [newBoardId]: {
                    columns: {
                        todo: { title: t('column.todo'), items: [] },
                        inProgress: { title: t('column.inProgress'), items: [] },
                        done: { title: t('column.done'), items: [] }
                    },
                    rewards: [],
                    totalPoints: 0,
                    bgColorStart: "#2D9596",
                    bgColorEnd: "#265073"
                }
            }
        }));
    };

    const handleDeleteBoard = (boardId: string) => {
        // Cannot delete the last board
        if (kanbanState.boards.length <= 1) return;

        setKanbanState(prev => {
            // Create new state without the deleted board
            const { [boardId]: removedBoard, ...remainingBoardsData } = prev.boardsData;

            // Find a new active board if needed
            let newActiveBoard = prev.activeBoard;
            if (newActiveBoard === boardId) {
                // Set the first available board as active
                newActiveBoard = Object.keys(remainingBoardsData)[0];
            }

            return {
                ...prev,
                activeBoard: newActiveBoard,
                boards: prev.boards.filter(board => board.id !== boardId),
                boardsData: remainingBoardsData
            };
        });
    };

    const handleRenameBoard = (boardId: string, newName: string) => {
        setKanbanState(prev => ({
            ...prev,
            boards: prev.boards.map(board =>
                board.id === boardId ? { ...board, name: newName } : board
            )
        }));
    };

    // Task completion confirmation
    const [completionConfirmDialog, setCompletionConfirmDialog] = useState<boolean>(false);
    const [taskToComplete, setTaskToComplete] = useState<{task: Task, sourceColumn: string, targetColumn: string} | null>(null);

    // UI state
    const [calendarDialogOpen, setCalendarDialogOpen] = useState<boolean>(false);
    const [infoDialogOpen, setInfoDialogOpen] = useState<boolean>(false);
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
    const [dailyToDoDialogOpen, setDailyToDoDialogOpen] = useState<boolean>(false);

    // State
    const [today, setToday] = useState<Date | null>(null);
    const [tasksWithDueDates, setTasksWithDueDates] = useState<Array<{id: string, title: string, dueDate: string}>>([]);
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
    const [newTaskOpenDialog, setNewTaskOpenDialog] = useState<boolean>(false);
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

    // Update column titles when language changes
    useEffect(() => {
        updateColumns({
            todo: {
                ...activeBoardData.columns.todo,
                title: t('column.todo')
            },
            inProgress: {
                ...activeBoardData.columns.inProgress,
                title: t('column.inProgress')
            },
            done: {
                ...activeBoardData.columns.done,
                title: t('column.done')
            }
        });
    }, [t, activeBoard]);

    // Track tasks with due dates
    useEffect(() => {
        const tasksWithDates: Array<{id: string, title: string, dueDate: string}> = [];

        if (activeBoardData.columns.inProgress && activeBoardData.columns.inProgress.items) {
            activeBoardData.columns.inProgress.items.forEach(task => {
                if (task.dueDate) {
                    tasksWithDates.push({
                        id: task.id,
                        title: task.title,
                        dueDate: task.dueDate
                    });
                }
            });
        }

        setTasksWithDueDates(tasksWithDates);
    }, [activeBoardData.columns]);

    // Handler functions
    const handleTaskClick = (task: Task, columnId: string): void => {
        setSelectedTaskDetails({
            ...task,
            columnStatus: activeBoardData.columns[columnId].title,
            columnId
        });
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
        updateRewards(activeBoardData.rewards.filter(reward => reward.id !== id));
    };

    const handleConfirmDeleteTask = (): void => {
        if (!selectedTask) return;

        const updatedColumns = {
            ...activeBoardData.columns,
            [selectedTask.columnId]: {
                ...activeBoardData.columns[selectedTask.columnId],
                items: activeBoardData.columns[selectedTask.columnId].items.filter(
                    item => item.id !== selectedTask.id
                )
            }
        };

        updateColumns(updatedColumns);
        setDeleteConfirmDialog(false);
    };

    const handleEditSave = (): void => {
        if (!selectedTask || !editTitle.trim()) return;

        const updatedTask = {
            ...selectedTask,
            title: editTitle,
            description: editDescription.trim()
        };

        const updatedColumns = {
            ...activeBoardData.columns,
            [selectedTask.columnId]: {
                ...activeBoardData.columns[selectedTask.columnId],
                items: activeBoardData.columns[selectedTask.columnId].items.map(
                    item => item.id === selectedTask.id ? updatedTask : item
                )
            }
        };

        updateColumns(updatedColumns);
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

        // Prevent moving from done to other columns
        if (sourceColumn === 'done') {
            return;
        }

        const task = activeBoardData.columns[sourceColumn].items.find(item => item.id === taskId);
        if (!task) return;

        setMovingTask(task);

        if (sourceColumn === 'todo' && targetColumn === 'inProgress') {
            setOpenProgressDialog(true);
        } else if (sourceColumn === 'inProgress' && targetColumn === 'done') {
            // Show confirmation dialog instead of immediately completing the task
            setTaskToComplete({task, sourceColumn, targetColumn});
            setCompletionConfirmDialog(true);
        } else {
            moveTask(sourceColumn, targetColumn, taskId);
        }
    };

    const handleCompletionConfirm = (): void => {
        if (!taskToComplete) return;

        setCompletionConfirmDialog(false);
        handleTaskCompletion(taskToComplete.task, taskToComplete.sourceColumn, taskToComplete.targetColumn);
    };

    const handleTaskCompletion = (task: Task, sourceColumn: string, targetColumn: string) => {
        const taskPoints = task.points || 0;
        if (taskPoints) {
            updateTotalPoints(activeBoardData.totalPoints + taskPoints);
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

        const updatedColumns = {
            ...activeBoardData.columns,
            todo: {
                ...activeBoardData.columns.todo,
                items: [...activeBoardData.columns.todo.items, task]
            }
        };

        updateColumns(updatedColumns);

        // Form verilerini sıfırla
        setNewTask({
            title: '',
            description: '',
            column: 'todo',
            points: '',
            color: '#800080' // Varsayılan rengi
        });
        setNewTaskOpenDialog(false);
    };

    const handleProgressSubmit = (): void => {
        if (!movingTask) return;

        moveTask('todo', 'inProgress', movingTask.id, progressDetails);
        setOpenProgressDialog(false);
        setProgressDetails({ duration: '', reward: '', notes: '', dueDate: '' });
    };

    const moveTask = (sourceColumn: string, targetColumn: string, taskId: string, additionalData: Partial<Task> = {}): void => {
        const task = activeBoardData.columns[sourceColumn].items.find(item => item.id === taskId);
        if (!task) return;

        const updatedTask = { ...task, ...additionalData };

        const updatedColumns = {
            ...activeBoardData.columns,
            [sourceColumn]: {
                ...activeBoardData.columns[sourceColumn],
                items: activeBoardData.columns[sourceColumn].items.filter(
                    item => item.id !== taskId
                )
            },
            [targetColumn]: {
                ...activeBoardData.columns[targetColumn],
                items: [...activeBoardData.columns[targetColumn].items, updatedTask]
            }
        };

        updateColumns(updatedColumns);
    };

    const handleAddReward = () => {
        if (!newReward.title || typeof newReward.points !== 'number') return;

        const reward: Reward = {
            id: Math.random().toString(36).slice(2, 11),
            title: newReward.title,
            points: newReward.points,
            color: newReward.color
        };

        updateRewards([...activeBoardData.rewards, reward]);
        setNewReward({ title: '', points: '', color: '' });
        setNewRewardDialog(false);
    };

    const handleEditRewardSave = () => {
        if (!editingReward || !newReward.title || typeof newReward.points !== 'number') return;

        const updatedRewards = activeBoardData.rewards.map(reward =>
            reward.id === editingReward.id
                ? {
                    ...reward,
                    title: newReward.title,
                    points: newReward.points as number,
                    color: newReward.color
                }
                : reward
        );

        updateRewards(updatedRewards);
        setEditRewardDialog(false);
        setEditingReward(null);
        setNewReward({ title: '', points: '', color: '' });
    };

    const handleCalendarDateSelect = (date: Date) => {
        const formattedDate = formatDate(date);

        setNewTask({
            ...newTask,
            description: `${formattedDate} 'e kadar..`,
            column: 'todo'
        });

        setNewTaskOpenDialog(true);
    };

    return (
        <div
            className="h-screen w-screen overflow-y-auto"
            style={{
                background: `linear-gradient(to bottom right, ${activeBoardData.bgColorStart}, ${activeBoardData.bgColorEnd})`
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
                                        {t('header.today')}: {formatDate(today)}
                                    </Typography>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2"
                                    onClick={() => setDailyToDoDialogOpen(true)}
                                >
                                    <CheckSquare className="h-4 w-4 text-white"/>
                                    <Typography variant="h5" className="text-white">
                                        {t('header.dailyTodos')}
                                    </Typography>
                                </Button>
                            </>
                        ) : (
                            <Typography variant="h5" className="text-white">
                                {t('header.loading')}
                            </Typography>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        <LanguageSelector />

                        <Button
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                            onClick={() => setHelpDialogOpen(true)}
                        >
                            <HelpCircle className="h-5 w-5"/>
                            <span>{t('header.help')}</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                            onClick={() => setInfoDialogOpen(true)}
                        >
                            <Info className="h-5 w-5"/>
                            <span>{t('header.privacy')}</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                            onClick={() => setShowColorPicker(true)}
                        >
                            <Palette className="h-5 w-5"/>
                            <span>{t('header.color')}</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2"
                        >
                            <Typography variant="h5" className="text-white">
                                {t('header.points')}: {activeBoardData.totalPoints}
                            </Typography>
                        </Button>
                    </div>
                </div>

                {/* Board Selector */}
                <BoardSelector
                    boards={kanbanState.boards}
                    activeBoard={activeBoard}
                    onBoardChange={handleBoardChange}
                    onCreateBoard={handleCreateBoard}
                    onDeleteBoard={handleDeleteBoard}
                    onRenameBoard={handleRenameBoard}
                    onReorderBoards={(reorderedBoards) => {
                        setKanbanState(prev => ({
                            ...prev,
                            boards: reorderedBoards
                        }));
                    }}
                />

                {/* Main Content Section */}
                <div className="flex flex-col gap-4 flex-1 mb-6 mt-4">
                    {/* Buttons Bar */}
                    <div className="mb-4 flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setNewTaskOpenDialog(true)}
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                        >
                            <ClipboardList className="mr-2 h-4 w-4"/>
                            {t('button.newTask')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setNewRewardDialog(true)}
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                        >
                            <Gift className="mr-2 h-4 w-4"/>
                            {t('button.newReward')}
                        </Button>
                    </div>

                    {/* Columns Container */}
                    <div className="flex gap-4 flex-1 min-h-0">
                        {Object.entries(activeBoardData.columns).map(([columnId, column]) => (
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
                            rewards={activeBoardData.rewards}
                            totalPoints={activeBoardData.totalPoints}
                            onAddClick={() => setNewRewardDialog(true)}
                            onUseReward={(points) => updateTotalPoints(activeBoardData.totalPoints - points)}
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
                <NewTaskDialog
                    open={newTaskOpenDialog}
                    onClose={() => setNewTaskOpenDialog(false)}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    onAddTask={handleAddTask}
                />

                <PrivacyDialog
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
                    onSelectDate={handleCalendarDateSelect}
                    tasksWithDueDates={tasksWithDueDates} // Son tarihi olan görevleri gönder
                />

                <ColorPickerDialog
                    open={showColorPicker}
                    onClose={() => setShowColorPicker(false)}
                    startColor={activeBoardData.bgColorStart}
                    endColor={activeBoardData.bgColorEnd}
                    onStartColorChange={(color) => updateBgColors(color, activeBoardData.bgColorEnd)}
                    onEndColorChange={(color) => updateBgColors(activeBoardData.bgColorStart, color)}
                    onReset={() => {
                        updateBgColors("#312e81", "#1e40af");
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

                <DailyToDoDialog
                    open={dailyToDoDialogOpen}
                    onClose={() => setDailyToDoDialogOpen(false)}
                    date={today}
                />

                <TaskCompletionDialog
                    open={completionConfirmDialog}
                    onClose={() => setCompletionConfirmDialog(false)}
                    onConfirm={handleCompletionConfirm}
                    taskTitle={taskToComplete?.task.title || ''}
                />
            </div>
        </div>
    );
};

export default KanbanBoard3;