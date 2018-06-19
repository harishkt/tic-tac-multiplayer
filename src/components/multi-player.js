import React,  { Component } from 'react';
import Board from './board';
import GameHeader from './gameHeader';
import Chat from './chat';

import { getOtherPlayer,
		didWin,
		didWinByPlayer,
		isDraw,
		minMax,
		getPlayerNameById,
		humanPlayer,
		aiPlayer
	} from '../utils/game-logic';


export default class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gameInfo: this.props.gameInfo
		};
		this.socket = this.props.socket;
		this.handleClick = this.handleClick.bind(this);
		this.handlePlayAgain = this.handlePlayAgain.bind(this);
	}

	
	componentDidMount() {
		this.socket.on('turnPlayed', ({ gameInfo }) => {
			this.setState({
				gameInfo
			});
		})
		this.socket.on('resetGame', ({ gameInfo }) => {
			this.setState({
				gameInfo
			});
		});
	}
	handleClick(tile) {
		const { gameInfo } = this.state;
		const { player, playerSymbol, gameId } = this.props;
		const { currentPlayer, tilePositions, isGameOver, winner } = gameInfo;
		if (player === currentPlayer) {
			tilePositions[tile] = playerSymbol;
			this.socket.emit('boardUpdated', ({ player, room: gameId, data: tilePositions }));
		} else {
			// console.log('Dude u need to wait for other player to play!!!!!')
		}

	}

	handlePlayAgain() {
		const { gameInfo } = this.state;
		const { currentPlayer, tilePositions, isGameOver, winner } = gameInfo;
		const { player, playerSymbol, gameId } = this.props;
		if (player === gameInfo.player1.name) {
			this.socket.emit('playAgain', ({ room: gameId }));
		} else {
			// console.log('Dude Ask the administrator to start the game!!!');
		}
	}
	
	
	render() {
		const { gameInfo } = this.state;
		const { currentPlayer, tilePositions, isGameOver, winner, status, roomNum, player1, player2 } = gameInfo;
		const { player } = this.props;
		if (status === 'Win') {
			return(<div>
				<GameHeader roomNum={roomNum} player1 = {player1} player2={player2}/>
				{currentPlayer} WON!!! Congrats
				<button onClick={this.handlePlayAgain}>Play Again!!</button>
				<Chat roomNum={roomNum} socket={this.socket} player={player}/>
			</div>)
		} else if (status === 'Draw') {
			return(
			<div>
				<GameHeader roomNum={roomNum}  player1 = {player1} player2={player2}/>
				<button onClick={this.handlePlayAgain}>Play Again!!</button>
				<p>Game was Draw. Play Again!!!!!</p>
				<Chat roomNum={roomNum} socket={this.socket} player={player}/>
			</div>)
		}
		return(
			<div>
				<GameHeader roomNum={roomNum}  player1 = {player1} player2={player2}/>
				<Board 
							onClick={this.handleClick}
							data={tilePositions}
							boardSize={3}
				/>
				<Chat roomNum={roomNum} socket={this.socket} player={player}/>
			</div>
			
		)
	}
}
