import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { meteorClientConfig } from 'meteor/apollo';
import App from '../../ui/App';
import { About } from '../../ui/About'

const client = new ApolloClient(meteorClientConfig());

const AppContainer = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="about" component={About}/>
    </Route>
  </Router>
)
