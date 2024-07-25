import { format, parseISO } from 'date-fns';

class DateFormatter {
    private static instance: DateFormatter;

    private constructor() { }

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
}

export default DateFormatter;
