import uuid from 'uuid';

export default function* (next) {
  const id = uuid.v4();
  this.id = this.set('Request-ID', id);
  yield* next;
}
