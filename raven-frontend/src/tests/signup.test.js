import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Signup from '../components/Signup';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'

const middlewares = [thunk]

const mockStore = configureStore(middlewares);

describe('Signup page', () => {
    const store = mockStore({});
    it('should have a valid user name', () => {
      // Test for a valid user name input
      const { getByLabelText, getByText } = render(<Router><Provider store={store}>
      <Signup />
    </Provider></Router>);
      const nameInput = getByLabelText('Name')
      fireEvent.change(nameInput, { target: { value: 'Jo' } })
      const registerButton = getByText('Register')
      fireEvent.click(registerButton)
        const validationError = screen.getByText(/Please enter a valid user name/i);
        expect(validationError).toBeInTheDocument();
    })
  
    it('should have a valid email address', () => {
      // Test for a valid email address input
      const { getByLabelText, getByText } = render(<Router><Provider store={store}>
      <Signup />
    </Provider></Router>);
      const emailInput = getByLabelText('Email')
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      const registerButton = getByText('Register')
      fireEvent.click(registerButton)
      expect(getByText('Please enter a valid email address.')).toBeInTheDocument()
    })
  
    it('should have a password greater than 8 characters', () => {
      // Test for a password input greater than 8 characters
      const { getByLabelText, getByText } = render(<Router><Provider store={store}>
      <Signup />
    </Provider></Router>);
      const passwordInput = getByLabelText('Password')
      fireEvent.change(passwordInput, { target: { value: 'pass123' } })
      const registerButton = getByText('Register')
      fireEvent.click(registerButton)
      expect(getByText('Please enter a password greater than 8 characters.')).toBeInTheDocument()
    })
  
    it('should have matching passwords', () => {
      // Test for matching passwords
      const { getByLabelText, getByText } = render(<Router><Provider store={store}>
      <Signup />
    </Provider></Router>);
      const passwordInput = getByLabelText('Password')
      const confirmPasswordInput = getByLabelText('Confirm Password')
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'password1234' } })
      const registerButton = getByText('Register')
      fireEvent.click(registerButton)
      expect(getByText('Please confirm your password.')).toBeInTheDocument()
    })
  
    it('should be able to sign up as a guest', () => {
      // Test for signing up as a guest
      const { getByText } = render(<Router><Provider store={store}>
      <Signup />
    </Provider></Router>);
      const guestButton = getByText('Sign in as Guest')
      fireEvent.click(guestButton)
      // Assert user is redirected to the correct page
      expect(window.location.pathname).toBe('/')
    })
  })
  