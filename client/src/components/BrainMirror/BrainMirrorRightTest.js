import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { getUser } from '../../actions/index';
import BrainAnimation from './BrainAnimation';
import BrainMirrorButton from './BrainMirrorButton';
import Loading from '../Utility/Loading';
import Noty from 'noty';
import "../../../node_modules/noty/lib/noty.css";  
import "../../../node_modules/noty/lib/themes/metroui.css";

class BrainMirrorRightTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			user: null,
			loading: true,
			redirecthome: false
		}
		this.handleClick = this.handleClick.bind(this);
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
				this.setState({ user: this.props.userData, loading: false });
			}
		}
	}

	handleClick = () => {
		this.setState({ redirect: true });
	}

	render() {
		if(this.state.redirect) {
			return <Redirect to="/brainmirror/test/rightbrain" />
		}
		if(!this.state.loading && this.state.user === null || this.state.redirecthome) {
			return <Redirect to="/" />
		}

		const { loading } = this.state;

		if(loading) {
			return <Loading />
		} else {
			return (
				<div className="brainmirror-container">
					<div className="middle-container">
						<Typography variant="h3" className="brainmirror-heading">Brain Mirror</Typography>
						<BrainAnimation />
						<Typography variant="h5" className="brainmirror-heading">{this.props.mode === "English" ? "Analysing right side of the brain" : "मस्तिष्क के दाईं ओर का विश्लेषण"}</Typography>
					</div>
					<div className="button-container">
						<BrainMirrorButton handleClick={this.handleClick} text={this.props.mode === "English" ? "Next" : "आगे"} />
					</div>
				</div>
			);
		}
	}
}


function mapStateToProps (state) {
    return {
        userData: state.auth.userData,
        mode: state.brainmirror.mode
    };
};

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        getUser: getUser
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BrainMirrorRightTest);