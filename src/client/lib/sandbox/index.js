import store from '../../store';
import subscribe from '../keypress';
import Sandbox from './sandbox';
import { ACCELERATE, FIRE, REGISTERKEYLISTENER, keydown, keyup, sendState } from './messages';
import { accelerate, fire, getCurrentShip, transformState } from './helpers';

// for stopping script on dying and restarting on respawn
const states = {
  RUNNING: 'RUNNING',
  DEAD: 'DEAD',
  STOPPED: 'STOPPED',
};

// wrapper around Sandbox, implementing the game-specific behaviour,
// e.g. message passing, state updates, etc.
class SandboxProxy {
  constructor() {
    this.keySubscriptions = [];
    this.listenersDisabled = false;
    this.storeSubscription = store.subscribe(this.stateUpdateHandler.bind(this));
    this.state = states.STOPPED;

    this.sandbox = new Sandbox();
    this.sandbox.onmessage = this.messageHandler.bind(this);
  }

  stateUpdateHandler() {
    const currentShip = getCurrentShip();

    if (this.state === states.DEAD && currentShip) {
      // respawn
      this.start();
    } else if (this.state === states.RUNNING && !currentShip) {
      this.state = states.DEAD;
      this.__stop();
    } else if (this.state === states.RUNNING) {
      // send state to player
      const newState = store.getState();
      const transformedState = transformState(newState);
      this.sandbox.postMessage(sendState(transformedState));
    }
  }

  createKeyDownHandler(code) {
    return () => this.sandbox.postMessage(keydown(code));
  }

  createKeyUpHandler(code) {
    return () => this.sandbox.postMessage(keyup(code));
  }

  messageHandler(e) {
    const msg = JSON.parse(e.data);
    switch (msg.type) {
      case ACCELERATE:
        accelerate(msg.payload.thrusterIndex, msg.payload.strength);
        break;

      case FIRE:
        fire();
        break;

      case REGISTERKEYLISTENER:
        this.keySubscriptions.push(subscribe(msg.payload.code,
                                this.createKeyDownHandler(msg.payload.code),
                                this.createKeyUpHandler(msg.payload.code),
                                msg.payload.preventDefault,
                                () => this.listenersDisabled));
        break;

      default:
        console.error(`Unexpected message of type ${msg.type}`);
    }
  }

  enableKeyListeners() {
    this.listenersDisabled = false;
  }

  disableKeyListeners() {
    this.listenersDisabled = true;
  }

  set code(newCode) {
    const extendedCode = SandboxProxy.extendCode(newCode);
    this.sandbox.code = extendedCode;
  }

  set onerror(callback) {
    this.sandbox.onerror = callback;
  }

  start() {
    this.sandbox.start();
    this.state = states.RUNNING;
  }

  stop() {
    this.state = states.STOPPED;
    this.__stop();
  }

  // for internal use
  __stop() {
    this.keySubscriptions.forEach(unsubscribe => unsubscribe());
    this.keySubscriptions = [];
    this.sandbox.stop();
  }

  // embed user code in our framework that controls message passing and
  // defines the interface available to user
  // note: this code should be backward-compatible
  static extendCode(code) {
    return `
      "use strict";

      var __SYSTEM = {
        // message types
        ACCELERATE: 'ACCELERATE',
        FIRE : 'FIRE',
        KEYDOWN: 'KEYDOWN',
        KEYUP: 'KEYUP',
        NOOP: 'NOOP',
        REGISTERKEYLISTENER: 'REGISTERKEYLISTENER',
        SENDSTATE: 'SENDSTATE',

        // state handling
        currentState: {},
        updateState: function (newState) { __SYSTEM.currentState = newState; },
        getState: function () { return __SYSTEM.currentState; },

        // keyboard event handling
        keyHandlers: {}, // format: { key: [{up, down}]}

        keydown: function (key) {
          var handlers = __SYSTEM.keyHandlers[key] || [];
          for (var ii = 0; ii < handlers.length; ++ii) {
            var h = handlers[ii];
            if (h.down) {
              h.down();
            }
          }
        },

        keyup: function (key) {
          var handlers = __SYSTEM.keyHandlers[key] || [];
          for (var ii = 0; ii < handlers.length; ++ii) {
            var h = handlers[ii];
            if (h.up) {
              h.up();
            }
          }
        },

        requestKeyListenerRegistration: function (code, preventDefault) {
          __SYSTEM.sendMessage(__SYSTEM.REGISTERKEYLISTENER, {
            code,
            preventDefault
          });
        },

        addKeyListener: function (code, down, up, preventDefault) {
          __SYSTEM.requestKeyListenerRegistration(code, preventDefault);
          __SYSTEM.keyHandlers[code] = __SYSTEM.keyHandlers[code] || [];
          __SYSTEM.keyHandlers[code].push({
            down: down,
            up: up
          });
        },

        // helpers
        sendMessage: function (type, payload) {
          postMessage(JSON.stringify({
            type: type || NOOP,
            payload: payload || {}
          }));
        },

        accelerate: function (thrusterIndex, strength) {
          __SYSTEM.sendMessage(__SYSTEM.ACCELERATE, {
            thrusterIndex: thrusterIndex,
            strength: strength
          });
        },

        fire: function () {
          __SYSTEM.sendMessage(__SYSTEM.FIRE);
        }
      };

      self.onmessage = function (e) {
        var msg = JSON.parse(e.data);
        switch (msg.type) {
          case __SYSTEM.SENDSTATE:
            __SYSTEM.updateState(msg.payload);
            break;

          case __SYSTEM.KEYDOWN:
            __SYSTEM.keydown(msg.payload.key);
            break;

          case __SYSTEM.KEYUP:
            __SYSTEM.keyup(msg.payload.key);
            break;

          default:
            throw new Error ('Unexpected incoming message of type ' + msg.type);
        }
      };

      var actions = {
        accelerate: __SYSTEM.accelerate,
        fire: __SYSTEM.fire
      };

      function getState() {
        return __SYSTEM.getState();
      }

      function simulate(actions) {
        throw new Error('simulate not implemented!');
      }

      var helpers = {
        addKeyListener: __SYSTEM.addKeyListener
      };

      ${code}
    `;
  }
}

export default new SandboxProxy(); // use as singleton
