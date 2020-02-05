import React from 'react';
import { Button } from '@material-ui/core';

const buttons = {
  background: "transparent",
  borderRadius: 10,
  border: "2px solid rgba(0,0,0,0.7)",
  color: "#000",
  padding: "5px 20px",
  textDecoration: "none",
  fontSize: "15px"
};

const BrainMirrorButton = (props) => {
	return (
		<Button style={buttons} color="primary" variant="outlined" onClick={props.handleClick}>{props.text}</Button>
	);
}

export default BrainMirrorButton;