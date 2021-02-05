import React, { useState } from 'react';
import './App.css';
import './body.css';
import { makeStyles } from '@material-ui/core/styles';
import { CubeProvider } from '@cubejs-client/react';
import Header from './components/Header';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { initCubeClient } from './init-cubejs-api';

import config from './auth_config';

Amplify.configure(config);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const AppLayout = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header />
      <div>{children}</div>
    </div>
  );
};

function getToken() {
  return Auth.currentSession()
    .then(session => session)
    .catch(err => console.log(err));
}

const App = ({ children, authData, authState }) => {
  const [cubejsApi, setCubejsApi] = useState(null);

  const Page = withAuthenticator(({ authData }) => (
    <CubeProvider cubejsApi={initCubeClient(authData.signInUserSession.accessToken.getJwtToken())}>
      <>
        {children}
      </>
    </CubeProvider>
  ));

  return (
    <AppLayout>
      <Page />
    </AppLayout>
  );
};

export default App;
