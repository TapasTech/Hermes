module.exports = {
  port: 8008,
  isProd: process.env.NODE_ENV === 'production',
  qiniu: {
    ACCESS_KEY: 'ACCESS_KEY',
    SECRET_KEY: 'SECRET_KEY',
  },
};
