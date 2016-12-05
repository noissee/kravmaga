import React from 'react';
import { Route } from 'react-router';

import AuthStore from './stores/AuthStore';
import App from './components/App';
import Login from './components/Login';
import Profile from './components/Profile';


// validate authentication for private routes
const requireAuth = (nextState, replace) => {
    if (!AuthStore.getState().isLoggedIn) {
       replace({pathname: '/login'})
    }
};
// redirect to profile (index route) if the user is authenticated
const userLoggedOn = (nextState, replace) => {
    if (AuthStore.getState().isLoggedIn) {
        replace({pathname: '/'})
    }
};

export default (
    <Route component={App}>
        <Route path='/' component={Profile} onEnter={requireAuth} />
        <Route path='/login' component={Login} onEnter={userLoggedOn} />
    </Route>
);
