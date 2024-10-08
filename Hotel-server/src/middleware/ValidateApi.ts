import { Request } from 'express';
import { ProjectResponse, Storage } from '../common';
import { SecrtKey } from '../env';
import moment from 'moment';

export const VerifyAPIKey = (req: Request): ProjectResponse => {
    const res = new ProjectResponse();

    try {
        const apiKey = Storage.getHeader('x-api-key', req);

        if (apiKey.error === '') {
            if (apiKey.data.key !== SecrtKey.API_KEY) {
                res.data = '';
                res.error = 'Server error: Invalid api key / api key must required.';
            } else {
                const specificTime = moment(apiKey.data.key.time);

                const currentTime = moment();
                const differenceInMinutes = currentTime.diff(specificTime, 'minutes');

                if (differenceInMinutes > 5) {
                    res.data = '';
                    res.error = 'Server error: Invalid api key / api key must required.';
                } else {
                    res.data = 'Success: Api key verified.';
                    res.error = '';
                }
            }
        } else {
            res.data = '';
            res.error = 'Server error: Invalid api key / api key must required.';
        }
    } catch (error: any) {
        res.data = '';
        res.error = error.message;
    }
    return res;
};
