import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUser, getInstitutes } from "../../actions/index";
import { Redirect } from "react-router-dom";
import createPalette from '@material-ui/core/styles/createPalette';
import Loading from '../Utility/Loading';
import createTypography from '@material-ui/core/styles/createTypography';
import { 
  Typography,
  Button,
  Select,
  MuiThemeProvider,
  createMuiTheme,
  MenuItem,
  FormControl,
  Input,
  Checkbox,
  ListItemText,
  InputLabel
} from '@material-ui/core';
import axios from 'axios';
import './admin.css';

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


const buttons = {
  background: "transparent",
  borderRadius: 50,
  border: "2px solid #26B897",
  color: "#26B897",
  padding: "5px 20px",
  textDecoration: "none"
};

class Admin extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			email: "",
			password: "",
			mobile: "",
			module: "Select Module",
			gender: "Male",
			tests_opted: [],
			company: "Select Institute",
			loading: true,
			user: null,
			redirect: false
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.props.getUser();
		this.props.getInstitutes();
		if(this.props.userData) {
			this.setState({ user: this.props.userData, loading: false });
		}
	}

	componentDidUpdate(prevProps) {
		if(JSON.stringify(this.props.userData) === '{}') {
			this.setState({ redirect: true });
		}
	}

	handleChange = name => event => {
		if(name === "tests_opted") {
			const current_tests_selected = event.target.value;
			const current_tests_state = this.state.tests_opted;
			if(current_tests_state.indexOf("Interview Test") > -1 && (current_tests_selected.includes("Interview Test") && current_tests_selected.includes("Interview Analyzer"))) {
				event.target.value = event.target.value.filter(val => val != "Interview Test");
			} else if (current_tests_state.indexOf("Interview Analyzer") > -1 && (current_tests_selected.includes("Interview Test") && current_tests_selected.includes("Interview Analyzer"))) {
				event.target.value = event.target.value.filter(val => val != "Interview Analyzer");
			}
		} 
		this.setState({ [name]: event.target.value });
	}

	renderInstitutes = () => {
		if(this.props.institutes) {
			return this.props.institutes.map((institute, index) => {
				return <MenuItem key={index} value={institute.name}>{institute.name}</MenuItem>
			});
		}
	}

	handleSubmit = () => {
		const { name, email, password, mobile, gender, company, tests_opted } = this.state;
		if(this.state.module === "Select Module" || company === "Select Institute" || name === "" || email === "" || mobile === "" || tests_opted.length === 0) {
			alert("Please fill in all the details!");
		} else {
			const data = {
				name,
				email,
				password,
				mobile,
				tests_opted,
				gender,
				company,
				module: this.state.module
			}
			this.setState({ loading: true });
			axios.post("/api/admin/user/register",data)
				.then(res => {
					this.setState({ name: "", gender: "Male", company: "Select Institute", email: "", password: "", mobile: "", tests_opted: [],module: "Select Module",loading: false });
					alert("User Registration Successfull!");
				})
				.catch(err => {
					this.setState({ loading: false });
					alert(err.response.data.message);
				})
		}
	}

	render() {
		if((!this.state.loading && this.state.user === null) || (this.state.user && !this.state.user.admin) || this.state.redirect) {
			return <Redirect to="/" />
		}
		const { handleChange } = this;
		return (
			<MuiThemeProvider theme={theme}>
				<div className="register-form-container">
					<Typography variant="h5" className="register-heading">User Registration</Typography>
					<div className="form-control">
						<FormControl>
			              <InputLabel
			                htmlFor="component-simple"
			              >
			                Name
			              </InputLabel>
			              <Input
			              value={this.state.name}
			                id="component-simple"
			                onChange={handleChange("name")}		             
			              />
			              </FormControl>
			          </div>
			          <div className="form-control">
			          <FormControl>
			              <InputLabel
			                htmlFor="component-simple"
			              >
			                Email Id
			              </InputLabel>
			              <Input
			              value={this.state.email}
			                type="email"
			                id="component-simple"
			                onChange={handleChange("email")}		             
			              />
			            </FormControl>
			          </div>
			          <div className="form-control">
			          <FormControl>
			              <InputLabel
			                htmlFor="component-simple"
			              >
			                Password
			              </InputLabel>
			              <Input
			              value={this.state.password}
			                type="password"
			                id="component-simple"
			                onChange={handleChange("password")}		             
			              />
			            </FormControl>
			          </div>
			          <div className="form-control">
						<FormControl>
			              <InputLabel
			                htmlFor="component-simple"
			              >
			                Mobile
			              </InputLabel>
			              <Input
			              value={this.state.mobile}
			                id="component-simple"
			                onChange={handleChange("mobile")}	             
			              />
			              </FormControl>
			          </div>
			          <div className="form-control">
			          	<FormControl>
				            <InputLabel  htmlFor="module-simple">
				              Module
				            </InputLabel>
				            <Select onChange={handleChange("module")} value={this.state.module}>
				              <MenuItem value="Select Module">Select Module</MenuItem>
				              <MenuItem value={6}>Six</MenuItem>
				              <MenuItem value={10}>Ten</MenuItem>
				              <MenuItem value={14}>Fourteen</MenuItem>
				            </Select>
				         </FormControl>
			          </div>
			          <div className="form-control">
			          	<FormControl>
				            <InputLabel  htmlFor="module-simple">
				              Gender
				            </InputLabel>
				            <Select onChange={handleChange("gender")} value={this.state.gender}>
				              <MenuItem value="Male">Male</MenuItem>
				              <MenuItem value="Female">Female</MenuItem>
				              <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
			            	</Select>
			            </FormControl>
			          </div>
			          <div className="form-control">
			          <FormControl>
			          	<InputLabel  htmlFor="module-simple">
		                    Institute
		                </InputLabel>
		                <Select
		                  value={this.state.company}
		                  onChange={handleChange("company")}
		                >	
		                	<MenuItem value="Select Institute">Select Institute</MenuItem>
		                 	{ this.renderInstitutes() } 
		                </Select>
		              </FormControl>
			          </div>
			          <div className="form-control">
			          	<FormControl>
			          		<InputLabel htmlFor="select-multiple-checkbox">Test/s Opting</InputLabel>
					        <Select
					          multiple
					          className="multiple-select"
					          value={this.state.tests_opted}
					          onChange={handleChange("tests_opted")}
					          renderValue={selected => selected.join(', ')}
					          input={<Input id="select-multiple-checkbox" />}
					        >
					            <MenuItem key="Interview Simulator" value="Interview Test">
					              <Checkbox checked={this.state.tests_opted.indexOf("Interview Test") > -1} />
	              				  <ListItemText primary="Interview Simulator" />
					            </MenuItem>
					            <MenuItem key="Brain Mirror" value="Brain Mirror">
					              <Checkbox checked={this.state.tests_opted.indexOf("Brain Mirror") > -1} />
	             				  <ListItemText primary="Brain Mirror" />
					            </MenuItem>
					            <MenuItem key="Interview Analyzer" value="Interview Analyzer">
					              <Checkbox checked={this.state.tests_opted.indexOf("Interview Analyzer") > -1} />
	              				  <ListItemText primary="Interview Analyzer" />
					            </MenuItem>
					        </Select>
			          	</FormControl>
			          </div>
			          <div className="form-control">
			          	<Button onClick={this.handleSubmit} style={buttons}>Add User</Button>
			          </div>
				</div>
				{ this.state.loading ? <Loading /> : null }
			</MuiThemeProvider>
		);
	}
}

function mapStateToProps(state) {
  return {
    userData: state.auth.userData,
    institutes: state.institutes.institutes
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUser,
      getInstitutes
    },
    dispatch
  );
}
export default connect(mapStateToProps,mapDispatchToProps)(Admin);