import React from 'react';
    import connectToStores from 'alt-utils/lib/connectToStores';
import ExecutionEnvironment from 'exenv';
import { Button } from 'react-bootstrap'

import AuthStore from '../stores/AuthStore';
import AuthActions from '../actions/AuthActions';

class Login extends React.Component {

    static getStores() {
        return [AuthStore];
    }

    static getPropsFromStores() {
        return AuthStore.getState();
    }

    componentDidMount() {
        this._initLock();
    }

    login() {
        if (typeof this._lock === 'undefined') {
            console.error('Lock is undefined');
            return;
        }

        this._lock.show();
    }

    _initLock() {
        if (!ExecutionEnvironment.canUseDOM || this._lock) {
            return;
        }

        // TODO: replace the strings with config
        // initialize
        this._lock = new Auth0Lock('Mr8dVDOpvKRoMPH6rj0hHnHYNJJcV5Cf', 'kozlo.eu.auth0.com', {
            auth: {
                redirectUrl: `${window.location.origin}/login`,
                responseType: 'token'
            }
        });

        this._lock.on('authenticated', authResult => this._onAuthenticated(authResult));
    }

    _onAuthenticated(authResult) {
        const token = authResult.idToken;
        this._lock.getProfile(token, (error, profile) => this._onProfileReceived(error, profile, token));
    }

    _onProfileReceived(error, profile, token) {
        if (error) {
            console.error(error);
            toastr.error('Autorizācija neveiksmīga!');
            return;
        }

        AuthActions.loginUser(profile, token);
    }

    render() {
        return (
            <div className='container'>
                <div className='text-center'>
                    <h2>Krav Maga</h2>
                    <Button className="btn btn-default btn-lg" onClick={this.login.bind(this)}>
                        <span className="glyphicon glyphicon-log-in"></span> Ienākt/Reģistrēties
                    </Button>
                </div>
            </div>
        );
    }
}

export default connectToStores(Login);
