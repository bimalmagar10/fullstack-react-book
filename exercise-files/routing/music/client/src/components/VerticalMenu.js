import React from 'react';
import { Link,NavLink } from 'react-router-dom';

import '../styles/VerticalMenu.css';

const VerticalMenu = ({ albums,albumMatchPath }) => {
  
  return (
	  <div className='ui secondary vertical menu'>
	    <div className='header item'>
	      Albums
	    </div>
	    {
	    	albums.map((album) => {
	    		return (
		    		<NavLink 
			    		to={`${albumMatchPath}/${album.id}`}
			    		className='item'
			    		key={album.id}
		    		>
		    		 {album.name}
		    		</NavLink>);
	    		}
	    	)
	    }

	  </div>);
};

export default VerticalMenu;
