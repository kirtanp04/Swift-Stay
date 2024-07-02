import moment from 'moment'

export class TimeFormatter {
    static formatTimeDifference(date: any) {
        const momentDate = moment(date);
        const now = moment();
        const diffInMinutes = now.diff(momentDate, 'minutes');
        const diffInHours = now.diff(momentDate, 'hours');
        const diffInDays = now.diff(momentDate, 'days');
        const diffInWeeks = now.diff(momentDate, 'weeks');
        const diffInMonths = now.diff(momentDate, 'months');
        const diffInYears = now.diff(momentDate, 'years');

        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 5) {
            return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} mins ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else if (diffInWeeks < 4) {
            return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
        } else if (diffInMonths < 12) {
            return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
        } else {
            return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
        }
    }
}


