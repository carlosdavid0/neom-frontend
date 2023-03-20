import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './routes/';

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.getElementById('favicon').href = require('./assets/img/neom_logo_white.png');
}

ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);
