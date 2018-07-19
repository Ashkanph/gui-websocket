
import 'core-js/es6/map';
import 'core-js/es6/set';
import React               from 'react';
import ReactDOM            from 'react-dom';
import "babel-polyfill";

import {Component}   from 'react';
import Main          from './components/Main/main';

// This only be loaded in the development mode
require('./index.scss');

ReactDOM.render(<Main />, document.getElementById('root'));
