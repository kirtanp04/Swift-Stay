"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
class CronScheduler {
    constructor() {
        this.tasks = new Map();
        this.CronTime = () => {
            return {
                everySecond: '* * * * * *',
                every5Seconds: '*/5 * * * * *',
                everyMinute: '* * * * *',
                every5Minutes: '*/5 * * * *',
                everyHour: '0 * * * *',
                everyDayAtMidnight: '0 0 * * *',
                everyMorning9AM: '0 9 * * *',
                customCron: (minute, hour, day, month, dayOfWeek) => `${minute} ${hour} ${day} ${month} ${dayOfWeek}`,
            };
        };
    }
    createResponse(isError, errorMessage = '', message = []) {
        return { isError, errorMessage, message };
    }
    addCronJob(jobName, cronTime, task, startImmediately = true) {
        try {
            if (this.tasks.has(jobName)) {
                return this.createResponse(true, `Cron job with name "${jobName}" already exists.`);
            }
            else {
                const scheduledTask = node_cron_1.default.schedule(cronTime, () => {
                    task();
                }, {
                    scheduled: startImmediately,
                });
                this.tasks.set(jobName, scheduledTask);
                return this.createResponse(false, '', []);
            }
        }
        catch (error) {
            return this.createResponse(true, error.message);
        }
    }
    startJob(jobName) {
        try {
            const task = this.tasks.get(jobName);
            if (task) {
                task.start();
                return this.createResponse(false, '', []);
            }
            else {
                return this.createResponse(true, `Cron job "${jobName}" not found.`);
            }
        }
        catch (error) {
            return this.createResponse(true, error.message);
        }
    }
    stopJob(jobName) {
        try {
            const task = this.tasks.get(jobName);
            if (task) {
                task.stop();
                return this.createResponse(false, '', []);
            }
            else {
                return this.createResponse(true, `Cron job "${jobName}" not found.`);
            }
        }
        catch (error) {
            return this.createResponse(true, error.message);
        }
    }
    removeJob(jobName) {
        try {
            const task = this.tasks.get(jobName);
            if (task) {
                task.stop();
                this.tasks.delete(jobName);
                return this.createResponse(false, '', []);
            }
            else {
                return this.createResponse(true, `Cron job "${jobName}" not found.`);
            }
        }
        catch (error) {
            return this.createResponse(true, error.message);
        }
    }
    listJobs() {
        try {
            if (this.tasks.size === 0) {
                return this.createResponse(true, 'No cron jobs available.');
            }
            else {
                const jobNames = Array.from(this.tasks.keys());
                return this.createResponse(false, '', jobNames);
            }
        }
        catch (error) {
            return this.createResponse(true, error.message);
        }
    }
}
exports.default = CronScheduler;
