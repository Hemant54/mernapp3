import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Button, TextField } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";
import { getUser } from "../../actions/index";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4)
  }
}));

const Register = props => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (e.target.password.value === e.target.cpassword.value) {
      axios
        .post("/api/register", {
          email: e.target.email.value,
          password: e.target.password.value,
          name: e.target.name.value,
          mobile: e.target.mobile.value
        })
        .then(result => {
          alert("User Register Succesfull");
          setOpen(false);
        })
        .catch(err => {
          setError("Error Register in user");
        });
    } else {
      setError("Both passwords should match");
    }
  };
  return (
    <div>
      <Button
        type="button"
        onClick={handleOpen}
        style={{
          marginTop: "10px"
        }}
      >
        Register
      </Button>
      <Modal open={open} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <h2>Register</h2>
          <hr />
          {error ? <p style={{ color: "red" }}> {error} </p> : undefined}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              type="text"
              name="name"
              margin="normal"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Mobile"
              type="tel"
              name="mobile"
              margin="normal"
              variant="outlined"
              fullWidth
              required
            />
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
            <TextField
              label="Confirm Password"
              type="password"
              name="cpassword"
              margin="normal"
              variant="outlined"
              fullWidth
              required
            />
            <Button type="submit" fullWidth variant="contained">
              {" "}
              Submit{" "}
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(getUser())
});

export default connect(
  undefined,
  mapDispatchToProps
)(Register);
