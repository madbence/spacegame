import dotenv from 'dotenv';

dotenv.load({
  silent: true,
});

export default {
  port: process.env.PORT,
  ws: {
    url: process.env.WS_URL,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
};
