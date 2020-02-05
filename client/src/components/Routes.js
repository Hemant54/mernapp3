import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "./Header/Header";
import Home from "./Home/Home";
import TestOption from "./TestOption/TestOption";
import StudentProfile from "./StudentProfile/StudentProfile";
import Instructions from "./InterviewSimulator/Instructions";
import EachTest from "./InterviewSimulator/EachTest";
import EachTest2 from "./InterviewSimulator/EachTest2";
import EachTest3 from "./InterviewSimulator/EachTest3";
import CompleteTest from "./InterviewSimulator/CompleteTest";
import RootLoader from './Utility/RootLoader';
import BrainMirrorIntro from './BrainMirror/BrainMirrorIntro';
import BrainMirrorLeftTest from './BrainMirror/BrainMirrorLeftTest';
import BrainMirrorRightTest from './BrainMirror/BrainMirrorRightTest';
import LeftBrainTest from './BrainMirror/LeftBrainTest';
import RightBrainTest from './BrainMirror/RightBrainTest';
import BrainMirrorResult from './BrainMirror/BrainMirrorResult';
import AnalyzerInstructions from "./InterviewAnalyzer/Instructions";
import Part1 from "./InterviewAnalyzer/Part1";
import Part2 from "./InterviewAnalyzer/Part2";
import Part3 from "./InterviewAnalyzer/Part3";
import AnalyzerCompleteTest from "./InterviewAnalyzer/TestComplete";
import Admin from './Admin/Admin';
import { getUser } from '../actions/index';

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
    this.props.getUser();
    this.renderContent = this.renderContent.bind(this);
  }

  componentDidMount() {
    var that = this;
    if(that.state.isLoading) {
      setTimeout(function() {
        that.setState({ isLoading: false });
      }, 2000);
    }
  }

  renderContent = () => {
    if(this.state.isLoading) {
      return <RootLoader />
    }
    return (
      <BrowserRouter>
        <Header />
        <br />
        <br />
        <br />
        <br />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/studentprofile" component={StudentProfile} />
          <Route path="/testoption" component={TestOption} />
          <Route path="/admin" exact component={Admin} />
          <Route path="/interviewsimulator/instructions" component={Instructions} />
          <Route path="/interviewsimulator/part1" component={EachTest} />
          <Route path="/interviewsimulator/part2" exact component={EachTest2} />
          <Route path="/interviewsimulator/part3" exact component={EachTest3} />
          <Route path="/interviewsimulator/test/complete" exact component={CompleteTest} />
          <Route path="/interviewanalyzer/instructions" component={AnalyzerInstructions} />
          <Route path="/interviewanalyzer/part1" component={Part1} />
          <Route path="/interviewanalyzer/part2" exact component={Part2} />
          <Route path="/interviewanalyzer/part3" exact component={Part3} />
          <Route path="/interviewanalyzer/test/complete" exact component={AnalyzerCompleteTest} />
          <Route path="/brainmirror/intro" exact component={BrainMirrorIntro} />
          <Route path="/brainmirror/result" exact component={BrainMirrorResult} />
          <Route path="/brainmirror/test/leftbrain" exact component={LeftBrainTest} />
          <Route path="/brainmirror/test/leftbrain/start" component={BrainMirrorLeftTest} />
          <Route path="/brainmirror/test/rightbrain" exact component={RightBrainTest} />
          <Route path="/brainmirror/test/rightbrain/start" component={BrainMirrorRightTest} />
        </Switch>
      </BrowserRouter>
    );
  }
  render() {
      return (
        this.renderContent()
      );
  }
};

function mapStateToProps(state) {
  return {
    userData: state.auth.userData,
    tests: state.questions.tests
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUser: getUser
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
