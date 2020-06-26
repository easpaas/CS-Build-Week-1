import React from 'react';
import './App.css';
import Game from './components/Game';
import Home from './components/Home';

import {Route} from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';


function App() {
  return (
    <div className="App">
      <ErrorBoundary>
      <Route exact path="/">
        <Home />
      </Route>
      </ErrorBoundary>
      <ErrorBoundary>
      <Route path="/game"> 
        <Game />
      </Route>
      </ErrorBoundary>
    </div>
  );
}

export default App;
