import React from 'react';
import {createStore,combineReducers} from 'redux';
import uuid from 'uuid';
import {Provider} from 'react-redux';

// function createStore(reducer, initialState) {
//   let state = initialState;
//   const listeners = [];

//   const subscribe = (listener) => (
//     listeners.push(listener)
//   );

//   const getState = () => (state);

//   const dispatch = (action) => {
//     state = reducer(state, action);
//     listeners.forEach(l => l());
//   };

//   return {
//     subscribe,
//     getState,
//     dispatch,
//   };
// }

const reducer = combineReducers({
  activeThreadId:activeThreadIdReducer,
  threads:threadsReducer
});

// function reducer(state={},action){
//   return {
//     activeThreadId:activeThreadIdReducer(state.activeThreadId,action),
//     threads:threadsReducer(state.threads,action),
//   };
// }
function activeThreadIdReducer(state='1-fca2',action){
  if(action.type === 'OPEN_THREAD'){
    return action.id;
  } else {
    return state;
  }
}
function findThreadIndex(threads,action){
  switch(action.type){
    case 'ADD_MESSAGE':{
      return threads.findIndex((t) => (action.threadId === t.id));
    }
    case 'DELETE_MESSAGE':{
      return threads.findIndex((t) => t.messages.find(m => (
      m.id === action.id)));
    }
  }
}
function threadsReducer(state = [
  {
    id: '1-fca2',
    title: 'Bimal Thapa Magar',
    messages: messageReducer(undefined, {}),
  },
  {
    id: '2-be91',
    title: 'Siva Poon',
    messages: messageReducer(undefined, {}),
  },
], action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
    case 'DELETE_MESSAGE':{
        const threadIndex =findThreadIndex(state,action);
        const oldThread = state[threadIndex];

        const newThread = {
          ...oldThread,
          messages:messageReducer(oldThread.messages,action),
        };
        return [
          ...state.slice(0,threadIndex),
          newThread,
          ...state.slice(threadIndex + 1,state.length)
        ];
    }
    default:{
      return state;
    }
  }
}
function messageReducer(state=[],action){
  switch(action.type){
    case 'ADD_MESSAGE':{
      const newMessage = {
        id:uuid.v4(),
        text:action.text,
        timestamp:Date.now()
      };
      return state.concat(newMessage);
    }
    case 'DELETE_MESSAGE': {
     return state.filter(m => m.id !== action.id);
    }
    default: {
      return state;
    } 
  }
}

// const initialState = {
//   activeThreadId:'1-fca2',
//   threads:[
//       {
//         id:'1-fca2',
//         title:'Buzz Aldrin',
//         messages:[
//         {
//           text:'Hey what\'s up?',
//           timestamp:Date.now(),
//           id:uuid.v4(),
//         }
//         ],
//       },
//       {
//         id:'2-be91',
//         title:'Bimal Thapa Magar',
//         messages:[]
//       }
//   ]
// };

const store = createStore(reducer);

class App extends React.Component {
  render() {
    return (
      <div className='ui segment'>
        <ThreadTabs/>
        <ThreadDisplay/> 
      </div>
    );
  }
}

const Tabs = (props) => {
  return (
   <div className='ui top attached tabular menu'>
        {
          props.tabs.map((t,index) => (
            <div
                key={index}
                className={t.active?'active item':'item'}
                onClick={() => props.onClick(t.id)}
              >
                {t.title}
            </div>
          ))
        }
  </div>
  );
};

class ThreadTabs extends React.Component{
  componentDidMount(){
    store.subscribe(() =>  this.forceUpdate());
  }
  render(){
    const state = store.getState();
    const tabs = state.threads.map(t => ({
        title:t.title,
        active:state.activeThreadId === t.id,
        id:t.id
    }));
    return (
     <Tabs 
        tabs={tabs}
        onClick = {(id) => {
          store.dispatch({
            type:'OPEN_THREAD',
            id:id
          });
        }}
     />
    );
  }
}


class TextFieldSubmit extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = (event) => {
      this.props.onSubmit(this.state.value);
      this.setState({
        value: '',
      });
    };

  render() {
    return (
      <div className='ui input'>
        <input
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >
          Submit
        </button>
       </div>
    );
  }
}

const MessageList = (props) => {
  return (
    <div className='ui comments'>
      {
        props.messages.map((m,index) =>(
          <div
            className='comment'
            key={index}
            onClick={() => props.onClick(m.id)}
          >
          <div className='text'> {/* Wrap message data in `div` */}
            {m.text}
            <span className='metadata'>@{m.timestamp}</span>
          </div>
      </div>
        ))
      }
    </div>
  );
};

const Thread = (props) => (
  <div className='ui center aligned basic segment'>
    <MessageList
      messages={props.thread.messages}
      onClick={props.onMessageClick}
    />
    <TextFieldSubmit
      onSubmit={props.onMessageSubmit}
    />
  </div>
);

class ThreadDisplay extends React.Component {
  componentDidMount(){
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    const state = store.getState();
    const activeThreadId = state.activeThreadId; 
    const activeThread = state.threads.find(
      t => t.id === activeThreadId
    );
    return (
      <Thread
        thread={activeThread}
        onMessageClick={(id) => {
          store.dispatch({
            type:'DELETE_MESSAGE',
            id:id
          })
        }}
        onMessageSubmit={(text) =>{
          store.dispatch({
            type:'ADD_MESSAGE',
            text:text,
            threadId:activeThreadId
          })
        }}
      />
    );
  }
}

const WrappedApp = () => {
  return (
    <Provider store={store}>
       <App/>
    </Provider>
  );
};


export default WrappedApp;