import React, { Component } from 'react';
import SocketIoClient from 'socket.io-client';

export default class Test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			host: 'http://localhost:4001',
			response: null
		}
	}

	componentDidMount() {
		const { host } = this.state;
		const socket = SocketIoClient(host);
		socket.on("FROMAPI", (data) => this.setState({ response: data }));
	}


	render() {
		const { response } = this.state;
		return (
		<div style={{ textAlign: "center" }}>
			{response
			? <p>
				The temperature in Florence is: {response} °F
				</p>
			: <p>Loading...</p>}
		</div>
		);
 	}
}