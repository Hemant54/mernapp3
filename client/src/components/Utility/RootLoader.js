import React from 'react';
import './utility.css';

const RootLoader = () => {
	return (
		<div className="root-loader">
          <img alt="Innovative Labs Logo" src={require("../../assets/innovative-ai-logo.png")} className="root-loader-logo" />
      	</div>
	);
}

export default RootLoader;