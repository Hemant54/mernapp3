import React from 'react';
import { Typography } from '@material-ui/core';
import videoFile from '../../assets/mem.mp4';
import "./home.css";

class Home extends React.Component {
    componentDidMount() {
      document.getElementsByTagName('video')[0].onended = function () {
        this.load();
        this.play();
      };
    }
    render () {
        return (
            <div className="home-div">
            	<div>
               <video width="520" height="420" src={videoFile} loop autoPlay muted>
               </video>
               <Typography variant="h3">Welcome to <span className="company">Innovative Labs</span></Typography>
            	</div>
            </div>
        );

    }
};
export default Home;
