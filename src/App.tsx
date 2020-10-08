import React from 'react';
import createStore from './store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
// import NowWhat from './components/NowWhat';
import Equipment from './Features/Metrics';
import Chart from './Features/Chart';
import Box from './Features/Box';

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const currentTime: number = Date.now();

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <Wrapper>
        <Header />
        {/* <NowWhat /> */}

        <Container>
          <Equipment />
          <Box />
          <Chart currentTime={currentTime} />
        </Container>
        <ToastContainer />
      </Wrapper>
    </Provider>
  </MuiThemeProvider>
);

export default App;
