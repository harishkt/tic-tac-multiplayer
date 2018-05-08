import React, { Component } from 'react';
import './App.css';
import Game from './components/game';
import Test from './components/test';
import GameSetup from './components/gameSetup';

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameSetup />
      </div>
    );
  }
}

export default App;
