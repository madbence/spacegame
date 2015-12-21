import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';

const testUser = {
  id: 1,
  username: 'test',
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // retrieve user...
  done(null, testUser);
});

passport.use(new LocalStrategy((username, password, done) => {
  // retrieve user...
  if (username === 'test' && password === 'test') {
    done(null, testUser);
  } else if (username === 'test') {
    done(null, false);
  } else {
    done(null, false);
  }
}));

export default passport.initialize();
