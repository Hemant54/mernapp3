import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUser, getTests } from "../../actions/index";
import { Redirect, Link } from "react-router-dom";
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Select,
  Avatar,
  Radio,
  MuiThemeProvider,
  createMuiTheme,
  RadioGroup,
  FormLabel,
  MenuItem,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  Grid
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import Loading from '../Utility/Loading';
import Noty from 'noty';
import "../../../node_modules/noty/lib/noty.css";  
import "../../../node_modules/noty/lib/themes/metroui.css";

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

const styles = {
  padding: "15px 50px",
  margin: "10px 0",
  height: "auto", 
  position:"relative"
};


const buttons = {
  background: "transparent",
  borderRadius: 50,
  border: "2px solid #26B897",
  color: "#26B897",
  padding: "5px 20px",
  textDecoration: "none"
};

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  formControl: {
    margin: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  group: {
    margin: theme.spacing(1, 0)
  },
  bigAvatar: {
    margin: 10,
    width: 200,
    height: 200,
    cursor: "pointer"
  }
}));

function isObject(obj) {
    return obj != null && obj.constructor.name === "Object"
}

function StudentProfile(props) {
  const classes = useStyles();
  const [userStatus, setUserStatus] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [otpInput, setOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsverified] = useState(props.userData.isVerified);
  const [values, setValues] = useState({
    name: props.userData.name,
    address: props.userData.address ? props.userData.address.address : "",
    state: props.userData.address ? props.userData.address.state : "",
    city: props.userData.address ? props.userData.address.city : "",
    country: props.userData.address ? props.userData.address.country : "",
    pincode: props.userData.address ? props.userData.address.pincode : "",
    mobile: props.userData.mobile,
    prevMobile: props.userData.mobile,
    email: props.userData.email,
    age: props.userData.age,
    company: isObject(props.userData.company) ? props.userData.company.name : props.userData.company,
    format: props.userData.format,
    module: props.userData.module,
    gender: props.userData.gender,
    otp: "",
    test:
      props.userData.test !== null
        ? props.userData.test
        : props.userData.module,
    avatar: props.userData.avatar,
    preview: props.userData.avatar
  });
  useEffect(() => {
    props.getUser();
    // eslint-disable-next-line
  }, []);
  if (props.userData._id && !userStatus) {
    setUserStatus(true);
  }
  if (!props.userData._id && userStatus) {
    setUserStatus(false);
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
    if(name === "mobile") {
      if(values.prevMobile !== event.target.value) {
        setIsverified(false);
      } else {
        setIsverified(true);
      }
    }
  };

  const handleImageChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      setLoading(true);
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data"
        }
      };
      let data = new FormData();
      data.append(`upload`, file);
      data.append(`filename`, file.name);
      data.append(`_id`, props.userData._id);
      axios
        .post("/api/uploadProfile", data, config)
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            setLoading(false);
            new Noty({
              theme: 'metroui',
              type: 'success',
              text: '<Typography variant="h5">Avatar Updated!</Typography>',
              layout: 'bottomRight',
              timeout: 3500,
              progressBar: true
            }).show();
          }
        })
        .catch(err => {
          console.log(err);
        });
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        setValues({ ...values, preview: reader.result });
      });
    }
  };

  const handleAvatarClick = () => {
    var avatarInput = document.getElementById("avatar-select");
    avatarInput.click();
  }

  const handleVerifyModal = () => {
    setVerifyModal(true);
  }

  const handleVerifyClose = () => {
    setVerifyModal(false);
  }

  const handleSendOtp = () => {
    if(values.mobile !== "" && values.mobile.length === 10) {
      setLoading(true);
      axios.post("/api/profile/sendOtp", { phone: values.mobile })
        .then(data => {
          if(data.status === 200 && data.data.status === "200") {
            setOtpInput(true);
            setLoading(false);
            new Noty({
              theme: 'metroui',
              type: 'success',
              text: '<Typography variant="h5">OTP Sent Successfully!</Typography>',
              layout: 'bottomRight',
              timeout: 3500,
              progressBar: true
            }).show();
          }
        })
        .catch(err => {
          new Noty({
            theme: 'metroui',
            type: 'error',
            text: '<Typography variant="h5">Error occured please try again!</Typography>',
            layout: 'bottomRight',
            timeout: 3500,
            progressBar: true
          }).show();
        });
    } else {
      new Noty({
          theme: 'metroui',
          type: 'error',
          text: '<Typography variant="h5">Please check the mobile number.</Typography>',
          layout: 'bottomRight',
          timeout: 3500,
          progressBar: true
        }).show();
    }
  }

  const handleVerifyOtp = () => {
    if(values.mobile !== "" && values.mobile.length === 10 && values.otp !== "" && values.otp.length === 4) {
      setLoading(true);
      axios.post("/api/profile/verifyOtp", { phone: values.mobile, otp: values.otp })
        .then(data => {
          if(data.status === 200 && data.data.status === "200") {
            props.getUser();
            setVerifyModal(false);
            setLoading(false);
            setIsverified(true);
            new Noty({
              theme: 'metroui',
              type: 'success',
              text: '<Typography variant="h5">Verification Successfull!</Typography>',
              layout: 'bottomRight',
              timeout: 3500,
              progressBar: true
            }).show();
          }
        })
        .catch(err => {
            new Noty({
              theme: 'metroui',
              type: 'error',
              text: '<Typography variant="h5">Please enter a valid otp.</Typography>',
              layout: 'bottomRight',
              timeout: 3500,
              progressBar: true
            }).show();
        });
    } else {
      new Noty({
          theme: 'metroui',
          type: 'error',
          text: '<Typography variant="h5">Please enter a valid otp.</Typography>',
          layout: 'bottomRight',
          timeout: 3500,
          progressBar: true
        }).show();
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/updateProfile/" + props.userData._id, {
        email: values.email,
        name: values.name,
        address: {
          address: values.address,
          state: values.state,
          city: values.city,
          country: values.country,
          pincode: values.pincode
        },
        mobile: values.mobile,
        age: values.age,
        gender: values.gender,
        company: values.company,
        format: values.format,
        module: values.module,
        test: values.test
      })
      .then(result => {
        setLoading(false);
        new Noty({
          theme: 'metroui',
          type: 'success',
          text: '<Typography variant="h5">Profile Updated!</Typography>',
          layout: 'bottomRight',
          timeout: 3500,
          progressBar: true
        }).show();
      })
      .catch(err => {
        setLoading(false);
        alert("Error in Profile update");
      });
  };

  if (!userStatus) {
    return <Redirect to="/" />;
  }
  return (
    <MuiThemeProvider theme={theme}>
      <Grid container style={styles}>
        <Grid item xs={3}>
            <div style={{ padding: "3px" }}>
          <Avatar
            alt="Profile"
            src={values.preview}
            className={classes.bigAvatar}
            onClick={handleAvatarClick}
          />
          
          <Input style={{display:"none"}} id="avatar-select" type="file" name="upload" onChange={handleImageChange} />
          <FormControl className={classes.formControl}>
              <InputLabel
                htmlFor="component-simple"
              >
                Name
              </InputLabel>
              <Input
                disabled
                id="component-simple"
                value={values.name}
                onChange={handleChange("name")}
              />
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <InputLabel
              htmlFor="component-simple"
            >
              Email
            </InputLabel>
            <Input
              id="component-simple"
              disabled
              value={props.userData.email}
              onChange={handleChange("email")}
            />
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <InputLabel
              
              htmlFor="component-simple"
            >
              Institute
            </InputLabel>
            <Input
              disabled
              id="component-simple"
              value={values.company}
              onChange={handleChange("company")}
            />
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <InputLabel  htmlFor="module-simple">
              Module
            </InputLabel>
            <Select
              value={values.module ? values.module : ""}
              onChange={handleChange("module")}
              disabled
            >
              <MenuItem value={6}>Six</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={14}>Fourteen</MenuItem>
            </Select>
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <InputLabel
              htmlFor="component-simple"
            >
              No of tests left
            </InputLabel>
            <Input
              
              id="component-simple"
              value={`${values.test}/${values.module}`}
              disabled
            />
          </FormControl>
        </div>
        </Grid>
        
        <Grid item xs={9}>
            <div className={classes.container}>
              <FormControl className={classes.formControl}>
                <InputLabel
                  
                  htmlFor="component-simple"
                >
                  Address
                </InputLabel>
                <Input
                  
                  id="component-simple"
                  value={values.address}
                  onChange={handleChange("address")}
                />
              </FormControl>
            </div>
            <div className={classes.container}>
              <FormControl className={classes.formControl}>
                <InputLabel
                  
                  htmlFor="component-simple"
                >
                  City
                </InputLabel>
                <Input
                  
                  id="component-simple"
                  value={values.city}
                  onChange={handleChange("city")}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel 
                  htmlFor="component-simple"
                >
                  State
                </InputLabel>
                <Input
                  
                  id="component-simple"
                  value={values.state}
                  onChange={handleChange("state")}
                />
              </FormControl>
            </div>
            <div className={classes.container}>
              <FormControl className={classes.formControl}>
                <InputLabel
                  htmlFor="component-simple"
                >
                  Pincode
                </InputLabel>
                <Input
                  id="component-simple"
                  value={values.pincode}
                  onChange={handleChange("pincode")}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel
                  htmlFor="component-simple"
                >
                  Country
                </InputLabel>
                <Input
                  id="component-simple"
                  value={values.country}
                  onChange={handleChange("country")}
                />
              </FormControl>
            </div>
            <div className={classes.container}>
            <FormControl className={classes.formControl}>
                <InputLabel
                  htmlFor="component-simple"
                >
                  Age
                </InputLabel>
                <Input
                  type="number"
                  id="component-simple"
                  value={values.age}
                  onChange={handleChange("age")}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel  htmlFor="module-simple">
                    Gender
                </InputLabel>
                <Select
                  
                  value={values.gender ? values.gender : ""}
                  onChange={handleChange("gender")}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="not">Prefer not to say</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={classes.container}>
              <FormControl className={classes.formControl}>
                <InputLabel
                  htmlFor="component-simple"
                >
                  Mobile
                </InputLabel>
                <Input
                  id="component-simple"
                  value={values.mobile}
                  onChange={handleChange("mobile")}
                />
              </FormControl>
              { isVerified ? null : 
              <Button
                style={buttons}
                onClick={handleVerifyModal}
                type="button"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                verify
              </Button>
            }
            </div>
            <div className={classes.container}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel  component="legend">
                  Format
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="format"
                  className={classes.group}
                  value={values.format ? values.format : ""}
                  onChange={handleChange("format")}
                >
                  <FormControlLabel
                    value="student"
                    control={<Radio color="primary" />}
                    label="Academic"
                  />
                  <FormControlLabel
                    value="work"
                    control={<Radio color="primary" />}
                    label="General"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div>
            <Button
              style={buttons}
              onClick={handleSubmit}
              type="button"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Update
            </Button>
            </div>
            <div style={{position:"absolute",top: "20px",right:"30px"}}>
              <Link to="/testoption" style={{textDecoration:"none",color:"inherit"}}>
                <Button
                  style={buttons}
                  type="button"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Tests
                </Button>
              </Link>
            </div>
        </Grid>
      </Grid>
      <Dialog open={verifyModal} onClose={handleVerifyClose}>
        <DialogTitle>Verify Account</DialogTitle>
        <DialogContent>
            <FormControl className={classes.formControl}>
              <InputLabel
                htmlFor="component-simple"
              >
                Mobile
              </InputLabel>
              <Input
                id="component-simple"
                value={values.mobile}
                onChange={handleChange("mobile")}
              />
            </FormControl>
            <Button
                style={buttons}
                onClick={handleSendOtp}
                type="button"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                send otp
            </Button>
            { otpInput ?
              <div>
                <FormControl className={classes.formControl}>
                <InputLabel
                  htmlFor="component-simple"
                >
                  OTP
                </InputLabel>
                <Input
                  id="component-simple"
                  value={values.otp}
                  onChange={handleChange("otp")}
                />
              </FormControl>
              <Button
                  style={buttons}
                  onClick={handleVerifyOtp}
                  type="button"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Verify otp
              </Button>
              </div>
            : null }
        </DialogContent>
      </Dialog>
      { loading ? <Loading /> : null }
    </MuiThemeProvider>
  );
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
)(StudentProfile);
