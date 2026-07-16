export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default_secret',
    expiresIn: '15m' as const,
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
    expiresIn: '7d' as const,
    expiresInSeconds:
      Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60,
  },
  cookie: {
    refreshToken: {
      name: process.env.REFRESH_TOKEN_COOKIE_NAME || 'refresh_token',
      maxAge:
        Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    },
    accessToken: {
      name: process.env.ACCESS_TOKEN_COOKIE_NAME || 'access_token',
      maxAge: 15 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    },
  },
};
