import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let initialized: boolean = false;

export function initialize(addr: string): Promise {
  if (initialized) {
    throw new Error('Can not initialize persistence service more than once');
  }
  initialized = true;
  return new Promise((resolve, reject) => {
    mongoose.connect(addr);
    const db = mongoose.connection;
    db.on("error", reject);
    db.once('open', function() {
      resolve();
    });
  });
}
