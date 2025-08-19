export default {
    jwt: {
        secret: process.env.APP_SECRET || 'default_secret',
        expiresIn: '100d',
    },
};
