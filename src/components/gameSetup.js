import React, { Component } from 'react';
import GameBoard from './game1';
import SockerIOClient from 'socket.io-client';
const host = "http://localhost:4001"
/*
 Gives a welcome prompt
 Asks you to either Join a Game or Create a Game
 If Create a Game--> game is created
 If join a game ..asks for gameId
*/

const isGtypeSelected = (gameType) => {
	if (gameType === 'new' || gameType === 'join') {
		return true;
	}
	return false;
}
const WelcomeScreen = ({ handleGameType }) => {
	return(
		<div>
			<h1> Welcome to Tic Tac MultiPlayer Game</h1>
			<p>Select the Game Type</p>
			<button name="new" onClick={handleGameType}>New Game</button>
			<button name="join" onClick={handleGameType}>Join Game</button>
		</div>
	)
}

const EnterGameTypeInformation = (props) => {
	const { gameType, handleCreateGame, handleInputs, handleJoinGame, player1, gameId, player2 } = props;
	const userInfo = gameType === "new" ? (
		<form onSubmit={handleCreateGame}>
					<label>
						Enter name:
						<input
							type="text"
							name="player1"
							value={player1}
							onChange={handleInputs}
						/>
					</label>
					<input type="submit" value="New Game" />
		</form>
	) : (
		<form onSubmit={handleJoinGame}>
			<label>
				Game Id:
				<input
					type="text"
					name="gameId"
					value={gameId}
					onChange={handleInputs}
				/>
			</label>
			<label>
				Player2 Name:
				<input
					type="text"
					name="player2"
					value={player2}
					onChange={handleInputs}
				/>
				</label>
				<input type="submit" value="Join Game" />
		</form>
	)
	return(
		<div>
		{userInfo}
		</div>
	);
}

export default class GameClient extends Component {

	constructor(props) {
		super(props);
		this.state = {
			gameType: '',
			gameId: '',
			player1: '',
			player2: '',
			gameStart: false,
			playerSymbol: ''
		};
		this.socket = SockerIOClient(host);
		this.handleCreateGame = this.handleCreateGame.bind(this);
		this.handleJoinGame = this.handleJoinGame.bind(this);
		this.handleInputs = this.handleInputs.bind(this);
		this.handleGameType = this.handleGameType.bind(this);
	}

	handleGameType(event) {
		const name = event.target.name;
		this.setState({
			gameType: name,
		});
	}

	handleInputs(event) {
		const target = event.target;
		const { name, value } = target;
		this.setState({
			[name]: value
		})
	}

	handleCreateGame(event) {
		console.log('handleCreateGame event entered');
		const { player1 } = this.state;
		this.socket.emit('createGame', { name: player1 });
		this.setState({
			gameStart: true,
			playerSymbol: 'X'
		});
		event.preventDefault();
	}

	handleJoinGame(event) {
		console.log('handle Join Game event entered');
		const { player2, gameId } = this.state;
		this.socket.emit('joinGame', { name: player2, room: gameId })
		this.setState({
			gameStart: true,
			playerSymbol: 'O'
		});
		event.preventDefault();
	}

	componentDidMount() {
		this.socket.on('newGame', data => {
			console.log('new game event received from server');
			console.log(`For player - ${data.name} and the room number is ${data.room}`);
			this.setState({
				player1: data.name,
				gameId: data.room
			});
		});
		this.socket.on('playerJoined', data => {
			console.log(`player joined event from server - ${data}`);
			this.setState({
				player2: data.name,
				gameId: data.room
			});
		});
	}

	render() {
		const { gameType, player2, player1, gameId, gameStart, playerSymbol } = this.state;
		console.log(this.state);
		const player = player1 || player2;
		const isGameTypeSelected = isGtypeSelected(gameType);
		const greeting = !isGameTypeSelected ? (
			<WelcomeScreen handleGameType={this.handleGameType} />
		) : (
			<EnterGameTypeInformation 
				gameType={gameType}
				handleCreateGame={this.handleCreateGame}
				handleJoinGame={this.handleJoinGame}
				handleInputs={this.handleInputs}
				player1={player1}
				gameId={gameId}
				player2={player2}
			/>
		);
		const display = gameStart
			? (<GameBoard
					player={player}
					gameId={gameId}
					socket={this.socket}
					playerSymbol={playerSymbol}
			/>) : greeting;
		return(
			<div>
				{display}
			</div>
		)
	}
}