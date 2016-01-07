import { checkSupport, createBlob } from './helpers';

// simple wrapper around web workers with an easy-to-use interface,
// enabling us to run scripts from strings
class Sandbox {
  constructor() {
    checkSupport();

    this.code = '';            // user code
    this.onerror = () => {};   // handler for error in worker (and sandbox)
    this.onmessage = () => {}; // handler for msgs from worker
    this.worker = null;
  }

  start() {
    if (this.worker) {
      this.stop();
    }

    // create blob to be run on worker
    const blob = createBlob(this.code);

    // start worker
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.onmessage = this.onmessage;
    this.worker.onerror = this.onerror;
  }

  stop() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  postMessage(msg) {
    if (this.worker) {
      this.worker.postMessage(JSON.stringify(msg));
    }
  }

  handleError(e) {
    if (this.onerror && typeof(this.onerror) === 'function') {
      this.onerror(e);
    }
  }
}

export default Sandbox;
