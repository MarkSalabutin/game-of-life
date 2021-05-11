import React from 'react';
import ReactDOM from 'react-dom';
import { GameView } from './GameView';

export const render = () => ReactDOM.render(<GameView />, document.querySelector('#root'));
