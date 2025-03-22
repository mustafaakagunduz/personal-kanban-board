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
import {
    Task,
    Reward,
    Columns,
    SelectedTask,
    NewTaskForm,
    ProgressDetails,
    ColumnData
} from '../../types';

// Use this function from dateUtils instead of defining it locally
// Import it at the top with your other imports
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

    // Local storage hooks - Yeni projeler için örnek veriler, varsa localStorage'dan alır
    const [columns, setColumns] = useLocalStorage<Columns>('kanbanData', sampleTasks);

    const [rewards, setRewards] = useLocalStorage<Reward[]>('rewards', [
        { id: '1', title: 'Latte', points: 35, color: '#6b21a8' },
        { id: '2', title: 'Sinema', points: 100, color: '#1f91dc' },
        { id: '3', title: 'Pizza', points: 75, color: '#008000' },
        { id: '4', title: 'Kitap', points: 50, color: '#ff7518' },
    ]);

    const [totalPoints, setTotalPoints] = useLocalStorage<number>('totalPoints', 150); // Başlangıçta biraz puan
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
    // Görevlerin son tarihlerini izleme
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

    // Dil değiştiğinde kolonların başlıklarını güncelle
    useEffect(() => {
        setColumns(prev => ({
            todo: {
                ...prev.todo,
                title: t('column.todo')
            },
            inProgress: {
                ...prev.inProgress,
                title: t('column.inProgress')
            },
            done: {
                ...prev.done,
                title: t('column.done')
            }
        }));
    }, [t]);

    // Son tarihi olan görevleri izle
    useEffect(() => {
        // Tüm kolonlardaki görevleri kontrol et
        const tasksWithDates: Array<{id: string, title: string, dueDate: string}> = [];

        // Özellikle 'inProgress' kolonundaki görevlere odaklan
        if (columns.inProgress && columns.inProgress.items) {
            columns.inProgress.items.forEach(task => {
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
    }, [columns]);

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
        setNewTaskOpenDialog(false);
    };

    const handleProgressSubmit = (): void => {
        if (!movingTask) return;
        // progressDetails içindeki dueDate'i ekliyoruz
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
        setNewTaskOpenDialog(true);
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
                        {/* Language Selector Bileşeni */}
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
                                {t('header.points')}: {totalPoints}
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