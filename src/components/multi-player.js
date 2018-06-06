import React,  { Component } from 'react';
import Board from './board';
import GameHeader from './gameHeader';
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
			console.log('turnPlayeed event entered');
			console.log(`We get new data from server  - ${gameInfo}`);
			this.setState({
				gameInfo
			});
		})
		this.socket.on('resetGame', ({ gameInfo }) => {
			console.log('resetGame Event triggered from server');
			this.setState({
				gameInfo
			});
		});
	}
	handleClick(tile) {
		console.log(`You selected Tile - ${tile}`);
		const { gameInfo } = this.state;
		const { player, playerSymbol, gameId } = this.props;
		const { currentPlayer, tilePositions, isGameOver, winner } = gameInfo;
		console.log(`player and currentPlayer in handleClick is ${player} and ${currentPlayer}`);
		if (player === currentPlayer) {
			tilePositions[tile] = playerSymbol;
			console.log(`new tile positions are ${tilePositions}`);
			this.socket.emit('boardUpdated', ({ player, room: gameId, data: tilePositions }));
		} else {
			console.log('Dude u need to wait for other player to play!!!!!')
		}

	}

	handlePlayAgain() {
		const { gameInfo } = this.state;
		const { currentPlayer, tilePositions, isGameOver, winner } = gameInfo;
		const { player, playerSymbol, gameId } = this.props;
		if (player === gameInfo.player1.name) {
			console.log(`Play Again button is clicked by ${player}`);
			this.socket.emit('playAgain', ({ room: gameId }));
		} else {
			console.log('Dude Ask the administrator to start the game!!!');
		}
	}
	
	
	render() {
		const { gameInfo } = this.state;
		const { player, playerSymbol, gameId } = this.props;
		const { currentPlayer, tilePositions, isGameOver, winner, status } = gameInfo;
		
		if (status === 'Win') {
			return(<div>
				<GameHeader roomNum={gameId.gameId} />
				{currentPlayer} WON!!! Congrats
				<button onClick={this.handlePlayAgain}>Play Again!!</button>
			</div>)
		} else if (status === 'Draw') {
			return(
			<div>
				<GameHeader roomNum={gameId.gameId} />
				<button onClick={this.handlePlayAgain}>Play Again!!</button>
				<p>Game was Draw. Play Again!!!!!</p>
			</div>)
		}
		return(
			<div>
				<GameHeader roomNum={gameId.gameId} />
				<Board 
							onClick={this.handleClick}
							data={tilePositions}
							boardSize={3}
				/>
			</div>
			
		)
	}
}
