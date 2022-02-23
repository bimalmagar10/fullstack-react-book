class TimersDashboard extends React.Component {
	state = {
		timers:[
			// {
		 //        "title": "Mow the lawn",
		 //        "project": "House Chores",
		 //        "elapsed": 5456099,
		 //        "id": uuid.v4(),
		 //        "runningSince":Date.now()
		 //    },
		 //    {
		 //        "title": "Clear paper jam",
		 //        "project": "Office Chores",
		 //        "elapsed": 1273998,
		 //        "id": "a73c1d19-f32d-4aff-b470-cea4e792406a",
		 //        "runningSince":null
		 //    },
		 //    {
		 //        "title": "Ponder origins of universe",
		 //        "project": "Life Chores",
		 //        "id": "2c43306e-5b44-4ff8-8753-33c35adbd06f",
		 //        "elapsed": 163388840025,
		 //        "runningSince": null
		 //    }
		],
	};
	componentDidMount(){
		this.loadTimersFromServer();
		setInterval(this.loadTimersFromServer,5000);
	}
	loadTimersFromServer(){
		client.getTimers(serverTimer => {
			this.setState({timers:serverTimer});
		});
	}
	createTimer =(timer) => {
		const t = helpers.newTimer(timer);
		this.setState(Object.assign({},this.state,{
			timers:this.state.timers.concat(t),
		}));
		client.createTimer(t);
	};
    deleteTimer = (timerId) => {
    	this.setState({
    		timers:this.state.timers.filter(timer => timerId !== timer.id),
    	});
    	client.deleteTimer({
    		id:timerId
    	})
    };
	handleCreateFormSubmit =(timer) => {
		this.createTimer(timer);
	}
	onEditFormSubmit = (attrs) => {
        this.setState({
        	timers:this.state.timers.map(timer => {
        		if(attrs.id === timer.id){
        			return Object.assign({},timer,{
        				title:attrs.title,
        				project:attrs.project
        			});
        		} else {
        			return timer;
        		}
        	}),
        });
        client.updateTimer(attrs);
	};
	handleDeleteTimer = (timerId) => {
		this.deleteTimer(timerId);
	};
	handleStart = (timerId) => {
		const now = Date.now();
		this.setState({
			timers:this.state.timers.map(timer => {
				if(timerId === timer.id){
					return Object.assign({},timer,{
						runningSince:now
					});
				} else {
					return timer;
				}
			}),
		});
		client.startTimer({
			id:timerId,
			start:now
		});
	};
	handleStop = (timerId) => {
		const now = Date.now();
		this.setState({
			timers:this.state.timers.map(timer => {
				if(timerId == timer.id){
					const lastElapsed = now - timer.runningSince;
					return Object.assign({},timer,{
						runningSince:null,
						elapsed:timer.elapsed + lastElapsed
					});
				} else {
					return timer;
				}
			}),
		});
		client.stopTimer(
		 {
			id:timerId,
		 	start:now
		 }
		);
	};
	render(){
		return (
			<div className='ui three column centered grid'>
        		<div className='column'>
        		  <EditableTimerList 
        		  	timers={this.state.timers}
        		  	onFormSubmit ={this.onEditFormSubmit}
        		  	onDeleteTimer = {this.handleDeleteTimer}
        		  	onStartClick ={this.handleStart}
        		  	onStopClick ={this.handleStop}
        		  />
        		  <ToggleableTimerForm
        		  	  onSubmitForm ={this.handleCreateFormSubmit}
        		  />
        		</div>
      		</div>
		);
	}
}
class EditableTimerList extends React.Component{
	render(){
		const timers = this.props.timers.map(timer => (
				<EditableTimer 
					key={timer.id}
					id={timer.id}
					title={timer.title}
					project={timer.project}
					elapsed={timer.elapsed}
					runningSince={timer.runningSince}
					onFormSubmit ={this.props.onFormSubmit}
					onDeleteTimer = {this.props.onDeleteTimer}
					onStartClick = {this.props.onStartClick}
					onStopClick ={this.props.onStopClick}
				/>
			)
		);
		return (
			<div id='timers'>
			 {timers}
			</div>
		);
	}
}
class EditableTimer extends React.Component {
	state ={
		editFormOpen:false
	};
	openForm = () => {
		this.setState({
			editFormOpen:true,
		});
	};
	closeForm = () => {
		this.setState({
			editFormOpen:false
		});
	};
	handleEditClick =() => {
		this.openForm();
	};
	handleFormClose = () => {
		this.closeForm();
	};
	handleUpdateForm = (timer) => {
       this.props.onFormSubmit(timer);
       this.setState({
       	editFormOpen:false
       });
	};
	render(){
		if(this.state.editFormOpen){
			return (
			 <TimerForm
			    id={this.props.id} 
			 	title={this.props.title}
			 	project={this.props.project}
			 	onFormClose={this.handleFormClose}
			 	onFormSubmit = {this.handleUpdateForm}
			 />
			);
		} else {
			return(
				<Timer 
				  id={this.props.id}
				  title={this.props.title}
				  project={this.props.project}
				  elapsedString={this.props.elapsed}
				  runningSince={this.props.runningSince}
				  onEditClick={this.handleEditClick}
				  onDeleteTimer={this.props.onDeleteTimer}
				  onStartClick ={this.props.onStartClick}
				  onStopClick ={this.props.onStopClick}
				/>
			);
		}
		
	}
}
class TimerForm extends React.Component {
	state = {
		title:this.props.title || '',
		project:this.props.project || '',
	};
	handleTitleChange = (e) => {
		this.setState(Object.assign({},this.state,{
			title:e.target.value
		}));
	};
	handleProjectChange = (e) => {
		this.setState(Object.assign({},this.state,{
			project:e.target.value
		}));
	};
	handleSubmit = () => {
		if(this.props.id){
			this.props.onFormSubmit({
				id:this.props.id,
				title:this.state.title,
				project:this.state.project
			});
		} else {
			this.props.onFormSubmit({
				title:this.state.title,
				project:this.state.project
			});
		}
	};

	render(){
		const submitText = this.props.id ? 'Update' : 'Create';
		return (
			<div className='ui centered card'>
		        <div className='content'>
		          	<div className='ui form'>
		            	<div className='field'>
			                <label>Title</label>
							<input 
								type='text' 
								value={this.state.title}
								onChange={this.handleTitleChange}
							/> 
						</div>
						<div className='field'>
							<label>Project</label>
							<input 
								type='text' 
								value={this.state.project}
								onChange={this.handleProjectChange}
							/>
		            	</div>
			            <div className='ui two bottom attached buttons'>
			              	<button 
			              		className='ui basic blue button'
			              		onClick = {this.handleSubmit}
			              	>{submitText}</button>
			              	<button 
			              		className='ui basic red button'
			              		onClick = {this.props.onFormClose}
			              	>
			              	Cancel
			              	</button>
			            </div>
		          	</div>
		        </div>
			</div>
		);
	}
}
class Timer extends React.Component {
	componentDidMount(){
		this.forceUpdateInterval = setInterval(()=> this.forceUpdate(),50);
	}
	componentWillunMount(){
		clearInterval(this.forceUpdateInterval);
	}
	handleDelete =() => {
		this.props.onDeleteTimer(this.props.id);
	};
	handleStartClick = () => {
		this.props.onStartClick(this.props.id);
	}
	handleStopClick = () => {
		this.props.onStopClick(this.props.id);
	}
	render(){
		const elapsedString = helpers.renderElapsedTime(parseInt(this.props.elapsedString),this.props.runningSince); 
		return (
			<div className='ui centered card'>
        		<div className='content'>
					<div className='header'>{this.props.title}</div>
	          		<div className='meta'>{this.props.project}</div>
	          		<div className='center aligned description'>
	            		<h2>{elapsedString}</h2> 
	            	</div>
	          		<div className='extra content'>
			            <span 
			            	className='right floated edit icon'
			            	onClick ={this.props.onEditClick}
			            >
			              <i className='edit icon' />
			            </span>
			            <span 
			            	className='right floated trash icon'
			            	onClick={this.handleDelete}
			            >
			              <i className='trash icon' />
	            		</span>
	          		</div>
        		</div>
        		<TimerActionButton 
        			isRunning ={!!this.props.runningSince}
        			onStartClick = {this.handleStartClick}
        			onStopClick = {this.handleStopClick}
        		/>
      		</div>
		);
	}
}
class TimerActionButton extends React.Component {
	render() {
		if(this.props.isRunning) {
			return (
				<div 
					className='ui bottom attached red basic button'
					onClick={this.props.onStopClick}
				>
					Stop
				</div>
			);
		} else {
			return (
				<div 
					className='ui bottom attached green basic button'
					onClick={this.props.onStartClick}
				>
					Start
				</div>
			);
		}
	}
}

class ToggleableTimerForm extends React.Component {
	state ={
		isOpen:false
	};
	handleFormClose = () => {
		this.setState(Object.assign({},this.state,{
			isOpen:false,
		}))
	};
	handleFormOpen = () => {
		this.setState(Object.assign({},this.state,{
			isOpen:true,
		}));
	};
	handleFormSubmit =(timer) => {
		this.props.onSubmitForm(timer);
		this.setState(Object.assign({},this.state,{
			isOpen:false,
		}));
	};
	render(){
			if(this.state.isOpen){
				return (
 					<TimerForm 
 						onFormClose = {this.handleFormClose}
 						onFormSubmit ={this.handleFormSubmit}
 					/>
				);
			} else {
				return (
					<div className='ui basic content center aligned segment'>
			          <button className='ui basic button icon' onClick={this.handleFormOpen}>
			            <i className='plus icon' />
			          </button>
					</div>
				);
			}
	}
}


ReactDOM.render(
	<TimersDashboard />,
	document.getElementById("content")    
);
