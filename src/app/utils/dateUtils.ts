// /src/utils/dateUtils.ts
import * as dateFns from 'date-fns';

export const formatDate = (date: Date): string => {
    return dateFns.format(date, 'dd/MM/yyyy');
};

export const getDaysLeft = (dueDate: string, today: Date | null): number | null => {
    if (!dueDate || !today) return null;
    return dateFns.differenceInDays(new Date(dueDate), today);
};

export const getTodayStart = (): Date => {
    return dateFns.startOfDay(new Date());
};