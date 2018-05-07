import React, { Component } from 'react';
import './App.css';
import Game from './components/game';
import Test from './components/test';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Test />
      </div>
    );
  }
}

export default App;
