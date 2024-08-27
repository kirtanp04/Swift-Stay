import { differenceInDays, format, isAfter, isBefore, parseISO } from 'date-fns';

class DateFormatter {
    private static instance: DateFormatter;



    public static getInstance(): DateFormatter {
        if (!DateFormatter.instance) {
            DateFormatter.instance = new DateFormatter();
        }
        return DateFormatter.instance;
    }

    formatDate(date: Date | string, formatString: string): string {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, formatString);
    }

    formatToDDMMYYYY(date: Date | string): string {
        return this.formatDate(date, 'dd/MM/yyyy');
    }

    formatToLongDate(date: Date | string): string {
        return this.formatDate(date, 'MMMM d, yyyy');
    }

    formatToISO(date: Date | string): string {
        return this.formatDate(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }

    formatToTime(date: Date | string): string {
        return this.formatDate(date, 'HH:mm:ss');
    }

    formatToCustom(date: Date | string, customFormat: string): string {
        return this.formatDate(date, customFormat);
    }

    getDifferenceInDays(date1: Date | string, date2: Date | string): number {
        const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1;
        const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2;
        return Math.abs(differenceInDays(parsedDate1, parsedDate2));
    }


    isDateBefore(date1: Date | string, date2: Date | string): boolean {
        const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1;
        const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2;
        return isBefore(parsedDate1, parsedDate2);
    }


    isDateAfter(date1: Date | string, date2: Date | string): boolean {
        const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1;
        const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2;
        return isAfter(parsedDate1, parsedDate2);
    }

}

export default DateFormatter;
