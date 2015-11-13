/**
 * Created by Gabor on 2015.11.13..
 */

import _ from 'lodash';
import React from 'react';

// Apply active behaviors on React components
// when DOM events fires
//
// the followings are basically
// 'partial prototypes'

// helper function
function invokeParent(parent, that, args) {
    if(_.isFunction(parent)) {
        return parent.apply(that, _.rest(args));
    }
}

// This behavior is for components
// which are responding to window resize events
const WindowResizeResponder = {
    getInitialState(parent) {
        let state = invokeParent(parent, this, arguments);
        let newstate = _.assign({}, state, {windowWidth: window.innerWidth, windowHeight: window.innerHeight});
        console.log(newstate);
        return newstate;
    },

    handleResize(parent, e) {
        this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight});
        return invokeParent(parent, this, arguments);
    },

    componentDidMount(parent) {
        window.addEventListener('resize', this.handleResize);
        return invokeParent(parent, this, arguments);
    },

    componentWillUnmount(parent) {
        window.removeEventListener('resize', this.handleResize);
        return invokeParent(parent, this, arguments);
    }
};


// Pack everything into a single function
const extendSpecs = _.partialRight(_.assign, function(value, other) {
    return _.isFunction(other) ? _.wrap(value, other) : other;
});

const ActiveClass = {
    create: function(specs, ...additional) {
        if(additional.length == 1 && Array.isArray(additional[0]))
            additional = additional[0];
        specs = extendSpecs(specs, ...additional);
        console.log(specs);
        return React.createClass(specs);
    },
    WindowResizeResponder
};

export default ActiveClass;
