import moment from "moment";





export function TimeDifference(Date: Date | string): string {
    const specificTime = moment(Date);

    const currentTime = moment();

    const differenceInSeconds = currentTime.diff(specificTime, 'seconds');

    const timeDifference = formatTimeDifference(differenceInSeconds);

    return timeDifference;
}




function formatTimeDifference(seconds) {
    const years = Math.floor(seconds / (3600 * 24 * 365));
    const months = Math.floor((seconds % (3600 * 24 * 365)) / (3600 * 24 * 30));
    const days = Math.floor((seconds % (3600 * 24 * 30)) / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let result = '';

    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        result += `${months} month${months !== 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        result += `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        result += `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        result += `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
        result += `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''} ago`;
    }

    return result;
}


