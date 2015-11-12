import React from 'react';
import * as actions from '../actions/index';

let component = null;

function renderButton(component) {
    window.onSignIn = (googleUser) => {
        const profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log("Name: " + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        console.log("Auth result:");
        console.log(googleUser.getAuthResponse());

        component.login();
    }
    window.onSignInFail = function(data) {
        component.loginFailed(['Google authentication failed: \'' + data.reason + '\'']);
    }
}

const ErrorList = React.createClass({
    render() {
        return <div className={alertdanger + (this.props.errors.length == 0 ? ' hidden' : '')}>
            <strong>Opps! </strong>
            {
                this.props.errors.map((msg, i) => (
                    <span key={i}>{msg} </span>
                ))
            }
        </div>
    }
});

const alertdanger = "alert alert-danger";

export default React.createClass({
    render() {
        return <div id='login' className="container-fluid">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <h3>SpaceGame</h3>
                            <p>It is a fantastic space shooter game. Really! You should try it.</p>
                            <ErrorList errors={this.props.site.login.errors} />
                            <div className="pull-left login-panel-sub">
                                <button className="btn btn-default"
                                        onClick={this.navigate.bind(this, '/signup')}>Sign up</button>
                                &nbsp;
                                <button className="btn btn-primary"
                                        onClick={this.login}>Log in</button>
                            </div>
                            <div className="pull-left login-panel-sub">
                                <div className="g-signin2 center-block login-option" data-theme="light"
                                     data-onsuccess="onSignIn"
                                     data-onfailure="onSignInFail"></div>
                            </div>
                            <div className="clearfix" ></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4"></div>
            </div>
        </div>
    },
    login() {
        this.loginBegins();
        this.navigate('/lobby');
    },
    navigate(route)
    {
        this.props.dispatch({
            type: 'NAVIGATE',
            payload: {
                route,
            },
        });
    },
    loginBegins() {
        this.props.dispatch({
            type: actions.SITE_LOGIN_MESSAGE_CLEAR
        });
    },
    loginFailed(messages) {
        this.props.dispatch({
            type: actions.SITE_LOGIN_MESSAGE_SET,
            messages
        });
    },
    componentDidMount: function() { renderButton(this); }
});
