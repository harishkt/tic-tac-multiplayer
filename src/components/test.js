import React, { Component } from 'react';

export default class Test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: 0
		}
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		
	}

	render() {
		return(
			<button onClick={this.handleClick}>{this.state.id}</button>
		);
	}
}