//THIS FILE IS CODED BY BIMAL THAPA MAGAR.
//ProductList Component
class ProductList extends React.Component {
  // constructor(props){
  //   super(props);

  //   this.state = {
  //     products:[]
  //   };
  //   this.handleUpVote = this.handleUpVote.bind(this);
  // }
  state = {
    products:[]
  };
  componentDidMount(){
    this.setState({products:Seed.products});
  }
  handleUpVote = (productId) =>{
    const newProducts = this.state.products.map(product => {
      if(product.id === productId){
        return Object.assign({},product,{
          votes:product.votes+1
        });
      } else {
        return product;
      }
    });
    this.setState({products:newProducts})
  }
  render(){
    const products =  this.state.products.sort((a,b) => {
      return b.votes - a.votes;
    })
    const productComponents = products.map(product => {
     return <Product 
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            votes={product.votes}
            avatarUrl={product.submitterAvatarUrl}
            imgUrl={product.productImageUrl}
            onVote={this.handleUpVote}
      />;
    });
    return (
         <div className='ui unstackable items'>
           {productComponents}
         </div>
      );
  }
}


//Product component
class Product extends React.Component{
  // constructor(props){
  //   super(props);
  //   this.upVote = this.upVote.bind(this);
  // }
  upVote = () => {
    this.props.onVote(this.props.id);
  }
  render() {
    return (
        <div className='item'>
          <div className='image'>
            <img src={this.props.imgUrl}/>
          </div>
          <div className='middle aligned content'>
            <div className='header'>
              <a onClick={this.upVote}>
                <i className='large caret up icon' />
              </a>
              {this.props.votes}
            </div>
            <div className='description'>
              <a>{this.props.title}</a>
              <p>{this.props.description}</p>
            </div>
            <div className='extra'>
              <span>Submitted by:</span>
              <img
                className='ui avatar image'
                src={this.props.avatarUrl}
              />
            </div>
          </div>
        </div>
      );
  }
}

ReactDOM.render(
    <ProductList />,
    document.getElementById('content')
);
