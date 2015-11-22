import jwt from 'jsonwebtoken';
import config from '../../../config';
const secret = config.session.secret;

if (!secret) {
  throw new Error('Please provide session.secret!');
}

function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, {
      algorithms: ['HS256'],
    }, (err, value) => {
      if (err) {
        return reject(err);
      }
      resolve(value);
    });
  });
}

function sign(value) {
  return new Promise(resolve => {
    jwt.sign(value, secret, {
      algorithm: 'HS256',
    }, token => {
      resolve(token);
    });
  });
}

export default function* (next) {
  if (!this.cookies.get('token')) {
    this.cookies.set('token', yield sign({
      user: null,
    }));
    return yield* next;
  }
  this.session = yield verify(this.cookies.get('token'));
  yield* next;
}
