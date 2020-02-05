import React, { Component } from 'react';
import { Grid,Typography, MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { connect } from 'react-redux';
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import { bindActionCreators } from "redux";
import { setBrainMirrorMode, getUser } from '../../actions/index';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Redirect } from 'react-router-dom';
import BrainMirrorButton from './BrainMirrorButton';
import Loading from '../Utility/Loading';
import Noty from 'noty';
import "../../../node_modules/noty/lib/noty.css";  
import "../../../node_modules/noty/lib/themes/metroui.css";
import "./brainmirror.css";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#26B897"
        }
    },
    typography: createTypography(createPalette({}), {
      fontFamily: '"OverPass"',
    })
});

const Intro = ({mode}) => {
	if(mode === "English") {
		return (
			<div className="brainmirror-intro">
				<Typography className="para first-para" variant="h5">This assessment will help you introspect yourself by generating a clear image of your brain, using inner engineering techniques.</Typography>
				<Typography className="para second-para" variant="h5">We believe that you know the most about yourself and with this hypothesis our brain mirror works as a self-analysis tool.</Typography>
			</div>
		);
	} else if(mode === "Hindi") {
		return (
		<div className="brainmirror-intro">
			<Typography className="para first-para" variant="h5">यह आकलन आंतरिक इंजीनियरिंग तकनीकों का उपयोग करके, अपने मस्तिष्क की एक स्पष्ट छवि उत्पन्न करके आपको आत्मनिरीक्षण करने में मदद करेगा।</Typography>
			<Typography className="para second-para" variant="h5">हम मानते हैं कि आप अपने बारे में सबसे अधिक जानते हैं और इस परिकल्पना के साथ हमारा मस्तिष्क दर्पण आत्म-विश्लेषण उपकरण के रूप में काम करता है।</Typography>
		</div>
	);
	}
	
}

const Instructions = ({ mode }) => {
	if(mode === "English") {
		return (
			<div className="brainmirror-instr">
				<Typography className="instruction-heading" variant="h4">Instructions</Typography>
				<Typography variant="h5">
					1. Concentrate on the questions answer them only after understanding correctly.
				</Typography>
				<Typography variant="h5">
					2. All questions are mandatory.
				</Typography>
				<Typography variant="h5">
					3. If you dont know the meaning of the word, hover your cursor over it and the meaning will be shown.
				</Typography>
				<Typography variant="h5">
					4. The Test is divided into two sections, left brain and right brain respectively.
				</Typography>
				<Typography variant="h5">
					5. After completing the test, wait a few seconds for the result. 
				</Typography>
			</div>
		);
	} else if(mode === "Hindi") {
		return (
			<div className="brainmirror-instr">
				<Typography className="instruction-heading" variant="h4">अनुदेश</Typography>
				<Typography variant="h5">
					1. प्रश्नों पर ध्यान लगाकर उन्हें सही तरीके से समझने के बाद ही उत्तर दें।
				</Typography>
				<Typography variant="h5">
					2. सभी प्रश्न अनिवार्य हैं।
				</Typography>
				<Typography variant="h5">
					3. यदि आप शब्द का अर्थ नहीं जानते हैं, तो उस पर अपने कर्सर को घुमाएं और अर्थ दिखाया जाएगा।
				</Typography>
				<Typography variant="h5">
					4. टेस्ट को क्रमशः दो वर्गों, बाएं मस्तिष्क और दाएं मस्तिष्क में विभाजित किया गया है।
				</Typography>
				<Typography variant="h5">
					5. परीक्षण पूरा करने के बाद, परिणाम के लिए कुछ सेकंड प्रतीक्षा करें।
				</Typography>
			</div>
		);
	}
}

class BrainMirrorIntro extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentStep: 0,
			redirect: false,
			redirecthome: false,
			open: true,
			mode: "",
			loading: true
		}
		this.handleClick = this.handleClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentDidMount() {
		this.props.getUser();
	}

	componentDidUpdate() {
		if(JSON.stringify(this.props.userData) === '{}') {
			this.setState({ redirecthome: true });
		} else {
			if(!this.props.userData.isVerified && !this.state.redirecthome) {
				new Noty({
		          theme: 'metroui',
		          type: 'error',
		          text: '<Typography variant="h5">Please verify your phone number to proceed.</Typography>',
		          layout: 'bottomRight',
		          timeout: 3500,
		          progressBar: true
		        }).show();
		        this.setState({ redirecthome: true });
			} else if(this.props.userData.isVerified && this.state.loading) {
				this.setState({ loading: false });
			}
		}
	}

	handleChange = name => {
		this.props.setBrainMirrorMode(name);
		this.setState({ mode: name, open: false });    
	}

	handleClick = () => {
		if(this.state.currentStep === 1) {
			this.setState({ redirect: true });
		} else if(this.state.currentStep === 0) {
			this.setState({ currentStep: 1 });
		}
	}

	handleClose = () => {
		this.setState({ open: false });
	}

	render() {
		if(this.state.redirect) {
			return <Redirect to="/brainmirror/test/leftbrain/start" />
		} 
		if(this.state.redirecthome) {
			return <Redirect to="/" />
		}
		if(this.state.loading) {
	      return <Loading />;
	    } else {
	    	if(this.state.open) {
				return (
					<MuiThemeProvider theme={theme}>
					<Dialog open={this.state.open} onClose={this.handleClose}>
				        <DialogTitle className="dialog-header">Select Language</DialogTitle>
				        <DialogContent>
				          	<div className="mode-select-container">
				          		<div onClick={() => this.handleChange("English")} className="mode">
				          			<Typography>English</Typography>
				          		</div>
				          		<div onClick={() => this.handleChange("Hindi")} className="mode">
				          			<Typography>हिंदी</Typography>
				          		</div>
				          	</div>
				        </DialogContent>
				    </Dialog>
				    </MuiThemeProvider>
				);
			} else {
				return (
					<MuiThemeProvider theme={theme}>
					<div className="brainmirror-container">
						<Grid container>
							<Grid item xs={8} style={{paddingRight: "40px"}}>
								<Typography className="brainmirror-heading" variant='h3'>BRAIN MIRROR</Typography>
								{ this.state.currentStep === 0 ? <Intro mode={this.props.mode} /> : <Instructions mode={this.props.mode} /> }
							</Grid>
							<Grid item xs={4}>
								<img className="brain-image" src={require("../../assets/frontimage.jpg")} alt="Logo" />
							</Grid>
							<div className="button-container">
								<BrainMirrorButton handleClick={this.handleClick} text={this.props.mode === "English" ? "Next" : "आगे"} />
							</div>
						</Grid>
					</div>
					</MuiThemeProvider>
				);
			}
	    }
	}
}

function mapStateToProps (state) {
    return {
        userData: state.auth.userData,
        mode: state.brainmirror.mode
    };
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
	    {
	    	setBrainMirrorMode: setBrainMirrorMode,
	    	getUser: getUser
	    },
	    dispatch
	  );
}

export default connect(mapStateToProps,mapDispatchToProps)(BrainMirrorIntro);