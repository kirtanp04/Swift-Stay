export const SecrtKey = {
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'knjbvuigbuvhuy84578953686578ty78',

    JWT_KEY: process.env.JWT_KEY || 'jbut*%$%^JHFR^$^$^&FC64',

    Environment: 'production',

    MNOGO_URL: process.env.MNOGO_URL || 'mongodb+srv://kirtanp04:OyBd0kVg6JZxkvpy@hotelcluster.exs9nof.mongodb.net/Stay_Swift',

    FRONTEND_URL: {
        ADMIN: process.env.FRONTEND_URL || 'http://localhost:5174',
        GUEST: process.env.FRONTEND_URL || 'http://localhost:5173',
    },

    NODEMAILER: {
        EMAIL_AUTH_USER: process.env.EMAIL_AUTH_USER || 'kirtanfake0412@gmail.com',

        EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',

        EMAIL_AUTH_PASS: process.env.EMAIL_AUTH_PASS || 'gypgtexluvrvhszd',
    },

    REDIS: {
        URL: 'redis-18995.c264.ap-south-1-1.ec2.redns.redis-cloud.com',

        PASSWORD: 'Z5j3MNcde38mGAg7bz1ZCCS7xxErL2LF',

        USERNAME: 'default',

        PORT: 18995,
    },
};
