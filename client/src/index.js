import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import reduxThunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import App from "./components/Routes";
import reducers from "./reducer/index";

const theme = createMuiTheme({
  typography: createTypography(createPalette({}), {
    fontFamily: '"OverPass"',
  })
});


const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
	  <Provider store={store}>
	    <App />
	  </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
