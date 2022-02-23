import React from 'react';
//import createHistory from 'history/createBrowserHistory';
// import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom';


//const history = new createHistory();
// const Route = ({path,component},{location}) => {
//     const pathname = location.pathname;
//     if(pathname.match(path)){
//       return React.createElement(component);
//     } else {
//       return null;
//     }
// };
// Route.contextTypes = {
//   location:PropTypes.object
// };
// const Link = ({to,children},{history}) => {
//   return (
//     <a onClick={(e) => {
//         e.preventDefault();
//         history.push(to);
//     }}
//     href={to}
//     >
//     {children}
//     </a>
//   );
// };
// Link.contextTypes = {
//   history:PropTypes.object
// };
// class Router extends React.Component {
//   static childContextTypes = {
//     history:PropTypes.object,
//     location:PropTypes.object
//   };
//   constructor(props){
//     super(props);
//     this.history = createHistory();
//     this.history.listen(() => this.forceUpdate());
//   }
//   getChildContext(){
//     return {
//       history:this.history,
//       location:window.location
//     };
//   }
//   render(){
//     return this.props.children;
//   }
// }
// class Redirect extends React.Component {
//   static contextTypes = {
//     history:PropTypes.object
//   };
//   componentDidMount(){
//     const history = this.context.history;
//     const to = this.props.to;
//     history.push(to);
//   }
//   render(){
//     return null;
//   }
// }

const App = () => (
  <Router>
    <div
        className='ui text container'
      >
        <h2 className='ui dividing header'>
          Which body of water?
        </h2>

        <ul>
          <li>
            <Link to='/atlantic'>
              <code>/atlantic</code>
            </Link>
          </li>
          <li>
            <Link to='/pacific'>
              <code>/pacific</code>
            </Link>
          </li>
          <li>
            <Link to='/blacksea'>
              <code>/blacksea</code>
            </Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/" render={() => {
            return (
              <div>
                <h1>Welcome to the routing basics of this book.</h1>
              </div>
            );
          }}/>
           <Route 
            path="/atlantic/ocean"
            render={() => {
              return (
                <div className="animation">
                  <h3>Atlantic Ocean-Once again</h3>
                  <p>
                    Also known as the 'Pond'
                  </p>
                </div>
              );
            }}
          />
          {<Route path='/atlantic' component={Atlantic}/>}
          <Route path='/pacific' component={Pacific}/>
          <Route path='/blacksea' component={BlackSea}/>
         
          <Route render={({location}) => {
            return (
              <div className='ui inverted red segment'>
                <h3>
                  Error! No matches for <code>{location.pathname}</code>
                </h3> 
              </div>
            );
          }}/>
        </Switch>
       
      </div>
  </Router>
);
// class App extends React.Component {
  
//   render() {
//     console.log('rendered')
//     return (
      
//     );
//   }
// }
class BlackSea extends React.Component {
  state = {
    counter:3
  };
  componentDidMount(){
    this.interval =  setInterval(() => {
      this.setState(prevState => {
        return {counter:prevState.counter - 1};
      })
    },1000);
  }
  componentWillUnmount(){
    clearInterval(this.interval);
  }
  render(){
    return (
      <div className="animation">
      <h1>Black Sea </h1>
      <p>Nothing to see here......</p>
      <p>Redirecting in {this.state.counter}secs</p>
      <p>
        {
          (this.state.counter < 1 ? <Redirect to='/'/> : null)
        }
      </p>
      </div>
    );
  }
}

const Atlantic = () => (
  <div className="animation">
    <h3>Atlantic Ocean</h3>
    <p>
      The Atlantic Ocean covers approximately 1/5th of the
      surface of the earth.
    </p>
  </div>
);

const Pacific = () => (
  <div class="animation">
    <h3>Pacific Ocean</h3>
    <p>
      Ferdinand Magellan, a Portuguese explorer, named the ocean
      'mar pacifico' in 1521, which means peaceful sea.
    </p>
  </div>
);

export default App;
