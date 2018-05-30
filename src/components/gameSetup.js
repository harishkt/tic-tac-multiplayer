import React, { Component } from 'react';
import GameBoard from './game1';
import SockerIOClient from 'socket.io-client';
const host = "http://localhost:4001"


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
	const { gameType, handleCreateGame, handleInputs, handleJoinGame, player1, roomId, player2 } = props;
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
					name="roomId"
					value={roomId}
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
const clientByRoom = {};


export default class GameClient extends Component {

	constructor(props) {
		super(props);
		this.state = {
			gameType: '',
			roomId: '',
			player1: '',
			player2: '',
			roomCreated: false,
			playerSymbol: '',
			showBoard: false
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
			roomCreated: true,
			playerSymbol: 'X'
		});
		event.preventDefault();
	}

	handleJoinGame(event) {
		console.log('handle Join Game event entered');
		const { player2, roomId } = this.state;
		this.socket.emit('joinGame', { name: player2, room: roomId })
		this.setState({
			roomCreated: true,
			playerSymbol: 'O'
		});
		event.preventDefault();
	}

	componentDidMount() {
		this.socket.on('newGame', data => {
			this.setState({
				player1: data.name,
				roomId: data.room
			});
		});
		this.socket.on('playerJoined', data => {
			this.setState({
				player2: data.name,
				roomId: data.room,
				showBoard: true
			});
		});
		this.socket.on('allPlayersJoined', data => {
			this.setState({
				showBoard: data.showBoard
			});
		})
	}

	render() {
		console.log(`the state of gamesetup is ${JSON.stringify(this.state)}`);
		const { gameType, player2, player1, roomId, roomCreated, showBoard, playerSymbol } = this.state;
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
				roomId={roomId}
				player2={player2}
			/>
		);
		let display;
		if (roomCreated) {
			if (showBoard) {
				display = (
					<GameBoard
						player={player}
						gameId={roomId}
						socket={this.socket}
						playerSymbol={playerSymbol}
					/>
				);
			} else {
				display = (<div> Wait for other player to join</div>);
			}
		} else {
			display = greeting;
		}
		return(
			<div>
				{display}
			</div>
		)
	}
}