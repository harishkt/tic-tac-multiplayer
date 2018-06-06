import React, { Component } from 'react';

export default GameHeader = ({ roomNum }) => (
	<div>
		<h1> Tic Tac Multiplayer Game </h1>
		<p> You are in romm - ${roomNum} </p>
	</div>
);

