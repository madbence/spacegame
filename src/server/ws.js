import { create as createClient } from './services/client';

export default socket => {
  createClient(socket);
};
