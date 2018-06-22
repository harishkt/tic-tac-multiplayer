import React, { Component } from 'react';
import { Button, Raised } from '@material-ui/core';
import GameBoard from './multi-player';
import SockerIOClient from 'socket.io-client';
import config from '../../config';
const host = config.serverConnection;

const btnStyle = {
	marginRight: '10px',
	marginLeft: '10px'
};

const isGtypeSelected = (gameType) => {
	if (gameType === 'new' || gameType === 'join') {
		return true;
	}
	return false;
}
const WelcomeScreen = ({ handleGameType }) => {
	return(
		<div className="welcome-screen-window">
			<h1 className="game-heading"> Welcome to Tic Tac MultiPlayer Game</h1>
			<p className="game-type">Select the Game Type</p>
			<Button variant="contained" color="primary" style={btnStyle}
				name="new" onClick={handleGameType}>New Game</Button>
			<Button variant="contained" color="primary" style={btnStyle}
				name="join" onClick={handleGameType}>Join Game</Button>
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
			showBoard: false,
			gameInfo: null
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
			playerSymbol: 'X',
			player: player1
		});
		event.preventDefault();
	}

	handleJoinGame(event) {
		console.log('handle Join Game event entered');
		const { player2, roomId } = this.state;
		this.socket.emit('joinGame', { name: player2, room: roomId })
		this.setState({
			roomCreated: true,
			playerSymbol: 'O',
			player: player2
		});
		event.preventDefault();
	}

	componentDidMount() {
		this.socket.on('newGame', data => {
			this.setState({
				player1: data.name,
				roomId: data.room,
				gameInfo: data.gameInfo
			});
		});
		this.socket.on('playerJoined', data => {
			this.setState({
				player2: data.name,
				roomId: data.room,
				showBoard: true,
				gameInfo: data.gameInfo
			});
		});
		this.socket.on('allPlayersJoined', data => {
			this.setState({
				showBoard: data.showBoard,
				gameInfo: data.gameInfo
			});
		})
	}

	render() {
		console.log(`the state of gamesetup is ${JSON.stringify(this.state)}`);
		const { gameType, player2, player1, roomId, roomCreated, showBoard, playerSymbol, gameInfo, player } = this.state;
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
						gameInfo={gameInfo}
					/>
				);
			} else {
				display = (<div> Send the RoomId - {roomId} for others to Join</div>);
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