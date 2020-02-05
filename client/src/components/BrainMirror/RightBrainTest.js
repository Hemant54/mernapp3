import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Tooltip } from "@material-ui/core";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { getUser, brainRightTestResult } from '../../actions/index';
import BrainAnimation from './BrainAnimation';
import BrainMirrorButton from './BrainMirrorButton';
import Loading from '../Utility/Loading';
import axios from 'axios';
import Noty from 'noty';
import "../../../node_modules/noty/lib/noty.css";  
import "../../../node_modules/noty/lib/themes/metroui.css";  

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#121212',
    maxWidth: 300,
    color: "#f7f7f7",
    padding: "15px",
    borderRadius: "5px"
  },
}))(Tooltip);

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class RightBrainTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questions: [],
			questionId: 0,
			redirect: false,
			slider: 0,
			result: {},
			user: null,
			loading: true,
			definition: "",
			redirecthome: false
		}
		this.handleClick = this.handleClick.bind(this);
		this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
	}

	componentDidMount() {
		var that = this;
		document.body.addEventListener("keypress", function(e) {
			var keyPressed = e.key;
			if(keyPressed === "Enter") {
				that.handleClick();
			} else if(keyPressed === "1" || keyPressed === "2" || keyPressed === "3" || keyPressed === "4") {
				that.handleSelect(Number(e.key));
			}
		});
		this.props.getUser();
		if(this.props.userData) {
			if(this.props.userData.isVerified) {
				const testName = "Brain Mirror";
				var questionsArray = [];
				var data = [];
				axios.get("/api/test/" + testName).then(res => {
					var index = this.props.mode === "English" ? 1 : 3;
					data = res.data[0].questionArray[index];
					for (var i = 0; i < Object.keys(data).length; i++) {
						var optionsArray = data[i.toString()].split(",");
						var definitionIndex = (optionsArray[3] && optionsArray[4]) ? 3 : 0; 
						questionsArray.push({
							options: {
								"first": optionsArray[0].trim(),
								"second": optionsArray[1].trim()
							},
							key: optionsArray[2].trim(),
							definitions: [optionsArray[definitionIndex] , optionsArray[definitionIndex+1]]
						});
					}
					shuffle(questionsArray);
					this.setState({ questions: questionsArray, user: this.props.userData, loading: false });
				})
				.catch(err =>{
					console.log(err);
					this.setState({ questions: [], user: this.props.userData, loading: true });
				});
			} else {
				new Noty({
		          theme: 'metroui',
		          type: 'error',
		          text: '<Typography variant="h5">Please verify your phone number to proceed.</Typography>',
		          layout: 'bottomRight',
		          timeout: 3500,
		          progressBar: true
		        }).show();
		        this.setState({ redirecthome: true });
			}
		}
	}

	handleClick = () => {
		const hasAnswered = this.state.result[this.state.questions[this.state.questionId]["key"]] !== undefined;
		if(hasAnswered) {
			const nextQues = this.state.questionId + 1;
			if(nextQues < this.state.questions.length) {
				this.setState({ slider: 0, questionId: nextQues });
			} else {
				this.props.brainRightTestResult(this.state.result);
				this.setState({ slider: 0, redirect: true });
			}
		} else {
			new Noty({
              theme: 'metroui',
              type: 'error',
              text: 'Please select a choice.',
              layout: 'bottomRight',
              timeout: 1000,
              progressBar: true
	        }).show();
	        return;
		}
	}

	handleOnMouseOver = (e) => {
		const word = e.currentTarget.innerText.trim();
		const questions = this.state.questions;
		if(word === questions[this.state.questionId].options.first) {
			this.setState({ definition: questions[this.state.questionId].definitions[0] });
		} else if(word === questions[this.state.questionId].options.second) {
			this.setState({ definition: questions[this.state.questionId].definitions[1] });	
		}
	}

	handleSelect(number) {
		var resultData = this.state.result;
		resultData[this.state.questions[this.state.questionId]["key"]] = number;
		this.setState({ slider: number, result: resultData });
	}

	render() {

		if(this.state.redirect) {
			return <Redirect to="/brainmirror/result" />
		}

		if(!this.state.loading && this.state.user === null || this.state.redirecthome) {
			return <Redirect to="/" />
		}

		const { slider, loading } = this.state;

		if(loading) {
			return <Loading />
		} else {
			return (
				<div className="brainmirror-container">
					<Grid container>
						<Grid style={{height:"75vh"}} item xs={3}>
							<div className="leftbrain-animation-container">
								<Typography variant="h3" className="brainmirror-heading">Brain Mirror</Typography>
								<BrainAnimation />
								<Typography variant="h5" className="brainmirror-heading">{this.props.mode === "English" ? "Analysing right side of the brain" : "मस्तिष्क के दाईं ओर का विश्लेषण"}</Typography>
							</div>
						</Grid>
						<Grid item xs={9}>
							<div className="test-container">
								<Typography style={{textAlign:"left",marginLeft:"30px"}} variant="h3">{this.props.mode === "English" ? "I perceive myself as:" : "मैं खुद को इस रूप में देखता हूं:"}</Typography>
								<div className="choices-container">
									<div className="choices-text">
									<HtmlTooltip
								        title={
								          <React.Fragment>
								            <Typography variant="h5">{this.state.questions[this.state.questionId].options["first"]}</Typography>
								           	<Typography>Definition: {this.state.definition}</Typography>
								          </React.Fragment>
								        }
								        placement="top-start"
								    >
						            	<Typography className="extreme-value" onMouseOver={this.handleOnMouseOver} variant="h4">{!loading && this.state.questions ? this.state.questions[this.state.questionId].options["first"] : null}</Typography>
							        </HtmlTooltip>
							        <HtmlTooltip
								        title={
								          <React.Fragment>
								            <Typography variant="h5">{this.state.questions[this.state.questionId].options["second"]}</Typography>
								           	<Typography>Definition: {this.state.definition}</Typography>
								          </React.Fragment>
								        }
								        placement="top-end"
								    >
										<Typography className="extreme-value" onMouseOver={this.handleOnMouseOver} variant="h4">{!loading && this.state.questions ? this.state.questions[this.state.questionId].options["second"] : null}</Typography>
									</HtmlTooltip>
									</div>
									<div className="choices-select">
										<div onClick={() => this.handleSelect(1)} className={"select-bar " + (slider >= 1 ? "selected" : "")}></div>
										<div className={"slide-bar " + (slider > 1 ? "selected" : "")}></div>
										<div onClick={() => this.handleSelect(2)} className={"select-bar " + (slider > 1 ? "selected" : "")}></div>
										<div className={"slide-bar " + (slider > 2 ? "selected" : "")}></div>
										<div onClick={() => this.handleSelect(3)} className={"select-bar " + (slider > 2 ? "selected" : "")}></div>
										<div className={"slide-bar " + (slider > 3 ? "selected" : "")}></div>
										<div  onClick={() => this.handleSelect(4)} className={"select-bar " + (slider > 3 ? "selected" : "")}></div>
									</div>
								</div>
								<Typography className="info-text">{this.props.mode === "English" ? "Mark the pointer or press 1,2,3,4 to select where you lie." : "उस बिंदु को चिह्नित करें जहां आपको लगता है कि आप हैं।"}</Typography>
								<div className="button-container">
									<BrainMirrorButton handleClick={this.handleClick} text={this.props.mode === "English" ? "Next" : "आगे"} />
								</div>
							</div>
						</Grid>
					</Grid>
				</div>
			);
		}
	}
}


function mapStateToProps (state) {
    return {
        userData: state.auth.userData,
        rightTestResult: state.brainmirror.rightResult,
        mode: state.brainmirror.mode
    };
};

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        getUser: getUser,
        brainRightTestResult: brainRightTestResult
    }, dispatch)
};


export default connect(mapStateToProps, mapDispatchToProps)(RightBrainTest);