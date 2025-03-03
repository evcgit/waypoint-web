import { createContext, useReducer, useEffect } from 'react';
import { getCurrentUser } from '../shared/api';
import { ACTION_TYPES } from '../utils/const';

const AppContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.INITIALIZING:
      return {
        ...state,
        initialized: false,
        isInitializing: true
      };
    case ACTION_TYPES.INIT_COMPLETE:
      return {
        ...state,
        initialized: true,
        isInitializing: false
      };
    case ACTION_TYPES.LOGGING_IN:
      return {
        ...state,
        isLoggingIn: true
      };
    case ACTION_TYPES.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        isLoggingIn: false,
        accessToken: null,
        refreshToken: null,
        user: {}
      };
    case ACTION_TYPES.LOGGED_IN:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      };
    case ACTION_TYPES.LOGGED_OUT:
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        pageTitle: '',
        siteAlerts: [],
        user: {}
      };
    case ACTION_TYPES.UPDATE_USER:
      const userObject = action.payload;
      return {
        ...state,
        user: {
          id: userObject.id || state.user.id || null,
          email: userObject.user.email,
          firstName: userObject.user.first_name,
          lastName: userObject.user.last_name,
          username: userObject.user.username,
          role: userObject.role,
          passportExpiry: userObject.passport_expiry,
          nationality: userObject.nationality
        }
      };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  useEffect(() => {
    if (state.accessToken) {
      dispatch({
        type: ACTION_TYPES.INITIALIZING
      });
      getCurrentUser(dispatch)
        .then(() => {
          dispatch({
            type: ACTION_TYPES.LOGGED_IN,
            payload: {
              accessToken: state.accessToken,
              refreshToken: state.refreshToken
            }
          });
        })
        .catch(() => {
          dispatch({
            type: ACTION_TYPES.LOGIN_ERROR
          });
        })
        .finally(() => {
          dispatch({
            type: ACTION_TYPES.INIT_COMPLETE
          });
        });
    }
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
