export default function* (next) {
  try {
    yield* next;
  } catch (e) {
    console.error(e.stack);
    this.body = {
      message: e.message,
      stack: e.stack,
    };
  }
}
