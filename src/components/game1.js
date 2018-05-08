import React,  { Component } from 'react';
import Board from './board';
import { getOtherPlayer,
		didWin,
		didWinByPlayer,
		isDraw,
		minMax,
		getPlayerNameById,
		humanPlayer,
		aiPlayer
	} from '../utils/game-logic';

const initState = (currentPlayer) => ({
	history: [
		[ 'Game Start']
	],
	data: Array(9).fill(null),
	currentPlayer,
	otherPlayerPlay: false
});

export default class Game extends Component {
	constructor(props) {
		super(props);
		this.state = initState(this.props.currentPlayer);
		this.socket = this.props.socket;
		this.handleReset = this.handleReset.bind(this);
		this.handleClickNew = this.handleClickNew.bind(this);
	}

	
	componentDidMount() {
		this.socket.on('turnPlayed', ({ data, room }) => {
			console.log(`We get new data from server  - ${data} and ${room}`);
			this.setState({
				data: data.data
			});
		})
	}
	handleClickNew(tile) {
		const { player, gameId, playerSymbol } = this.props;
		console.log(`Entered handleClickNew event with ${tile}`)
		const [ ...data ] = this.state.data;
		const Msg = `You selected Tile - ${tile}`;
		if (didWin(data) || isDraw(data)) {
			return;
		}
		if (data[tile] !== null) {
			return;
		};
		data[tile] = playerSymbol;
		this.socket.emit('boardUpdated', ({ player, room: gameId, data }));
		this.setState({
			data
		});
	}
	handleReset() {
		this.setState(initState);
	}
	showResetBtn() {
		return(
			<button
				className="btn"
				onClick={this.handleReset}
			>Reset
			</button>
		);
	}
	getGameStatus() {
		const { data } = this.state;
		const winner = didWinByPlayer(data, aiPlayer)
			? aiPlayer : didWinByPlayer(data, humanPlayer) ? humanPlayer : null;
		return winner
			? { status: 'Win', winner }
			: isDraw(data)
				? { status: 'Draw' } : { status: null }
	}
	showHistory() {
		const { history } = this.state;
		return history.map((step, index) => <li key={index}>{step}</li>);
	}
	
	render() {
		console.log(`Entered render method for ${this.props.gameId} and ${this.props.player}`);
		// <ol>{this.showHistory()}</ol>
		// <div className="game-status">Status:{this.getGameStatus()}</div>
		const { currentPlayer } = this.state;
		const { status,  winner } = this.getGameStatus();
		const gameBoard = (
			<Board 
							onClick={this.handleClickNew}
							data={this.state.data}
							boardSize={3}
			/>
		);
		let gameScreen;
		if (status === 'Win') {
			gameScreen = (<div><p className='status-msg'>{winner} won. Play Again!!!!</p></div>);
		} else if(status === 'Draw') {
			gameScreen = (<div><p className='status-msg'>Game Draw. Play Again!!!</p></div>);
		} else {
			gameScreen = gameBoard;
		}
		
		const playGame = (
			<div>
				{gameScreen}	
			</div>
		);
		return(
			<div>
				<h1 className="game-heading">Tic Tac Toe</h1>
				{playGame }
			</div>
		);
	}
}
