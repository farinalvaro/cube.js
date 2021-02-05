import React, { useEffect, useState } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { Auth } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';

const def = {
  status: null,
};

const AmplifyContext = React.createContext(def);

export const useAmplify = () => React.useContext(AmplifyContext);

export const AmplifyProvider = ({ children }) => {
  const [authState, setAuthState] = useState('signIn');
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const getState = async () => {
      try {
        const authData = await Auth.currentAuthenticatedUser();

        setAuthData(authData);
      } catch (e) {
        console.log(e);
      }
    };
    getState();

    return Hub.listen('auth', (e) => {
      switch (e.payload.event) {
        case 'signIn':
          setAuthState('signIn');
          break;
        case 'signUp':
          setAuthState('signUp');
          break;
        case 'signOut':
          setAuthState('signOut');
          break;
      }

      console.log(e.payload.event);
    });
  }, []);

  return (
    <AmplifyContext.Provider value={{
      authData,
      authState,
      // isAuthorized: authState !== 'signIn',
      isAuthorized: true,
      logout: () => Auth.signOut({ global: false, }),
    }}>
      {children}
    </AmplifyContext.Provider>
  );
};
