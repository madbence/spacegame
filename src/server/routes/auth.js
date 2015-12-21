import { get, post } from 'koa-route';
import compose from 'koa-compose';
import passport from 'koa-passport';

const authLocal = post('/local', passport.authenticate('local', {
  successRedirect: '/lobby',
  failureRedirect: '/login',
  // failureFlash: 'Invalid username or password.', // TODO: add flash msg mechanism
}));

const authGoogle = get('/google', function *() {
  this.status = 501;
});

const authFacebook = get('/facebook', function *() {
  this.status = 501;
});

export default compose([
  authLocal,
  authGoogle,
  authFacebook,
]);
