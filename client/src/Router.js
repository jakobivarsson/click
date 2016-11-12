import React from 'react';
import App from './App';
import Counter from './components/counter/Counter';
import Buildings from './components/buildings/buildings';
import { Router, Route, browserHistory } from 'react-router';

export default function() {
  return (
	<Router history={browserHistory}>
	  <Route path="/" component={App} />
	  <Route path="/counter" component={Counter} />
	  <Route path="/buildings" component={Buildings} />
	  <Route path="*" component={App} />
	</Router>
  );
}
