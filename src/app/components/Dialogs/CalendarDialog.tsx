import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, safeParseDate } from '../../utils/dateUtils';

interface TaskWithDueDate {
    id: string;
    title: string;
    dueDate: string;
}

interface CalendarDialogProps {
    open: boolean;
    onClose: () => void;
    selectedDate?: Date;
    onSelectDate?: (date: Date) => void;
    tasksWithDueDates?: TaskWithDueDate[];
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({
                                                           open,
                                                           onClose,
                                                           selectedDate,
                                                           onSelectDate,
                                                           tasksWithDueDates = []
                                                       }) => {
    // Log tasks with due dates for debugging
    useEffect(() => {
        if (tasksWithDueDates.length > 0) {
            console.log('Tasks with due dates:', tasksWithDueDates);
        }
    }, [tasksWithDueDates]);

    // Use selectedDate or current date as the default
    const [currentDate, setCurrentDate] = useState(() => {
        return selectedDate ? new Date(selectedDate) : new Date();
    });

    // Takvim görünümü için gerekli tarih bilgilerini hesapla
    const [year, setYear] = useState<number>(currentDate.getFullYear());
    const [month, setMonth] = useState<number>(currentDate.getMonth());

    // Geçmiş tarih tooltipini kontrol etmek için state
    const [pastDateTooltip, setPastDateTooltip] = useState<{day: number, month: number, year: number} | null>(null);

    // Ay değişikliğinde year ve month değerlerini güncelle
    useEffect(() => {
        setYear(currentDate.getFullYear());
        setMonth(currentDate.getMonth());
    }, [currentDate]);

    // Türkçe ay isimleri
    const turkishMonths = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];

    // Turkish day abbreviations
    const dayAbbreviations = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

    // Bir önceki aya git
    const goToPreviousMonth = () => {
        const prevMonth = new Date(year, month - 1, 1);
        setCurrentDate(prevMonth);
    };

    // Bir sonraki aya git
    const goToNextMonth = () => {
        const nextMonth = new Date(year, month + 1, 1);
        setCurrentDate(nextMonth);
    };

    // Ayın ilk gününün haftanın hangi günü olduğunu bul (0: Pazar, 1: Pazartesi, ...)
    // Türkçe takvimde Pazartesi ilk gün olduğu için indeks uyarlanmalı
    const getFirstDayOfMonth = () => {
        const firstDay = new Date(year, month, 1).getDay();
        // Pazar (0) → 6, Pazartesi (1) → 0, Salı (2) → 1, ...
        return firstDay === 0 ? 6 : firstDay - 1;
    };

    // Ayın kaç gün olduğunu hesapla
    const getDaysInMonth = () => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Bir önceki ayın son birkaç gününü hesapla
    const getPreviousMonthDays = () => {
        const firstDayIndex = getFirstDayOfMonth();
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        const prevMonthDays = [];
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            prevMonthDays.push(prevMonthLastDay - i);
        }

        return prevMonthDays;
    };

    // Mevcut ayın günlerini hesapla
    const getCurrentMonthDays = () => {
        const daysInMonth = getDaysInMonth();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    // Bir sonraki ayın ilk birkaç gününü hesapla
    const getNextMonthDays = () => {
        const firstDayIndex = getFirstDayOfMonth();
        const daysInMonth = getDaysInMonth();
        const totalCells = 42; // 6 satır x 7 gün

        const nextMonthDays = [];
        const remainingCells = totalCells - (firstDayIndex + daysInMonth);

        for (let i = 1; i <= remainingCells; i++) {
            nextMonthDays.push(i);
        }

        return nextMonthDays;
    };

    // Takvim günlerini oluştur
    const prevMonthDays = getPreviousMonthDays();
    const currentMonthDays = getCurrentMonthDays();
    const nextMonthDays = getNextMonthDays();

    // Tüm takvim günlerini birleştir
    const calendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

    // Seçili günü kontrol et
    const isSelectedDay = (day: number, monthOffset: number) => {
        if (!selectedDate) return false;

        const checkDate = new Date(selectedDate);
        return (
            day === checkDate.getDate() &&
            month + monthOffset === checkDate.getMonth() &&
            year === checkDate.getFullYear()
        );
    };

    // Bugün mü kontrol et
    const isTodayCheck = (day: number, monthOffset: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            month + monthOffset === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    // A day has tasks function - improved version
    const getTasksForDay = (day: number, monthOffset: number) => {
        if (!tasksWithDueDates || tasksWithDueDates.length === 0) return [];

        // Create a date for this calendar cell
        const calendarCellDate = new Date(year, month + monthOffset, day);

        // Filter tasks for this date, comparing only the calendar day (ignoring time)
        return tasksWithDueDates.filter(task => {
            try {
                // Parse the task's due date
                const taskDueDate = safeParseDate(task.dueDate);

                // Skip invalid dates
                if (!taskDueDate) return false;

                // Compare only year, month, and day
                return (
                    taskDueDate.getDate() === calendarCellDate.getDate() &&
                    taskDueDate.getMonth() === calendarCellDate.getMonth() &&
                    taskDueDate.getFullYear() === calendarCellDate.getFullYear()
                );
            } catch (error) {
                console.error(`Error checking task due date for "${task.title}":`, error);
                return false;
            }
        });
    };

    // Handle day click - new function
    const handleDayClick = (day: number, monthOffset: number) => {
        // Seçilen gün için tarih nesnesi oluştur
        const selectedDay = new Date(year, month + monthOffset, day);

        // Bugünün başlangıcı için tarih nesnesi oluştur
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Seçilen gün bugünden önceyse (geçmiş bir tarihse) tooltip'i göster
        if (selectedDay < todayStart) {
            // Tooltip'i göster
            setPastDateTooltip({day, month: month + monthOffset, year});

            // 3 saniye sonra tooltip'i gizle
            setTimeout(() => {
                setPastDateTooltip(null);
            }, 1500);

            return; // İşlemi sonlandır
        }

        // Call the callback if provided
        if (onSelectDate) {
            onSelectDate(selectedDay);
        }

        // Close the dialog
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-xl p-0 max-h-[90vh] overflow-auto">
                <DialogHeader className="border-b p-6 relative">
                    <DialogTitle className="text-center text-2xl font-medium">Takvim</DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <button
                            className="rounded-full p-2 hover:bg-gray-100"
                            onClick={goToPreviousMonth}
                        >
                            <ChevronLeft size={24}/>
                        </button>
                        <h2 className="text-xl font-medium">{turkishMonths[month]} {year}</h2>
                        <button
                            className="rounded-full p-2 hover:bg-gray-100"
                            onClick={goToNextMonth}
                        >
                            <ChevronRight size={24}/>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-y-4">
                        {/* Day headers */}
                        {dayAbbreviations.map((day, index) => (
                            <div key={`header-${index}`} className="text-center text-gray-500 text-lg">
                                {day}
                            </div>
                        ))}

                        {/* Calendar days */}
                        {calendarDays.map((day, index) => {
                            const isCurrentMonth = index >= prevMonthDays.length &&
                                index < prevMonthDays.length + currentMonthDays.length;
                            const monthOffset = isCurrentMonth ? 0 : (index < prevMonthDays.length ? -1 : 1);

                            // Şu anki gün bugün mü?
                            const isToday = day === new Date().getDate() &&
                                month === new Date().getMonth() &&
                                year === new Date().getFullYear() &&
                                isCurrentMonth;

                            // Bu gün için görevleri al
                            const tasksForDay = isCurrentMonth ? getTasksForDay(day, monthOffset) : [];
                            const hasTasks = tasksForDay.length > 0;

                            // Geçmiş tarih kontrolü
                            const dayDate = new Date(year, month + monthOffset, day);
                            const todayStart = new Date();
                            todayStart.setHours(0, 0, 0, 0);
                            const isPastDate = dayDate < todayStart;

                            // Tooltip görünürlüğünü kontrol et
                            const showPastDateTooltip = isPastDate &&
                                pastDateTooltip &&
                                pastDateTooltip.day === day &&
                                pastDateTooltip.month === (month + monthOffset) &&
                                pastDateTooltip.year === year;

                            return (
                                <div
                                    key={`day-${index}`}
                                    className={`text-center py-2 text-lg cursor-pointer hover:bg-gray-100 hover:text-black rounded-full relative 
                                        ${isCurrentMonth ? 'text-black' : 'text-gray-400'}
                                        ${isSelectedDay(day, monthOffset) ?
                                        'bg-black text-white hover:bg-black hover:bg-opacity-90 rounded-full w-10 h-10 flex items-center justify-center mx-auto' : ''}
                                        ${isToday && !isSelectedDay(day, monthOffset) ?
                                        'font-bold border border-gray-400 rounded-full w-10 h-10 flex items-center justify-center mx-auto' : ''}`}
                                    onClick={() => handleDayClick(day, monthOffset)}
                                >
                                    {/* Gerekli klass'ları ayarla */}
                                    <div className={`w-full h-full flex items-center justify-center ${hasTasks ? 'group' : ''}`}>
                                        {day}

                                        {/* Son tarihi olan görevleri göster */}
                                        {hasTasks && (
                                            <div className="w-2 h-2 bg-red-500 rounded-full absolute bottom-0 right-1 mb-1"></div>
                                        )}

                                        {/* Görevler için Tooltip - hover ile gösterilir */}
                                        {hasTasks && (
                                            <div className="absolute z-10 invisible group-hover:visible bg-black bg-opacity-80 text-white p-2 rounded text-xs -mb-2 bottom-full left-1/2 transform -translate-x-1/2 min-w-[150px] max-w-[200px]">
                                                <p className="font-bold mb-1">Son tarihli görevler:</p>
                                                <ul className="list-disc list-inside">
                                                    {tasksForDay.map(task => (
                                                        <li key={task.id}
                                                            className="truncate text-left">{task.title}</li>
                                                    ))}
                                                </ul>
                                                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black border-opacity-80"></div>
                                            </div>
                                        )}

                                        {/* Geçmiş tarih uyarı tooltip'i - tıklama ile gösterilir */}
                                        {showPastDateTooltip && (
                                            <div className="absolute z-10 bg-red-600 text-white p-2 rounded text-xs -mb-2 bottom-full left-1/2 transform -translate-x-1/2 min-w-[200px] max-w-[250px]">
                                                <p className="font-bold">Bugünden önceki bir tarihe görev atayamazsınız</p>
                                                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="border-t p-4 text-center text-sm text-gray-500">
                    <p>Günlere tıklayarak yeni görev oluşturabilir, mouse ile üzerine gelerek o gün tamamlanacak
                        görevleri görebilirsiniz.</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CalendarDialog;