import React, { Component } from 'react';
import { connect } from 'react-apollo';
import gql from 'graphql-tag';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import { Accounts } from 'meteor/std:accounts-ui';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

function Layout({ children, params, location, userId, currentUser }) {
  return (
    <div>
      <Link to="/">Home</Link> &nbsp;
      <Link to="/tasks">Tasks</Link> &nbsp;
      <div className="container">
        {children}
      </div>
      <Accounts.ui.LoginForm />
      { userId ? (
        <div>
          <pre>{JSON.stringify(currentUser, null, 2)}</pre>
          <button onClick={() => currentUser.refetch()}>Refetch!</button>
        </div>
      ) : 'Please log in!' }
    </div>
  )
}

// This container brings in Apollo GraphQL data
const LayoutWithData = connect({
  mapQueriesToProps({ ownProps }) {
    if (ownProps.userId) {
      return {
        currentUser: {
          query: gql`
            query getUserData ($id: String!) {
              user(id: $id) {
                emails {
                  address
                  verified
                }
                username
                randomString
              }
            }
          `,
          variables: {
            id: ownProps.userId,
          },
        },
      };
    }
  },
})(Layout);


const LayoutWithUserId = createContainer((props) => {
  return {
    userId: Meteor.userId(),
  }
}, LayoutWithData);

export default LayoutWithUserId
