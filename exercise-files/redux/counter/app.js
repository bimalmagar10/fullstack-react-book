// function reducer(state,action){
// 	if(action.type === 'INCREMENT'){
// 		return state + action.value;
// 	} else if(action.type === 'DECREMENT'){
// 		return state - action.value;
// 	} else {
// 		return state;
// 	}
// }
// const incrementAction = {type:'INCREMENT',value:2};
// console.log(reducer(0,incrementAction));

// console.log(reducer(1,incrementAction));
// console.log(reducer(2,incrementAction));
// const unknownAction = {type:'UNKNOWN'};
// console.log(reducer(2,unknownAction));
// const decrementAction = {type:'DECREMENT',value:2};
// console.log(reducer(5,decrementAction));
function createStore(reducer){
	let state = 0;
	const getState = () =>  (state);
	const dispatch = (action)=>{
		state = reducer(state,action);
	};
	return {
		dispatch,
		getState
	};
}
function reducer(state,action){
	if(action.type === 'INCREMENT'){
		return state + action.value;
	} else if(action.type === 'DECREMENT'){
		return state - action.value;
	} else {
		return state;
	}
}
const store = createStore(reducer);
const incrementAction = {type:'INCREMENT',value:2};
store.dispatch(incrementAction);
console.log(store.getState());
