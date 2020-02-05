import React from 'react';
import { Link } from "react-router-dom";
import {
  Button,
  Typography,
  FormControlLabel,
  Modal,
  Backdrop,
  Fade,
  Checkbox,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core";
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import { makeStyles } from "@material-ui/core/styles";

const useStylesModal = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "4px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "80%"
  },
  button: {
    margin: theme.spacing(1)
  }
}));

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

const TermsAndConditions = props => {
	const classesModal = useStylesModal();
	return (
		<MuiThemeProvider theme={theme}>
		<Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classesModal.modal}
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        disableBackdropClick={true}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={props.open}>
          <div className={classesModal.paper}>
            <center>
              <Typography variant="h4" style={{ color: "#0ccbaa" }}>Terms & Conditions</Typography>
              
              <Typography>
                The content of this test is highly confidential, Innovative Labs
                owns the intellectual property rights as defined by law. To
                ensure confidentiality, you must agree to the following terms 
                and conditions before taking the test.
              </Typography>
              </center>
              <Typography>
                <li>
                You will not record, copy, publish or share any part of the test
                questions or answers in any form(verbal, written) or by any
                means(manual, electronic) for any purpose.
                </li>
              </Typography>
              <Typography>
                <li>
                You acknowledge that the test will be taken solely by you and
                that you will not consult any third person or use any other
                online or offline resource.
                </li>
              </Typography>
              <Typography>
                <li>
                You will receive warnings if prohibited behavior is detected.
                Multiple instances of prohibited behavior will result in the
                automatic shutdown of the test and rejection of your
                application.
                </li>
              </Typography>
              <Typography>
                <li>
                Behaviours will be tracked during this assessment( e.g. browser
                usage, screen captures, photographs, audio, video, etc.) to
                ensure a fair process for all candidates.
                </li>
              </Typography>
              <Typography>
                <li>
                We know that you care how we use information about you and we
                appreciate your trust in us to do that carefully and sensibly.
                </li>
              </Typography>
            <center>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.agree}
                    onChange={props.setagree}
                    value="checkedB"
                    color="primary"
                  />
                }
                label="I agree to Terms and Conditions"
              />
            </center>
            <center>
              <Button
                variant="contained"
                color="secondary"
                onClick={props.handleClose}
                className={classesModal.button}
              >
                Cancel
              </Button>

              {props.tests.length > 0 && props.agree === true ? (
                // eslint-disable-next-line
                props.tests.map((eachtest, key) => {
                  if(eachtest.testname === props.test.test) {
                    return (
                      <Link
                        style={{ textDecoration: "none", color: "inherit" }}
                        to={`${props.test.url}?id=${eachtest._id}`}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          className={classesModal.button}
                        >
                          Confirm
                        </Button>
                      </Link>
                    );
                }
                })
              ) : (
                <Typography variant="body1" style={{ color: "red" }}>
                  *Please Accept Terms and Conditions to begin the test
                </Typography>
              )}
            </center>
          </div>
        </Fade>
      </Modal>
      </MuiThemeProvider>
	);
}

export default TermsAndConditions;