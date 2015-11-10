export default function* (next) {
  const start = Date.now();
  yield* next;
  const duration = Date.now() - start;
  this.set('Response-Time', duration);
  console.log('%s %s took %dms (%d)', this.method, this.originalUrl, duration, this.status);
}
