import dotenv from 'dotenv';

dotenv.load({
  silent: true,
});

export default {
  port: process.env.PORT,
  ws: {
    url: process.env.WS_URL,
  },
};
