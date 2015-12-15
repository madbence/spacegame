import dotenv from 'dotenv';

dotenv.load({
  silent: true,
});

export default {
  port: process.env.PORT,
  session: {
    secret: process.env.SESSION_SECRET,
  },
  ws: {
    url: process.env.WS_URL,
  },
  analytics: {
    id: process.env.ANALYTICS_ID,
  },
};
