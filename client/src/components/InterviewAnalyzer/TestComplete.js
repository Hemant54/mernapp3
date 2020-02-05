import React, {useState,useEffect} from 'react';
import { Typography , MuiThemeProvider, createMuiTheme, Button } from '@material-ui/core';
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getUser } from '../../actions/index';
import { Redirect } from 'react-router-dom';
import '../InterviewSimulator/completetest.css';

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

function TestComplete (props) {

  const [userStatus, setUserStatus] = useState(false);
  const queryParams = props.location.search ? props.location.search.split("&") : null;
  const error = queryParams ? queryParams[0].split("=")[1] : null;
  const [onetimeerror, setOneTime] = useState(0);
    // eslint-disable-next-line
  var [url,setUrl] = useState((queryParams && queryParams[1].split("=")[1]) ? queryParams[1].split("=")[1] : `/api/downloadVideo/${props.userData.name}/${"Interview Analyzer"}/${props.userData.test !== 0 ? props.userData.module - props.userData.test + 1 : props.userData.module}`);
  if (props.userData._id && !userStatus) {
    setUserStatus(true);
  }
  if (!props.userData._id && userStatus) {
      setUserStatus(false);
  }

  useEffect( ()=> {
    props.getUser()
    // eslint-disable-next-line
  },[]);

  if(!userStatus || !props.tests) {
    return (
        <Redirect to = '/' />
    );
  }

  if(userStatus && error && onetimeerror === 0) {
      setOneTime(1);
      alert("Sorry, please try again!");
  }

  const handleDownload = (url) => {
    var URL = `${process.env.REACT_APP_URL}${url}`;
    window.open(URL);
  }

  return(
    <MuiThemeProvider theme={theme}>
      <div className="complete-test-container">
        <span className="checkmark">&#10003;</span>
        <Typography variant="h4">Thank you for taking the test</Typography>
        <Typography variant="h4">Your video is available for review.</Typography>
        <Typography variant="h4">Analysis will be mailed to you on your registered email.</Typography>
        <Button variant="contained" color="primary" onClick={() => handleDownload(url)}>
          Download
        </Button>
      </div>
    </MuiThemeProvider>
  )
}
function mapStateToProps (state) {
  return {
      userData: state.auth.userData,
      tests: state.questions.tests  
  };
};
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
      getUser: getUser
  }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(TestComplete);
