import React, { Component } from 'react';

const PlayerDisplay = ({ admin, otherPlayer }) => (
	<div>
		<div>
			<p>Room Admin: {admin}</p>
		</div>
		<div>
			<p>Other participant: {otherPlayer}</p>
		</div>
	</div>
);
const GameHeader = ({ roomNum, player1, player2 }) => (
	<div>
		<h1> Tic Tac Multiplayer Game </h1>
		<p> You are in room - {roomNum} </p>
		<PlayerDisplay admin={player1.name} otherPlayer={player2.name} />
	</div>
);

export default GameHeader;

