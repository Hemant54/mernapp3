import React,{ useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Grid, Button,MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { Link } from 'react-router-dom';
import Login from '../Login/Login';
import { getUser } from '../../actions/index';
import innovativeLogo from '../../assets/innovative-ai-logo.png';
import axios from 'axios';
import Noty from 'noty';
import './header.css';
import "../../../node_modules/noty/lib/noty.css";  
import "../../../node_modules/noty/lib/themes/metroui.css";  

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#000"
        }
    },
    typography: createTypography(createPalette({}), {
      fontFamily: '"OverPass"',
    })
});

const useStyles = makeStyles (theme => ({
  button: {
    background: "transparent",
    borderRadius: 50,
    border: "2px solid #26B897",
    color: '#26B897',
    padding: '5px 20px',
  }
}));

const Header = (props) => {
    const classes = useStyles();
    const [userStatus, setUserStatus] = useState(false);
    const [linkDisabled, setLinkDisabled] = useState(false);
    if (props.userData._id && !userStatus) {
        setUserStatus(true);
    }
    if (!props.userData._id && userStatus) {
        setUserStatus(false);
    }

    useEffect(() => {
      var interviewRegex = RegExp('/part*');
      var brainmirrorRegex = RegExp('/brainmirror/test/*');
      if(interviewRegex.test(props.location.pathname) || brainmirrorRegex.test(props.location.pathname)) {
        setLinkDisabled(true);
      } else {
        setLinkDisabled(false);
      }
    },[props.location.pathname]);

    const showHeading = () => {
        if(props.location && props.location.pathname !== "/") {
            return (
                <Typography variant="h6">Innovative Labs</Typography>
            );
        } else {
            return null;
        }
    }

    const showButtons = () => {
        return (
            <React.Fragment>
                <Link className={linkDisabled ? "disabled-link" : ""} style={{textDecoration:"none",color:"inherit"}} to="/studentprofile"><Button className={classes.button} color="inherit"  style = {{ marginTop: '13px',marginRight:"10px" }}> Profile </Button></Link>
                <Button className={classes.button} color="inherit" variant="outlined" onClick = { handleLogout }  style = {{ marginTop: '13px' }}> Logout </Button>
            </React.Fragment>
        );
    }

    const handleLogout = () => {
        var interviewRegex = RegExp('/part*');
        var brainmirrorRegex = RegExp('/brainmirror/test/*');
        if(!interviewRegex.test(props.location.pathname) && !brainmirrorRegex.test(props.location.pathname)) {
          axios.get('/api/logout')
              .then(result => {
                  new Noty({
                    theme: 'metroui',
                    type: 'success',
                    text: '<Typography variant="h5">Logout Successfull.</Typography>',
                    layout: 'bottomRight',
                    timeout: 3500,
                    progressBar: true
                }).show();
                  props.getUser()
              }).catch(err => {
                  new Noty({
                    theme: 'metroui',
                    type: 'error',
                    text: '<Typography variant="h5">Error occurred on logout.</Typography>',
                    layout: 'bottomRight',
                    timeout: 3500,
                    progressBar: true
                }).show();
                  console.log(err);
          });
        } else {
          new Noty({
              theme: 'metroui',
              type: 'error',
              text: '<Typography variant="h5">No logout during test.</Typography>',
              layout: 'bottomRight',
              timeout: 3500,
              progressBar: true
          }).show();
        }
    }
    return (
    <MuiThemeProvider theme={theme}>
        <AppBar color="primary">
            <Grid container spacing = { 3 }>
                <Grid item xs = { 9 }>
                    <Toolbar>
                        <Link className={linkDisabled ? "disabled-link" : ""} to="/" style={{textDecoration:"none",color:"inherit"}}>
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <img src={innovativeLogo} alt="logo" style={{height:"50px",width:"50px",marginRight:"10px"}} />
                            { showHeading() }
                            </div>
                        </Link>
                    </Toolbar>
                </Grid>
                <Grid item xs = { 3 } style={{textAlign:"center"}}>
                    { !userStatus ? <Login /> : showButtons() }
                </Grid>
            </Grid>
      </AppBar>
    </MuiThemeProvider>
    );
};
const mapDispatchToProps = (dispatch) => ({
    getUser: () => dispatch(getUser())
  });
const mapStateToProps = (state) => {
    return {
        userData: state.auth.userData
    };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Header));
