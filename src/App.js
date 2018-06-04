import React, { Component } from 'react';
import './App.css';
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
