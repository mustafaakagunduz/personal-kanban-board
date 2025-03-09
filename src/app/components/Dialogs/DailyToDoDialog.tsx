// src/components/Dialogs/DailyToDoDialog.tsx
"use client"

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import { Plus, Trash2, Calendar, Clock, Filter, ArrowUpDown } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatDate } from '../../utils/dateUtils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Tipleri tanımla
interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    priority?: 'low' | 'medium' | 'high';
}

interface DailyToDoDialogProps {
    open: boolean;
    onClose: () => void;
    date: Date | null;
}

const DailyToDoDialog: React.FC<DailyToDoDialogProps> = ({ open, onClose, date }) => {
    // State tanımları
    const [todos, setTodos] = useLocalStorage<TodoItem[]>('dailyTodos', []);
    const [newTodo, setNewTodo] = useState('');
    const [completedCount, setCompletedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [filterBy, setFilterBy] = useState<'all' | 'active' | 'completed'>('all');
    const [sortBy, setSortBy] = useState<'created' | 'priority'>('created');
    const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');

    // İstatistikleri güncelle
    useEffect(() => {
        setTotalCount(todos.length);
        setCompletedCount(todos.filter(todo => todo.completed).length);
    }, [todos]);

    // Yeni görev ekle
    const handleAddTodo = () => {
        if (!newTodo.trim()) return;

        const newItem: TodoItem = {
            id: Math.random().toString(36).slice(2, 11),
            text: newTodo,
            completed: false,
            createdAt: new Date().toISOString(),
            priority: newTodoPriority,

        };

        setTodos([...todos, newItem]);
        setNewTodo('');
        // Varsayılan değerlere geri dön
        setNewTodoPriority('medium');

    };

    // Görev durumunu değiştir
    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    // Görevi sil
    const deleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    // Enter tuşu ile görev ekleme
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    // Filtreleme fonksiyonu
    const getFilteredTodos = () => {
        let filtered = [...todos];

        // Önce filtrele
        if (filterBy === 'active') {
            filtered = filtered.filter(todo => !todo.completed);
        } else if (filterBy === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        }

        // Sonra sırala
        if (sortBy === 'priority') {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            filtered.sort((a, b) => {
                const priorityA = a.priority ? priorityOrder[a.priority] : 4;
                const priorityB = b.priority ? priorityOrder[b.priority] : 4;
                return priorityA - priorityB;
            });
        } else {
            // Oluşturulma tarihine göre sırala (en yeni en üstte)
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return filtered;
    };

    // Öncelik rengini belirle
    const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-amber-500';
            case 'low': return 'text-green-600';
            default: return '';
        }
    };



    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>Bugün Yapacaklarım</span>
                        {date && <span className="text-sm text-muted-foreground ml-2">({formatDate(date)})</span>}
                    </DialogTitle>
                </DialogHeader>

                {/* Yeni görev ekleme formu */}
                <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Yeni görev ekle..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="flex-1"
                        />

                        {/* Öncelik seçici */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className={getPriorityColor(newTodoPriority)}>
                                                <ArrowUpDown className="h-4 w-4 mr-1" />
                                                Öncelik
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setNewTodoPriority('high')} className="text-red-600">
                                                Yüksek Öncelik
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setNewTodoPriority('medium')} className="text-amber-500">
                                                Orta Öncelik
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setNewTodoPriority('low')} className="text-green-600">
                                                Düşük Öncelik
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Öncelik Seç</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>



                        <Button onClick={handleAddTodo} size="sm">
                            <Plus className="h-4 w-4 mr-1" />

                        </Button>
                    </div>
                </div>

                {/* Filtre ve sıralama araçları */}
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">


                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-1" />
                                Sırala
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSortBy('created')}>
                                Oluşturma Tarihine Göre
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('priority')}>
                                Önceliğe Göre
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Görev listesi */}
                <div className="min-h-80 max-h-96 overflow-y-auto flex flex-col">
                    {todos.length === 0 ? (
                        <Typography className="text-center text-gray-500 py-16 my-auto">
                            Henüz görev eklenmedi.
                        </Typography>
                    ) : getFilteredTodos().length === 0 ? (
                        <Typography className="text-center text-gray-500 py-16 my-auto">
                            Seçilen filtrelere uygun görev bulunamadı.
                        </Typography>
                    ) : (
                        <ul className="space-y-2 flex-grow">
                            {getFilteredTodos().map((todo) => (
                                <li key={todo.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={todo.completed}
                                            onCheckedChange={() => toggleTodo(todo.id)}
                                            id={`todo-${todo.id}`}
                                        />
                                        <label
                                            htmlFor={`todo-${todo.id}`}
                                            className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : ''}`}
                                        >
                                                <span className={`${getPriorityColor(todo.priority)} font-medium`}>
                                                                    {todo.text}
                                                            </span>
                                        </label>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteTodo(todo.id)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <DialogFooter className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                        <div>{completedCount} / {totalCount} tamamlandı</div>

                    </div>
                    <Button onClick={onClose} variant="outline">
                        Kapat
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DailyToDoDialog;