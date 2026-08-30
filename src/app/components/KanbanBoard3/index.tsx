// /src/app/components/KanbanBoard3/index.tsx
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
    Info,
    Calendar,
    Palette,
    ClipboardList,
    HelpCircle,
    CheckSquare,
    Settings,
    LogOut,
    X
} from 'lucide-react';
import HelpDialog from '../Dialogs/HelpDialog';
import BoardSelector from '../BoardSelector';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Column from '../Column';
import NewTaskDialog from '../Dialogs/NewTaskDialog';
import ProgressDialog from '../Dialogs/ProgressDialog';
import TaskEditDialog from '../Dialogs/TaskEditDialog';
import CelebrationDialog from '../Dialogs/CelebrationDialog';
import TaskDetails from '../TaskDetails';
import DeleteConfirmationDialog from '../Dialogs/DeleteConfirmationDialog';
import DailyQuote from "@/src/app/components/DailyQuote/DailyQuote";
import { formatDate, getTodayStart } from '../../utils/dateUtils';
import CalendarDialog from '../Dialogs/CalendarDialog';
import ColorPickerDialog from "@/src/app/components/Dialogs/ColorPickerDialog";
import AddProgressStepDialog from '../Dialogs/AddProgressStepDialog';
import Spinner from '../Spinner';
import { Typography } from "@/components/ui/typography";
import PrivacyDialog from '../Dialogs/PrivacyDialog';
import DailyToDoDialog from '../Dialogs/DailyToDoDialog';
import LanguageSelector from '@/src/app/components/LanguageSelector/LanguageSelector';
import { useLanguage } from '../../../context/LanguageContext';
import TaskCompletionDialog from '../Dialogs/TaskCompletionDialog';
import {
    Task,
    Columns,
    SelectedTask,
    NewTaskForm,
    ProgressDetails,
    ColumnData,
    Board,
    Assignee,
    CompanyColors
} from '../../types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const apiFetch = (url: string, body?: unknown, method = "PATCH") =>
    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

const STATUS_TO_COLUMN: Record<string, string> = {
    TODO: 'todo',
    IN_PROGRESS: 'inProgress',
    DONE: 'done',
};

const COLUMN_TO_STATUS: Record<string, string> = {
    todo: 'TODO',
    inProgress: 'IN_PROGRESS',
    done: 'DONE',
};

interface TaskRow extends Task {
    status: keyof typeof STATUS_TO_COLUMN;
}

const KanbanBoard3: React.FC = () => {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN';

    // Boards
    const { data: boards } = useSWR<Board[]>('/api/boards', fetcher);
    const [activeBoard, setActiveBoard] = useState<string>('');

    useEffect(() => {
        if (!activeBoard && boards && boards.length > 0) {
            setActiveBoard(boards[0].id);
        }
    }, [boards, activeBoard]);

    const activeBoardData = boards?.find(b => b.id === activeBoard) || null;

    // Global company-wide board background colors
    const { data: companyColors } = useSWR<CompanyColors>('/api/company', fetcher);

    // Tasks for the active board
    const tasksKey = activeBoard ? `/api/boards/${activeBoard}/tasks` : null;
    const { data: tasksData } = useSWR<TaskRow[]>(tasksKey, fetcher);
    const mutateTasks = () => tasksKey && mutate(tasksKey);

    // Company members (for assignment)
    const { data: users } = useSWR<Assignee[]>('/api/users', fetcher);

    const columns: Columns = useMemo(() => {
        const groups: Columns = {
            todo: { title: t('column.todo'), items: [] },
            inProgress: { title: t('column.inProgress'), items: [] },
            done: { title: t('column.done'), items: [] },
        };

        (tasksData || []).forEach((row) => {
            const columnId = STATUS_TO_COLUMN[row.status];
            if (!columnId) return;
            groups[columnId].items.push(row);
        });

        return groups;
    }, [tasksData, t]);

    const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

    const filteredColumns: Columns = useMemo(() => {
        if (assigneeFilter === 'all') return columns;

        const filtered: Columns = {};
        Object.entries(columns).forEach(([columnId, column]) => {
            filtered[columnId] = {
                ...column,
                items: column.items.filter((task) => task.assigneeId === assigneeFilter),
            };
        });
        return filtered;
    }, [columns, assigneeFilter]);

    // Task completion confirmation
    const [completionConfirmDialog, setCompletionConfirmDialog] = useState<boolean>(false);
    const [taskToComplete, setTaskToComplete] = useState<{ task: Task, sourceColumn: string, targetColumn: string } | null>(null);

    // UI state
    const [calendarDialogOpen, setCalendarDialogOpen] = useState<boolean>(false);
    const [infoDialogOpen, setInfoDialogOpen] = useState<boolean>(false);
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
    const [dailyToDoDialogOpen, setDailyToDoDialogOpen] = useState<boolean>(false);

    // State
    const [today, setToday] = useState<Date | null>(null);
    const [tasksWithDueDates, setTasksWithDueDates] = useState<Array<{ id: string, title: string, dueDate: string }>>([]);
    const [newTask, setNewTask] = useState<NewTaskForm>({
        title: '',
        description: '',
        color: '#800080'
    });
    const [helpDialogOpen, setHelpDialogOpen] = useState<boolean>(false);
    const [progressDetails, setProgressDetails] = useState<ProgressDetails>({
        notes: '', dueDate: ''
    });
    const [movingTask, setMovingTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
    const [selectedTaskDetails, setSelectedTaskDetails] = useState<SelectedTask | null>(null);

    const [editTitle, setEditTitle] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');

    // Dialog states
    const [newTaskOpenDialog, setNewTaskOpenDialog] = useState<boolean>(false);
    const [editDialog, setEditDialog] = useState<boolean>(false);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<boolean>(false);
    const [openProgressDialog, setOpenProgressDialog] = useState<boolean>(false);
    const [celebrationDialog, setCelebrationDialog] = useState<boolean>(false);
    const [taskDetailsDialog, setTaskDetailsDialog] = useState<boolean>(false);
    const [addStepDialogOpen, setAddStepDialogOpen] = useState<boolean>(false);
    const [taskForStep, setTaskForStep] = useState<Task | null>(null);

    // Loading state'leri - işlem sırasında butonlarda spinner göstermek için
    const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
    const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
    const [isDeletingTask, setIsDeletingTask] = useState<boolean>(false);
    const [isAddingStep, setIsAddingStep] = useState<boolean>(false);
    const [isSubmittingProgress, setIsSubmittingProgress] = useState<boolean>(false);
    const [isCompletingTask, setIsCompletingTask] = useState<boolean>(false);
    const [boardActionLoading, setBoardActionLoading] = useState<boolean>(false);

    // Initialize today's date
    useEffect(() => {
        setToday(getTodayStart());
    }, []);

    // Reset the assignee filter when switching boards
    useEffect(() => {
        setAssigneeFilter('all');
    }, [activeBoard]);

    // Track tasks with due dates
    useEffect(() => {
        const tasksWithDates: Array<{ id: string, title: string, dueDate: string }> = [];

        columns.inProgress.items.forEach(task => {
            if (task.dueDate) {
                tasksWithDates.push({
                    id: task.id,
                    title: task.title,
                    dueDate: task.dueDate
                });
            }
        });

        setTasksWithDueDates(tasksWithDates);
    }, [columns]);

    // Handler functions
    const handleTaskClick = (task: Task, columnId: string): void => {
        setSelectedTaskDetails({
            ...task,
            columnStatus: columns[columnId].title,
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

    const handleConfirmDeleteTask = async (): Promise<void> => {
        if (!selectedTask) return;
        setIsDeletingTask(true);
        try {
            await apiFetch(`/api/tasks/${selectedTask.id}`, undefined, "DELETE");
            mutateTasks();
            setDeleteConfirmDialog(false);
        } finally {
            setIsDeletingTask(false);
        }
    };

    // İlerleme notu artık ayrı bir alan değil, kartın ilerleme adımları listesine ekleniyor
    const addProgressStep = async (taskId: string, text: string): Promise<void> => {
        const trimmed = text.trim();
        if (!trimmed) return;
        await apiFetch(`/api/tasks/${taskId}/steps`, { text: trimmed }, "POST");
    };

    const handleEditSave = async (): Promise<void> => {
        if (!selectedTask || !editTitle.trim()) return;

        setIsSavingEdit(true);
        try {
            await apiFetch(`/api/tasks/${selectedTask.id}`, {
                title: editTitle,
                description: editDescription.trim(),
                color: selectedTask.color,
                assigneeId: selectedTask.assigneeId ?? null,
                dueDate: selectedTask.dueDate || null,
            });

            mutateTasks();
            setEditDialog(false);
            setSelectedTask(null);
            setEditTitle('');
            setEditDescription('');
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string, sourceColumn: string): void => {
        e.dataTransfer.setData('taskId', id);
        e.dataTransfer.setData('sourceColumn', sourceColumn);
    };

    const moveTask = async (taskId: string, targetColumn: string, extra: Record<string, unknown> = {}): Promise<void> => {
        await apiFetch(`/api/tasks/${taskId}`, {
            status: COLUMN_TO_STATUS[targetColumn],
            ...extra
        });
        mutateTasks();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumn: string): void => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn');

        if (sourceColumn === targetColumn) return;
        if (sourceColumn === 'done') return;

        const task = columns[sourceColumn].items.find(item => item.id === taskId);
        if (!task) return;

        setMovingTask(task);

        if (sourceColumn === 'todo' && targetColumn === 'inProgress') {
            setOpenProgressDialog(true);
        } else if (sourceColumn === 'inProgress' && targetColumn === 'done') {
            setTaskToComplete({ task, sourceColumn, targetColumn });
            setCompletionConfirmDialog(true);
        } else {
            moveTask(taskId, targetColumn);
        }
    };

    const handleCompletionConfirm = async (): Promise<void> => {
        if (!taskToComplete) return;
        setIsCompletingTask(true);
        try {
            await moveTask(taskToComplete.task.id, taskToComplete.targetColumn);
            setCompletionConfirmDialog(false);
            setCelebrationDialog(true);
        } finally {
            setIsCompletingTask(false);
        }
    };

    const handleAddStepClick = (task: Task): void => {
        setTaskForStep(task);
        setAddStepDialogOpen(true);
    };

    const handleSaveStep = async (text: string): Promise<void> => {
        if (!taskForStep) return;
        setIsAddingStep(true);
        try {
            await addProgressStep(taskForStep.id, text);
            mutateTasks();
            setAddStepDialogOpen(false);
            setTaskForStep(null);
        } finally {
            setIsAddingStep(false);
        }
    };

    const handleAddTask = async (): Promise<void> => {
        if (!newTask.title || !activeBoard) return;

        setIsAddingTask(true);
        try {
            await apiFetch(`/api/boards/${activeBoard}/tasks`, {
                title: newTask.title,
                description: newTask.description,
                color: newTask.color || "#800080",
                assigneeId: newTask.assigneeId || null,
            }, "POST");

            mutateTasks();

            setNewTask({
                title: '',
                description: '',
                color: '#800080'
            });
            setNewTaskOpenDialog(false);
        } finally {
            setIsAddingTask(false);
        }
    };

    const handleProgressSubmit = async (): Promise<void> => {
        if (!movingTask) return;

        setIsSubmittingProgress(true);
        try {
            await moveTask(movingTask.id, 'inProgress', {
                dueDate: progressDetails.dueDate || null,
                progress: 0
            });
            mutateTasks();
            setOpenProgressDialog(false);
            setProgressDetails({ notes: '', dueDate: '' });
        } finally {
            setIsSubmittingProgress(false);
        }
    };

    const handleCalendarDateSelect = (date: Date) => {
        const formattedDate = formatDate(date);

        setNewTask({
            ...newTask,
            description: `${formattedDate} 'e kadar..`,
        });

        setNewTaskOpenDialog(true);
    };

    // Board management
    const handleBoardChange = (boardId: string) => {
        setActiveBoard(boardId);
    };

    const handleCreateBoard = async (name: string) => {
        setBoardActionLoading(true);
        try {
            const res = await apiFetch('/api/boards', { name }, "POST");
            const board = await res.json();
            mutate('/api/boards');
            setActiveBoard(board.id);
        } finally {
            setBoardActionLoading(false);
        }
    };

    const handleDeleteBoard = async (boardId: string) => {
        if (!boards || boards.length <= 1) return;
        setBoardActionLoading(true);
        try {
            await apiFetch(`/api/boards/${boardId}`, undefined, "DELETE");
            if (activeBoard === boardId) {
                const remaining = boards.filter(b => b.id !== boardId);
                setActiveBoard(remaining[0]?.id || '');
            }
            mutate('/api/boards');
        } finally {
            setBoardActionLoading(false);
        }
    };

    const handleRenameBoard = async (boardId: string, newName: string) => {
        setBoardActionLoading(true);
        try {
            await apiFetch(`/api/boards/${boardId}`, { name: newName });
            mutate('/api/boards');
        } finally {
            setBoardActionLoading(false);
        }
    };

    const handleReorderBoards = async (reorderedBoards: Board[]) => {
        mutate('/api/boards', reorderedBoards, false);
        await apiFetch('/api/boards/reorder', { ids: reorderedBoards.map(b => b.id) }, "POST");
        mutate('/api/boards');
    };

    const updateBgColors = async (start: string, end: string) => {
        if (!companyColors) return;
        mutate('/api/company', { ...companyColors, bgColorStart: start, bgColorEnd: end }, false);
        await apiFetch('/api/company', { bgColorStart: start, bgColorEnd: end });
        mutate('/api/company');
    };

    if (!boards) {
        return (
            <div className="h-screen w-screen flex items-center justify-center gap-3 bg-[#171718]">
                <Spinner className="h-6 w-6 text-white" />
                <Typography variant="h5" className="text-white">{t('header.loading')}</Typography>
            </div>
        );
    }

    if (boards.length === 0) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-[#171718]">
                <Typography variant="h5" className="text-white">Henüz bir pano yok.</Typography>
                <Button onClick={() => handleCreateBoard('Panom')}>
                    İlk Panoyu Oluştur
                </Button>
            </div>
        );
    }

    if (!activeBoardData) {
        return (
            <div className="h-screen w-screen flex items-center justify-center gap-3 bg-[#171718]">
                <Spinner className="h-6 w-6 text-white" />
                <Typography variant="h5" className="text-white">{t('header.loading')}</Typography>
            </div>
        );
    }

    return (
        <div
            className="h-screen w-screen overflow-y-auto"
            style={{
                background: `linear-gradient(to bottom right, ${companyColors?.bgColorStart ?? '#171718'}, ${companyColors?.bgColorEnd ?? '#C0FF2D'})`
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

                                {/* <Button
                                    variant="outline"
                                    className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2"
                                    onClick={() => setDailyToDoDialogOpen(true)}
                                >
                                    <CheckSquare className="h-4 w-4 text-white"/>
                                    <Typography variant="h5" className="text-white">
                                        {t('header.dailyTodos')}
                                    </Typography>
                                </Button> */}
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4 text-white" />
                                <Typography variant="h5" className="text-white">
                                    {t('header.loading')}
                                </Typography>
                            </div>
                        )}
                    </div>

                    {session?.user?.companyName && (
                        <div className="flex items-center">
                            <Typography variant="h5" className="text-white font-semibold">
                                {session.user.companyName}
                            </Typography>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        <LanguageSelector />

                        {isAdmin && (
                            <Link href="/settings">
                                <Button
                                    variant="outline"
                                    className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                                >
                                    <Settings className="h-5 w-5"/>
                                    <span>Ayarlar</span>
                                </Button>
                            </Link>
                        )}

                        <Button
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                            onClick={() => setHelpDialogOpen(true)}
                        >
                            <HelpCircle className="h-5 w-5"/>
                            <span>{t('header.help')}</span>
                        </Button>

                        {/* <Button
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                            onClick={() => setInfoDialogOpen(true)}
                        >
                            <Info className="h-5 w-5"/>
                            <span>{t('header.privacy')}</span>
                        </Button> */}
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
                            className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                            onClick={() => signOut({ callbackUrl: '/login' })}
                        >
                            <LogOut className="h-5 w-5"/>
                            <span>Çıkış</span>
                        </Button>
                    </div>
                </div>

                {/* Board Selector */}
                <BoardSelector
                    boards={boards}
                    activeBoard={activeBoard}
                    onBoardChange={handleBoardChange}
                    onCreateBoard={handleCreateBoard}
                    onDeleteBoard={handleDeleteBoard}
                    onRenameBoard={handleRenameBoard}
                    onReorderBoards={handleReorderBoards}
                    loading={boardActionLoading}
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

                        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                            <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-sm border-0 rounded-lg text-white">
                                <SelectValue placeholder="Kişiye göre filtrele" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm Kişiler</SelectItem>
                                {(users || []).map((u) => (
                                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {assigneeFilter !== 'all' && (
                            <Button
                                variant="outline"
                                onClick={() => setAssigneeFilter('all')}
                                className="bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 text-white"
                            >
                                <X className="h-4 w-4"/>
                                Sıfırla
                            </Button>
                        )}
                    </div>

                    {/* Columns Container */}
                    <div className="flex gap-4 flex-1 min-h-0 relative">
                        {!tasksData ? (
                            <div className="w-full flex items-center justify-center py-24">
                                <Spinner className="h-8 w-8 text-white" />
                            </div>
                        ) : (
                            Object.entries(filteredColumns).map(([columnId, column]) => (
                                <Column
                                    key={columnId}
                                    columnId={columnId}
                                    column={column as ColumnData}
                                    onDrop={handleDrop}
                                    onDragStart={handleDragStart}
                                    onEditClick={handleEditTask}
                                    onDeleteClick={handleDeleteClick}
                                    onTaskClick={handleTaskClick}
                                    onAddStepClick={handleAddStepClick}
                                    today={today}
                                />
                            ))
                        )}
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
                    assignees={users || []}
                    loading={isAddingTask}
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
                    loading={isSubmittingProgress}
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
                    assignees={users || []}
                    loading={isSavingEdit}
                />

                <DeleteConfirmationDialog
                    open={deleteConfirmDialog}
                    onClose={() => setDeleteConfirmDialog(false)}
                    onConfirm={handleConfirmDeleteTask}
                    loading={isDeletingTask}
                />

                <CelebrationDialog
                    open={celebrationDialog}
                    onClose={() => setCelebrationDialog(false)}
                />

                <CalendarDialog
                    open={calendarDialogOpen}
                    onClose={() => setCalendarDialogOpen(false)}
                    selectedDate={today || undefined}
                    onSelectDate={handleCalendarDateSelect}
                    tasksWithDueDates={tasksWithDueDates}
                />

                <ColorPickerDialog
                    open={showColorPicker}
                    onClose={() => setShowColorPicker(false)}
                    startColor={companyColors?.bgColorStart ?? '#171718'}
                    endColor={companyColors?.bgColorEnd ?? '#C0FF2D'}
                    onStartColorChange={(color) => updateBgColors(color, companyColors?.bgColorEnd ?? '#C0FF2D')}
                    onEndColorChange={(color) => updateBgColors(companyColors?.bgColorStart ?? '#171718', color)}
                    onReset={() => {
                        updateBgColors("#171718", "#C0FF2D");
                    }}
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
                    loading={isCompletingTask}
                />

                <AddProgressStepDialog
                    open={addStepDialogOpen}
                    onClose={() => {
                        setAddStepDialogOpen(false);
                        setTaskForStep(null);
                    }}
                    onSave={handleSaveStep}
                    loading={isAddingStep}
                />
            </div>
        </div>
    );
};

export default KanbanBoard3;
