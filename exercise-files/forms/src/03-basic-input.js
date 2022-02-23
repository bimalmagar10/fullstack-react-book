import React from 'react';
import isEmail from 'validator/lib/isEmail';

const Field = require('./03-field-component-field.js');

const content = document.createElement('div');
document.body.appendChild(content);

module.exports = class extends React.Component {
  static displayName = "03-basic-input";

  // state = {
  //   fields: {
  //     name: '',
  //     email: '',
  //   },
  //   fieldErrors: {},
  //   people: [],
  // };

  // onFormSubmit = evt => {
  //   const people = [ ...this.state.people ];
  //   const person = this.state.fields;

  //   evt.preventDefault();

  //   if (this.validate()) return;

  //   this.setState({
  //     people: people.concat(person),
  //     fields: { 
  //       name: '',
  //       email: '',
  //     }
  //   });
  // };

  // onInputChange = ({name, value, error}) => {
  //   const fields = Object.assign({}, this.state.fields);
  //   const fieldErrors = Object.assign({}, this.state.fieldErrors);

  //   fields[name] = value;
  //   fieldErrors[name] = error;
    
  //   this.setState({ fields, fieldErrors });
  // };

  // validate = () => {
  //   const person = this.state.fields;
  //   const fieldErrors = this.state.fieldErrors;
  //   const errMessages = Object.keys(fieldErrors).filter(k => fieldErrors[k]);

  //   if (!person.name) return true;
  //   if (!person.email) return true;
  //   if (errMessages.length) return true;

  //   return false;
  // };


  // render() {
  //   return (
  //     <div>
  //       <h1>Sign Up Sheet</h1>

  //       <form onSubmit={this.onFormSubmit} id="signUp" name="signUp">
  //         <Field
  //           placeholder='Name'
  //           name='name'
  //           value={this.state.fields.name}
  //           onChange={this.onInputChange}
  //           validate={val => (val ? false : 'Name Required')}
  //         />

  //       <br/>

  //       <Field
  //           placeholder='Email'
  //           name='email'
  //           type='email'
  //           value={this.state.fields.email}
  //           onChange={this.onInputChange}
  //           validate={val => (isEmail(val) ? false : 'Invalid Email')}
  //         />

  //       <br/>

  //         <input type='submit' disabled={this.validate()}/>
  //       </form>

  //       <br/>

  //       <div>
  //         <h3>People</h3>
  //         <ul>
  //           { this.state.people.map(({name, email}, i) => (
  //             <li key={i}>
  //               {name} ({email})
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     </div>
  //   );
  // }
  state = {
    fields:{
       name:'',
       email:'',
    },
    fieldErrors:{},
    people:[]
  };
  onInputChange = ({name,value,error}) => {
     const fields = Object.assign({},this.state.fields);
     const fieldErrors = Object.assign({},this.state.fieldErrors);
     fields[name] = value;
     fieldErrors[name] = error;

     this.setState({fields,fieldErrors});
  }

  onFormSubmit = (event) =>{
      const people = [...this.state.people];
      const person = this.state.fields;
      event.preventDefault();

      if(this.validate()) return;

      this.setState({
        people:people.concat(person),
        fields:{name:'',email:''}
      });
  };

  validate = () => {
    const people = this.state.fields;
    const fieldErrors = this.state.fieldErrors;
    const errMessages = Object.keys(fieldErrors).filter(k => fieldErrors[k]);
    if(!people.name) return true;
    if(!people.email) return true;
    if(errMessages.length) return true;
    return false;
  }; 

  render(){
    return (
      <div>
        <h1>Sign Up Sheet</h1>
        <form onSubmit ={this.onFormSubmit}>
          <Field 
              placeholder='Enter your name'
              name='name'
              value={this.state.fields.name}
              onChange={this.onInputChange}
              validate={val => (val ? false : 'Name Required')}
          />
          <Field 
              placeholder='Enter your email'
              name='email'
              value={this.state.fields.email}
              onChange={this.onInputChange}
              validate={val => (isEmail(val) ? false:"Email required")}
          />
          {/*<input 
              placeholder='Enter your name'
              name='name'
              value={this.state.fields.name}
              onChange={this.onInputChange}
          />
          <span style={{color:'red'}}>{this.state.fieldErrors.name}</span>
          <br></br>
          <input 
              placeholder='Enter your email'
              name='email'
              value={this.state.fields.email}
              onChange={this.onInputChange}
          />
          <span style={{color:'red'}}>{this.state.fieldErrors.email}</span>
          <br></br>*/}
          <input type='submit' disabled={this.validate()}/>
        </form>
        <div>
          <h3>Names</h3>
          <ul>
            {this.state.people.map(({name,email},i) => (<li key={i}>{name}  <b>:</b>  {email}</li>))}
          </ul>
        </div>
      </div>
    );
  }
};
