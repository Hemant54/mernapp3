import React from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Button, Typography } from "@material-ui/core";
import { getUser } from "../../actions/index";
import Loading from '../Utility/Loading';
import Noty from 'noty';
import "../../../node_modules/noty/lib/noty.css";  
import "../../../node_modules/noty/lib/themes/metroui.css";

class Instructions extends React.Component {
  state = {
    redirect: false,
    loading: true
  };
  componentDidMount() {
    this.props.getUser();
  }
  componentDidUpdate(nextProps, nextState) {
    if (
      nextProps.userData !== this.props.userData &&
      !this.props.userData._id
    ) {
      this.setState({ redirect: true });
    } else {
      if(!this.props.userData.isVerified && !this.state.redirect) {
        new Noty({
          theme: 'metroui',
          type: 'error',
          text: '<Typography variant="h5">Please verify your phone number to proceed.</Typography>',
          layout: 'bottomRight',
          timeout: 3500,
          progressBar: true
        }).show();
        this.setState({ redirect: true });
      } else if(this.props.userData.isVerified && this.state.loading) {
        this.setState({ loading: false });
      }
    }
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    const questionID = this.props.location.search.split("=")[1];

    if(this.state.loading) {
      return <Loading />;
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <Typography variant="h2">Instructions</Typography>
          <Typography>Please patiently watch the video for smooth workflow of the test</Typography>
          <br />
          <iframe
            style={{ border: "none" }}
            title="Instructions"
            width="75%"
            height="450"
            src="https://www.youtube.com/embed/rEFWbU0SlT0?autoplay=1"
          ></iframe>
          <br />
          <br />
          <Link
            style={{ textDecoration: "none" }}
            to={`/interviewanalyzer/part1?id=${questionID}`}
          >
            <Button variant="contained" color="primary">
              Go to test
            </Button>
          </Link>
        </div>
      );
    }
  }
}
function mapStateToProps(state) {
  return {
    userData: state.auth.userData
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Instructions);
