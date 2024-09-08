import cron, { ScheduledTask } from 'node-cron';

interface CronRes {
    isError: boolean;
    errorMessage: string;
    message: string[];
}

interface CronTime {
    everySecond: string,
    every5Seconds: string,
    everyMinute: string,
    every5Minutes: string,
    everyHour: string,
    everyDayAtMidnight: string,
    everyMorning9AM: string,
    customCron: (minute: string, hour: string, day: string, month: string, dayOfWeek: string) => string,
}

class CronScheduler {
    private tasks: Map<string, ScheduledTask> = new Map();

    public CronTime = (): CronTime => {
        return {
            everySecond: '* * * * * *',
            every5Seconds: '*/5 * * * * *',
            everyMinute: '* * * * *',
            every5Minutes: '*/5 * * * *',
            everyHour: '0 * * * *',
            everyDayAtMidnight: '0 0 * * *',
            everyMorning9AM: '0 9 * * *',
            customCron: (minute: string, hour: string, day: string, month: string, dayOfWeek: string) =>
                `${minute} ${hour} ${day} ${month} ${dayOfWeek}`,
        };
    };

    private createResponse(isError: boolean, errorMessage: string = '', message: string[] = []): CronRes {
        return { isError, errorMessage, message };
    }

    public addCronJob(jobName: string, cronTime: string, task: () => void, startImmediately: boolean = true): CronRes {
        try {
            if (this.tasks.has(jobName)) {
                return this.createResponse(true, `Cron job with name "${jobName}" already exists.`);
            } else {
                const scheduledTask = cron.schedule(
                    cronTime,
                    () => {
                        task();
                    },
                    {
                        scheduled: startImmediately,
                    }
                );
                this.tasks.set(jobName, scheduledTask);

                return this.createResponse(false, '', []);
            }
        } catch (error: any) {
            return this.createResponse(true, error.message);
        }
    }

    public startJob(jobName: string): CronRes {
        try {
            const task = this.tasks.get(jobName);
            if (task) {
                task.start();

                return this.createResponse(false, '', []);
            } else {
                return this.createResponse(true, `Cron job "${jobName}" not found.`);
            }
        } catch (error: any) {
            return this.createResponse(true, error.message);
        }
    }

    public stopJob(jobName: string): CronRes {
        try {
            const task = this.tasks.get(jobName);
            if (task) {
                task.stop();

                return this.createResponse(false, '', []);
            } else {
                return this.createResponse(true, `Cron job "${jobName}" not found.`);
            }
        } catch (error: any) {
            return this.createResponse(true, error.message);
        }
    }

    public removeJob(jobName: string): CronRes {
        try {
            const task = this.tasks.get(jobName);
            if (task) {
                task.stop();
                this.tasks.delete(jobName);

                return this.createResponse(false, '', []);
            } else {
                return this.createResponse(true, `Cron job "${jobName}" not found.`);
            }
        } catch (error: any) {
            return this.createResponse(true, error.message);
        }
    }

    public listJobs(): CronRes {
        try {
            if (this.tasks.size === 0) {
                return this.createResponse(true, 'No cron jobs available.');
            } else {
                const jobNames = Array.from(this.tasks.keys());
                return this.createResponse(false, '', jobNames);
            }
        } catch (error: any) {
            return this.createResponse(true, error.message);
        }
    }
}

export default CronScheduler;
