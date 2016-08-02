import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React from 'react';

import ApolloClient from 'apollo-client';
import { meteorClientConfig } from 'meteor/apollo';
import { ApolloProvider } from 'react-apollo';
import { renderRoutes } from '../imports/startup/client/routes.js';

import App from '/imports/ui/App';

const client = new ApolloClient(meteorClientConfig());

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));
  // render(<ApolloProvider client={client}>
  //   <App />
  // </ApolloProvider>, document.getElementById('app'));
});
