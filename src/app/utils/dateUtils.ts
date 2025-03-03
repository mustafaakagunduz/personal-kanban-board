// /src/utils/dateUtils.ts
import { format as formatFn, differenceInDays, startOfDay } from 'date-fns';

export const formatDate = (date: Date): string => {
    return formatFn(date, 'dd/MM/yyyy');
};

export const getDaysLeft = (dueDate: string, today: Date | null): number | null => {
    if (!dueDate || !today) return null;
    return differenceInDays(new Date(dueDate), today);
};

export const getTodayStart = (): Date => {
    return startOfDay(new Date());
};