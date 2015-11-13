// Enables simple binding of keys

const state = new Map();
const upListeners = new Map();
const downListeners = new Map();

let keyDownHandler;
let keyUpHandler;

function eventHandler(type, event) {
    let handle;
    if(type == 'keydown') {
        if(downListeners.has(event.keyCode) && !state.has(event.keyCode)) {
            (handle = downListeners.get(event.keyCode)).action(event);
            handle.preventDefault && event.preventDefault();
        }
        state.set(event.keyCode, true);
    }
    if(type == 'keyup') {
        if(upListeners.has(event.keyCode) && state.has(event.keyCode)) {
            (handle = upListeners.get(event.keyCode)).action(event);
            handle.preventDefault && event.preventDefault();
        }
        state.delete(event.keyCode);
    }
}

function attachHandler(attach = true) {
    let keyDownHandlerAttached = "function" == typeof keyDownHandler;
    let keyUpHandlerAttached = "function" == typeof keyUpHandler;

    attach && !keyDownHandlerAttached && (
        keyDownHandler = eventHandler.bind(window, 'keydown'),
        document.body.addEventListener('keydown', keyDownHandler)
    ) && console.log("keyDownHandlerAttached");
    attach && !keyUpHandlerAttached && (
        keyUpHandler = eventHandler.bind(window, 'keyup'),
        document.body.addEventListener('keyup', keyUpHandler)
    );

    !attach && keyDownHandlerAttached && document.body.removeEventListener('keydown', keyDownHandler);
    !attach && keyUpHandlerAttached && document.body.removeEventListener('keydown', keyUpHandler);
}

export function bind(key, onDown, onUp, preventDefault = true) {
    if("function" === typeof onDown) {
        downListeners.set(key, {action: onDown, preventDefault});
    }

    if("function" === typeof onUp) {
        upListeners.set(key, {action: onUp, preventDefault});
    }

    attachHandler(downListeners.size || upListeners.size);
}

export function unbind(key) {
    upListeners.delete(key);
    downListeners.delete(key);
    attachHandler(downListeners.size || upListeners.size);
}