export function checkSupport() {
  if (!window.Worker) {
    // TODO: figure out how to handle this
    throw new Error('Workers not supported');
  }

  window.URL = window.URL || window.webkitURL;
  if (!window.URL) {
    // TODO: figure out how to handle this
    throw new Error('URL API not supported');
  }
}

export function createBlob(code) {
  let blob;
  try {
    blob = new Blob([code], {type: 'application/javascript'});
  } catch (e) { // Backwards-compatibility
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    blob = new window.BlobBuilder();
    blob.append(code);
    blob = blob.getBlob();
  }

  return blob;
}
