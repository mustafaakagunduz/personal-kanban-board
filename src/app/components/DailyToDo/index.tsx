// src/components/DailyToDo/index.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Plus,
    Trash2,
    CheckSquare,
    ArrowUpDown,
    Filter,
    Clock,
    Calendar
} from 'lucide-react';
import { Typography } from "@/components/ui/typography";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatDate } from '../../utils/dateUtils';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import DailyToDoDialog from '../Dialogs/DailyToDoDialog';

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    priority?: 'low' | 'medium' | 'high';
    timeEstimate?: number; // dakika cinsinden
}

interface DailyToDoProps {
    date: Date | null;
    variant?: 'button' | 'card' | 'inline';
    className?: string;
    maxItems?: number;
}

const DailyToDo: React.FC<DailyToDoProps> = ({
                                                 date,
                                                 variant = 'button',
                                                 className = '',
                                                 maxItems = 5
                                             }) => {
    const [open, setOpen] = useState(false);
    const [todos, setTodos] = useLocalStorage<TodoItem[]>('dailyTodos', []);
    const [activeTodos, setActiveTodos] = useState<TodoItem[]>([]);
    const [completedCount, setCompletedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        // Aktif (tamamlanmamış) görevleri filtrele ve saat sınırına göre kes
        const filtered = todos
            .filter(todo => !todo.completed)
            .sort((a, b) => {
                // Önce önceliğe göre sırala
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                const priorityA = a.priority ? priorityOrder[a.priority] : 3;
                const priorityB = b.priority ? priorityOrder[b.priority] : 3;

                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }

                // Aynı öncelikte olanları oluşturma tarihine göre sırala
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .slice(0, maxItems);

        setActiveTodos(filtered);
        setTotalCount(todos.length);
        setCompletedCount(todos.filter(todo => todo.completed).length);
    }, [todos, maxItems]);

    // Öncelik rengini belirle
    const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-amber-500';
            case 'low': return 'text-green-600';
            default: return '';
        }
    };

    // Görev durumunu değiştir
    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    // Toplam tahmini süreyi hesapla
    const getTotalTimeEstimate = () => {
        return activeTodos.reduce((total, todo) => total + (todo.timeEstimate || 0), 0);
    };

    // Button variant render
    if (variant === 'button') {
        return (
            <>
                <Button
                    variant="outline"
                    className={`bg-white/10 backdrop-blur-sm border-0 rounded-lg hover:bg-white/20 flex items-center gap-2 ${className}`}
                    onClick={() => setOpen(true)}
                >
                    <CheckSquare className="h-4 w-4 text-white"/>
                    <Typography variant="h5" className="text-white">
                        Bugün Yapacaklarım
                    </Typography>
                </Button>

                <DailyToDoDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    date={date}
                />
            </>
        );
    }

    // Card variant render
    if (variant === 'card') {
        return (
            <>
                <Card className={`w-full ${className}`}>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <CheckSquare className="h-5 w-5" />
                                Bugün Yapacaklarım
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setOpen(true)}
                                className="text-blue-600"
                            >
                                Tümünü Gör
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeTodos.length === 0 ? (
                            <Typography className="text-center text-gray-500 py-4">
                                Henüz görev eklenmedi.
                            </Typography>
                        ) : (
                            <ul className="space-y-2">
                                {activeTodos.map((todo) => (
                                    <li key={todo.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={todo.completed}
                                                onCheckedChange={() => toggleTodo(todo.id)}
                                                id={`todo-card-${todo.id}`}
                                            />
                                            <label
                                                htmlFor={`todo-card-${todo.id}`}
                                                className="cursor-pointer"
                                            >
                        <span className={`${getPriorityColor(todo.priority)} font-medium`}>
                          {todo.text}
                        </span>
                                                {todo.timeEstimate && (
                                                    <span className="ml-2 text-xs text-gray-500">
                            ({todo.timeEstimate} dk)
                          </span>
                                                )}
                                            </label>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between text-sm text-muted-foreground">
                        <div>{completedCount} / {totalCount} tamamlandı</div>
                        {activeTodos.length > 0 && (
                            <div>Tahmini süre: {getTotalTimeEstimate()} dk</div>
                        )}
                    </CardFooter>
                </Card>

                <DailyToDoDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    date={date}
                />
            </>
        );
    }

    // Inline variant render
    return (
        <>
            <div className={`w-full ${className}`}>
                <div className="flex justify-between items-center mb-2">
                    <Typography variant="h6" className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Bugün Yapacaklarım
                    </Typography>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        Düzenle
                    </Button>
                </div>

                {activeTodos.length === 0 ? (
                    <Typography className="text-center text-gray-500 py-2 text-sm">
                        Görev eklenmedi.
                    </Typography>
                ) : (
                    <ul className="space-y-1">
                        {activeTodos.map((todo) => (
                            <li key={todo.id} className="flex items-center text-sm">
                                <span className="mr-2">•</span>
                                <span className={`${getPriorityColor(todo.priority)}`}>
                  {todo.text}
                </span>
                                {todo.timeEstimate && (
                                    <span className="ml-2 text-xs text-gray-500">
                    ({todo.timeEstimate} dk)
                  </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                    <span>{completedCount} / {totalCount} tamamlandı</span>
                    {activeTodos.length > 0 && (
                        <span>Toplam: {getTotalTimeEstimate()} dk</span>
                    )}
                </div>
            </div>

            <DailyToDoDialog
                open={open}
                onClose={() => setOpen(false)}
                date={date}
            />
        </>
    );
}

export default DailyToDo;