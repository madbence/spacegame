import dotenv from 'dotenv';

dotenv.load({
  silent: true,
});

export default {
  port: process.env.PORT,
};
