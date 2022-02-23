import React,{Component} from 'react';
function createStore(reducer,initialState) {
  let state = initialState;
  let listeners = [];

  const getState = () => (state);

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(l => l());
  };
  const subscribe = (listener) => {
  	listeners.push(listener);
  };

  return {
    getState,
    dispatch,
    subscribe
  };
}
function reducer(state,action){
	if(action.type === 'ADD_MESSAGE'){
		return {
			messages:state.messages.concat(action.message)
		};
	} else if(action.type === 'DELETE_MESSAGE'){
		return {
			messages:[...state.messages.slice(0,action.index),
			...state.messages.slice(action.index + 1,state.messages.length)
			]
		};
	} else {
		return state;
	}
}
const initialState = {messages:[]};
const store = createStore(reducer,initialState);

class MessageInput extends Component {
	state ={
		value:""
	};
	onChange = (e) => {
		this.setState({value:e.target.value});
	}
  	handleSubmit = (e) => {
  		store.dispatch({
  			type:'ADD_MESSAGE',
  			message:this.state.value
  		});
        this.setState({value:""});
  	};
	render(){
		return (
			<div className='ui input'>
				<input 
					type="text"
					value={this.state.value}
					onChange={this.onChange}
				/>
				<button 
					onClick={this.handleSubmit}
					className="ui primary button"
					type="submit"
				>
					Submit
				</button>
			</div>
		);
	}
}

class App extends Component {
	componentDidMount(){
		store.subscribe(() => this.forceUpdate());
	}
	render(){
		const messages = store.getState().messages;
		return (
			<div>
				<MessageView messages ={messages}/>
				<MessageInput />
			</div>
		);
	}
}
class MessageView extends Component {
	handleDelete = (e) => {
		store.dispatch({
			type:"DELETE_MESSAGE",
			index:e.target.dataset.index
		});
	};
	render(){
		const messages = this.props.messages.map((msg,i) =>(
			<div 
				className="comment" 
				key={i}
				data-index={i}
				onClick = {this.handleDelete}
			>
			{msg}
			</div>
		));
		return (
			<div>
				{messages}
			</div>
		);
	}
}


export default App;



