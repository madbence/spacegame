import React from 'react';

import Login from './login';
import Lobby from './lobby';
import Game from './game';
import Placeholder from './placeholder';
import ActiveClass from '../lib/reactive';

const Dialog = ActiveClass.create({
    render() {
        let dimension = {
            height: '150px',
            width: '' + (this.state.windowWidth / 5) + 'px',
            top: (this.state.windowHeight - 150) / 2,
            left: (this.state.windowWidth * 4 / 10),
            position: 'absolute'
        };
        return <div className="panel panel-info center-block my-dialog" style={dimension} >
            <div className="panel-heading">{this.props.title}</div>
            <div className="panel-body">
                {this.props.children}
            </div>
         </div>;
    }
}, ActiveClass.WindowResizeResponder);

const LoadingDialog = React.createClass({
    render() {
        return <Dialog title="Please Wait">
            <div className="center-block">
                <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...
            </div>
        </Dialog>
    }
});

const Overlay = ActiveClass.create(
    {
        render() {
            const dimensions = {
                height: '' + this.state.windowHeight + 'px',
                width: '' + this.state.windowWidth + 'px'
            };
            return <div className={this.props.busy ? "overlay" : "hidden"} style={dimensions}><LoadingDialog /></div>
        }
    }
    ,ActiveClass.WindowResizeResponder
);

const ReactApp = React.createClass({
    navigate(route) {
        this.props.dispatch({
            type: 'NAVIGATE',
            payload: { route }
        });
    },

    render() {
        let innerComponent = this.getInnerComponent();

        if(!innerComponent.nowrap)
            innerComponent = this.wrap(innerComponent);

        return <div className="container-fluid">
            {innerComponent}
            <Overlay busy={this.props.site.busy} />
        </div>;
    },

    wrap(innerComponent) {
        return <div className="row">
            <div className="col-md-12">
                {innerComponent}
            </div>
        </div>
    },

    getInnerComponent() {
        switch (this.props.route) {
            case '/login': return (
                <Login dispatch={this.props.dispatch} site={this.props.site} />
            );
            case '/lobby': return (
                <Lobby onJoin={this.navigate.bind(null, '/game')} />
            );
            case '/game': return (
                <Game {...this.props} />
            );
            case '/signup': return (
                <Placeholder image='signup' />
            );
            default: return (
                <Placeholder />
            );
        }
    }

});

export default ReactApp;
