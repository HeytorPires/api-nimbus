export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default_secret',
    expiresIn: '1d',
  },
};
