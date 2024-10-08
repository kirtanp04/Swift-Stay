import moment from 'moment';

export class TimeFormatter {


    static formatTo12Hour = (value: string): string => {
        if (!value) return '';
        return moment(value, 'HH:mm').format('hh:mm a');
    };

    static getTimeDifference = (date: Date) => {
        try {

            const specificTime = new Date(date);
            const currentTime = new Date();
            const differenceInSeconds = Math.floor((currentTime.getTime() - specificTime.getTime()) / 1000);

            const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

            if (differenceInSeconds < 60) {
                return rtf.format(-differenceInSeconds, 'second');
            }

            const differenceInMinutes = Math.floor(differenceInSeconds / 60);
            if (differenceInMinutes < 60) {
                return rtf.format(-differenceInMinutes, 'minute');
            }

            const differenceInHours = Math.floor(differenceInMinutes / 60);
            if (differenceInHours < 24) {
                return rtf.format(-differenceInHours, 'hour');
            }

            const differenceInDays = Math.floor(differenceInHours / 24);
            if (differenceInDays < 7) {
                return rtf.format(-differenceInDays, 'day');
            }

            const differenceInWeeks = Math.floor(differenceInDays / 7);
            if (differenceInWeeks < 4) {
                return rtf.format(-differenceInWeeks, 'week');
            }

            const differenceInMonths = Math.floor(differenceInDays / 30);
            if (differenceInMonths < 12) {
                return rtf.format(-differenceInMonths, 'month');
            }

            const differenceInYears = Math.floor(differenceInDays / 365);
            return rtf.format(-differenceInYears, 'year');


        } catch (error) {

        }
    }

}



