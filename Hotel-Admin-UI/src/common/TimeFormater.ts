import moment from 'moment';

export class TimeFormatter {
    static formatTimeDifference(date: string | Date): string {
        // Ensure the input date is in UTC
        const momentDate = moment.utc(date);
        const now = moment.utc(); // Current time in UTC


        // Calculate differences
        const diffInMinutes = now.diff(momentDate, 'minutes');
        const diffInHours = now.diff(momentDate, 'hours');
        const diffInDays = now.diff(momentDate, 'days');
        // const diffInWeeks = now.diff(momentDate, 'weeks');

        const diffInMonths = now.diff(momentDate, 'months');
        const diffInYears = now.diff(momentDate, 'years');


        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else if (diffInDays < 30) {
            return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
        } else if (diffInMonths < 12) {
            return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
        } else {
            return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
        }
    }

    static formatTo12Hour = (value: string): string => {
        if (!value) return '';
        return moment(value, 'HH:mm').format('hh:mm a');
    };

}



