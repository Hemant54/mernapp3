import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography
} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import "./utility.css";

const useStyles = makeStyles(theme => ({
  progress: {
    color: "#26B897"
  },
}));

export default function CircularIndeterminate(props) {
  const classes = useStyles();

  return (
    <div className="loading-component">
    	<div className="loading">
      		<CircularProgress className={classes.progress} color="primary" />
          <Typography>{props.text}</Typography>
      	</div>
    </div>
  );
}