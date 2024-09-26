"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecrtKey = void 0;
exports.SecrtKey = {
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
    STRIPE: {
        PUBLISHABLE_KEY: 'pk_test_51PrybgE49rR7qfxXGVr14COb9LapJyhecBMruappFTlAXpLZr6pEVqQwacAUxcOmnZ2VFy4FzPYKW3X3uEG2oYeI00I7iEYP4R',
        SECRET_KEY: 'sk_test_51PrybgE49rR7qfxX360o3NEyPPuSAGnpLvpA2zyQej11IaV8oBgL9XQtRicKcs0zxWpvVFL5bFIBwWpG47axWg1v00IpA1ssf4',
        WEBHOOK_SECRET: 'whsec_04461b10779a430b15a1899b44a19098909b93005ea4de91e03f96f014ab6dec'
        // command   stripe listen --forward-to=http://localhost:8080/swiftstay/guest/webhook
    }
};
