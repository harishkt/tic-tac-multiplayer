import React, { Component } from 'react';

export default class Chat extends Component {
	constructor(props) {
		super(props);
		this.socket = this.props.socket;
		this.state = {
			messages: [],
			chatMsg: ''
		};
		this.handlePost = this.handlePost.bind(this);
		this.handleChatMsg = this.handleChatMsg.bind(this);
	}

	componentDidMount() {
		this.socket.on('chatUpdated', ({ messages }) => {
			this.setState({
				messages
			});
		});
	}
	handlePost(event) {
		event.preventDefault();
		const { chatMsg } = this.state;
		const { player, roomNum } = this.props;
		const msgToBePosted = {
			name: player,
			body: chatMsg
		};
		this.socket.emit('postChat', ({ roomNum, msgToBePosted }));
	}

	handleChatMsg(event) {
		this.setState({ chatMsg: event.target.value });
	}
	render() {
		const { chatMsg } = this.state;
		return(
			<div>
				<h4>Chat Window</h4>
				<div className="chatBody">
					{this.state.messages.map((message, index) =>
						(<div key={index} >{message.name}: {message.body}</div>))}
				</div>
				<div className="chatInput">
					<textarea onChange={this.handleChatMsg} value={chatMsg}>
						
					</textarea>
					<button onClick={this.handlePost}>Post!!!</button>
				</div>
			</div>
		)
	}
}