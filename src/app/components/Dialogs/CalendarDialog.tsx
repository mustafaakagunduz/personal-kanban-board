import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface CalendarDialogProps {
    open: boolean;
    onClose: () => void;
    selectedDate?: Date;
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({
                                                           open,
                                                           onClose,
                                                           selectedDate
                                                       }) => {
    // Başlangıç tarihi olarak seçilen tarihi veya bugünü kullan
    const [currentDate, setCurrentDate] = useState(() => {
        return selectedDate ? new Date(selectedDate) : new Date(2025, 1, 28);
    });

    // Takvim görünümü için gerekli tarih bilgilerini hesapla
    const [year, setYear] = useState<number>(currentDate.getFullYear());
    const [month, setMonth] = useState<number>(currentDate.getMonth());

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
                            <ChevronLeft size={24} />
                        </button>
                        <h2 className="text-xl font-medium">{turkishMonths[month]} {year}</h2>
                        <button
                            className="rounded-full p-2 hover:bg-gray-100"
                            onClick={goToNextMonth}
                        >
                            <ChevronRight size={24} />
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
                            const isToday = day === currentDate.getDate() &&
                                month === currentDate.getMonth() &&
                                year === currentDate.getFullYear() &&
                                isCurrentMonth;

                            return (
                                <div
                                    key={`day-${index}`}
                                    className={`text-center py-2 text-lg cursor-pointer hover:bg-gray-100 rounded-full
                                        ${isCurrentMonth ? 'text-black' : 'text-gray-400'}
                                        ${isSelectedDay(day, monthOffset) ?
                                        'bg-black text-white hover:bg-black hover:bg-opacity-90 rounded-full w-10 h-10 flex items-center justify-center mx-auto' : ''}
                                        ${isToday && !isSelectedDay(day, monthOffset) ?
                                        'font-bold border border-gray-400 rounded-full w-10 h-10 flex items-center justify-center mx-auto' : ''}`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CalendarDialog;