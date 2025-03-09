// /src/utils/dateUtils.ts
import * as dateFns from 'date-fns';

/**
 * Safely parses a date string into a Date object
 * Returns null if the date is invalid
 */
export const safeParseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    try {
        const date = new Date(dateString);
        // Check if the date is valid
        if (isNaN(date.getTime())) return null;
        return date;
    } catch (error) {
        console.error(`Error parsing date: ${dateString}`, error);
        return null;
    }
};

/**
 * Format a date to a readable string using date-fns
 */
export const formatDate = (date: Date): string => {
    try {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            return 'Geçersiz tarih';
        }
        return dateFns.format(date, 'dd/MM/yyyy');
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Tarih hatası';
    }
};

/**
 * Calculate days left between a due date and today using date-fns
 * Returns null if either date is invalid
 */
export const getDaysLeft = (dueDate: string, today: Date | null): number | null => {
    if (!dueDate || !today) return null;

    try {
        const dueDateObj = safeParseDate(dueDate);
        if (!dueDateObj) return null;

        // Use date-fns to calculate the difference in days
        return dateFns.differenceInDays(dueDateObj, today);
    } catch (error) {
        console.error(`Error calculating days left for date: ${dueDate}`, error);
        return null;
    }
};

/**
 * Get today's date, with time set to start of day
 */
export const getTodayStart = (): Date => {
    return dateFns.startOfDay(new Date());
};

/**
 * Create a Date string in ISO format for a date in the future
 * This ensures consistent date format across the application
 */
export const getDateInFuture = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(0, 0, 0, 0); // Standardize to start of day
    return date.toISOString();
};

/**
 * Compare two dates to see if they fall on the same calendar day
 * Ignores time component
 */
export const isSameCalendarDay = (date1: Date | string, date2: Date | string): boolean => {
    try {
        const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
        const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

        return (
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
        );
    } catch (error) {
        console.error('Error comparing dates:', error);
        return false;
    }
};