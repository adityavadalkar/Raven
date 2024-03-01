import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Auth0ProviderWithNavigate } from "./auth0-provider-with-history";
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <Provider store={store}>
        {/* <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}> */}
          <App />
        {/* </GoogleOAuthProvider> */}
      </Provider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
