import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Grid, Typography, createMuiTheme, MuiThemeProvider, CircularProgress, Button } from '@material-ui/core';
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { Redirect } from "react-router-dom";
import { getUser, getTests } from "../../actions/index";
import Loading from '../Utility/Loading';
import axios from 'axios';
import './testoption.css';
import TermsAndConditions from '../Utility/TermsAndConditions';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#26B897",
      contrastText: "#fff"
    }
  },
  typography: createTypography(createPalette({}), {
    fontFamily: '"OverPass"',
  })
});

const useStyles = makeStyles(theme => ({
  button: {
    background: "transparent",
    borderRadius: 50,
    border: "2px solid #26B897",
    color: "#26B897",
    padding: "5px 20px"
  }
}));

const TestOption = props => {
	const classes = useStyles();
	const [userStatus, setUserStatus] = useState(false);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
  	const [agree, setAgree] = useState(false);
  	const [test, setTest] = useState({});
  	const [openInterestedModal, setopenInterestedModal] = useState(false);
  	const [interestedLoading, setInterestedLoading] = useState(false);
  	const [interestedDone, setInterestedDone] = useState(false);
  	const [interestedTest, setInterestedTest] = useState(null);
  	const [userTests, setUserTests] = useState([]);
	useEffect(() => {
		props.getUser();
		props.getTests();
		// eslint-disable-next-line
	},[]); 

	const handleOpen = (test) => {
		if(props.userData.tests_opted.includes(test) || props.userData.admin) {
			var url;
			if(props.userData.isVerified) {
				if(test === "Brain Mirror") {
					if(props.userData.brainMirrorTaken) {
						alert("You can only take Brain Mirror test once!");
					} else {
						url = "/brainmirror/intro";
						setOpen(true);
						setTest({ test: test, url: url });
					}
				} else if(test === "Interview Test") {
					if(props.userData.test === 0) {
						alert("You have completed your module!");
					} else {
						url = "/interviewsimulator/instructions";
						setOpen(true);
						setTest({ test: test, url: url });
					}
				} else if (test === "Interview Analyzer") {
					if(props.userData.test === 0) {
						alert("You have completed your module!");
					} else {
						url = "/interviewanalyzer/instructions";
						setOpen(true);
						setTest({ test: test, url: url });
					}
				}
			} else {
				alert("You need to verify your phone number to proceed.");
			}
		} else {
			setInterestedTest(test);
			if(props.userData.interested_tests && props.userData.interested_tests.includes(test)) {
				alert("Already shown interest, please contact your institute.");
			} else {
				setopenInterestedModal(true);
			}
		}
	};

	const handleClose = () => {
	    setOpen(false);
	    setAgree(false);
	};

	const handleInterestedClose = () => {
		setopenInterestedModal(false);
	};

	const handleInterested = () => {
		if(interestedTest !== null) {
			setInterestedLoading(true);
			axios.post("/api/user/interested/test", { _id: props.userData._id,test: interestedTest })
				.then(res => {
					if(res.status === 200) {
						setInterestedLoading(false);
						setInterestedDone(true);
					}
				})
				.catch(err => {
					setInterestedLoading(false);
					setInterestedDone(false);
					alert("There was an error, please try again");
					console.log(err);
				});
		}
	}

	const showContent = () => {
		if(interestedDone) {
			return (
				<React.Fragment>
					<Typography>Please contact your institute</Typography>
					<Button onClick={handleInterestedClose} variant="contained" color="primary">Ok</Button>
				</React.Fragment>
			);	
		} else {
			return (
				<React.Fragment>
					<Button onClick={handleInterested} variant="contained" color="primary">yes</Button>
					<Button style={{marginLeft:"10px"}} onClick={handleInterestedClose}>No</Button>
				</React.Fragment>
			);
		}
	}

	if (props.userData._id && !userStatus) {
	    setUserStatus(true);
	    if(props.tests) {
	    	setUserTests(props.userData.tests_opted);
	    	setLoading(false);
	    }
	}
	if (!props.userData._id && userStatus) {
	    setUserStatus(false);
	    setLoading(false);
	}

	if(!loading && !userStatus) {
		return <Redirect to="/" />
	}

	if(loading) {
		return <Loading />;
	} else if(!loading && userStatus) {
		return (
			<MuiThemeProvider theme={theme}>
				<Grid container className="testoption-container">
					<Grid item xs={4}>
						<div className={"test-card " + (userTests ? userTests.includes("Interview Test") ? "opted" : "" : "")}>
							<Typography variant="h4" className="testname">Interview Simulator</Typography>
							<Button className={classes.button} onClick={() => handleOpen("Interview Test")}>Begin Test</Button>
						</div>
					</Grid>
					<Grid item xs={4}>
						<div className={"test-card " + (userTests ? userTests.includes("Brain Mirror") ? "opted" : "" : "")}>
							<Typography variant="h4" className="testname">Brain Mirror</Typography>
							<Button className={classes.button} onClick={() => handleOpen("Brain Mirror")}>Begin Test</Button>
						</div>
					</Grid>
					<Grid item xs={4}>
						<div className={"test-card " + (userTests ? userTests.includes("Interview Analyzer") ? "opted" : "" : "")}>
							<Typography variant="h4" className="testname">Interview Analyzer</Typography>
							<Button className={classes.button} onClick={() => handleOpen("Interview Analyzer")}>Begin Test</Button>
						</div>
					</Grid>	
					<Grid style={{textAlign: "center", marginTop: "30px"}} item xs={12}>
						<Typography>If you have any problem with the test environments or want to give feedback please mail us at <a style={{textDecoration:"none",color:"rgba(0,0,0,0.8)"}} href="mailto:support@hireonai.com">support@hireonai.com</a></Typography>
					</Grid>
				</Grid>
				<Dialog open={openInterestedModal} onClose={handleInterestedClose}>
			        <DialogContent style={{textAlign:"center"}}>
			        	<Typography variant="h5">You haven't opted for this test.</Typography>
						<Typography style={{marginTop:"10px"}}>Are you interested in this test?</Typography>
						<div style={{margin: "10px"}}>
							{ interestedLoading ? <CircularProgress /> : showContent() }
						</div>			          	
			        </DialogContent>
			    </Dialog>
				<TermsAndConditions test={test} open={open} agree={agree} handleClose={handleClose} tests={[...props.tests,{testname:"Interview Analyzer",_id:"5d51101d2a051a68280ef0f2"}]} setagree={() => setAgree(!agree)} />
			</MuiThemeProvider>
		);
	}
}

function mapStateToProps(state) {
  return {
    userData: state.auth.userData,
    tests: state.questions.tests
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUser: getUser,
      getTests: getTests
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestOption);