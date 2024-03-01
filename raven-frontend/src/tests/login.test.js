import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login from '../components/Login';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

const middlewares = [thunk]

const mockStore = configureStore(middlewares);

describe('Login page', () => {
    const store = mockStore({});
    it('should have a valid email address', () => {
      // Test for a valid user name input
      const { getByLabelText, getByText } = render(<Router><Provider store={store}>
      <Login />
    </Provider></Router>);
      const emailInput = getByLabelText('Email')
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      const loginButton = getByText('Login')
      fireEvent.click(loginButton)
        const validationError = screen.getByText(/Please enter a valid email address/i);
        expect(validationError).toBeInTheDocument();
    })

    it('should have a valid password', () => {
        const {getByLabelText, getByText} = render(<Router><Provider store={store}>
            <Login />
            </Provider></Router>);
        const passwordInput = getByLabelText('Password')
        fireEvent.change(passwordInput, { target: { value: 'pass123' } })
        const loginButton = getByText('Login')
        fireEvent.click(loginButton)
        expect(getByText('Password must be greater than 8 characters')).toBeInTheDocument()

    })

    it('should be signed up', async () => {
        const {getByLabelText, getByText} = render(<Router><Provider store={store}>
            <Login />
            </Provider></Router>);
        const emailInput = getByLabelText('Email')
        fireEvent.change(emailInput, { target: { value: 'test@email.com' } })
        const passwordInput = getByLabelText('Password')
        fireEvent.change(passwordInput, { target: { value: 'pass12345' } })
        const loginButton = getByText('Login')        
        fireEvent.click(loginButton)
        await waitFor(() => {
            expect(getByText('Invalid email or password')).toBeInTheDocument()
          })
        
    })
  })
  