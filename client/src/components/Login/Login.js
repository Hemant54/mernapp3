import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core";
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import { getUser } from "../../actions/index";
import Noty from 'noty';
import "../../../node_modules/noty/lib/noty.css";  
import "../../../node_modules/noty/lib/themes/metroui.css";  

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

const Login = props => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [redirect, setRedirect] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("/api/login", {
        email: e.target.email.value,
        password: e.target.password.value
      })
      .then(result => {
        if (result.status === 200) { 
          new Noty({
              theme: 'metroui',
              type: 'success',
              text: '<Typography variant="h5">Login Successfull.</Typography>',
              layout: 'bottomRight',
              timeout: 3500,
              progressBar: true
          }).show();
          props.getUser();
          setOpen(false);
          setError("");
          setRedirect(true);
        }
      })
      .catch(err => {
        setError("Error logging in user, please check your credentials.");
      });
  };

  if(redirect) {
    return <Redirect to="/testoption" />
  }

  return (
    <MuiThemeProvider theme={theme}>
      <Button
        color="inherit"
        variant="outlined"
        type="button"
        onClick={handleOpen}
        style={{
          marginTop: "13px"
        }}
        className={classes.button}
      >
        login
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Innovative Labs Login</DialogTitle>
        <DialogContent>
          <form
            style={{ marginTop: "-15px", marginBottom: "20px" }}
            onSubmit={handleSubmit}
          >
            {error ? <p style={{ color: "red" }}> {error} </p> : undefined}
            <TextField
              label="Email"
              type="email"
              name="email"
              margin="normal"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              margin="normal"
              variant="outlined"
              fullWidth
              required
            />
            <Button type="submit" fullWidth color="primary" variant="contained">
              {" "}
              Submit{" "}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </MuiThemeProvider>
  );
};

const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Login)
);
