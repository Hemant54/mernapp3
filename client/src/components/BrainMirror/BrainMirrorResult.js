import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import BrainAnimation from './BrainAnimation';
import BrainMirrorButton from './BrainMirrorButton';
import axios from 'axios';
import RootLoader from '../Utility/RootLoader';

class BrainMirrorResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			result: {},
			loading: true
		}
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		var result = {};
		if(this.props.leftTestResult && this.props.rightTestResult) {
			result = Object.assign(this.props.leftTestResult, this.props.rightTestResult, { mode: this.props.mode });
		}
		if(result) {
			const URL = 'https://persona-test-api.herokuapp.com';
			let axiosConfig = {
		      headers: {
		          'Content-Type': 'application/json'
		      }
		    };
		    result = JSON.stringify(result);
			axios.post(URL, result, axiosConfig)
				.then(res => {
					var data = res.data;
					var finalRes =[];
					for(var i=0;i<Object.keys(data).length;i++) {
						finalRes.push(data[i.toString()])
					}
					axios.post("/api/test/complete", { testname: "Brain Mirror", _id: this.props.userData._id })
						.then(data => {
							this.setState({ loading: false, result: finalRes });
						})
						.catch(err => {
							console.log("in error")
							console.log(err);
							this.setState({ loading: false, result: finalRes });
						})
				})
				.catch(err => {
					console.log("in error")
					console.log(err);
					this.setState({ loading: false, result: ["Error in result"] });
				})
		} else {
			console.log("no result");
		}
	}

	componentDidUpdate() {
		if(JSON.stringify(this.props.userData) === '{}') {
			this.setState({ redirect: true });
		}
	}

	handleClick = () => {
		this.setState({ redirect: true });
	}

	showResult = () => {
		if(this.state.result.length > 0) {
			return (
				this.state.result.map((res,key) => {
					return (
						<Typography variant="h5">{key+1}. {res}</Typography>
					);
				})
			)
		} else {
			return null;
		}
	} 

	showContent = () => {
		if(this.state.loading) {
			return <RootLoader />;
		} else {
			return (
				<React.Fragment>
				<Grid container>
					<Grid item xs={8}>
						<div className="result-container">
							<Typography variant="h3" className="brainmirror-heading">Brain Mirror</Typography>
							<Typography className="result-info">{this.props.mode === "English" ? "Your Personality traits define:" : "आपका व्यक्तित्व लक्षण परिभाषित करता है:"}</Typography>
							{ this.showResult() }
							<Typography className="result-info">{this.props.mode === "English" ? "Please take a screenshot of the result for future reference." : "कृपया भविष्य के संदर्भ के लिए परिणाम का स्क्रीनशॉट लें।"}</Typography>
						</div>
					</Grid>
					<Grid item xs={4}>
						<div className="result-animation">
							<div className="middle-container">
								<BrainAnimation />
							</div>
						</div>
					</Grid>
				</Grid>
				<div className="button-container">
					<BrainMirrorButton handleClick={this.handleClick} text="Home" />
				</div>
				</React.Fragment>
			);
		}
	}
	render() {
		if(this.state.redirect) {
			return <Redirect to="/" />
		} else {
			return (
				<div className="brainmirror-container">
					{ this.showContent() }
				</div>
			);
		}
	}
}

function mapStateToProps (state) {
    return {
        userData: state.auth.userData,
        leftTestResult: state.brainmirror.leftResult,
        rightTestResult: state.brainmirror.rightResult,
        mode: state.brainmirror.mode
    };
};

export default connect(mapStateToProps, null)(BrainMirrorResult);