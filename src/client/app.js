import Inferno from 'inferno';
import InfernoDOM from 'inferno-dom';
import Component from 'inferno-component'

import {createStore} from 'redux';
import {Provider} from 'inferno-redux';
import {Router, Route, browserHistory} from 'inferno-router';

import Login from './components/login';
import Game from './components/game';

const store = createStore(state => state, {
  user: null,
});

class App extends Component {
  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

InfernoDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} component={App}>
      <Route path='/' component={Game} />
      <Route path='/login' component={Login} />
    </Router>
  </Provider>,
  document.getElementById('mount')
);

// if (!store.getState().user) {
//   browserHistory.routeTo('/login');
//   window.history.pushState(null, null, '/login');
// }
